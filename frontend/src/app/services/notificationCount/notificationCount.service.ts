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
  private readonly chatNotificationCounts = new Map<string, BehaviorSubject<number>>(); // Declare chatNotificationCounts here
  private readonly newNoticeSubject = new BehaviorSubject<any>('');
  private readonly newThoughtSubject = new BehaviorSubject<any>('');

  notificationCount$ = this.notificationCountSubject.asObservable();
  newNotice$ = this.newNoticeSubject.asObservable();
  newthought$ = this.newThoughtSubject.asObservable();

  private readonly socket: Socket;
  private noticeCachedCount: number | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService
  ) {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
    });

    // Listen for 'noticeCreated' event
    this.socket.on('noticeCreated', (data) => {
      this.newNoticeSubject.next(data.notice);
    });

    // Subscribe to user data to join notification room and set up event listeners
    this.userService.getUserData().subscribe((user) => {
      if (user?.id) {
        this.joinNotificationRoom(user.id);

        // Listen for updated notice count event
        this.socket.on('updatedCount', (data) => {
          console.log('Updated notification count received:', data);
          this.notificationCountSubject.next(data.count);
          this.noticeCachedCount = data.count;
        });

        // Listen for updated chat count event (with senderId)
        this.socket.on('updatedChatCount', (data) => {
          console.log('Updated chat notification count received:', data);
          const { senderId, count } = data;

          // Create or update count subject for specific sender
          if (!this.chatNotificationCounts.has(senderId)) {
            this.chatNotificationCounts.set(senderId, new BehaviorSubject(count));
          } else {
            this.chatNotificationCounts.get(senderId)?.next(count);
          }
        });

        this.socket.on('thoughtUpdated', ({thought:thought})=>{
          console.log(thought);
          this.newThoughtSubject.next(thought)
        })
      }
    });
  }

  // Method to join a user's specific room
  joinNotificationRoom(userId: string) {
    this.socket.emit('joinRoom', userId);
  }

  // Fetch current notification count
  getCount(societyId: string, userId: string, type: string, senderId?: string): Observable<number> {
    if (type === 'notice' && this.noticeCachedCount !== null) {
      return of(this.noticeCachedCount);
    }

    if (type === 'chat' && senderId && this.chatNotificationCounts.has(senderId)) {
      return this.chatNotificationCounts.get(senderId)!.asObservable();
    }

    return this.http
      .get<number>(`${this.apiUrl}/${societyId}/${userId}/${type}`)
      .pipe(
        tap((count: any) => {
          if (type === 'notice') {
            this.noticeCachedCount = count.count;
            this.notificationCountSubject.next(count.count);
          } else if (type === 'chat' && senderId) {
            if (!this.chatNotificationCounts.has(senderId)) {
              this.chatNotificationCounts.set(senderId, new BehaviorSubject(count.count));
            } else {
              this.chatNotificationCounts.get(senderId)!.next(count.count);
            }
          }
        })
      );
  }

  // Reset notification count
  resetCount(societyId: string, userId: string, type: string, senderId?: string): Observable<void> { 
    return this.http.post<void>(`${this.apiUrl}/reset/${societyId}/${userId}/${type}`, {senderId}).pipe(
      tap(() => {
        if (type === 'notice') {
          this.noticeCachedCount = 0;
          this.notificationCountSubject.next(0);
        } else if (type === 'chat' && senderId) {
          this.chatNotificationCounts.get(senderId)?.next(0);
        }
      })
    );
  }

  // Get notification count observable by sender ID
  getChatNotificationCountBySender(senderId: string): Observable<number> {
    if (!this.chatNotificationCounts.has(senderId)) {
      this.chatNotificationCounts.set(senderId, new BehaviorSubject(0));
    }
    return this.chatNotificationCounts.get(senderId)!.asObservable();
  }
}
