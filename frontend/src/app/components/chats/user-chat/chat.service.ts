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
  private apiUrl = 'http://localhost:7500/api/v1/chats/'; // Update with your API URL

  constructor(private http: HttpClient) {
    // Initialize WebSocket connection
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
    console.log("callback", callback);
    
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
// aqd
