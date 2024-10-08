import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SocietyService } from '../../../services/society/society.Service';
import { UserService } from '../../../services/user/user.service';
import { HttpClient } from '@angular/common/http';
import { Gender } from '../../../interfaces/user.interface';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { Wing } from '../../../interfaces/wing.interface';

@Component({
  selector: 'app-allocate-house',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    ToastModule,
  ],
  providers:[],
  templateUrl: './allocate-house.component.html',
  styleUrl: './allocate-house.component.css',
})
export class AllocateHouseComponent implements OnInit {
  wingOptions: any[] = []; 
  houseOptions: any[] = []; 
  numberOfWings!: { name: number; value: number }; 
  numberOfHouse!: { house_no: number; value: number }; 
  userDetailForm!: FormGroup;
  genders: Gender[] = [];

  constructor(
    private societyService: SocietyService,
    private userService: UserService,
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,

  ) {
    this.genders = [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'Other' },
    ];

    this.userDetailForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      gender: ['', Validators.required],
      number: ['', Validators.required],
      dateofbirth: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.generateWingOptions();
  }

  generateWingOptions() {
    this.userService.userSocietyId$.subscribe({
      next: (societyId) => {
        console.log("from allocate house ?",societyId);
        
        this.societyService.fetchSocietyData(societyId).subscribe({
          next: (response:any) => {
            console.log(response);
            
            const sortedWings = response.societyDetails.sort(
              (a: Wing, b: Wing) => a.name.localeCompare(b.name)
            );
            this.wingOptions = sortedWings.map((wing: Wing) => ({
              name: wing.name, 
              value: wing.id, 
            }));
          },
          error: (error) => {
            console.error('Failed to load wing options', error);
          },
        });
      },
    });
  }
  
  onWingSelection() {
    const houseApiUrl = `${environment.apiUrl}/house/wingHouseDetails/${this.numberOfWings.value}`;
    this.http.get<any>(houseApiUrl).subscribe({
      next: (response: any) => {
        const sortedHouse = response.data.wingHouseDetails.sort(
          (a: any, b: any) => a.house_no - b.house_no
        );

        this.houseOptions = sortedHouse.map((house: any) => ({
          house_no: house.house_no, // Use the wing name from the response
          value: house.id, // Assign a value (index-based or from response)
        }));
      },
      error: (error: Error) => {
        console.error('Error fetching house data:', error);
      },
    });
  }
  onSubmit() {
    if (this.userDetailForm.valid && this.numberOfWings && this.numberOfHouse) {
      // Create the object with user details and selected wing/house IDs only
      const allocationDetails = {
        firstname: this.userDetailForm.get('firstname')?.value,
        lastname: this.userDetailForm.get('lastname')?.value,
        email: this.userDetailForm.get('email')?.value,
        gender: this.userDetailForm.get('gender')?.value.value,
        number: this.userDetailForm.get('number')?.value,
        dateofbirth: this.userDetailForm.get('dateofbirth')?.value,
        wingId: this.numberOfWings.value,
        houseId: this.numberOfHouse.value,
        isOwner: true,
      };

      this.userService.addFamilyMember(allocationDetails).subscribe({
        next: (response: any) => {
          console.log('User added successfully:', response);  
          this.snackBar.open(`House Allocated to  ${allocationDetails.firstname}`, 'Close', { duration: 2000 });

          // Clear the form and variables
          this.userDetailForm.reset(); 
          this.numberOfWings = { name: 0, value: 0 }; 
          this.numberOfHouse = { house_no: 0, value: 0 }; 
        },
        error: (error: Error) => {
          console.error('Failed to add user:', error);
          this.snackBar.open(`${error.message}`, 'Close', { duration: 2000 });
          
          this.userDetailForm.reset(); 
          this.numberOfWings = { name: 0, value: 0 }; 
          this.numberOfHouse = { house_no: 0, value: 0 }; 
        },
      });
    } else {
      console.error('Form is invalid or Wing/House not selected');
    }
  }
}
