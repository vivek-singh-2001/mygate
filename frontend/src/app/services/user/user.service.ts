import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApiUrl = 'http://localhost:7500/api/v1/users/getUser';  
  private societyApiUrl = 'http://localhost:7500/api/v1/society';

  // BehaviorSubject to hold the current user data
  private userData = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  // Fetches current user data and updates BehaviorSubject
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.userApiUrl}/me`).pipe(
      tap((response: any) => {
        this.userData.next(response.data.user);
      })
    );
  }

  // Returns an Observable of the current user data
  getUserData(): Observable<any> {
    return this.userData.asObservable();
  }

  // Returns the current value of user data (useful for synchronous access)
  getCurrentUserData(): any {
    return this.userData.getValue();
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

  // Fetch users by society ID and wing ID
  getUsersBySocietyIdAndWingId(societyId: string, wingId: string): Observable<any> {
    return this.http.get(`${this.societyApiUrl}/${societyId}/wing/${wingId}`);
  }
}
