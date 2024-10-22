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
  specificNoticeDetail: any = [];
  noticeDescription: string = '';
  selectedFiles: File[] = [];
  societyId: string = '';
  userId: string = '';
  formData!: FormData;
  notices!: Notice[];
  @Output() noticeCountUpdated = new EventEmitter<number>();

  constructor(
    private readonly noticeService: NoticeService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly notificationService:NotificationCountService
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
        this.notices = notices.noticeList;
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
        console.log(data.data.newNotice);

        this.messageService.add({
          severity: 'success',
          detail: data.message,
        });
        this.notices.unshift(data.data.newNotice);

       // Increment notification count for the notice type
      this.notificationService.incrementCount(this.societyId, this.userId, 'notice')
      .subscribe({
        next: (count:any) => {
          console.log(`Notification count incremented: ${count}`);
          // this.notificationService.getCount(this.societyId,this.userId,'notice').subscribe({
          //   next:(count:any)=>{
          //     console.log("from notice component",count.count);
          //     this.noticeCountUpdated.emit(count.count)
          //   }
          // })
        },
        error: (err:any) => {
          console.error('Error incrementing notification count:', err);
        },
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

  viewNotice(notice: Notice) {
    this.viewNoticeForm = true;
    this.specificNoticeDetail = notice;
  }
}
