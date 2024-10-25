import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import {
  response,
  Role,
  StaffService,
} from '../../../services/staff/staff.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-security-gaurd',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    ToastModule,
    CommonModule,
    CalendarModule,
  ],
  templateUrl: './security-gaurd.component.html',
  styleUrl: './security-gaurd.component.css',
  providers: [MessageService],
})
export class SecurityGaurdComponent implements OnInit {
  securityGuardForm: FormGroup;
  roles: Role[] = [];
  societyId: string = '';
  userId: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly staffService: StaffService,
    private readonly userService: UserService
  ) {
    this.securityGuardForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      dateofbirth: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.staffService.staffRoles$.subscribe({
      next: (roles) => {
        if (roles && roles.length > 0) {
          this.roles = roles;
        } else {
          this.staffService.fetchRoles().subscribe({
            next: (response: response) => {
              this.roles = response.roles.filter(
                (role: Role) => role.name === 'security'
              );
            },
            error: (err) => {
              console.error('Error fetching roles:', err);
            },
          });
        }
      },
      error: (err) => {
        console.error('Error loading cached roles:', err);
      },
    });

    this.userService.userSocietyId$.subscribe({
      next: (societyId) => {
        this.societyId = societyId;
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.userService.userData$.subscribe({
      next: (data) => {
        this.userId = data.id;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSubmit() {
    if (this.securityGuardForm.valid) {
      this.staffService.registerStaff(this.securityGuardForm.value,this.societyId).subscribe({
        next: (staff) => {
          console.log(staff);
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Security Guard added successfully!',
          });
          this.securityGuardForm.reset();
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something is wrong. Try Again later',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in the required fields correctly.',
      });
    }
  }
}
