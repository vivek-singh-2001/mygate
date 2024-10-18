import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { UserService } from '../../../../services/user/user.service';
import { VisitorService } from '../../../../services/visitor/visitor.service';
import { ToastModule } from 'primeng/toast';
import { HouseService } from '../../../../services/houses/houseService';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    MessagesModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    TableModule
  ],
  providers: [MessageService],
  templateUrl: './visitors.component.html',
  styleUrl: './visitors.component.css',
})
export class VisitorsComponent implements OnInit {
  display: boolean = false;
  visitorForm: FormGroup;
  visitorTypes = [
    { label: 'Invited', value: 'Invited' },
    { label: 'Uninvited', value: 'Uninvited' },
  ];
  visitorStatuses = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
  ];
  today: Date = new Date();
  userId: string = '';
  houseId: string = '';
  visitors: any = []

  constructor(
    private readonly fb: FormBuilder,
    private readonly visitorService: VisitorService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly houseService: HouseService
  ) {
    this.visitorForm = this.fb.group({
      name: ['', Validators.required],
      number: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]{9}$')],
      ],
      vehicleNumber: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      visitTime: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.userService.userData$.subscribe((user) => {
      this.userId = user.id
    });

    this.houseService.selectedHouse$.subscribe((selectedHouse) => {
      if (selectedHouse) this.houseId = selectedHouse.id
    });

    // if (this.houseId !== '') {
    //   this.fetchVisitors(this.houseId)
    // } else {
      this.fetchVisitors(undefined, this.userId)
    // }
  }

  fetchVisitors(houseId?: string, userId?: string): void {
    this.visitorService.getVisitors(houseId, userId).subscribe({
      next: (visitors) => {
        if (visitors) {
          console.log("visitorss", visitors);
          
          this.visitors = visitors.data;
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch visitors: ' + error.message,
        });
      },
    });
  }

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
    this.visitorForm.reset();
  }

  onSubmit() {
    if (this.visitorForm.valid) {
      console.log('form data', this.visitorForm.value);
      const visitorData = {
        ...this.visitorForm.value,
        purpose: 'Visit',
        type: 'Invited',
        status: 'Pending',
        houseId: this.houseId ? this.houseId : null,
        responsibleUser: this.userId,
      };

      this.visitorService.addVisitor(visitorData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Visitor added successfully!',
          });
          this.closeDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add visitor: ' + error.message,
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields.',
      });
    }
  }

  validateNumericInput(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement | null;
    const key = event.key;

    if (key < '0' || key > '9') {
      event.preventDefault();
      return;
    }

    if (inputElement?.value.length === 0 && key === '0') {
      event.preventDefault();
    }
  }
}
