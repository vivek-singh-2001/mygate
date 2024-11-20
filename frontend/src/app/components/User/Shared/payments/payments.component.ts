import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../../services/payment/payment.service';
import { loadRazorpay } from '../../../../utils/razorpay';
import { firstValueFrom } from 'rxjs';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { UserService } from '../../../../services/user/user.service';
import { PaymentRecord } from '../../../../interfaces/payment.interfaces';
import { DropdownModule } from 'primeng/dropdown';
import { MaintenanceReportComponent } from '../../Admin/maintenance-report/maintenance-report.component';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { jsPDF } from 'jspdf';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  theme: {
    color: string;
  };
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    ButtonModule,
    CommonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    GalleriaModule,
    DropdownModule,
    MaintenanceReportComponent,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class PaymentsComponent implements OnInit {
  paymentsData: PaymentRecord[] = [];
  paymentHistoryData: PaymentRecord[] = [];
  isPaymentHistory: boolean = false;

  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchUserPayments();
  }

  fetchUserPayments() {
    this.userService.getUserData().subscribe({
      next: (user) => {
        this.paymentService.getPaymentsForUser(user.id).subscribe({
          next: (data) => {
            data.data.forEach((payment: PaymentRecord) => {
              if (payment.status === 'pending') {
                this.paymentsData.push(payment);
              } else {
                this.paymentHistoryData.push(payment);
              }
            });
          },
          error: (error) => console.log(error),
        });
      },
    });
  }

  toggleView() {
    this.isPaymentHistory = !this.isPaymentHistory;
  }

  downloadReceipt(payment: PaymentRecord) {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.width;

    const title = 'Payment Receipt';
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(title, titleX, 30);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    const companyInfo = [
      'MyGate - Payment Gateway',
      'Address: 123 MyGate Lane, City, Country',
      'Phone: +1 (123) 456-7890',
      'Email: support@mygate.com',
    ];

    let companyInfoY = 45;
    companyInfo.forEach((line) => {
      const lineWidth = doc.getTextWidth(line);
      const lineX = (pageWidth - lineWidth) / 2;
      doc.text(line, lineX, companyInfoY);
      companyInfoY += 8;
    });

    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(10, companyInfoY + 10, pageWidth - 10, companyInfoY + 10);

    const startY = companyInfoY + 20;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Payment Details', 20, startY);

    doc.setFillColor(245, 245, 245);
    doc.rect(20, startY + 8, pageWidth - 40, 85, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.rect(20, startY + 8, pageWidth - 40, 85);

    doc.setFont('Helvetica', 'bold');
    const labels = [
      'Order ID:',
      'Payment Date:',
      'Amount Paid:',
      'Purpose:',
      'Payment Status:',
      'Transaction ID:',
      'Paid via:',
    ];

    labels.forEach((label, index) => {
      const labelY = startY + 20 + index * 10;
      doc.text(label, 25, labelY);
    });

    doc.setFont('Helvetica', 'normal');
    const values = [
      `${payment.razorpayPaymentId}`,
      `${new Date(payment.paymentDate).toLocaleDateString()}`,
      `Rs. ${payment.amount.toLocaleString('en-IN')}`,
      `${payment.purpose}`,
      `${payment.status === 'success' ? 'Success' : 'Failure'}`,
      `${payment.razorpayPaymentId}`,
      'Razorpay Gateway',
    ];

    values.forEach((value, index) => {
      const valueY = startY + 20 + index * 10;
      doc.text(value, pageWidth - 25 - doc.getTextWidth(value), valueY);
    });

    const footerY = startY + 130;

    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(8);
    doc.text(
      'This is an autogenerated receipt. For questions, contact support@mygate.com',
      105,
      footerY,
      { align: 'center' }
    );

    doc.save(`Payment_Receipt_${payment.razorpayPaymentId}.pdf`);
  }

  async onPayNow(paymentId: string) {
    try {
      const orderResponse = await firstValueFrom(
        this.paymentService.makePayment(paymentId)
      );

      if (orderResponse?.success) {
        const { data, razorpayKey } = orderResponse;
        // Razorpay SDK
        const razorpayScriptLoaded = await loadRazorpay();
        if (!razorpayScriptLoaded)
          throw new Error('Razorpay SDK failed to load');

        // Razorpay payment options
        const options: RazorpayOptions = {
          key: razorpayKey,
          amount: data.amount,
          currency: 'INR',
          name: 'My Gate',
          description: 'Maintenance payment',
          order_id: data.orderId,
          handler: async (response: RazorpayResponse) => {
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verificationResponse = await firstValueFrom(
              this.paymentService.verifyPayment(paymentData)
            );
            if (verificationResponse?.success) {
              alert('Payment successful!');
            } else {
              alert('Payment verification failed');
            }
          },
          theme: {
            color: '#3399cc',
          },
        };

        // Open Razorpay checkout form
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  }
}
