import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WingService {
  private wingDetailsSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  getWingDetails(wingId: number): Observable<any> {
    const wingDetails = this.wingDetailsSubject.getValue()
    if (wingDetails) {
      return of(wingDetails)
    } else {
      return this.fetchWingDetailsFromAPI(wingId);
    }
  }

  fetchWingDetailsFromAPI(wingId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/wing/wingDetails/${wingId}`).pipe(
      tap((response) => {
        this.wingDetailsSubject.next(response);
      })
    );
  }

  clearWingDetails() {
    this.wingDetailsSubject.next(null);
  }
}
