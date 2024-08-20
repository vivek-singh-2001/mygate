// chat.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private apiUrl = 'http://localhost:7500/api/v1/chats';

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:7500', {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  sendMessage(senderId: string, receiverId: string, message: string): void {
    this.socket.emit('sendMessage', { senderId, receiverId, message });
  }

  receiveMessage(callback: (message: any) => void): void {
    this.socket.on('receiveMessage', callback);
  }

  joinRoom(roomId: string): void {
    this.socket.emit('joinRoom', roomId);
  }

  getChatHistory(userId1: number, userId2: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/${userId1}/${userId2}`);
  }
}
