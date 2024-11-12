import { Component } from '@angular/core';
import { PaymentService } from '../../../../services/payment/payment.service';
import { loadRazorpay } from '../../../../utils/razorpay';
import { firstValueFrom } from 'rxjs';

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
  imports: [],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class PaymentsComponent {
  amount = 50000;
  currency = 'INR';
  ownerId = 'efe28c36-fbcd-4e63-8168-12facbfe4b08';
  houseId = "ac348c69-9efc-401e-bc5c-ad4766131c09";

  constructor(private readonly paymentService: PaymentService) {}

  async onPayNow() {
    try {
      const orderResponse = await firstValueFrom(
        this.paymentService.createOrder(this.amount, this.ownerId, this.houseId)
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
          description: 'Test Transaction',
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