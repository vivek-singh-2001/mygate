import { Component, OnInit } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { UserChatComponent } from './user-chat/user-chat.component';

import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../../services/chats/chat.service';
import { UserService } from '../../../../services/user/user.service';

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
  currentUserId: number = 0;
  private userSubscription!: Subscription;

  constructor(
    private readonly ChatService: ChatService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.getUserData().subscribe({
      next: (userData) => {
        this.currentUserId = userData.id;
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
