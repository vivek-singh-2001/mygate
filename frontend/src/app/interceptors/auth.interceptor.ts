// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("request send to :" ,req.url);

     // Get the token from localStorage
     const token = localStorage.getItem('authToken');
     // Clone the request to add the Authorization header
    let authReq = req;
    if (token) {
      // Add Authorization header if token exists
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
      });
    }
    return next.handle(authReq).pipe(
      catchError((error)=>{
        if(error.status === 401){
          localStorage.removeItem('authToken');
          localStorage.removeItem('isLoggedIn');
             // Redirect the user to the login page
             this.router.navigate(['/login']);
        }
        return throwError(() => new Error(error.message));
      })
    )
  }
}
