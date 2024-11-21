import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WingService {
  private readonly wingDetailsSubject = new BehaviorSubject<any>(null);
  private readonly wingHousesSubject = new BehaviorSubject<any>(null);
  public house$ = this.wingHousesSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  getWingDetails(wingId: number): Observable<any> {
    const wingDetails = this.wingDetailsSubject.getValue();
    if (wingDetails) {
      return of(wingDetails);
    } else {
      return this.fetchWingDetailsFromAPI(wingId);
    }
  }

  fetchWingDetailsFromAPI(wingId: number): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/wing/wingDetails/${wingId}`)
      .pipe(
        tap((response) => {
          this.wingDetailsSubject.next(response);
        })
      );
  }

  fetchHousesByWingId(wingId: string): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/house/wingHouseDetails/${wingId}`)
      .pipe(
        tap((response) => {
          this.wingHousesSubject.next(response);
        })
      );
  }

  clearHouses(): void {
    this.wingHousesSubject.next([]);
  }

  clearWingDetails() {
    this.wingDetailsSubject.next(null);
  }
}
