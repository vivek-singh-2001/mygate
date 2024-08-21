import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  OnDestroy,
  AfterViewChecked, ElementRef, ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { UserService } from '../../../services/user/user.service';
import { UserListComponent } from '../user-list/user-list.component';
import { Subscription, BehaviorSubject } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';

interface Message {
  id?: string; // Add an id field to uniquely identify messages
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
export class UserChatComponent implements OnInit, OnChanges, OnDestroy  , AfterViewChecked{
  
  @Input() selectedUser: any;
  @ViewChild('chatWindow') private chatWindow!: ElementRef;
  messages: Message[] = [];
  newMessage: string = '';
  currentUser: any;
  private messageSubscription!: Subscription;
  private selectedUserSubject = new BehaviorSubject<any>(null);

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  constructor(
    private userService: UserService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.subscribeToMessages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedUser']) {
      this.selectedUserSubject.next(this.selectedUser);
      if (this.selectedUser && this.currentUser) {
        this.loadChatHistory();
        this.joinRoom();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  private loadCurrentUser() {
    this.userService.getUserData().subscribe({
      next: (userData) => {
        this.currentUser = userData;
        if (this.selectedUser) {
          this.joinRoom();
          this.loadChatHistory();
        }
      },
      error: (error) => console.error('Error fetching user data:', error),
    });
  }

  private subscribeToMessages() {
    this.messageSubscription = this.chatService.getMessages().pipe(
      withLatestFrom(this.selectedUserSubject),
      filter(([message, selectedUser]) =>
        message &&
        selectedUser &&
        (message.senderId === selectedUser.id || message.receiverId === selectedUser.id)
      )
    ).subscribe(([message, _]) => {
      // Check if the message is already in the messages array
      if (!this.messages.some(m => m.id === message.id)) {
        this.messages.push({
          id: message.id,
          text: message.message,
          isSender: message.senderId === this.currentUser.id,
        });
      }
    });
  }

  loadChatHistory() {
    if (this.currentUser && this.selectedUser) {
      this.chatService
        .getChatHistory(this.currentUser.id, this.selectedUser.id)
        .subscribe({
          next: (history: any) => {
            if (Array.isArray(history.chats)) {
              this.messages = history.chats.map((msg: any) => ({
                id: msg.id,
                text: msg.message,
                isSender: msg.senderId === this.currentUser.id,
              }));
            } else if (history && typeof history === 'object') {
              this.messages = [history].map((msg: any) => ({
                id: msg.id,
                text: msg.message,
                isSender: msg.senderId === this.currentUser.id,
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
  }

  private joinRoom() {
    if (this.currentUser && this.selectedUser) {
      const roomId = `${this.currentUser.id}-${this.selectedUser.id}`;
      this.chatService.joinRoom(roomId);
    }
  }

  private scrollToBottom(): void {
    if (this.chatWindow && this.chatWindow.nativeElement) {
      try {
        this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Could not scroll to bottom:', err);
      }
    }
  }
  

  sendMessage() {
    if (this.newMessage.trim() && this.selectedUser && this.currentUser) {
      const messageId = Date.now().toString(); // Generate a unique ID for the message
      this.chatService.sendMessage(
        this.currentUser.id,
        this.selectedUser.id,
        this.newMessage,
        messageId
      );
      this.newMessage = '';
    }
  }
}