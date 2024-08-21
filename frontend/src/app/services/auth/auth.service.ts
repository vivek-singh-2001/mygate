import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs';
import { EMPTY } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:7500/api/v1/auth';
  // private googleUrl = 'http://localhost:7500/api/v1/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData, {
      withCredentials: true,
    });
  }

  getToken(): string | null {
    console.log('token from function',this.cookieService.get('jwtToken'));
    
    return this.cookieService.get('jwtToken'); // Retrieves the token from the cookie
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google`;
  }
  handleGoogleLoginCallback(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        const token = params['token'];
        console.log('Google login successful, token received:', token);
        this.router.navigate(['/home']);
      }
    });
  }

  // Logout function
  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true }) // Ensure the empty body is sent as an object
      .pipe(
        catchError((error) => {
          // Handle HTTP errors if necessary
          console.error('Logout failed', error);
          return EMPTY; // Use EMPTY to indicate completion without values
        })
      )
      .subscribe({
        next: () => {
          // Redirect to login page after successful logout
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error during logout', error);
        },
      });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
