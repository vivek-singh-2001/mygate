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
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
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

    // Subscribe to user data and populate the form
    this.userService.getUserData().subscribe((userData) => {
      if (userData) {
        this.userDetails = userData;
        console.log(this.userDetails);

        this.userProfileForm.patchValue({
          firstname: userData.firstname || 'apple',
          lastname: userData.lastname || '',
          email: userData.email || '',
          gender: userData.gender || 'male',
          number: userData.number || '',
          dob: userData.dateofbirth ? new Date(userData.dateofbirth) : '',
          passcode: userData.passcode || '',
          roomno: userData.Houses[0].house_no || '',
          wingname: userData.Houses[0].Wing.name || '',
          societyname: userData.Houses[0].Wing.Society.name || '',
          societyaddress:
            this.getAddress(userData.Houses[0].Wing.Society.address) || '',
        });
      }
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
