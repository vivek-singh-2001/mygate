import { Component, EventEmitter, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { AddressService } from '../../../services/address/address.service';
import { SocietyService } from '../../../services/society/society.Service';
import { CustomValidators } from '../../../utils/customValidators';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    CalendarModule,
    ToastModule,
  ],
  providers: [MessageService],
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

  invalidPostalCode = false; // Flag for postal code validity

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly addressService: AddressService,
    private readonly societyService: SocietyService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.reactiveForm = this.formBuilder.group({
      firstname: ['', [Validators.required, CustomValidators.noSpaceAllowed]],
      lastname: ['', [Validators.required, CustomValidators.noSpaceAllowed]],
      email: ['', [Validators.required, CustomValidators.validEmail]],
      number: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]{9}$')],
      ],
      dateofbirth: ['', [Validators.required]],
      address: this.formBuilder.group({
        s_name: ['', Validators.required],
        street: ['', Validators.required],
        postal: [
          '',
          [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')],
          // [CustomValidators.postalCodeValidator(this.addressService)],
        ],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
      }),
      house_option: ['A-101', Validators.required],
    });
  }

  onNextStep(currentStepFields: string[], nextCallback: EventEmitter<void>) {
    let isValid = true;

    currentStepFields.forEach((field) => {
      const control = this.reactiveForm.get(field);
      if (control) {
        if (control.invalid) {
          control.markAsTouched();
          isValid = false;
        }
      }
    });

    if (isValid) {
      nextCallback.emit();
    }
  }

  downloadSampleCSV() {
    const sampleCsvData = `Wing Name, Floors,Number of Houses \nA,1,10\nA,2,10 \nA,3,8 \nB,1,12 \nB,2,12\nB,3,10`;
    const blob = new Blob([sampleCsvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'sample_society_details.csv';
    anchor.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      if (
        file.type === 'text/csv' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        this.selectedFile = file;
        this.fileError = null;
      } else {
        this.fileError = 'Please upload a valid CSV file';
      }
    } else {
      this.fileError = 'No file selected';
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
    const formdata = new FormData();

    if (this.reactiveForm.valid) {
      if (!this.selectedFile) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Kindly upload CSV file.',
        });
        return;
      }
      formdata.append('society', JSON.stringify(this.reactiveForm.value));

      formdata.append('file', this.selectedFile);

      this.societyService.registerSociety(formdata).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Your request has been submitted',
          });
          setTimeout(() => {
            this.reactiveForm.reset();
            this.goToLoginPage();
          }, 2000);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Error while processing your request',
          });
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

            this.invalidPostalCode = false;
          } else {
            this.invalidPostalCode = true;
            console.error('Invalid PIN code or no data found.');
          }
        },
        error: (error: Error) => {
          this.invalidPostalCode = true;
          console.error('Error fetching data:', error);
        },
      });
    }
  }

  validateNumericInput(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement | null;
    const key = event.key;

    if (key < '0' || key > '9') {
      event.preventDefault();
      return;
    }

    if (inputElement?.value.length === 0 && key === '0') {
      event.preventDefault();
    }
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }
}
