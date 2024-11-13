import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UserService } from '../../../../services/user/user.service';
import { PaymentService } from '../../../../services/payment/payment.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-maintenance-report',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    CommonModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './maintenance-report.component.html',
  styleUrl: './maintenance-report.component.css',
})
export class MaintenanceReportComponent implements OnInit {
  displayPaymentDialog = false;
  displayExpensesDialog = false;
  societyId: string = '';

  paymentAmount: number | null = null;
  paymentDate: string | null = null;
  paymentCategories = [
    { label: 'Maintenance', value: 'Maintenance' },
    { label: 'Other', value: 'Other' },
  ];
  selectedPaymentCategory: string | null = null;
  customCategory: string | null = null;

  expenseAmount: number | null = null;
  expenseDate: string | null = null;
  expenseCategory = '';
  selectedExpenseCategory: string | null = null;
  expenseDescription: string | null = null;

  constructor(
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userService.userSocietyId$.subscribe({
      next: (societyId) => {
        this.societyId = societyId;
      },
    });
  }

  showPaymentDialog() {
    this.displayPaymentDialog = true;
  }

  showExpensesDialog() {
    this.displayExpensesDialog = true;
  }

  onCategoryChange() {
    if (this.selectedPaymentCategory !== 'Other') {
      this.customCategory = null;
    }
  }

  submitPaymentRequest() {
    const category =
      this.selectedPaymentCategory === 'Other'
        ? this.customCategory
        : this.selectedPaymentCategory;
    console.log('Payment Request Submitted', {
      societyId: this.societyId,
      amount: this.paymentAmount,
      date: this.paymentDate,
      category,
    });
    this.paymentService
      .createOrder({
        societyId: this.societyId,
        amount: this.paymentAmount,
        date: this.paymentDate,
        category,
      })
      .subscribe({
        next: (data: any) => {
          if (typeof data.data == 'string') {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail:
                'Your maintenance request for this month is already sent.',
            });
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Maintenance request has been sent successfully.',
            });
            this.paymentAmount = null;
            this.paymentDate = null;
            this.displayPaymentDialog = false;
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong. Please try again later.',
          });
        },
      });
  }

  submitExpense() {
    console.log('Expense Submitted', {
      amount: this.expenseAmount,
      date: this.expenseDate,
      category: this.expenseCategory,
      description: this.expenseDescription,
    });
    this.displayExpensesDialog = false;
  }
}
