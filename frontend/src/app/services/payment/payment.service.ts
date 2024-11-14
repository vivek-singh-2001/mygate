import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentRecord } from '../../interfaces/payment.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly apiUrl = `${environment.apiUrl}/payments`;

  constructor(private readonly http: HttpClient) {}


  createOrder({societyId, amount, date, category }:any){
    return this.http.post(`${this.apiUrl}/create`,{societyId, amount, date, category })
  }

  makePayment(paymentId: string) {
    return this.http.post<{
      success: boolean;
      data: PaymentRecord;
      razorpayKey: string;
    }>(`${this.apiUrl}`, { paymentId });
  }

  verifyPayment(paymentData: any) {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/verify-payment`,
      paymentData
    );
  }

  getPaymentById(paymentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/${paymentId}`);
  }

  getPaymentsForUser(ownerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${ownerId}`);
  }

  getAllPayments(societyId:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/all/${societyId}`,{});
  }
}
