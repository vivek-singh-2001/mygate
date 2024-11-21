import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { tap } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';
import { Society } from '../../../interfaces/society.interface';
import { SocietyService } from '../../../services/society/society.Service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-society-list',
  standalone: true,
  imports: [
    TableModule,
    PaginatorModule,
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressBarModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './society-list.component.html',
  styleUrl: './society-list.component.css',
})
export class SocietyListComponent {
  societies: Society[] = [];
  isLoading: boolean = false;
  selectedStatus: string | null = null;
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];
  noUsersFound: boolean = false;

  constructor(
    private readonly societyService: SocietyService,
    private readonly http: HttpClient,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchSocieties();
  }

  fetchSocieties() {
    this.isLoading = true;
    const status = this.selectedStatus ? this.selectedStatus : '';
    this.societyService.fetchAllSociety(status).subscribe({
      next: (societies: Society[]) => {
        console.log('appppppppppp', societies);

        this.societies = societies;
        this.noUsersFound = societies.length === 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
        console.error('Error fetching societies:', err);
        this.isLoading = false;
      },
    });
  }

  onStatusFilterChange(): void {
    this.fetchSocieties();
  }

  viewPdf(society: Society) {
    const fullPath: string | undefined = society.csvData;
    if (!fullPath) {
      return console.error('file not found');
    }
    const filename = fullPath.split('/').pop() ?? '';
    this.isLoading = true;

    const csvFileUrl = `${environment.apiUrl}/society/csv/${filename}`;

    this.http.get(csvFileUrl, { responseType: 'text' }).subscribe({
      next: (csvData) => {
        const parsedData = this.parseCsv(csvData);
        const csvString = this.convertArrayToCSV(parsedData);
        this.downloadCSV(csvString, filename);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching CSV file: ', error.message);
        this.isLoading = false;
      },
    });
  }

  private parseCsv(csvData: string): string[][] {
    const results: string[][] = [];

    const rows = csvData.split('\n');
    rows.forEach((row) => {
      const parsedRow = row.split(',').map((item) => item.trim());
      if (parsedRow.length > 1) {
        results.push(parsedRow);
      }
    });

    console.log('Parsed CSV Data: ', results);
    return results;
  }

  private convertArrayToCSV(data: string[][]): string {
    return data.map((row) => row.join(',')).join('\n');
  }

  private downloadCSV(csvData: string, filename: string): void {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `parsed_${filename}`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  onCanelSociety(society: Society) {
    console.log(society);
    this.isLoading = true;
    this.societyService
      .rejectSociety(society)
      .pipe(
        tap(() => {
          this.fetchSocieties();
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Society has been rejected!',
          });
        },
        error: (err) => {
          console.error(err.message);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message,
          });
        },
      });
  }

  onApproveSociety(society: Society) {
    this.isLoading = true;
    console.log(society);

    this.societyService
      .createSociety(society)
      .pipe(
        tap(() => {
          this.fetchSocieties();
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Society has been created!',
          });
        },
        error: (err) => {
          console.error(err.message);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message,
          });
        },
      });
  }

  onCancel(event: Event, society: Society) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Reject Society Approval',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.onCanelSociety(society);
      },
    });
  }

  onConfirm(event: Event, society: Society) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to create this society ?',
      header: 'Approval Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.onApproveSociety(society);
        this.fetchSocieties();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'action Rejected',
        });
      },
    });
  }
}
