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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { lettersOnlyValidator } from '../../utils/lettersOnlyValidator';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { HouseService } from '../../services/houses/houseService';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { FamilyDetailsComponent } from './family-details/family-details.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { WingService } from '../../services/wings/wing.service';
import { MessageService } from 'primeng/api';
import { User } from '../../interfaces/user.interface';

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
    FamilyDetailsComponent,
    ProgressBarModule,
  ],
  providers: [MessageService],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent implements OnInit {
  today: Date = new Date();
  familyData: User[] = [];
  genders: Gender[] = [];
  userProfileForm!: FormGroup;
  userDetails: any = {};
  selectedHouse: any = [];
  isLoading: boolean = true;

  private userSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private houseService: HouseService,
    private wingService: WingService,
    private messageService: MessageService
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
      dateofbirth: ['', Validators.required],
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
              dateofbirth: userData.dateofbirth
                ? new Date(userData.dateofbirth)
                : '',
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
            console.log('house from userdetails', house);
            this.userDetails.house = house;
            this.userProfileForm.patchValue({
              roomno: house.house_no || '',
              wingname: house.Wing?.name || '',
              societyname: house.Wing?.Society?.name || '',
              societyaddress:
                this.getAddress(house.Wing?.Society?.address) || '',
            });

            // Fetch wing details here
            this.fetchWingDetails(house.Wing?.id);
          } else {
            console.log('Selected house is null or undefined');
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching house details', err);
          this.isLoading = false;
        },
        complete: () => {
          if (this.userSubscription) {
            this.userSubscription.unsubscribe();
          }
        },
      });

    // Fetch family details
    this.userService.getFamilyMembers().subscribe((response) => {
      this.familyData = response.users.filter(
        (data: User) => data.id !== this.userDetails.id
      );
    });
  }

  // Fetch wing details after getting house info
  fetchWingDetails(wingId: number) {
    if (wingId) {
      this.wingService.fetchWingDetails(wingId).subscribe({
        next: (wingDetails) => {
          console.log('Fetched wing details:', wingDetails);
          // Add wing details to userDetails
          this.userDetails.wingDetails =
            wingDetails?.data?.wingDetails?.wingAdminDetails || {};
        },
        error: (error) => {
          console.error('Error fetching wing details:', error);
        },
      });
    }
  }

  getAddress(obj: {
    street: string;
    city: string;
    state: string;
    zip: string;
  }) {
    const { street, city, state, zip } = obj;
    return `${street}, ${city}, ${state}, ${zip}`;
  }

  addFamilyMember(member: any) {
    member.houseId = this.selectedHouse.id;
    this.userService.addFamilyMember(member).subscribe({
      next: (response) => {
        this.familyData.push(response.data.user);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Family member added successfully!',
        });
      },
      error: (error) => {
        console.log('Error adding family member', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not add family member. Please try again.',
        });
      },
    });
  }
}
