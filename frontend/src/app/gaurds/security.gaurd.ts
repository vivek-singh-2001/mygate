import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class SecurityGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean> {
   
    const allowedRoles = ['security'];

    return this.userService.userRoles$.pipe(
      switchMap((roles: string[] | null) => {
        if (roles && roles.length > 0) {
          
          // Check if user has any of the allowed roles
          const hasAllowedRole = roles.some(role => allowedRoles.includes(role));
          
          if (hasAllowedRole ) {
            return of(true);  // Allow access
          } else {
            // Redirect to unauthorized page if not allowed
            this.router.navigate(['/unauthorized']);
            return of(false);
          }
        } else {
          // Fetch user data if roles are not available
          return this.userService.getCurrentUser().pipe(
            switchMap(() =>
              this.userService.userRoles$.pipe(
                map((updatedRoles: string[]) => {
                  console.log('Checking updated roles:', updatedRoles);

                  const hasAllowedRole = updatedRoles.some(role => allowedRoles.includes(role));

                  if (hasAllowedRole ) {
                    return true;  // Allow access
                  } else {
                    this.router.navigate(['/unauthorized']);
                    return false;  // Restrict access
                  }
                })
              )
            )
          );
        }
      })
    );
  }
}
