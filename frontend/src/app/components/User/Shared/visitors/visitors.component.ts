import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { User } from '../../../../interfaces/user.interface';
import { TooltipModule } from 'primeng/tooltip';
import { Visitor } from '../../../../interfaces/visitor.interface';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
    TableModule,
    TooltipModule,
    TabViewModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
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
  userData!: User;
  houseData!: any;
  visitors: Visitor[] = [];
  expectedVisitors: Visitor[] = [];
  pastVisitors: Visitor[] = [];
  pendingVisitors: Visitor[] = [];
  selectedVisitor!: Visitor;
  displayDialog: boolean = false;
  imageUrl: string = '';
  confirmDialogVisible = false
  actionType!: 'approve' | 'reject';

  constructor(
    private readonly fb: FormBuilder,
    private readonly visitorService: VisitorService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly houseService: HouseService,
    private readonly confirmationService: ConfirmationService
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
      console.log('userrrr', user);

      this.userData = user;
    });

    this.houseService.selectedHouse$.subscribe((selectedHouse) => {
      console.log('houseeee', selectedHouse);

      if (selectedHouse) this.houseData = selectedHouse;
    });

    if (this.houseData) {
      this.fetchVisitors(this.houseData.id);
    } else {
      this.fetchVisitors(undefined, this.userData.id);
    }
  }

  fetchVisitors(houseId?: string, userId?: string): void {
    this.visitorService.getVisitors(houseId, userId).subscribe({
      next: (visitors) => {
        if (visitors) {
          console.log('visitorss', visitors);
          this.expectedVisitors = visitors.data.filter(
            (visitor: Visitor) =>
              visitor.type === 'Invited' && visitor.status === 'Pending'
          );
          this.pastVisitors = visitors.data.filter(
            (visitor: Visitor) =>
              visitor.status === 'Approved' || visitor.status === 'Rejected'
          );
          this.pendingVisitors = visitors.data.filter(
            (visitor: Visitor) =>
              visitor.type === 'Uninvited' && visitor.status === 'Pending'
          );
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
        type: 'Invited',
        purpose: 'Visit',
        houseId: this.houseData ? this.houseData.id : null,
        responsibleUser: this.userData.id,
      };

      this.visitorService.addVisitor(visitorData).subscribe({
        next: (response) => {
          this.visitors.push(response.data);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Visitor added successfully!',
          });
          this.closeDialog();
          this.openShareDialog(response.data);
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
        summary: 'Invalid Form',
        detail: 'Please ensure all required fields are filled and valid.',
      });
    }
  }

  showConfirmation(visitor: Visitor, action: 'Approved' | 'Rejected') {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${action === 'Approved' ? 'approve' : 'reject'} this visitor?`,
      header: 'Confirm Action',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: action === 'Approved' ? 'p-button-success' : 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.updateVisitorStatus(visitor, action);
      },
    });
  }

  updateVisitorStatus(visitor: Visitor, status: 'Approved' | 'Rejected') {
    this.visitorService.updateVisitorStatus(visitor.id, status).subscribe({
      next: (response) => {
        this.pendingVisitors = this.pendingVisitors.filter(
          (p) => p.id !== visitor.id
        );
        this.pastVisitors.push(response.data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: status === 'Approved' ? 'Visitor approved successfully.': 'Visitor rejected successfully.',
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update visitor status: ' + error.message,
        });
      },
    });
  }

  generateVisitorImage(visitor: Visitor): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const scaleFactor = 2;
      const canvasWidth = 400 * scaleFactor;
      const canvasHeight = 600 * scaleFactor;
  
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
  
      if (ctx) {
        ctx.scale(scaleFactor, scaleFactor);
  
        const logo = new Image();
        logo.src = 'assets/mygate.png';
  
        logo.onload = () => {
          ctx.fillStyle = '#FF4D4D';
          ctx.fillRect(0, 0, canvasWidth / scaleFactor, canvasHeight / scaleFactor);
  
          const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
          };
  
          drawRoundedRect(20, 40, 360, 520, 20);
  
          const logoHeight = 70;
          const logoY = 50;
          ctx.drawImage(logo, (400 - 100) / 2, logoY, 100, logoHeight);
  
          const textStartY = logoY + logoHeight + 50;
  
          ctx.fillStyle = '#555';
          ctx.font = 'normal 22px Arial';
          ctx.fillText(`Hello, `, 40, textStartY);
  
          const greetingWidth = ctx.measureText(`Hello, `).width;
  
          ctx.fillStyle = '#555';
          ctx.font = 'bold 22px Arial';
          ctx.fillText(`${visitor.name}`, 40 + greetingWidth, textStartY);
  
          const nextY = textStartY + 60;
  
          ctx.fillStyle = '#555';
          ctx.font = 'bold 22px Arial';
          const userFullName = `${this.userData.firstname} ${this.userData.lastname}`;
          ctx.fillText(userFullName, 40, nextY);
  
          const fullNameWidth = ctx.measureText(userFullName).width;
  
          ctx.fillStyle = '#555';
          ctx.font = 'normal 22px Arial';
          ctx.fillText(`has invited you to`, 40 + fullNameWidth + 10, nextY);
  
          ctx.fillStyle = '#555';
          ctx.font = 'bold 22px Arial';
          ctx.fillText(
            `${this.houseData.Floor.Wing.name}-${this.houseData.house_no}, ${this.houseData.Floor.Wing.Society.name}`,
            40,
            nextY + 40
          );
  
          ctx.fillStyle = '#333';
          ctx.font = 'normal 16px Arial';
          const startDate = new Date(visitor.startDate).toLocaleDateString();
          const endDate = new Date(visitor.endDate).toLocaleDateString();
          const dateY = nextY + 100;
          ctx.fillText(`${startDate} - ${endDate}`, 40, dateY);
  
          const passcodeY = dateY + 60;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(40, passcodeY, 320, 100);
  
          ctx.fillStyle = '#333';
          ctx.font = 'bold 50px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(visitor.passcode, canvas.width / (2 * scaleFactor), passcodeY + 60);
  
          ctx.font = 'italic 14px Arial';
          ctx.fillStyle = '#666';
          ctx.textAlign = 'center';
  
          const footerY = passcodeY + 160;
          ctx.fillText(
            'Please share this passcode with security at the gate.',
            canvas.width / (2 * scaleFactor),
            footerY
          );
  
          const imageUrl = canvas.toDataURL('image/png');
          resolve(imageUrl);
        };
  
        logo.onerror = () => {
          reject(new Error('Failed to load the logo image.'));
        };
      } else {
        reject(new Error('Canvas context is null.'));
      }
    });
  }
  

  openShareDialog(visitor: Visitor) {
    this.generateVisitorImage(visitor).then((imageUrl) => {
      this.imageUrl = imageUrl;
      this.displayDialog = true;
    });
  }

  shareOnWhatsApp() {
    fetch(this.imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'visitor-pass.png');

        fetch('https://file.io', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              const downloadUrl = data.link;
              const message = `${this.userData.firstname} has invited you to ${this.houseData.Floor.Wing.Society.name}. Check out your visitor pass.`;
              const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                message + ' ' + downloadUrl
              )}`;
              window.open(whatsappUrl, '_blank');
              this.displayDialog = false;
            } else {
              console.error('Image upload failed:', data);
            }
          })
          .catch((err) => console.error('Error uploading to File.io:', err));
      })
      .catch((err) => console.error('Error fetching the image blob:', err));
  }

  shareOnTwitter() {
    fetch(this.imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'visitor-pass.png');

        fetch('https://file.io', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              const downloadUrl = data.link;
              const message = `${this.userData.firstname} has invited you to ${this.houseData.Floor.Wing.Society.name}. Check out your visitor pass.`;
              const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                message + ' ' + downloadUrl
              )}`;
              window.open(twitterUrl, '_blank');
              this.displayDialog = false;
            } else {
              console.error('Image upload failed:', data);
            }
          })
          .catch((err) => console.error('Error uploading to File.io:', err));
      })
      .catch((err) => console.error('Error fetching the image blob:', err));
  }

  shareOnFacebook() {
    fetch(this.imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'visitor-pass.png');

        fetch('https://file.io', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              const downloadUrl = data.link;
              const message = `${this.userData.firstname} has invited you to ${this.houseData.Floor.Wing.Society.name}. Check out your visitor pass.`;
              const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                downloadUrl
              )}&quote=${encodeURIComponent(message)}`;
              window.open(facebookUrl, '_blank');
              this.displayDialog = false;
            } else {
              console.error('Image upload failed:', data);
            }
          })
          .catch((err) => console.error('Error uploading to File.io:', err));
      })
      .catch((err) => console.error('Error fetching the image blob:', err));
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
