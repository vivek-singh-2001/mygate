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
import { CalendarModule } from 'primeng/calendar';

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
    CalendarModule,
  ],
  providers: [MessageService],
  templateUrl: './maintenance-report.component.html',
  styleUrl: './maintenance-report.component.css',
})
export class MaintenanceReportComponent implements OnInit {
  displayPaymentDialog = false;
  displayExpensesDialog = false;
  societyId: string = '';
 selectedFile: File | null = null;

  minDate: Date = new Date();
  maxDate: Date = new Date();

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

    this.minDate.setDate(1);

    const nextMonth = new Date(this.minDate);
    nextMonth.setMonth(this.minDate.getMonth() + 2);
    nextMonth.setDate(0);
    this.maxDate = nextMonth;
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file);
      this.selectedFile = file; 
    }
  }
  

  submitExpense() {
    // Check if required fields are filled
    if (!this.expenseAmount || !this.expenseDate || !this.expenseCategory) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all the required fields.',
      });
      return;
    }
  
    // Create and populate FormData
    const formData = new FormData();
    formData.append('amount', this.expenseAmount.toString());
    formData.append('date', this.expenseDate.toString()); // Convert date to string
    formData.append('category', this.expenseCategory);
    formData.append('description', this.expenseDescription || '');
    formData.append('societyId', this.societyId.toString());
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile); // Add the file if it exists
    }

  
    // Call the service method to send the FormData
    this.paymentService.addExpense(formData).subscribe({
      next: () => {
        // Reset form and show success message
        this.displayExpensesDialog = false;
        this.expenseAmount = null;
        this.expenseDate = null;
        this.expenseCategory = '';
        this.selectedExpenseCategory = null;
        this.expenseDescription = null;
        this.selectedFile = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Expense added successfully.',
        });
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong. Please try again later.',
        });
      },
    });
  }
  
}
