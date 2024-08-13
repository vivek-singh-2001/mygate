import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:7500/api/v1/auth';
  private googleUrl = 'http://localhost:7500/api/v1/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData, {
      withCredentials: true,
    });
  }

  // Optional: You may still want to check if the user is authenticated
  isLoggedIn(): boolean {
    // You might need to adjust this based on your authentication strategy
    return document.cookie.includes('authToken'); // Example of a simple check
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google`;
  }
  handleGoogleLoginCallback(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        // Process the token (e.g., store in cookie, localStorage, or directly use)
        const token = params['token'];
        console.log('Google login successful, token received:', token);

        // Redirect to home page
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
}
