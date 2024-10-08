// chat.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly socket: Socket;
  private readonly apiUrl = `${environment.apiUrl}/chats`;
  private readonly messageSubject = new BehaviorSubject<any>(null);

  constructor(private readonly http: HttpClient) {
    // Initialize WebSocket connection
    this.socket = io('http://192.1.200.38:7500', {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server',this.socket.connected);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.setupMessageListener()
  }

  sendMessage(senderId: string, receiverId: string, message: string,messageId: string): void {
    this.socket.emit('sendMessage', { senderId, receiverId, message , id: messageId});
  }

  setupMessageListener() {
    this.socket.on('receiveMessage',(msg:any)=>{
      this.messageSubject.next(msg);
    });
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  joinRoom(roomId: string): void {
    this.socket.emit('joinRoom', roomId);
  }

  // Leave a chat room
  leaveRoom(roomId: string): void {
    this.socket.emit('leaveRoom', roomId);
  }

  // Fetch chat history between two users
  getChatHistory(userId1: number, userId2: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/history/${userId1}/${userId2}`);
  }
}

