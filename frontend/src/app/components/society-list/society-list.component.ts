import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AdminService } from '../../services/admin/admin.service';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { SocietyService } from '../../services/society/society.Service';

@Component({
  selector: 'app-society-list',
  standalone: true,
  imports: [TableModule, PaginatorModule, CommonModule],
  templateUrl: './society-list.component.html',
  styleUrl: './society-list.component.css',
})
export class SocietyListComponent {
  societies: any[] = [];
  status = 'pending';
  first: number = 0; //offset
  rows: number = 20; //limit
  totalRecords: number = 0; //total records fetched
  searchQuery: string = '';
  noUsersFound: boolean = false;

  private searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private societyService: SocietyService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.societyService.fetchAllSociety(this.status).subscribe({
      next: () => {
        this.societyService.allSocietyData$.subscribe({
          next: (society) => {
            console.log(society);
            this.societies = society;
          },
        });
      },
      error: (err) => {
        console.log('errr', err.message);
        console.log('error', err);
      },
    });
  }

  viewPdf(society: any) {
    const fullPath = society.csvData;
    if (!fullPath) {
      return console.error('file not found');
    }
    const filename = fullPath.split('/').pop(); // Get the filename from the path

    // Construct the URL to fetch the CSV
    const csvFileUrl = `http://localhost:7500/api/v1/society/csv/${filename}`;

    // Fetch the CSV file
    this.http.get(csvFileUrl, { responseType: 'text' }).subscribe({
      next: (csvData) => {
        // Parse the CSV data
        const parsedData = this.parseCsv(csvData);
        // Convert parsed data back to CSV format
        const csvString = this.convertArrayToCSV(parsedData);
        // Trigger the download of the parsed CSV
        this.downloadCSV(csvString, filename);
      },
      error: (error) => {
        console.error('Error fetching CSV file: ', error.message);
      },
    });
  }

  private parseCsv(csvData: string): any[] {
    const results: any[] = [];

    // Using a simple parser for the CSV data
    const rows = csvData.split('\n'); // Split by new lines
    rows.forEach((row) => {
      const parsedRow = row.split(',').map((item) => item.trim()); // Adjust based on your CSV format
      if (parsedRow.length > 1) {
        // Ensure it's a valid row
        results.push(parsedRow);
      }
    });

    console.log('Parsed CSV Data: ', results);
    return results; // Return the parsed results
  }

  private convertArrayToCSV(data: any[]): string {
    return data.map((row) => row.join(',')).join('\n');
  }

  private downloadCSV(csvData: string, filename: string): void {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `parsed_${filename}`; // Prefix with 'parsed_' for clarity
    anchor.click();
    window.URL.revokeObjectURL(url); // Clean up URL object
  }
}
