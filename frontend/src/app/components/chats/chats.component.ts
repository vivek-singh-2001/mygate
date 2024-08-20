import { Component,OnInit } from '@angular/core';
import { UserListComponent } from "./user-list/user-list.component";
import { UserChatComponent } from "./user-chat/user-chat.component";
import { ChatService } from './user-chat/chat.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [UserListComponent, UserChatComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent implements OnInit  {
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
    // console.log(this.selectedUser)
    this.messages = []; // Clear previous messages or fetch messages for the selected user
    this.chatService.joinRoom(`${user.id}`); // Join the chat room for the selected user
  }

  
}
