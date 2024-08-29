import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, BehaviorSubject, EMPTY, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:7500/api/v1/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http
      .post<any>(`${this.apiUrl}/login`, loginData, {
      })
      .pipe(
        tap((response) => {
          const token = response.token;
          if (token) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('isLoggedIn', 'true');
            this.router.navigate(['/home']);
          }
        })
      );
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google`;
  }

  handleGoogleLoginCallback(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        const token = params['token'];
        localStorage.setItem('authToken', token);
        localStorage.setItem('isLoggedIn', 'true');

        this.router.navigate(['/home'], { replaceUrl: true });
        console.log('log in with google');
      }
    });
  }

  // Logout function
  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, {}, )
      .pipe(
        catchError((error) => {
          console.error('Logout failed', error);
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('isLoggedIn');

          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error during logout', error);
        },
      });
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
