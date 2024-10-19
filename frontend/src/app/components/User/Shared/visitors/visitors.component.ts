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
import { User } from '../../../../interfaces/user.interface';

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
  userData!: User;
  houseData!: any;
  visitors: any = [];
  selectedVisitor: any;
  displayDialog: boolean = false;
  imageUrl: string = '';

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

  generateVisitorImage(visitor: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const logo = new Image();
      logo.src = 'assets/mygate.png';

      logo.onload = () => {
        if (ctx) {
          canvas.width = 400;
          canvas.height = 600;

          ctx.fillStyle = '#FF4D4D';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const drawRoundedRect = (
            x: number,
            y: number,
            width: number,
            height: number,
            radius: number
          ) => {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(
              x + width,
              y + height,
              x + width - radius,
              y + height
            );
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
          ctx.drawImage(logo, (canvas.width - 100) / 2, logoY, 100, logoHeight);

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
          ctx.fillText(visitor.passcode, canvas.width / 2, passcodeY + 60);

          ctx.font = 'italic 14px Arial';
          ctx.fillStyle = '#666';
          ctx.textAlign = 'center';

          const footerY = passcodeY + 160;
          ctx.fillText(
            'Please share this passcode with security at the gate.',
            canvas.width / 2,
            footerY
          );

          // const imageUrl = canvas.toDataURL();
          // const downloadLink = document.createElement('a');
          // downloadLink.href = imageUrl;
          // downloadLink.download = `Visitor_${visitor.name}.png`;
          // downloadLink.click();

          // canvas.toBlob((blob) => {
          //   // Check if the blob is null
          //   if (blob) {
          //     const imageUrl = URL.createObjectURL(blob);

          //     // Web Share API for sharing the image
          //     if (navigator.share) {
          //       navigator
          //         .share({
          //           title: `Visitor Pass for ${visitor.name}`,
          //           text: `Here is the visitor pass for ${visitor.name}`,
          //           files: [new File([blob], `Visitor_${visitor.name}.png`, { type: 'image/png' })],
          //         })
          //         .then(() => console.log('Share was successful.'))
          //         .catch((error) => console.log('Sharing failed', error));
          //     } else {
          //       console.log('Web Share API is not supported in this browser.');
          //       // Provide fallback option, such as downloading the image
          //       const downloadLink = document.createElement('a');
          //       downloadLink.href = imageUrl;
          //       downloadLink.download = `Visitor_${visitor.name}.png`;
          //       downloadLink.click();
          //     }
          //   } else {
          //     console.error('Blob generation failed!');
          //   }
          // }, 'image/png');

          const imageUrl = canvas.toDataURL('image/png');
          resolve(imageUrl);
        } else {
          reject(new Error('Canvas context is null.'));
        }
      };
    });
  }

  shareVisitor(visitor: any) {
    this.generateVisitorImage(visitor)
      .then((imageUrl) => {
        // Check if the browser supports the Web Share API and file sharing
        if (navigator.canShare && navigator.canShare({ files: [] })) {
          fetch(imageUrl)
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File([blob], 'visitor-pass.png', {
                type: 'image/png',
              });

              if (navigator.canShare({ files: [file] })) {
                navigator
                  .share({
                    title: 'Visitor Pass',
                    text: `Visitor pass for ${visitor.name}`,
                    files: [file], // Share the image file
                  })
                  .then(() => console.log('Share successful'))
                  .catch((error) => console.log('Error sharing:', error));
              } else {
                console.log('This browser does not support sharing files.');
                alert('This browser does not support sharing files.');
              }
            });
        } else {
          // Fallback for browsers that don't support Web Share API or file sharing
          console.log('Sharing not supported in this browser11');
          alert('Sharing not supported in this browser');
        }
      })
      .catch((error) => {
        console.error('Error generating image:', error);
      });
  }

  openShareDialog(visitor: any) {
    this.generateVisitorImage(visitor).then((imageUrl) => {
      this.imageUrl = imageUrl; // Save the image URL to share later
      this.displayDialog = true; // Open the dialog
    });
  }

  // openShareDialog(imageUrl: string) {
  //   const whatsappUrl = `https://api.whatsapp.com/send?text=Check%20out%20this%20visitor%20pass:%20${encodeURIComponent(imageUrl)}`;
  //   window.open(whatsappUrl, '_blank');
  // }

  shareOnWhatsApp() {
    fetch(this.imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'visitor-pass.png');

        // Upload to File.io
        fetch('https://file.io', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              const downloadUrl = data.link; // Get the download link
              const whatsappUrl = `https://api.whatsapp.com/send?text=Check%20out%20this%20visitor%20pass:%20${encodeURIComponent(
                downloadUrl
              )}`;
              window.open(whatsappUrl, '_blank');
            } else {
              console.error('Image upload failed:', data);
            }
          })
          .catch((err) => console.error('Error uploading to File.io:', err));
      })
      .catch((err) => console.error('Error fetching the image blob:', err));
  }

  shareOnWhatsApp11() {
    const message = `Visitor Pass ${this.imageUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, '_blank');
  }

  shareOnTwitter() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=Visitor%20Pass%20&url=${encodeURIComponent(
      this.imageUrl
    )}`;
    window.open(twitterUrl, '_blank');
  }

  shareOnFacebook() {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      this.imageUrl
    )}`;
    window.open(facebookUrl, '_blank');
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
