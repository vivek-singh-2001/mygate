import { Component, OnInit } from '@angular/core';
import { PaymentRecord } from '../../../../interfaces/payment.interfaces';
import { PaymentService } from '../../../../services/payment/payment.service';
import { UserService } from '../../../../services/user/user.service';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-society-accounts',
  standalone: true,
  imports: [
    TableModule,
    DropdownModule,
    CommonModule,
    CalendarModule,
    FormsModule,
  ],
  templateUrl: './society-accounts.component.html',
  styleUrls: [
    './society-accounts.component.css',
    '../payments/payments.component.css',
  ],
})
export class SocietyAccountsComponent implements OnInit {
  societyPaymentData: PaymentRecord[] = [];
  paymentSummary: {
    totalIncome?: string;
    totalExpense?: string;
    expectedIncome?: string;
    pendingIncome?: string;
    currentBalance: number;
  } = { currentBalance: 0 };
  filters = {
    status: 'success',
    purpose: '',
    type: '',
    fromDate: '',
    toDate: '',
  };
  societyId = '';

  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.userSocietyId$.subscribe((societyId) => {
      this.societyId = societyId;
    });
    this.setDefaultDateRange();
    this.fetchSocietyPayments();
    this.fetchPaymentSummary();
  }

  setDefaultDateRange() {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    this.filters.fromDate = firstDayOfMonth.toLocaleDateString('en-CA');
    this.filters.toDate = currentDate.toLocaleDateString('en-CA');
  }

  fetchSocietyPayments() {
    this.paymentService.getAllPayments(this.societyId, this.filters).subscribe({
      next: (response) => {
        this.societyPaymentData = response.data;
      },
      error: (error) => console.error(error),
    });
  }

  fetchPaymentSummary() {
    this.paymentService
      .getPaymentSummary(this.societyId, {
        fromDate: this.filters.fromDate,
        toDate: this.filters.toDate,
      })
      .subscribe({
        next: (response) => {
          this.paymentSummary = response.data;
        },
        error: (error) => console.error(error),
      });
  }

  onFilterChange() {
    this.fetchSocietyPayments();
  }

  onDateChange() {
    this.fetchSocietyPayments();
    this.fetchPaymentSummary();
  }
}
