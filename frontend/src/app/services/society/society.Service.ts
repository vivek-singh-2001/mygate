import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocietyService {
  private readonly societyApiUrl = `${environment.apiUrl}/society`;
  private readonly societyDataSubject = new BehaviorSubject<any[]>([]); 
  private readonly allSocietyDataSubject = new BehaviorSubject<any[]>([]);
  societyData$ = this.societyDataSubject.asObservable();
  allSocietyData$ = this.allSocietyDataSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

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
                console.log("soossssss", response);
                
                if (response?.data) {
                  this.societyDataSubject.next(response.data); // Update BehaviorSubject
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
