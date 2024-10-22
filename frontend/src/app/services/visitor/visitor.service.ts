import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private readonly visitorApiUrl = `${environment.apiUrl}/visitors`;

  constructor(private readonly http: HttpClient) {}

  addVisitor(visitorData: any): Observable<any> {
    return this.http.post(`${this.visitorApiUrl}/add`, visitorData).pipe(
      tap((response) => {
        console.log('Visitor added successfully:', response);
      }),
      catchError((error) => {
        console.error('Failed to add visitor', error);
        return of(null);
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
}