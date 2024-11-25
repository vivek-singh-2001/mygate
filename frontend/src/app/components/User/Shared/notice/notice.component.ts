import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { GalleriaModule } from 'primeng/galleria';
import { NotificationCountService } from '../../../../services/notificationCount/notificationCount.service';

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
    GalleriaModule,
  ],
  providers: [MessageService, DatePipe],
  templateUrl: './notice.component.html',
  styleUrl: './notice.component.css',
})
export class NoticeComponent implements OnInit {
  noticeForm: boolean = false;
  viewNoticeForm: boolean = false;
  username!: string;
  specificNoticeDetail: any = [];
  noticeDescription: string = '';
  selectedFiles: File[] = [];
  societyId: string = '';
  userId: string = '';
  formData!: FormData;
  notices!: any;
  isAdmin: boolean = false;
  @Output() noticeCountUpdated = new EventEmitter<number>();

  constructor(
    private readonly noticeService: NoticeService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly notificationCuntService: NotificationCountService
  ) {
    this.formData = new FormData();
  }

  ngOnInit(): void {
    this.userService.userData$.subscribe({
      next: (userData) => {
        this.userId = userData.id;
        this.username = userData.firstname;

        this.userService.userSocietyId$.subscribe({
          next: (societyId) => {
            this.societyId = societyId;
            this.userService.userRoles$.subscribe({
              next: (roleArray) => {
                if (
                  roleArray.includes('societyAdmin') ||
                  roleArray.includes('wingAdmin')
                ) {
                  this.isAdmin = true;
                }
              },
            });
          },
        });
      },
    });

    this.noticeService.getNotices(this.societyId).subscribe({
      next: (notices) => {
        console.log(notices.noticeList);
        
        const sortedNoticeList = notices.noticeList.sort((a: any, b: any) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        this.notices = sortedNoticeList;
        console.log("juice piladooooo",this.notices);
        this.notificationCuntService
          .resetCount(this.societyId, this.userId, 'notice')
          .subscribe();
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
        this.formData.append('files', element);
      }
    }

    this.noticeService.createNotice(this.formData).subscribe({
      next: (data: any) => {
        this.messageService.add({
          severity: 'success',
          detail: data.message,
        });
        console.log(data.data.newNotice);

        this.notices.unshift(data.data.newNotice);
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

  viewNotice(notice: Notice) {
    this.viewNoticeForm = true;
    this.specificNoticeDetail = notice;
  }
}
