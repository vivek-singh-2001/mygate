import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApiUrl = 'http://localhost:7500/api/v1/users/getUser';
  private societyApiUrl = 'http://localhost:7500/api/v1/society';

  private userData = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    return this.http
      .get(`${this.userApiUrl}/me`, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          this.userData.next(response.data.user);
          // console.log(this.userData['_value'])
        })
      );
  }

  getUserData(): Observable<any> {
    return this.userData.asObservable();
  }

  getCurrentUserData(): Observable<any> {
    return this.userData.getValue();
  }

  setUserData(data: any): void {
    this.userData.next(data);
  }

  clearUserData(): void {
    this.userData.next(null);
  }

  getUsersBySocietyId(societyId: string): Observable<any> {
    return this.http.get(`${this.societyApiUrl}/${societyId}`, {
      withCredentials: true,
    });
  }

  getUsersBySocietyIdAndWingId(societyId: string, wingId:string): Observable<any> {
    return this.http.get(`${this.societyApiUrl}/${societyId}/wing/${wingId}`, {
      withCredentials: true,
    });
  }
}
