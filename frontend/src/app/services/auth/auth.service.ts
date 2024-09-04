import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, tap, switchMap, Subscription, EMPTY } from 'rxjs';
import { UserService } from '../user/user.service';
import { HouseService } from '../houses/houseService';

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
    private houseService: HouseService
  ) {}

  // Login with email and password
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('isLoggedIn', 'true');
        }
      }),
      switchMap(() => this.userService.getCurrentUser()),
      tap((user) => {
        this.houseService.setHouses(user.data.user.Houses);
        console.log("from auth service ",user.data.user.Houses );
      }),
      tap(() => {
        this.router.navigate(['/home']);
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
            this.houseService.setHouses(user.data.user.Houses);
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

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
