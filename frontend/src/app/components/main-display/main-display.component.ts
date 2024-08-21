import { Component } from '@angular/core';
import { UserChatComponent } from "../chats/user-chat/user-chat.component";
import { ChatsComponent } from "../chats/chats.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { RouterOutlet , Route} from '@angular/router';
@Component({
  selector: 'app-main-display',
  standalone: true,
  imports: [UserChatComponent, ChatsComponent, DashboardComponent,RouterOutlet],
  templateUrl: './main-display.component.html',
  styleUrl: './main-display.component.css'
})
export class MainDisplayComponent {
  

}
