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
  @Input() selectedUser: any;
  messages: Message[] = [];
  newMessage: string = '';

  constructor(
    private userService: UserService,
    private chatService: ChatService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedUser'] && this.selectedUser) {
      this.loadChatHistory();
    }
  }
  loadChatHistory() {
    this.userService.getUserData().subscribe({
      next: (userData) => {
        if (userData && this.selectedUser) {
          this.chatService
            .getChatHistory(userData.id, this.selectedUser.id)
            .subscribe({
              next: (history: any) => {
                console.log('Chat history:', history.chats); // Log to see the structure

                // Check if history is an array or a single object
                if (Array.isArray(history.chats)) {
                  // Handle array of messages
                  this.messages = history.chats.map((msg: any) => ({
                    text: msg.message,
                    isSender: msg.senderId === userData.id,
                  }));
                } else if (history && typeof history === 'object') {
                  // Handle single message object or a set of objects
                  // For multiple messages, you may need to wrap them in an array
                  this.messages = [history].map((msg: any) => ({
                    text: msg.message,
                    isSender: msg.senderId === userData.id,
                  }));
                  console.log('messages',this.messages);
                  
                } else {
                  console.error('Unexpected chat history format:', history);
                  this.messages = []; // Handle unexpected format
                }
              },
              error: (error) => {
                console.error('Error fetching chat history:', error);
                this.messages = []; // Handle error by setting messages to an empty array
              },
              complete: () => {
                console.log('Chat history loading complete');
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
          this.chatService.sendMessage(this.selectedUser.id, this.newMessage);
          this.newMessage = '';
        }
      });
    }
  }
}
