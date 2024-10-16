import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Fetch admin status before proceeding
    return this.userService.userRoles$.pipe(
      switchMap((roles: string[] | null) => {
        if (roles && roles.length > 0) {
          // Check if user has either societyAdmin or wingAdmin roles
          if (roles.includes('societyAdmin') || roles.includes('wingAdmin')) {
            return of(true); // Allow access
          } else {
            // Redirect to unauthorized if user has any other role
            this.router.navigate(['/unauthorized']);
            return of(false);
          }
        } else {
          // If roles are not available, trigger user data loading
          return this.userService.getCurrentUser().pipe(
            switchMap(() =>
              // After fetching user data, check the updated userRoles$
              this.userService.userRoles$.pipe(
                map((updatedRoles: string[]) => {
                  // Check if user has either societyAdmin or wingAdmin roles
                  if (updatedRoles.includes('societyAdmin') || updatedRoles.includes('wingAdmin')) {
                    return true; // Allow access
                  } else {
                    this.router.navigate(['/unauthorized']);
                    return false; // Prevent access
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
