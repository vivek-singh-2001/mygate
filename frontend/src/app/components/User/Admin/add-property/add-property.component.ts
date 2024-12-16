import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SocietyService } from '../../../../services/society/society.Service';
import { Wing } from '../../../../interfaces/wing.interface';

interface WingOptions {
  name: string;
  id: number;
}

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [DropdownModule, FormsModule, CommonModule],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.css',
})
export class AddPropertyComponent implements OnInit {
  wingOptions: WingOptions[] = []; // Array to hold wings
  numberOfWings: any; // Selected wing
  societyId = ''; // Example society ID

  constructor(private societyService: SocietyService) {}

  ngOnInit(): void {
    this.fetchSocietyDetails(this.societyId);
  }

  // Fetch wings from the service
  fetchSocietyDetails(societyId: string): void {
    this.societyService
      .fetchSocietyData(societyId)
      .subscribe((responseData: any) => {
        console.log('socccc', responseData);
        this.wingOptions = responseData.societyDetails.map((wing: Wing) => ({
          name: wing.name,
          id: wing.id,
        }));
      });
  }

  onWingSelection(): void {
    console.log('Selected Wing:', this.numberOfWings);
    // Add further logic based on selected wing
  }
}
