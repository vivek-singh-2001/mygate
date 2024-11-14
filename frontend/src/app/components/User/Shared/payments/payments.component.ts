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
import { MaintenanceReportComponent } from "../../Admin/maintenance-report/maintenance-report.component";
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';

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
    MultiSelectModule
],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class PaymentsComponent implements OnInit {
  paymentsData: PaymentRecord[] = [];
  paymentHistoryData: PaymentRecord[] = [];
  societyPaymentData: PaymentRecord[] = [];
  filters = {
    status: 'success',
    purpose: '',
    type: '',
    fromDate: '',
    toDate: '',
  };
  isPaymentHistory: boolean = false;
  isSocietyPayments: boolean = false;

  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchUserPayments();
    // this.fetchSocietyPayments();
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

  fetchSocietyPayments() {
    this.userService.userSocietyId$.subscribe((societyId) => {
      this.paymentService.getAllPayments(societyId, this.filters).subscribe({
        next: (response) => {
          console.log(response.data);
          this.societyPaymentData = response.data;
        },
        error: (error) => console.log(error),
      });
    });
  }

  applyFilters() {
    this.fetchSocietyPayments();
  }

  toggleView() {
    this.isPaymentHistory = !this.isPaymentHistory;
  }

  toggleSocietyPayments() {
    console.log("fefger", this.societyPaymentData);
    
    if (this.societyPaymentData.length === 0) {
      this.fetchSocietyPayments();      
    }
    this.isSocietyPayments = !this.isSocietyPayments;
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
