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

import { CustomValidators } from '../../utils/noSpaceAllowed.validator'; // Assuming you have custom validators here
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CardModule,InputTextModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  reactiveForm!: FormGroup;
  formdata: any = {};

  constructor(private formBuilder: FormBuilder,private router:Router) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.reactiveForm = this.formBuilder.group({
      firstname: ['', [Validators.required, CustomValidators.noSpaceAllowed]],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: this.formBuilder.group({
        street: ['', Validators.required],
        country: ['India', Validators.required],
        city: [''],
        region: [''],
        postal: ['', Validators.required],
      }),
    });
  }

  // Form submission
  OnFormSubmitted() {
    console.log('wdaf');

    if (this.reactiveForm.valid) {
      console.log('aaaaa');

      this.formdata = this.reactiveForm.value;
      console.log(this.formdata);
    } else {
      console.log('bbbb');

      this.reactiveForm.markAllAsTouched();
    }
  }

  goToLoginPage(){
     this.router.navigate(['/login']);
  }
}
