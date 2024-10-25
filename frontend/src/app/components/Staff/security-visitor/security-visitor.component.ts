import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SocietyService } from '../../../services/society/society.Service';
import { Wing } from '../../../interfaces/wing.interface';
import { UserService } from '../../../services/user/user.service';
import { WingService } from '../../../services/wings/wing.service';
import { DropdownModule } from 'primeng/dropdown';
import { VisitorService } from '../../../services/visitor/visitor.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Visitor } from '../../../interfaces/visitor.interface';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-security-visitor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonModule, DropdownModule, ToastModule, DialogModule, TableModule, InputOtpModule],
  templateUrl: './security-visitor.component.html',
  styleUrl: './security-visitor.component.css',
  providers: [MessageService],
})
export class SecurityVisitorComponent implements OnInit {
  visitorForm!: FormGroup;
  verificationForm!: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  houses: any[] = [];
  wings: Wing[] = [];
  visitors: Visitor[] = []
  formSubmitted: boolean = false;
  display: boolean = false;
  verifyDialog: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly societyService: SocietyService,
    private readonly wingService: WingService,
    private readonly visitorService: VisitorService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit() {
    this.visitorForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      purpose: ['', Validators.required],
      wingId: ['', Validators.required],
      houseId: ['', Validators.required],
    });

    this.verificationForm = this.fb.group({
      passcode: ['', Validators.required]
    });

    this.userService.userSocietyId$.subscribe((societyId) => {
      this.fetchWings(societyId);
      this.fetchVisitors(societyId);
    });
  }

  fetchWings(societyId: string): void {
    this.societyService.fetchSocietyData(societyId).subscribe({
      next: (response: any) => {
        this.wings = response
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
          .map((wing: any) => ({
            label: wing.name,
            value: wing.id,
          }));
      },
      error: (error) => {
        console.error('Failed to load wings', error);
      },
    });
  }

  fetchVisitors(societyId: string): void {
    this.visitorService.getSocietyVisitors(societyId).subscribe({
      next: (response: any) => {
        this.visitors = response.data;
      },
      error: (error) => {
        console.error('Failed to load visitors', error);
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

  showVerificationDialog() {
    this.verifyDialog = true;
  }

  closeVerificationDialog() {
    this.verifyDialog = false;
    this.verificationForm.reset()
  }

  onWingSelection(wingId: string): void {
    this.wingService.fetchHousesByWingId(wingId).subscribe({
      next: (response: any) => {
        this.houses = response.data.wingHouseDetails
          // .filter((house: any) => house.owner)
          .sort((a: any, b: any) => a.house_no - b.house_no)
          .map((house: any) => {
            let ownerName = '';

            if (house.owner) {
              ownerName = house.owner.firstname;
              if (house.owner.lastname) {
                ownerName += ` ${house.owner.lastname}`;
              }
              ownerName = ` - ${ownerName}`;
            }
            return {
              label: house.house_no + ownerName,
              value: { houseId: house.id, ownerId: house.owner?.id || null },
              disabled: !house.owner,
            };
          });
      },
      error: (error) => {
        console.error('Failed to load houses', error);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = input.files[0].name;
    } else {
      this.selectedFile = null;
      this.selectedFileName = null;
    }
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.visitorForm.valid && this.selectedFile) {
      const formData = new FormData();

      const today = new Date();
      const todayDate = today.toISOString().split('T')[0];
      const visitTime = new Date(today.getTime() + 5 * 60000).toISOString();

      formData.append('name', this.visitorForm.get('name')?.value);
      formData.append('number', this.visitorForm.get('phone')?.value);
      formData.append('purpose', this.visitorForm.get('purpose')?.value);
      formData.append('houseId', this.visitorForm.get('houseId')?.value.houseId);
      formData.append('responsibleUser', this.visitorForm.get('houseId')?.value.ownerId);
      formData.append('image', this.selectedFile);
      formData.append('type', 'Uninvited');
      formData.append('startDate', todayDate);
      formData.append('endDate', todayDate);
      formData.append('visitTime', visitTime);

      this.visitorService.addVisitor(formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Request sent successfully!',
          });
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
      this.visitorForm.markAllAsTouched();
    }
  }
}
