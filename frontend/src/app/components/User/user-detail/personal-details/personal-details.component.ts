import { Component, Input } from '@angular/core';
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
import { BehaviorSubject, finalize, switchMap } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';
import { Gender, User } from '../../../../interfaces/user.interface';
import { UserService } from '../../../../services/user/user.service';
import { Wing } from '../../../../interfaces/wing.interface';

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
    ProgressBarModule,
  ],
  templateUrl: './personal-details.component.html',
  styleUrls: ['../user-detail.component.css', './personal-details.component.css'],
})
export class PersonalDetailsComponent {
  @Input() userDetails!: User;
  @Input() userProfileForm!: FormGroup;
  @Input() genders?: Gender[];
  @Input() today?: Date;
  isLoading: boolean = false;
  wingDetailsSubject = new BehaviorSubject<Wing | null>(null);

  constructor(private readonly userService: UserService) {}

  onUserFormSubmit() {
    this.isLoading = true;
    this.userService
      .updateUser(this.userDetails.id , this.userProfileForm.value)
      .pipe(
        switchMap(() => this.userService.getCurrentUser()),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }
}
