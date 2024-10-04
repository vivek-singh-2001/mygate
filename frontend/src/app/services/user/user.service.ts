import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userApiUrl = 'http://localhost:7500/api/v1/users';
  private readonly societyApiUrl = 'http://localhost:7500/api/v1/society';

  // BehaviorSubject to hold the current user data
  private readonly userDataSubject = new BehaviorSubject<any>(null);
  private readonly familyDataSubject = new BehaviorSubject<any>(null);
  private readonly userSocietyIdSubject = new BehaviorSubject<number>(0);
  userSocietyId$ = this.userSocietyIdSubject.asObservable();
  userData$ = this.userDataSubject.asObservable()
  constructor(private readonly http: HttpClient) {}

  getUserData(): Observable<any> {
    if (this.userDataSubject.getValue()) {
      return this.userDataSubject.asObservable();
    } else {
      return this.getCurrentUser();
    }
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.userApiUrl}/getUser/me`).pipe(
      tap((response: any) => {
        this.userDataSubject.next(response);
        this.userSocietyIdSubject.next(response.data.Houses[0]?.Floor?.Wing?.societyId);
      }),
      catchError((error) => {
        console.error('Failed to load user data', error);
        return of(null);
      })
    );
  }

  updateUser(userId: number, userData: User): Observable<any> {
    return this.http
      .patch(`${this.userApiUrl}/updateUser/${userId}`, userData)
      .pipe(
        tap((response) => {
          console.log('User updated successfully:', response);
        }),
        catchError((error) => {
          console.error('Failed to update user', error);
          return of(null); // Handle error
        })
      );
  }

  // Manually set user data
  setUserData(data: User): void {
    this.userDataSubject.next(data);
  }

  // Clears the user data ( on logout)
  clearUserData(): void {
    this.userDataSubject.next(null);
  }

  // Fetch users by society ID
  getUsersBySocietyId(
    societyId: string,
    limits: number,
    offset: number,
    searchQuery: string
  ): Observable<any> {
    console.log(limits, offset);
    return this.http.get(
      `${this.societyApiUrl}/${societyId}?limits=${limits}&offsets=${offset}&searchQuery=${searchQuery}`
    );
  }

  getUsersBySocietyIdAndWingId(
    societyId: string,
    wingId: string
  ): Observable<any> {
    return this.http.get(`${this.societyApiUrl}/${societyId}/wing/${wingId}`);
  }

  getFamilyMembers(userId: number, houseId: number): Observable<any> {
    if (this.familyDataSubject.getValue()) {
      return this.familyDataSubject.asObservable();
    } else {
      return this.fetchFamilyMembers(userId, houseId);
    }
  }

  fetchFamilyMembers(userId: number, houseId: number): Observable<any> {
    if (!userId || !houseId) {
      console.error('User Id and House Id is not available, cannot fetch family members.');
      return of(null);
    }

    return this.http.get(`${this.userApiUrl}/familyMembers/${userId}/${houseId}`).pipe(
      tap((response: any) => {
        this.familyDataSubject.next(response);
      }),
      catchError((error) => {
        console.error('Failed to load family members data', error);
        return of(null);
      })
    );
  }

  addFamilyMember(member: any): Observable<any> {
    return this.http.post(`${this.userApiUrl}/addFamilyMember`, member);
  }

  clearfamilyData() {
    this.familyDataSubject.next(null)
  }
}
