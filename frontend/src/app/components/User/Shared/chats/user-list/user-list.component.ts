import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { EMPTY, Subscription } from 'rxjs';
import { UserService } from '../../../../../services/user/user.service';
import { HouseService } from '../../../../../services/houses/houseService';
import { BadgeModule } from 'primeng/badge';
import { NotificationCountService } from '../../../../../services/notificationCount/notificationCount.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, BadgeModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  userData: any;
  SocietyUsers: any;
  societyId: string = '';
  myId: string = '';
  unreadMessages: { [userId: string]: number } = {};
  selectedUserId: string | null = null; // Track the selected user
  @Output() userSelected = new EventEmitter<any>();
  private subscription!: Subscription;

  constructor(
    private readonly userService: UserService,
    private readonly houseService: HouseService,
    private readonly notificationCountService: NotificationCountService
  ) {}

  ngOnInit() {
    this.subscription = this.houseService.selectedHouse$
      .pipe(
        switchMap((selectedHouse) => {
          if (selectedHouse) {
            console.log(selectedHouse);
            
            this.societyId = selectedHouse.Floor.Wing.societyId
            return this.userService.getUsersBySocietyIdAndWingId(
              selectedHouse.Floor.Wing.societyId,
              selectedHouse.Floor.wingId
            );
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe({
        next: (societyUsers: any) => {
          console.log(societyUsers);
          
          this.SocietyUsers = societyUsers;
          this.SocietyUsers.forEach((user: any) => {
            this.notificationCountService
              .getChatNotificationCountBySender(user.id)
              .subscribe((count) => {
                this.unreadMessages[user.id] = count;
              });
          });

          this.userService.getUserData().subscribe({
            next:(user)=>{
              this.myId = user.id
            }
          })
        },
        error: (error) => {
          console.error('Failed to fetch society users', error);
        },
        complete: () => {
          if (this.subscription) {
            this.subscription.unsubscribe();
          }
        },
      });
  }
  selectUser(user: any) {
    this.selectedUserId = user.id;
    this.userSelected.emit(user);
    this.notificationCountService.resetCount(this.societyId,user.id,'chat',this.myId).subscribe({
      next:()=>{
        this.unreadMessages[user.id] = 0
      }
    })
  }
}
