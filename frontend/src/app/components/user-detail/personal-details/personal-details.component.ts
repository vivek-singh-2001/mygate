import { Component, Input, OnInit } from '@angular/core';
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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { finalize, switchMap } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-personal-details',
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
    ProgressBarModule
  ],
  templateUrl: './personal-details.component.html',
  styleUrls: ['../user-detail.component.css'],
})
export class PersonalDetailsComponent implements OnInit {
  @Input() userDetails: any;
  @Input() userProfileForm!: FormGroup;
  @Input() genders?: any[];
  @Input() today?: Date;
  isLoading: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // append the userId in the userprofileform
  }
  onUserFormSubmit() {
    this.isLoading = true; // Set loading to true before starting the HTTP request
  
    this.userService
      .updateUser(this.userDetails.id, this.userProfileForm.value)
      .pipe(
        switchMap(() => this.userService.getCurrentUser()),
        finalize(() => {
          // Stop the loader when the request completes (whether success or error)
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (user) => {
          // Handle successful response here
          console.log('User data updated and fetched:', user);
        },
        error: (err) => {
          // Handle error here
          console.error('Error updating user:', err);
        },
      });
  }
}
