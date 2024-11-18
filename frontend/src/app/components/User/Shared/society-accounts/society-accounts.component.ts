import { Component, OnInit } from '@angular/core';
import { PaymentRecord } from '../../../../interfaces/payment.interfaces';
import { PaymentService } from '../../../../services/payment/payment.service';
import { UserService } from '../../../../services/user/user.service';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { jsPDF } from "jspdf";
import { Chart, registerables } from 'chart.js';
import autoTable from 'jspdf-autotable';

Chart.register(...registerables);

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
  societyPaymentData: any[] = [];
  paymentSummary: {
    totalIncome: number;
    totalExpense: number;
    pendingIncome: number;
    currentBalance: number;
  } = { totalIncome: 0, totalExpense: 0, pendingIncome: 0, currentBalance: 0 };
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


  downloadPDF() {
    const doc = new jsPDF();
    const title = 'Society Payment Report';
    const reportDate = new Date().toLocaleDateString(); // Add current date
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Add Title at the center of the page
    doc.setFontSize(16);
    doc.text(`${title} - ${reportDate}`, pageWidth / 2, 20, { align: 'center' });

    // Draw Payment Summary Section
    const summaryStartY = 30;
    const summaryRowHeight = 10;
    const summaryData = [
      { label: 'Total Income:', value: this.paymentSummary.totalIncome, style: 'income' },
      { label: 'Total Expense:', value: this.paymentSummary.totalExpense, style: 'expense' },
      { label: 'Pending Income:', value: this.paymentSummary.pendingIncome, style: 'pending-income' },
      { label: 'Current Balance:', value: this.paymentSummary.currentBalance, style: this.paymentSummary.currentBalance >= 0 ? 'positive' : 'negative' },
    ];

    // Define styling properties
    const summaryStartX = 14;
    const summaryColWidths = [60, 80];
    const headerBgColor: [number, number, number] = [240, 240, 240]; // Light gray background
    const fontSize = 12;

    // Color map for different styles
    const colorMap: any = {
      income: [76, 175, 80], // #4caf50
      expense: [244, 67, 54], // #f44336
      'pending-income': [255, 152, 0], // #ff9800
      positive: [76, 175, 80], // #4caf50
      negative: [244, 67, 54], // #f44336
    };

    summaryData.forEach((row, index) => {
      const y = summaryStartY + index * summaryRowHeight;

      // Add background color for rows
      if (index % 2 === 0) {
        doc.setFillColor(...headerBgColor);
        doc.rect(summaryStartX, y, summaryColWidths[0] + summaryColWidths[1], summaryRowHeight, 'F'); // Fill row
      }

      // Draw borders
      doc.rect(summaryStartX, y, summaryColWidths[0], summaryRowHeight); // First column
      doc.rect(summaryStartX + summaryColWidths[0], y, summaryColWidths[1], summaryRowHeight); // Second column

      // Add text with styles
      doc.setFontSize(fontSize);
      doc.setTextColor(0, 0, 0); // Default black for labels
      doc.setFont('helvetica', 'normal');
      doc.text(row.label, summaryStartX + 2, y + 7); // First column text

      // Set text color based on style
      const [r, g, b] = colorMap[row.style];
      doc.setTextColor(r, g, b);
      doc.text(`Rs. ${row.value.toLocaleString('en-IN')}`, summaryStartX + summaryColWidths[0] + 2, y + 7); // Second column text
    });

    // Prepare Table Data
    const tableData = this.societyPaymentData.map((payment: any) => [
      payment.purpose,
      `${payment.amount.toLocaleString('en-IN')}`,
      new Date(payment.date).toLocaleDateString(),
      payment.paymentEntity,
      payment.type,
    ]);

    // Add Table with Conditional Styling
    autoTable(doc, {
      head: [['Purpose', 'Amount', 'Date', 'Payment Entity', 'Type']],
      body: tableData,
      startY: summaryStartY + summaryData.length * summaryRowHeight + 10, // Start below summary
      styles: {
        fontSize: 10, // Adjust font size if needed
        cellPadding: 3, // Add padding inside cells
        lineWidth: 0.1, // Adds grid lines
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Purpose
        1: { cellWidth: 35 }, // Amount
        2: { cellWidth: 30 }, // Date
        3: { cellWidth: 50 }, // Payment Entity
        4: { cellWidth: 20 }, // Type
      },
      didParseCell: (data) => {
        // Apply styles only to body rows and the "Type" column
        if (data.section === 'body' && data.column.index === 4) {
          if (data.cell.raw === 'Credit') {
            data.cell.styles.textColor = [0, 128, 0]; // Green for "Credit"
          } else {
            data.cell.styles.textColor = [255, 0, 0]; // Red for others
          }
        }
      },
    });

    // Add footer with page numbers
    const pageCount = (doc.internal as any).getNumberOfPages(); // Cast to 'any'
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 20);
    }

    // Save PDF
    doc.save('Society_Payment_Report.pdf');
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
