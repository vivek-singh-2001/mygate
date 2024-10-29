import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Society } from '../../interfaces/society.interface';
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

  registerSociety(formData:FormData):Observable<Society[]> {
    return this.http.post<Society[]>(`${this.societyApiUrl}/registerSociety`, formData);
  }

  // Fetch society data by societyId
  fetchSocietyData(societyId: string): Observable<Society[]> {
    return this.societyData$.pipe(
      switchMap((societyData) => {
        if (societyData.length > 0) {
          return of(societyData); // Return cached data
        } else {
          return this.http
            .get<any>(`${this.societyApiUrl}/societyAdminsDetails/${societyId}`)
            .pipe(
              tap((response) => {
                console.log("fafhwauifgwauvwaufwaufwugd",response);
                
                
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

  fetchAllSociety(status: string): Observable<Society[]> {
    const url = status 
      ? `${this.societyApiUrl}/a/b/c/d/allSocieties?status=${status}` 
      : `${this.societyApiUrl}/a/b/c/d/allSocieties`;
      
    return this.http.get<{society:Society[]}>(url).pipe(
      map((response) => response.society), // Extract the 'society' field
      tap((societies) => {
        console.log("Fetched societies:", societies);
        this.allSocietyDataSubject.next(societies);  
      })
    );
  }

  createSociety(societyData: Society): Observable<Society> {
    console.log("aaja",societyData);
    
    return this.http.post<Society>(`${this.societyApiUrl}/createSociety`, societyData)
  }

  rejectSociety(societyData:Society):Observable<Society>{
    return this.http.post<Society>(`${this.societyApiUrl}/rejectSociety`,societyData)
  }
  
}

