import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';


interface Wing {
  name: string;
  code: string;
}

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [DropdownModule,FormsModule,CommonModule],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.css'
})
export class AddPropertyComponent implements OnInit {
  wingOptions: any[] = [];  // Initialize an empty array for the options
  numberOfWings!: {name: number, value: number};  // Variable to bind to the selected value
  wings: { name: string }[] = []; 

  ngOnInit() {
    this.generateWingOptions();
  }

  generateWingOptions() {
    // Generate an array of numbers between 1 and 5
    this.wingOptions = Array.from({ length: 5 }, (_, index) => ({
      name: index + 1,  // Option label
      value: index + 1  // Option value
    }));
  }
  onWingSelection() {
    console.log("wingss", this.numberOfWings);

    // Update the wings array to reflect the selected number of wings
    this.wings = Array.from({ length: this.numberOfWings.value }, () => ({ name: '' }));
    console.log("wingss", this.wings);
    
  }
}
