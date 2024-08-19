import { CommonModule } from '@angular/common';
import { Component ,Input,OnChanges,OnInit,SimpleChanges} from '@angular/core';
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
export class UserChatComponent implements OnChanges {

  @Input() selectedUser:any

  messages: { text: string, isSender: boolean }[] = [];
  
  newMessage: string = '';
 

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedUser']) {
      // Handle the new selectedUser here
      console.log('Selected user in chat:', this.selectedUser);
      // You can call a method to load chat messages for this user, etc.
    }
  }

  sendMessage(){
    console.log('message sent', this.newMessage);
    this.newMessage=''
    
  }

}
