import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationCountService {
  private readonly apiUrl = `${environment.apiUrl}/notificationcount`;

  private readonly notificationCountSubject = new BehaviorSubject<number>(0);
  private readonly chatNotificationCountSubject = new BehaviorSubject<number>(
    0
  );
  private readonly newNoticeSubject = new BehaviorSubject<any>('');
  notificationCount$ = this.notificationCountSubject.asObservable();
  chatNotificationCount$ = this.chatNotificationCountSubject.asObservable();
  newNotice$ = this.newNoticeSubject.asObservable();

  private readonly socket: Socket;
  private noticeCachedCount: number | null = null;
  private chatCachedCount: number | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService
  ) {
    // Initialize WebSocket connection
    this.socket = io('http://localhost:7500', {
      transports: ['websocket'],
      withCredentials: true,
    });

    // Listen for 'noticeCreated' event and just log that a notice was created
    this.socket.on('noticeCreated', (data) => {
      this.newNoticeSubject.next(data.notice);
    });

    // Get user data to join the user's notification room
    this.userService.getUserData().subscribe((user) => {
      if (user && user.id) {
        this.joinNotificationRoom(user.id);

        // Listen for 'updatedCount' event to get the updated notification count and notice
        this.socket.on('updatedCount', (data) => {
          console.log('Updated notification count received:', data);
          // Update the count when the event is received
          this.notificationCountSubject.next(data.count); // Update the UI with the count
          this.noticeCachedCount = data.count;
        });

        // Listen for the updated chat count event
        this.socket.on('updatedChatCount', (data) => {
          console.log('Updated chat notification count received:', data.count);
          // Update the chat notification count subject
          this.chatNotificationCountSubject.next(data.count); // Update the UI with the count
          this.chatCachedCount = data.count;
        });
      }
    });
  }

  // Method to join a user's specific room
  joinNotificationRoom(userId: string) {
    this.socket.emit('joinRoom', userId); // Join the room with userId as the room name
  }

  // Fetch the current notification count
  getCount(
    societyId: string,
    userId: string,
    type: string
  ): Observable<number> {
    if (type === 'notice' && this.noticeCachedCount !== null) {
      return of(this.noticeCachedCount);
    }
    if (type === 'chat' && this.chatCachedCount !== null) {
      return of(this.chatCachedCount);
    }

    return this.http
      .get<number>(`${this.apiUrl}/${societyId}/${userId}/${type}`)
      .pipe(
        tap((count: any) => {
          if (type === 'notice') {
            this.noticeCachedCount = count.count;
            this.notificationCountSubject.next(count.count);
          } else if (type === 'chat') {
            this.chatCachedCount = count.count;
            this.chatNotificationCountSubject.next(count.count);
          }
        })
      );
  }

  resetCount(societyId: string, userId: string, type: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset/${societyId}/${userId}/${type}`, {}).pipe(
      tap(() => {
        // Reset the cached count and the subject value based on type
        if (type === 'notice') {
          this.noticeCachedCount = 0;
          this.notificationCountSubject.next(0);
        } else if (type === 'chat') {
          this.chatCachedCount = 0;
          this.chatNotificationCountSubject.next(0);
        }
      })
    );
  }

  
}
