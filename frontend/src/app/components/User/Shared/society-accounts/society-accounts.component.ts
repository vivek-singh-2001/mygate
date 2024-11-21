import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../../services/payment/payment.service';
import { UserService } from '../../../../services/user/user.service';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { Chart, registerables } from 'chart.js';
import autoTable from 'jspdf-autotable';
import { AccountRecord } from '../../../../interfaces/account.interface';

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
  societyPaymentData: AccountRecord[] = [];
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
    const title = 'Society Accounts Report';
    const reportDate = new Date();
    const formattedDate = `${reportDate
      .getDate()
      .toString()
      .padStart(2, '0')}/${(reportDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${reportDate.getFullYear()}`;

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(16);
    doc.text(`${title} - ${formattedDate}`, pageWidth / 2, 20, {
      align: 'center',
    });

    const summaryStartY = 30;
    const summaryRowHeight = 10;
    const summaryData = [
      {
        label: 'Total Income:',
        value: this.paymentSummary.totalIncome,
        style: 'income',
      },
      {
        label: 'Total Expense:',
        value: this.paymentSummary.totalExpense,
        style: 'expense',
      },
      {
        label: 'Pending Income:',
        value: this.paymentSummary.pendingIncome,
        style: 'pending-income',
      },
      {
        label: 'Current Balance:',
        value: this.paymentSummary.currentBalance,
        style:
          this.paymentSummary.currentBalance >= 0 ? 'positive' : 'negative',
      },
    ];

    const summaryStartX = 14;
    const summaryColWidths = [60, 80];
    const headerBgColor: [number, number, number] = [240, 240, 240];
    const fontSize = 12;

    const colorMap: any = {
      income: [76, 175, 80],
      expense: [244, 67, 54],
      'pending-income': [255, 152, 0],
      positive: [76, 175, 80],
      negative: [244, 67, 54],
    };

    summaryData.forEach((row, index) => {
      const y = summaryStartY + index * summaryRowHeight;

      if (index % 2 === 0) {
        doc.setFillColor(...headerBgColor);
        doc.rect(
          summaryStartX,
          y,
          summaryColWidths[0] + summaryColWidths[1],
          summaryRowHeight,
          'F'
        );
      }

      doc.rect(summaryStartX, y, summaryColWidths[0], summaryRowHeight);
      doc.rect(
        summaryStartX + summaryColWidths[0],
        y,
        summaryColWidths[1],
        summaryRowHeight
      );

      doc.setFontSize(fontSize);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text(row.label, summaryStartX + 2, y + 7);

      const [r, g, b] = colorMap[row.style];
      doc.setTextColor(r, g, b);
      doc.text(
        `Rs. ${row.value.toLocaleString('en-IN')}`,
        summaryStartX + summaryColWidths[0] + 2,
        y + 7
      );
    });

    const tableData = this.societyPaymentData.map((payment: AccountRecord) => [
      payment.purpose,
      `${payment.amount.toLocaleString('en-IN')}`,
      new Date(payment.date).toLocaleDateString(),
      payment.paymentEntity,
      payment.type,
    ]);

    autoTable(doc, {
      head: [['Purpose', 'Amount', 'Date', 'Payment Entity', 'Type']],
      body: tableData,
      startY: summaryStartY + summaryData.length * summaryRowHeight + 10,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 55 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 25 },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 4) {
          if (data.cell.raw === 'Credit') {
            data.cell.styles.textColor = [0, 128, 0];
          } else {
            data.cell.styles.textColor = [255, 0, 0];
          }
        }
      },
    });

    const pageCount = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
    }

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
