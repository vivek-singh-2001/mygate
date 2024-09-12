import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApiUrl = 'http://localhost:7500/api/v1/users';
  private societyApiUrl = 'http://localhost:7500/api/v1/society';

  // BehaviorSubject to hold the current user data
  private userData = new BehaviorSubject<any>(null);
  private familyData = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  getUserData(): Observable<any> {
    if (this.userData.getValue()) {
      return this.userData.asObservable();
    } else {
      return this.getCurrentUser().pipe(
        switchMap(() => this.userData.asObservable())
      );
    }
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.userApiUrl}/getUser/me`).pipe(
      tap((response: any) => {
        this.userData.next(response.data.user);
      }),
      catchError((error) => {
        console.error('Failed to load user data', error);
        return of(null);
      })
    );
  }

  // Manually set user data
  setUserData(data: any): void {
    this.userData.next(data);
  }

  // Clears the user data ( on logout)
  clearUserData(): void {
    this.userData.next(null);
  }

  // Fetch users by society ID
  getUsersBySocietyId(societyId: string): Observable<any> {
    return this.http.get(`${this.societyApiUrl}/${societyId}`);
  }

  getUsersBySocietyIdAndWingId(
    societyId: string,
    wingId: string
  ): Observable<any> {
    return this.http.get(`${this.societyApiUrl}/${societyId}/wing/${wingId}`);
  }

  // Fetch family members data
  getFamilyMembers(): Observable<any> {
    // If familyData is already available, return it
    if (this.familyData.getValue()) {
      return this.familyData.asObservable();
    }

    // If user data is not available, first fetch the user and then family members
    if (!this.userData.getValue()) {
      return this.getCurrentUser().pipe(
        switchMap(() => this.fetchFamilyMembers()) // Fetch family members after user data
      );
    } else {
      // Fetch family members if user data is already available
      return this.fetchFamilyMembers();
    }
  }

  private fetchFamilyMembers(): Observable<any> {
    const userId = this.userData.getValue()?.id; // Extract user ID from userData
    if (!userId) {
      console.error('User ID is not available, cannot fetch family members.');
      return of(null); // If no user ID, return null
    }

    return this.http.get(`${this.userApiUrl}/familyMembers/${userId}`).pipe(
      tap((response: any) => {
        console.log('Fetched family members data:', response);
        this.familyData.next(response.users); // Set familyData on success
      }),
      catchError((error) => {
        console.error('Failed to load family members data', error);
        return of(null); // Return null in case of error
      })
    );
  }

  updateUser(userId: number, userData: any): Observable<any> {
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

  addFamilyMember(member: any): Observable<any> {
    return this.http.post(`${this.userApiUrl}/addFamilyMember`, member);
  }
}
