import { Component } from '@angular/core';
import { UserChatComponent } from "../../chats/user-chat/user-chat.component";
import { ChatsComponent } from "../../chats/chats.component";

@Component({
  selector: 'app-main-display',
  standalone: true,
  imports: [UserChatComponent, ChatsComponent],
  templateUrl: './main-display.component.html',
  styleUrl: './main-display.component.css'
})
export class MainDisplayComponent {

}
