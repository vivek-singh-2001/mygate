import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { Gender, User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-family-details',
  standalone: true,
  imports: [
    ImageModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    ToastModule,
    DropdownModule,
  ],
  templateUrl: './family-details.component.html',
  styleUrls: ['../user-detail.component.css', './family-details.component.css'],
})
export class FamilyDetailsComponent {
  @Input() familyData?: User[];
  @Input() userDetails?: User;
  @Input() genders?: Gender[];
  @Output() addFamilyMember = new EventEmitter<any>();

  familyMemberForm: FormGroup;
  isFormVisible = false;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.familyMemberForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      // gender: ['', Validators.required],
      number: ['', Validators.required],
      dateofbirth: ['', Validators.required],
    });
  }

  showForm() {
    if (this.isFormVisible) {
      this.familyMemberForm.reset();
    }
    this.isFormVisible = !this.isFormVisible;
  }

  onCancel() {
    this.isFormVisible = false;
    this.familyMemberForm.reset();
  }

  onSubmit() {
    if (this.familyMemberForm.valid) {
      console.log(this.familyMemberForm.value);
      this.addFamilyMember.emit(this.familyMemberForm.value);
      this.familyMemberForm.reset();
      this.isFormVisible = false;
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Warning',
        detail: 'All the fields are mandatory.',
      });
    }
  }
}
