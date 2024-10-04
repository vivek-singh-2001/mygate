import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { SocietyService } from '../../services/society/society.Service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-society-list',
  standalone: true,
  imports: [TableModule, PaginatorModule, CommonModule,ButtonModule],
  templateUrl: './society-list.component.html',
  styleUrl: './society-list.component.css',
})
export class SocietyListComponent {
  societies: any[] = [];
  selectedStatus: string | null = null;
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];
  noUsersFound: boolean = false;

  constructor(
    private societyService: SocietyService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchSocieties();
  }

  fetchSocieties() {
    const status = this.selectedStatus ? this.selectedStatus : '';
    this.societyService.fetchAllSociety(status).subscribe({
      next: (societies) => {
        this.societies = societies;
        this.noUsersFound = societies.length === 0;
      },
      error: (err) => {
        console.error('Error fetching societies:', err);
      },
    });
  }

   // Triggered when the status filter dropdown is changed
   onStatusFilterChange() {
    this.fetchSocieties();
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


  onCanel(){
    console.log("wfiwfi");
    
  }

  onApprove(){
    console.log("wqifhufwi");
  }
}
