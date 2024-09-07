import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WingService {
  private wingDetailsSubject = new BehaviorSubject<any>(null);
  wingDetails$ = this.wingDetailsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchWingDetails(wingId: number): Observable<any> {
    return this.http.get(`http://localhost:7500/api/v1/wing/wingDetails/${wingId}`).pipe(
      tap((response) => {
        this.wingDetailsSubject.next(response);
      })
    );
  }

  clearWingDetails() {
    this.wingDetailsSubject.next(null);
  }
}
