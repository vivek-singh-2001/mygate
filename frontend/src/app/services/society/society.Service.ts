import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SocietyService {
  private societyApiUrl = 'http://localhost:7500/api/v1/society';
  private societyDataSubject = new BehaviorSubject<any[]>([]); 
  private allSocietyDataSubject = new BehaviorSubject<any[]>([]);
  societyData$ = this.societyDataSubject.asObservable();
  allSocietyData$ = this.allSocietyDataSubject.asObservable();

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

  fetchAllSociety(status: string): Observable<any[]> {
    const url = status 
      ? `${this.societyApiUrl}/a/b/c/d/allSocieties?status=${status}` 
      : `${this.societyApiUrl}/a/b/c/d/allSocieties`;
      
    return this.http.get<any>(url).pipe(
      map((response) => response.society), // Extract the 'society' field
      tap((societies) => {
        console.log("Fetched societies:", societies);
        this.allSocietyDataSubject.next(societies);  
      })
    );
  }
  

}
