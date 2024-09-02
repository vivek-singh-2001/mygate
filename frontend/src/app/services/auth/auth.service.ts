import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, BehaviorSubject, EMPTY, Observable, tap,switchMap } from 'rxjs';
import { UserService } from '../user/user.service';
import { HouseService } from '../houses/houseService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:7500/api/v1/auth';

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
      switchMap(() => this.userService.getCurrentUser()), // Fetch and store user data after login
      tap((user)=>{
        this.houseService.setHouses(user.Houses);
      }),
      tap(() => {
        this.router.navigate(['/home']);
      })
    );
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google`;
  }

  // Handle the Google login callback
  handleGoogleLoginCallback(): void {
    this.route.queryParams
      .pipe(
        tap((params) => {
          if (params['token']) {
            const token = params['token'];
            localStorage.setItem('authToken', token);
            localStorage.setItem('isLoggedIn', 'true');
          }
        }),
        switchMap(() => this.userService.getCurrentUser()), 
        tap((user) => {
        console.log('user from auth service',user.data.user)
          this.houseService.setHouses(user.data.user.Houses); 
        }),
        tap(() => {
          this.router.navigate(['/home'], { replaceUrl: true });
        })
      )
      .subscribe();
  }
  

 // Logout function
 logout(): void {
  this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
    next: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isLoggedIn');
      this.userService.clearUserData(); // Clear stored user data on logout
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
