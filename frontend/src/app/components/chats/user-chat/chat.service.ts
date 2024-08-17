import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;

  constructor() {
    // Initialize WebSocket connection
    this.socket = io('http://localhost:7500', {
      transports: ['websocket'],
      withCredentials: true,
    });

    // Handle connection events if needed
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  // Send a message to a specific receiver
  sendMessage(receiverId: number, message: string): void {
    this.socket.emit('sendMessage', { receiverId, message });
  }

  // Listen for incoming messages
  receiveMessage(callback: (message: any) => void): void {
    this.socket.on('chat message', callback);
  }

  // Join a chat room
  joinRoom(roomId: string): void {
    this.socket.emit('joinRoom', roomId);
  }

  // Leave a chat room
  leaveRoom(roomId: string): void {
    this.socket.emit('leaveRoom', roomId);
  }
}
