import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { lettersOnlyValidator } from '../../utils/lettersOnlyValidator';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { HouseService } from '../../services/houses/houseService';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { PersonalDetailsComponent } from "./personal-details/personal-details.component";
import { FamilyDetailsComponent } from "./family-details/family-details.component";

interface Gender {
  label: string;
  value: string;
}

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    TabViewModule,
    AvatarModule,
    ButtonModule,
    InputMaskModule,
    InputNumberModule,
    ImageModule,
    DividerModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    AutoCompleteModule,
    InputTextareaModule,
    ReactiveFormsModule,
    CommonModule,
    PersonalDetailsComponent,
    FamilyDetailsComponent
],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent implements OnInit {
  today: Date = new Date();
  familyData: any[] = [];
  genders: Gender[] = [];
  userProfileForm!: FormGroup;
  userDetails: any = {};
  selectedHouse: any = [];

  private userSubscription!: Subscription;
  private houseSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private houseService: HouseService
  ) {
    this.genders = [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
    ];
  }

  ngOnInit(): void {
    this.userProfileForm = this.fb.group({
      firstname: ['', [lettersOnlyValidator()]],
      lastname: [''],
      email: [{ value: '', disabled: true }, [Validators.email]],
      gender: [''],
      number: ['', Validators.required],
      dob: ['', Validators.required],
      passcode: [{ value: '', disabled: true }],
      roomno: [{ value: '', disabled: true }],
      wingname: [{ value: '', disabled: true }],
      societyname: [{ value: '', disabled: true }],
      societyaddress: [{ value: '', disabled: true }],
    });

    // Fetch user data first
    this.userSubscription = this.userService
      .getUserData()
      .pipe(
        switchMap((userData) => {
          if (userData) {
            this.userDetails = userData;
            this.userProfileForm.patchValue({
              firstname: userData.firstname || 'apple',
              lastname: userData.lastname || '',
              email: userData.email || '',
              gender: userData.gender || 'male',
              number: userData.number || '',
              dob: userData.dateofbirth ? new Date(userData.dateofbirth) : '',
              passcode: userData.passcode || '',
            });

            // Wait for house details to be set and then subscribe to selectedHouse$
            return this.houseService.houses$.pipe(
              switchMap(() => this.houseService.selectedHouse$)
            );
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: (house) => {
          this.selectedHouse = house;
          if (house) {
            this.userProfileForm.patchValue({
              roomno: house.house_no || '',
              wingname: house.Wing?.name || '',
              societyname: house.Wing?.Society?.name || '',
              societyaddress:
                this.getAddress(house.Wing?.Society?.address) || '',
            });
          } else {
            console.log('Selected house is null or undefined');
          }
        },
        error: (err) => {
          console.error('Error fetching house details', err);
        },
        complete: () => {
          if (this.userSubscription) {
            this.userSubscription.unsubscribe();
          }
        },
      });

    this.userService.getFamilyMembers().subscribe((response) => {
      this.familyData = response.users;
    });
  }

  getAddress(obj: any) {
    const { street, city, state, zip } = obj;
    return `${street}, ${city}, ${state}, ${zip}`;
  }
}
