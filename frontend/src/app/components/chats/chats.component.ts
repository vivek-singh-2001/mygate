import { Component, OnInit } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { UserChatComponent } from './user-chat/user-chat.component';
import { ChatService } from './user-chat/chat.service';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';

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
  selectedUser: any = null; // Adjust type according to your user model
  roomId: string = '';
  currentUserId: number = 0;

  constructor(
    private ChatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.ChatService.receiveMessage((message: any) => {
      if (message.receiverId === this.selectedUser.id) {
        this.messages.push({ text: message.text, isSender: false });
      }
    });
  }

  onUserSelected(user: any) {
    this.selectedUser = user;
    this.roomId = `${user.id}-${this.currentUserId}`; // Create a unique room ID
    this.messages = []; // Clear previous messages or fetch messages for the selected user
    // Fetch chat history from the backend
    this.ChatService.getChatHistory(this.currentUserId, user.id).subscribe({
      next: (response: any) => {
        this.messages = response.chats.map((chat: any) => ({
          text: chat.message,
          isSender: chat.senderId === this.currentUserId,
        }));
      },
      error: (error) => {
        console.error('Failed to fetch chat history', error);
      },
    });

    this.ChatService.joinRoom(`${user.id}`); // Join the chat room for the selected user
  }
}
