import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly apiUrl = `${environment.apiUrl}/payments`;

  constructor(private readonly http: HttpClient) {}

  createOrder(
    amount: number,
    ownerId: string,
    houseId: string
  ) {
    return this.http.post<{ success: boolean; data: any; razorpayKey: string }>(
      `${this.apiUrl}`,
      {
        amount,
        ownerId,
        houseId,
      }
    );
  }

  verifyPayment(paymentData: any) {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/verify-payment`,
      paymentData
    );
  }
  getPaymentById(paymentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${paymentId}`);
  }

  getPaymentsForUser(ownerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${ownerId}`);
  }

  getAllPayments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
