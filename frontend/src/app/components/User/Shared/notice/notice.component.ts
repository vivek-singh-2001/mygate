import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { NoticeService } from '../../../../services/notice/notice.service';
import { UserService } from '../../../../services/user/user.service';
import { MessageService } from 'primeng/api';
import { Notice } from '../../../../interfaces/notice.interface';
import { DatePipe } from '@angular/common';


interface ItemsToAppend {
  description: string;
  societyId: string;
  userId: string;
}

@Component({
  selector: 'app-notice',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    ButtonModule,
    CommonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    FormsModule,
  ],
  providers: [MessageService,DatePipe],
  templateUrl: './notice.component.html',
  styleUrl: './notice.component.css',
})
export class NoticeComponent implements OnInit {
  noticeForm: boolean = false;
  noticeDescription: string = '';
  selectedFiles: File[] = [];
  societyId: string = '';
  userId: string = '';
  formData!: FormData;
  notices!: Notice[];

  constructor(
    private readonly noticeService: NoticeService,
    private readonly userService: UserService,
    private readonly messageService: MessageService
  ) {
    this.formData = new FormData();
  }

  ngOnInit(): void {
    this.userService.userData$.subscribe({
      next: (userData) => {
        this.userId = userData.id;
        this.userService.userSocietyId$.subscribe({
          next: (societyId) => {
            this.societyId = societyId;
          },
        });
      },
    });

    this.noticeService.getNotices(this.societyId).subscribe({
      next: (notices) => {
        console.log(notices)   
        this.notices = notices.noticeList    
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  showNoticeForm() {
    this.noticeForm = true;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  createNotice(fileInput: HTMLInputElement) {
    this.formData = new FormData();

    const itemsToAppend: ItemsToAppend = {
      description: this.noticeDescription,
      societyId: this.societyId,
      userId: this.userId,
    };

    Object.keys(itemsToAppend).forEach((key) => {
      this.formData.append(key, itemsToAppend[key as keyof ItemsToAppend]);
    });

    // Append multiple files
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (const element of this.selectedFiles) {
        this.formData.append('files', element); // 'files' is the key for multiple files
      }
    }

    this.noticeService.createNotice(this.formData).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          detail: data.message,
        });

        // Clear FormData by reinitializing it
        this.formData = new FormData();
        this.noticeForm = false;
        this.noticeDescription = '';
        this.selectedFiles = [];
        fileInput.value = '';
      },
      error: (err) => {
        this.messageService.add({
          severity: 'success',
          detail: err.message,
        });
      },
    });
  }
}
