import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Observable,
  tap,
  switchMap,
  Subscription,
  throwError,
  catchError,
} from 'rxjs';
import { UserService } from '../user/user.service';
import { HouseService } from '../houses/houseService';
import { environment } from '../../../environments/environment';
import { SocietyStaffService } from '../societyStaff/societyStaff.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private subscription: Subscription | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly houseService: HouseService,
    private readonly societyStaffService: SocietyStaffService,
  ) {}

  // Login with email and password
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      switchMap((response) => {
        console.log('ress login', response);
        const token = response.token;
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('isLoggedIn', 'true');
        }
        return this.userService.getCurrentUser();
      }),
      tap((user) => {
        this.userService.userRoles$.subscribe({
          next: (roles) => {
            if (roles.includes('systemAdmin')) {
              this.router.navigate(['/systemAdmin']);
            } else if (roles.includes('pending')) {
              this.router.navigate(['/pending']);
            } else if (roles.includes('security')) {
              this.router.navigate(['/Security']);
            } else {
              this.router.navigate(['/home']);
            }
          },
        });
        this.houseService.setHouses(user.data.Houses);
      }),
      catchError((error) => {
        console.error('Login failed: ', error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google`;
  }

  handleGoogleLoginCallback(): void {
    console.log("helooooo222", this.route.queryParams);
    
    this.route.queryParams.subscribe((params) => {
      console.log("paaaaaa", params);
      
      const token = params['token'];
      console.log('tokrn', token);
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('isLoggedIn', 'true');

        // Fetch user data and navigate after token is set
        this.userService.getCurrentUser().subscribe({
          next: (user) => {
            this.houseService.setHouses(user.data.Houses);
            this.userService.userRoles$.subscribe({
              next: (roles) => {
                if (roles.includes('systemAdmin')) {
                  this.router.navigate(['/systemAdmin'], { replaceUrl: true });
                } else if (roles.includes('pending')) {
                  this.router.navigate(['/pending'], { replaceUrl: true });
                } else if (roles.includes('security')) {
                  this.router.navigate(['/Security'], { replaceUrl: true });
                } else {
                  this.router.navigate(['/home'], { replaceUrl: true });
                }
              },
            });
            this.router.navigate(['/home'], { replaceUrl: true });
          },
          error: (error) => console.error('Error fetching user data:', error),
        });
      }
    });
  }

  logout(): void {
    this.subscription = this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isLoggedIn');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error during logout', error);
      },
      complete: () => {
        if (this.subscription) {
          this.subscription.unsubscribe();
          this.subscription = undefined;
        }
      },
    });
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken.exp * 1000 > Date.now();
    }
    return false;
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token && this.isTokenValid();
  }
}
