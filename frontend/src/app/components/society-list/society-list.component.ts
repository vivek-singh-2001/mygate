import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { SocietyService } from '../../services/society/society.Service';
import { ButtonModule } from 'primeng/button';
import { Society } from '../../interfaces/society.interface';

@Component({
  selector: 'app-society-list',
  standalone: true,
  imports: [TableModule, PaginatorModule, CommonModule,ButtonModule],
  templateUrl: './society-list.component.html',
  styleUrl: './society-list.component.css',
})
export class SocietyListComponent {
  societies: Society[] = [];
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
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchSocieties();
  }

  fetchSocieties() {
    const status = this.selectedStatus ? this.selectedStatus : '';
    this.societyService.fetchAllSociety(status).subscribe({
      next: (societies:Society[]) => {
        this.societies = societies;
        this.noUsersFound = societies.length === 0;
      },
      error: (err) => {
        console.error('Error fetching societies:', err);
      },
    });
  }

   onStatusFilterChange():void {
    this.fetchSocieties();
  }

  

  viewPdf(society: Society) {
    const fullPath: string | undefined = society.csvData;
    if (!fullPath) {
      return console.error('file not found');
    }
    const filename = fullPath.split('/').pop() ?? ''; 

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


  onCanel(society:Society){
    console.log(society);
    
    
  }

  onApprove(society:Society){
    console.log(society);
    this.societyService.createSociety(society).subscribe({
      next(value) {
        console.log(value);
        
      },
    })

  }
}
