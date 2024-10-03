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
  finalize,
} from 'rxjs';
import { UserService } from '../user/user.service';
import { HouseService } from '../houses/houseService';
import { AdminService } from '../admin/admin.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:7500/api/v1/auth';
  private subscription: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private houseService: HouseService,
    private adminService: AdminService
  ) {}

  // Login with email and password
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      switchMap((response) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('isLoggedIn', 'true');
        }
        // Return new observable to fetch user data
        return this.userService.getCurrentUser();
      }),
      tap((user) => {
        // Set houses after getting the user
        console.log('user after login', user);

        this.houseService.setHouses(user.data.user.Houses);
        this.adminService.societydetails().subscribe();
      }),
      finalize(() => {
        // Navigate only after a successful login
        this.router.navigate(['/home']);
      }),
      catchError((error) => {
        // Handle error (wrong credentials)
        console.error('Login failed: ', error);
        // Optionally, you can show an error message here
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google`;
  }

  handleGoogleLoginCallback(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('isLoggedIn', 'true');

        // Fetch user data and navigate after token is set
        this.userService.getCurrentUser().subscribe({
          next: (user) => {
            this.houseService.setHouses(user.data.Houses);
            this.adminService.societydetails().subscribe(); //to set the admin status
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
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token && this.isTokenValid();
  }
}
