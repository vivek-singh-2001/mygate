import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import { CustomValidators } from '../../utils/noSpaceAllowed.validator';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address/address.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  reactiveForm!: FormGroup;
  formdata: any = {};
  states: { name: string; code: string }[] = [];
  districts: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private addressService: AddressService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.reactiveForm = this.formBuilder.group({
      firstname: ['', [Validators.required, CustomValidators.noSpaceAllowed]],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: this.formBuilder.group({
        street1: ['', Validators.required],
        street2: ['', Validators.required],
        postal: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['India', Validators.required],
      }),
    });
  }

  // Form submission
  OnFormSubmitted() {
    console.log('wdaf');

    if (this.reactiveForm.valid) {
      this.formdata = this.reactiveForm.value;
      console.log(this.formdata);
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
