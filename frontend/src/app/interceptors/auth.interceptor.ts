// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private snackBar: MatSnackBar) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('request send to :', req.url);

    // Get the token from localStorage
    const token = localStorage.getItem('authToken');

    // Clone the request to add the Authorization header
    let authReq = req;
    if (token) {
      // Add Authorization header if token exists
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 401 && req.url.includes('/login')) {
            errorMessage = 'Credentials are wrong. try again!';
          }
          else if (
            error.status === 500  &&
            req.url.includes('/login')
          ) {
            errorMessage = 'Credentials are wrong. try again!';

          }
           else if (
            (error.status === 401 || error.status === 500) &&
            !req.url.includes('/login')
          ) {
            alert('Your session has expired. Please log in again.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('isLoggedIn');
            this.router.navigate(['/login']);
          } else if (error.status === 403) {
            errorMessage = `forbidden: you are not the head of the family `;
          } else if (error.status === 404) {
            errorMessage = `Not Found: ${error.message}`;
          } else if (error.status === 500) {
            errorMessage = `Internal Server Error: ${error.message}`;
          }
        }

        // Display the error message using a notification service
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });

        // Optionally log the error to a logging service or backend

        return throwError(() => new Error(errorMessage));
      })

      // catchError((error)=>{
      //   if(error.status ===  401  && !req.url.includes('/login') ){
      //     alert('Your session has expired. Please log in again.');
      //     localStorage.removeItem('authToken');
      //     localStorage.removeItem('isLoggedIn');
      //        // Redirect the user to the login page
      //        this.router.navigate(['/login']);
      //   }
      //   else if (error.status === 401 && req.url.includes('/login')) {
      //     // Handle login failure (wrong credentials)
      //     alert('Invalid credentials. Please try again.');
      //   }
      //   return throwError(() => new Error(error.message));
      // })
    );
  }
}
