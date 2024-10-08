import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CustomValidators } from '../../utils/noSpaceAllowed.validator';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address/address.service';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SocietyService } from '../../services/society/society.Service';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    StepperModule,
    IconFieldModule,
    InputIconModule,
    RadioButtonModule,
    CalendarModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  active: number | undefined = 0;
  today: Date = new Date();

  reactiveForm!: FormGroup;
  states: { name: string; code: string }[] = [];
  districts: string[] = [];
  fileError: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly addressService: AddressService,
    private readonly societyService: SocietyService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.reactiveForm = this.formBuilder.group({
      firstname: ['', [Validators.required, CustomValidators.noSpaceAllowed]],
      lastname: ['', [Validators.required, CustomValidators.noSpaceAllowed]],
      email: ['', [Validators.required, Validators.email]],
      number: ['', [Validators.required]],
      dateofbirth: ['', [Validators.required]],
      address: this.formBuilder.group({
        s_name: ['', Validators.required],
        street: ['', Validators.required],
        postal: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
      }),
      house_option: ['A-101', Validators.required],
    });
  }

  downloadSampleCSV() {
    const sampleCsvData = `Wing Name, Floors,Number of Houses \nA,1,10\nA,2,10 \nA,3,8 \nB,1,12 \nB,1,12\nB,2,12\nB,3,10`;
    const blob = new Blob([sampleCsvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'sample_society_details.csv';
    anchor.click();
  }

  // Method to handle file selection
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (
      file &&
      (file.type === 'text/csv' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    ) {
      this.selectedFile = file;
      this.fileError = null;
    } else {
      this.fileError = 'Please upload a valid CSV file';
    }
  }
  uploadFile() {
    if (!this.selectedFile) {
      this.fileError = 'No file selected. Please upload a CSV/Excel file.';
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  }

  // Form submission
  OnFormSubmitted() {
    // Initialize formdata as a new FormData object
    const formdata = new FormData();

    if (this.reactiveForm.valid) {
      // Append the society data
      formdata.append('society', JSON.stringify(this.reactiveForm.value));

      // Append the selected file if it exists
      if (this.selectedFile) {
        formdata.append('file', this.selectedFile);
      }
      // Make the API call to register the society
      this.societyService.registerSociety(formdata).subscribe({
        next: (response) => {
          console.log('Society registered successfully:', response);
        },
        error: (error) => {
          console.log('Error in registering society:', error.message);
        },
      });
    } else {
      this.reactiveForm.markAllAsTouched();
    }
  }

  getStateByPincode() {
    const pincode = this.reactiveForm.get('address.postal')?.value.toString();

    if (pincode && pincode.length === 6) {
      this.addressService.getStateByPincode(pincode).subscribe({
        next: (response) => {
          if (response && response[0].Status === 'Success') {
            const postOffice = response[0].PostOffice[0];

            this.reactiveForm.patchValue({
              address: {
                city: postOffice.District,
                state: postOffice.State,
                country: postOffice.Country,
              },
            });
          } else {
            console.error('Invalid PIN code or no data found.');
          }
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        },
      });
    } else if (pincode.length > 6) {
      console.log('PIN code should be 6 digits only.');
    } else {
      console.log('Waiting for 6-digit PIN code...');
    }
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }
}
