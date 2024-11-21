import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { FamilyDetailsComponent } from './family-details/family-details.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';
import { Gender, User } from '../../../../interfaces/user.interface';
import { House } from '../../../../interfaces/house.interface';
import { UserService } from '../../../../services/user/user.service';
import { HouseService } from '../../../../services/houses/houseService';
import { WingService } from '../../../../services/wings/wing.service';
import { lettersOnlyValidator } from '../../../../utils/lettersOnlyValidator';

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
export class UserDetailComponent implements OnInit, OnDestroy {
  today: Date = new Date();
  familyData: User[] = [];
  genders: Gender[] = [];
  userProfileForm!: FormGroup;
  userDetails: User = {
    id: '',
    isMember: true,
    isOwner: true,
    firstname: '',
    lastname: '',
    email: '',
    gender: '',
    number: '',
    dateofbirth: new Date(),
    passcode: '',
    house: undefined,
  };
  selectedHouse: Partial<House> = {};
  isLoading: boolean = true;

  private wingSubscription!: Subscription;
  private userSubscription!: Subscription;
  private familySubscription!: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly houseService: HouseService,
    private readonly wingService: WingService,
    private readonly messageService: MessageService
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
            this.userDetails.house = house;
            this.userProfileForm.patchValue({
              roomno: house.house_no || '',
              wingname: house.Floor?.Wing?.name || '',
              societyname: house.Floor?.Wing?.Society?.name || '',
              societyaddress:
                this.getAddress(house.Floor?.Wing?.Society?.address) || '',
            });

            // Fetch wing details here
            this.fetchWingDetails(house.Floor?.Wing?.id);

            // Fetch family details
            this.getFamilyMembers(this.userDetails.id, house.id);
          } else {
            console.log('Selected house is null or undefined');
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching house details', err);
          this.isLoading = false;
        },
      });
  }

  //Get Family Members
  getFamilyMembers(userId: string, houseId: number) {
    this.familySubscription = this.userService
      .getFamilyMembers(userId, houseId)
      .subscribe((response) => {
        this.familyData = response.users.filter(
          (data: User) => data.id !== this.userDetails.id
        );
      });
  }

  // Fetch wing details after getting house info
  fetchWingDetails(wingId: number) {
    if (wingId) {
      this.wingSubscription = this.wingService
        .getWingDetails(wingId)
        .subscribe({
          next: (wingDetails) => {
            console.log("apple",wingDetails.data);
            
            // Add wing details to userDetails
            this.userDetails.wingDetails = wingDetails?.data || {};
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

  addFamilyMember(member: User) {
    member.houseId = this.selectedHouse.id;
    member.isOwner = false;
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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions at once
    this.wingSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.familySubscription.unsubscribe();
  }
}
