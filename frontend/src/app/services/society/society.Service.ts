import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SocietyService {
  private societyApiUrl = 'http://localhost:7500/api/v1/society';
  private societyDataSubject = new BehaviorSubject<any[]>([]); // Default to empty array
  societyData$ = this.societyDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  registerSociety(formData:FormData):Observable<any[]> {
    return this.http.post<any[]>(`${this.societyApiUrl}/registerSociety`, formData);
  }

  // Fetch society data by societyId
  fetchSocietyData(societyId: number): Observable<any[]> {
    return this.societyData$.pipe(
      switchMap((societyData) => {
        if (societyData.length > 0) {
          return of(societyData); // Return cached data
        } else {
          return this.http
            .get<any>(`${this.societyApiUrl}/societyAdminsDetails/${societyId}`)
            .pipe(
              tap((response) => {
                if (response?.data?.societyDetails) {
                  this.societyDataSubject.next(response.data.societyDetails); // Update BehaviorSubject
                }
              }),
              catchError((error) => {
                console.error('Failed to load society data', error);
                return of([]); // Return empty array on error
              })
            );
        }
      })
    );
  }
}
