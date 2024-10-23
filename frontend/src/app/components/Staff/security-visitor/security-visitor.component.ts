import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-security-visitor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './security-visitor.component.html',
  styleUrl: './security-visitor.component.css'
})

export class SecurityVisitorComponent implements OnInit {
  visitorForm!: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  houses: any[] = [];
  formSubmitted: boolean = false;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    // Initialize the form with form controls
    this.visitorForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      purpose: ['', Validators.required]
      // houseId: ['', Validators.required],
    });

    // Fetch houses from the backend
    this.fetchHouses();
  }

  fetchHouses() {
    
  }

  // onFileChange(event: any) {
  //   this.selectedFile = event.target.files[0];
  // }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
   
    
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = input.files[0].name;
    } else {
      this.selectedFile = null;
      this.selectedFileName = null;
    }
  }

  onSubmit() {
    this.formSubmitted = true
    console.log("vasvja", this.visitorForm.valid, this.selectedFile);
    
    if (this.visitorForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.visitorForm.get('name')?.value);
      formData.append('phone', this.visitorForm.get('phone')?.value);
      // formData.append('houseId', this.visitorForm.get('houseId')?.value);
      formData.append('image', this.selectedFile);


      
    } else {
      this.visitorForm.markAllAsTouched();
    }
    
    
  }
}