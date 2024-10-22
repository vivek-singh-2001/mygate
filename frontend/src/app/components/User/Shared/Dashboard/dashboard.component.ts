import { Component, OnInit } from '@angular/core';
import { CalanderComponent } from '../calander/calander.component';
import { NoticeComponent } from '../notice/notice.component';
import { AvatarModule } from 'primeng/avatar';
import { RouterModule } from '@angular/router';
import { NotificationCountService } from '../../../../services/notificationCount/notificationCount.service';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CalanderComponent, NoticeComponent, AvatarModule, RouterModule,CommonModule,BadgeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  newNoticesCount: number = 0;
  societyId: string = '';
  userId: string = '';

  constructor(private readonly notificationCountService: NotificationCountService,private readonly userService:UserService) {}

  ngOnInit() {
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

     // Fetch the initial count for "notice" type
     this.notificationCountService
     .getCount(this.societyId, this.userId, 'notice')
     .subscribe({
       next: (count:any) => {
         this.newNoticesCount = count.count;
       },
       error: (err) => {
         console.error('Error fetching notice count:', err);
       },
     });

   // Subscribe to the BehaviorSubject in NotificationCountService for real-time updates
   this.notificationCountService.notificationCount$.subscribe({
     next: (count) => {
       this.newNoticesCount = count;
     },
   });
  }

  
}
