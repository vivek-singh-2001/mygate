import { CommonModule } from '@angular/common';
import { Component ,OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { UserService } from '../../../services/user/user.service';
import { UserListComponent } from "../user-list/user-list.component";


interface Message {
  text: string;
  isSender: boolean;
}

@Component({
  selector: 'app-user-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, UserListComponent],
  templateUrl: './user-chat.component.html',
  styleUrl: './user-chat.component.css'
})
export class UserChatComponent implements OnInit{

  messages: { text: string, isSender: boolean }[] = [];
  
  newMessage: string = '';
  selectedUser: any = null; // Adjust type according to your user model

  constructor(private chatService: ChatService, private userService: UserService) {}

  ngOnInit() {
    this.chatService.receiveMessage((message: any) => {
      if (message.receiverId === this.selectedUser.id) {
        this.messages.push({ text: message.text, isSender: false });
      }
    });
  }

  onUserSelected(user: any) {
    this.selectedUser = user;
    console.log(this.selectedUser)
    this.messages = []; // Clear previous messages or fetch messages for the selected user
    this.chatService.joinRoom(`${user.id}`); // Join the chat room for the selected user
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      this.messages.push({ text: this.newMessage, isSender: true });
      this.chatService.sendMessage(this.selectedUser.id, this.newMessage);
      this.newMessage = '';
    }
  }
}
