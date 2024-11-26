import { Component, OnInit } from '@angular/core';
import { CalanderComponent } from '../calander/calander.component';
import { NoticeComponent } from '../notice/notice.component';
import { AvatarModule } from 'primeng/avatar';
import { RouterModule } from '@angular/router';
import { NotificationCountService } from '../../../../services/notificationCount/notificationCount.service';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { UserService } from '../../../../services/user/user.service';
import { NoticeService } from '../../../../services/notice/notice.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CalanderComponent,
    NoticeComponent,
    AvatarModule,
    RouterModule,
    CommonModule,
    BadgeModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  newNoticesCount: number = 0;
  newComplaintsCount: number = 0;
  newChatCount: number = 0;
  notices: any = [];
  societyId: string = '';
  userId: string = '';

  constructor(
    private readonly notificationCountService: NotificationCountService,
    private readonly userService: UserService,
    private readonly noticeService: NoticeService
  ) {}

  ngOnInit() {
    this.userService.userData$.subscribe({
      next: (userData) => {
        console.log(userData.id);
        
        this.userId = userData.id;
        this.userService.userSocietyId$.subscribe({
          next: (societyId) => {
            console.log("pppp",societyId);
            this.societyId = societyId;
            this.fetchNoticeCount();
            // this.fetchChatCount(); 
          },
        });
      },
    });

    this.notificationCountService.notificationCount$.subscribe({
      next: (count: any) => {
        this.newNoticesCount = count;
        this.noticeService.getNotices(this.societyId).subscribe((notice) => {
          const sortedNoticeList = notice.noticeList.sort((a: any, b: any) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          this.notices = sortedNoticeList[0];
        });
      },
    });

    // // Subscribe to chat notification count updates
    // this.notificationCountService.chatNotificationCount$.subscribe({
    //   next: (count: any) => {
    //     this.newChatCount = count;
    //   },
    // });
  }

  private fetchNoticeCount() {
    this.notificationCountService
      .getCount(this.societyId, this.userId, 'notice')
      .subscribe({
        next: (count: any) => {
          this.newNoticesCount = count.count;
        },
        error: (err) => {
          console.error('Error fetching notice count:', err);
        },
      });
  }

  // // Fetch chat notification count
  // private fetchChatCount() {
  //   this.notificationCountService
  //     .getCount(this.societyId, this.userId, 'chat')
  //     .subscribe({
  //       next: (count: any) => {
  //         console.log('fom the dashboard', count.count);
  //         this.newChatCount = count.count;
  //       },
  //       error: (err) => {
  //         console.error('Error fetching chat count:', err);
  //       },
  //     });
  // }
}
