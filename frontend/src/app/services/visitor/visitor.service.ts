import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, fromEvent, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { Visitor } from '../../interfaces/visitor.interface';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private readonly visitorApiUrl = `${environment.apiUrl}/visitors`;
  private readonly socket: Socket;

  constructor(private readonly http: HttpClient) {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server',this.socket.connected);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  addVisitor(visitorData: any): Observable<any> {
    return this.http.post(`${this.visitorApiUrl}/add`, visitorData).pipe(
      tap((response) => {
        console.log('Visitor added successfully:', response);
      })
    );
  }

  getVisitors(houseId?: string, userId?: string): Observable<any> {
    const params: any = {};

    if (houseId) {
      params.houseId = houseId;
    } else if (userId) {
      params.userId = userId;
    }

    return this.http.get(`${this.visitorApiUrl}`, { params }).pipe(
      catchError((error) => {
        console.error('Failed to fetch visitors', error);
        return of(null);
      })
    );
  }

  updateVisitorStatus(visitorId: string, status: 'Approved'| 'Rejected'): Observable<any> {
    return this.http.patch(`${this.visitorApiUrl}/approval/${visitorId}`, {status}).pipe(
      tap((response) => {
        console.log('Visitor status updated successfully:', response);
      }),
      catchError((error) => {
        console.error('Failed to update visitor status', error);
        return of(null);
      })
    );
  }

  getSocietyVisitors(societyId: string): Observable<any> {
    return this.http.get(`${this.visitorApiUrl}/all/${societyId}`).pipe(
      tap((response) => {
        console.log('Visitors data:', response);
      })
    )
  }

  verifyVisitor(passcode: any): Observable<any> {
    return this.http.post(`${this.visitorApiUrl}/verify-passcode`, passcode)
  }

  listenForVisitorUpdates(userId: string) {
    return fromEvent(this.socket, `visitorUpdate:${userId}`);
  }
}