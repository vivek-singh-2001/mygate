import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError,  tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SocietyService {
  private societyApiUrl = 'http://localhost:7500/api/v1/society';

  
  private societyDataSubject = new BehaviorSubject<any>(null);
  societyData$ = this.societyDataSubject.asObservable();


  constructor(private http: HttpClient) {}

  fetchSocietyData(societyId:number): Observable<any> {
    return this.http.get(`${this.societyApiUrl}/SocietyAdminsDetails/${societyId}`).pipe(
      tap((response: any) => {
        this.societyDataSubject.next(response.data.societyDetails);
      }),
      catchError((error) => {
        console.error('Failed to load society data', error);
        return of(null);
      })
    );
  }
  

  
}
