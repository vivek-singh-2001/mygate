import { Component, OnInit } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { UserChatComponent } from './user-chat/user-chat.component';

import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../../services/chats/chat.service';
import { UserService } from '../../../../services/user/user.service';
import { NotificationCountService } from '../../../../services/notificationCount/notificationCount.service';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [UserListComponent, UserChatComponent, CommonModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css',
})
export class ChatsComponent implements OnInit {
  messages: { text: string; isSender: boolean }[] = [];
  newMessage: string = '';
  selectedUser: any = null;
  roomId: string = '';
  currentUserId: string = '';
  societyId: string = '';
  private userSubscription!: Subscription;

  constructor(
    private readonly ChatService: ChatService,
    private readonly userService: UserService,
    private readonly notificationCuntService: NotificationCountService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.getUserData().subscribe({
      next: (userData) => {
        this.currentUserId = userData.id;
        this.userService.userSocietyId$.subscribe({
          next: (societyId) => {
            this.societyId = societyId;
            this.notificationCuntService
              .resetCount(this.societyId, this.currentUserId, 'chat')
              .subscribe();
          },
        });
      },
      error: (error) => {
        console.error('Failed to fetch user data', error);
      },
      complete: () => {
        if (this.userSubscription) {
          this.userSubscription.unsubscribe();
        }
      },
    });
  }
  onUserSelected(user: any) {
    this.selectedUser = user;
    this.roomId = `${user.id}-${this.currentUserId}`;
    this.messages = [];
    this.ChatService.joinRoom(`${user.id}`);
  }
}
