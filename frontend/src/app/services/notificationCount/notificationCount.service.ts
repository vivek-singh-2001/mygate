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
  private readonly newNoticeSubject = new BehaviorSubject<any>('');
  notificationCount$ = this.notificationCountSubject.asObservable();
  newNotice$ = this.newNoticeSubject .asObservable();

  private readonly socket: Socket;
  private cachedCount: number | null = null;

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
      this.newNoticeSubject.next(data.notice)
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
          this.cachedCount = data.count;
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
    if (this.cachedCount !== null) {
      return of(this.cachedCount); // Return the cached count if it is available
    }
    return this.http
      .get<number>(`${this.apiUrl}/${societyId}/${userId}/${type}`)
      .pipe(
        tap((count: any) => {
          this.cachedCount = count.count;
          this.notificationCountSubject.next(count.count);
        })
      );
  }
}
