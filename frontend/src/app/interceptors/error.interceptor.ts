import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar'; // or any other notification service


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {} // Inject your notification service

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
      console.log('request send to:', req.url);
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 401) {
            errorMessage = 'Credentials are wrong. try again!';
          } else if (error.status === 400) {
            errorMessage = `Bad Request: ${error.message}`;
          } else if (error.status === 403) {
            errorMessage = `Forbidden: ${error.message}`;
          } else if (error.status === 404) {
            errorMessage = `Not Found: ${error.message}`;
          } else if (error.status === 500) {
            errorMessage = `Internal Server Error: ${error.message}`;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
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
    );
  }
}
