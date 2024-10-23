import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root',
  })
  export class NotificationCountService {

    private readonly apiUrl = `${environment.apiUrl}/notificationcount`;

    private readonly notificationCountSubject = new BehaviorSubject<number>(0);
    notificationCount$ = this.notificationCountSubject.asObservable();
  
    constructor(private readonly http: HttpClient) {}
  
    // Fetch the current notification count
    getCount(societyId: string, userId: string, type: string): Observable<number> {
      
      return this.http.get<number>(`${this.apiUrl}/${societyId}/${userId}/${type}`);
    }
  
    // Increment the count and emit new value
    incrementCount(societyId: string, userId: string, type: string): Observable<number> {
      return this.http.post<number>(`${this.apiUrl}/increment`, {
        societyId,
        userId,
        type,
      }).pipe(
        tap((response:any) => {
            console.log("from service ", response.count);
            
          this.notificationCountSubject.next(response.count);  // Update the BehaviorSubject with the new count
        })
      );
    }
  
    // Reset the count for a specific type
    resetCount(societyId: string, userId: string, type: string): Observable<void> {
      return this.http.post<void>(`${this.apiUrl}/reset/${societyId}/${userId}/${type}`, {});
    }
  }
  