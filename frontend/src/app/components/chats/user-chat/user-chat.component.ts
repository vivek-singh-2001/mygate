import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { UserService } from '../../../services/user/user.service';
import { UserListComponent } from '../user-list/user-list.component';

interface Message {
  text: string;
  isSender: boolean;
}

@Component({
  selector: 'app-user-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, UserListComponent],
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.css'],
})
export class UserChatComponent implements OnChanges {

  @Input() selectedUser:any
  @Input() messages: { text: string, isSender: boolean }[] = [];
  @Input() newMessage: string = '';


  constructor(private chatService:ChatService){}
 

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedUser'] && this.selectedUser) {
      this.loadChatHistory();
      const roomId = `${this.currentUser.id}-${this.selectedUser.id}`;
      this.chatService.joinRoom(roomId);
    }
  }

  loadChatHistory() {
    this.userService.getUserData().subscribe({
      next: (userData) => {
        this.currentUser = userData;
        if (userData && this.selectedUser) {
          this.chatService
            .getChatHistory(userData.id, this.selectedUser.id)
            .subscribe({
              next: (history: any) => {
                if (Array.isArray(history.chats)) {
                  this.messages = history.chats.map((msg: any) => ({
                    text: msg.message,
                    isSender: msg.senderId === userData.id,
                  }));
                } else if (history && typeof history === 'object') {
                  this.messages = [history].map((msg: any) => ({
                    text: msg.message,
                    isSender: msg.senderId === userData.id,
                  }));
                } else {
                  console.error('Unexpected chat history format:', history);
                  this.messages = [];
                }
              },
              error: (error) => {
                console.error('Error fetching chat history:', error);
                this.messages = [];
              },
            });
        }
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      this.userService.getUserData().subscribe((userData) => {
        if (userData) {
          this.messages.push({ text: this.newMessage, isSender: true });
          const roomId = `${this.currentUser.id}-${this.selectedUser.id}`;
          this.chatService.sendMessage(
            this.currentUser.id,
            this.selectedUser.id,
            this.newMessage
          );
          this.newMessage = '';
        }
      });
    }
  }
}
