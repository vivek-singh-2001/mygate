import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../../interfaces/user.interface';
import { environment } from '../../../environments/environment';

const roleMappings: { [key: string]: string } = {
  systemAdmin: 'System Admin',
  familyMember: 'Family Member',
  security: 'Security',
  societyAdmin: 'Society Admin',
  owner: 'Owner',
  wingAdmin: 'Wing Admin',
  pending: 'Pending',
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userApiUrl = `${environment.apiUrl}/users`;
  private readonly societyApiUrl = `${environment.apiUrl}/society`;

  private readonly userDataSubject = new BehaviorSubject<any>(null);
  private readonly familyDataSubject = new BehaviorSubject<any>(null);
  private readonly userSocietyIdSubject = new BehaviorSubject<string>('');
  private readonly userRoleArraySubject = new BehaviorSubject<string[]>([]);
  private readonly usersBySocietyIdandWingIdSubject = new BehaviorSubject<
    any[]
  >([]);
  private readonly usersBySocietyIdandWingId$: Observable<any[]> =
    this.usersBySocietyIdandWingIdSubject.asObservable();

  userSocietyId$ = this.userSocietyIdSubject.asObservable();
  userRoles$ = this.userRoleArraySubject.asObservable();
  userData$ = this.userDataSubject.asObservable();

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
        console.log(response);
        
        response.data.role = roleMappings[response.data.Roles[0].name];
        this.userDataSubject.next(response.data);

        this.userSocietyIdSubject.next(
          response.data.Houses[0]?.Floor?.Wing?.societyId ||
            response?.data?.societyDetails[0]?.id
        );

        const rolesNames =
          response.data.Roles?.map((role: { name: string }) => role.name) || [];
        this.userRoleArraySubject.next(rolesNames);
      }),
      catchError((error) => {
        console.error('Failed to load user data', error);
        return of(null);
      })
    );
  }

  updateUser(userId: string, userData: User): Observable<any> {
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
    if (this.usersBySocietyIdandWingIdSubject.value.length) {
      return this.usersBySocietyIdandWingId$;
    } else {
      return this.http
        .get(`${this.societyApiUrl}/${societyId}/wing/${wingId}`)
        .pipe(
          map((response: any) => {
            this.usersBySocietyIdandWingIdSubject.next(response.data.users);

            return response.data.users;
          })
        );
    }
  }

  getFamilyMembers(userId: string, houseId: number): Observable<any> {
    if (this.familyDataSubject.getValue()) {
      return this.familyDataSubject.asObservable();
    } else {
      return this.fetchFamilyMembers(userId, houseId);
    }
  }

  fetchFamilyMembers(userId: string, houseId: number): Observable<any> {
    if (!userId || !houseId) {
      console.error(
        'User Id and House Id is not available, cannot fetch family members.'
      );
      return of(null);
    }

    return this.http
      .get(`${this.userApiUrl}/familyMembers/${userId}/${houseId}`)
      .pipe(
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
    this.familyDataSubject.next(null);
  }
}
