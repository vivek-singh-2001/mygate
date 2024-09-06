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
  ],
  templateUrl: './family-details.component.html',
  styleUrls: ['../user-detail.component.css', './family-details.component.css'],
})
export class FamilyDetailsComponent {
  @Input() familyData?: any[];
  @Output() addFamilyMember = new EventEmitter<any>();

  familyMemberForm: FormGroup;
  showForm = false;

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

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onSubmit() {
    console.log('he;loo');

    if (this.familyMemberForm.valid) {
      console.log(this.familyMemberForm.value);
      this.addFamilyMember.emit(this.familyMemberForm.value);
      this.familyMemberForm.reset();
      this.showForm = false;
    } else {
      console.log('geljk');

      this.messageService.add({
        severity: 'info',
        summary: 'Warning',
        detail: 'All the fields are mandatory.',
      });
    }
  }
}
