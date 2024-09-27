import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:7500/api/v1/events/';

  private eventsSubject = new BehaviorSubject<any>(null);
  events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any> {
    if (this.eventsSubject.getValue()) {
      console.log("hello", this.eventsSubject.getValue());
      return this.events$
    } else {
      return this.fetchEvents()
    }
  }

  fetchEvents(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((response) => {
        this.eventsSubject.next(response);
      })
    );
  }

  addEvent(eventData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, eventData).pipe(
      tap((newEvent) => {
        const currentEvents = this.eventsSubject.value;
        this.eventsSubject.next([...currentEvents, newEvent]);
      })
    );
  }

  clearEvents() {
    this.eventsSubject.next([]);
  }
}
