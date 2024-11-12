export interface PaymentRecord {
  id: string;
  ownerId: string;
  houseId?: string;
  amount: number;
  status: 'pending' | 'failure' | 'success';
  paymentDate: Date;
  orderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  failureReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}