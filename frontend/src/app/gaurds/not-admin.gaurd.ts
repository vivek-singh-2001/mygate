import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class NonAdminGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private  router: Router
  ) {}

  canActivate(): Observable<boolean> {
    const allowedRoles = ['wingAdmin', 'societyAdmin', 'security'];

    return this.userService.userRoles$.pipe(
      switchMap((roles: string[] | null) => {
        try {
          if (roles && roles.length > 0) {
            console.log('User roles:', roles);
            const hasAllowedRole = roles.some((role) =>
              allowedRoles.includes(role)
            );

            if (hasAllowedRole) {
              return of(true); // Allow access
            } else {
              this.router.navigate(['/unauthorized']); // Redirect to unauthorized page if not allowed
              return of(false);
            }
          } else {
            // If roles are not available, fetch user data
            return this.userService.getCurrentUser().pipe(
              switchMap(() =>
                this.userService.userRoles$.pipe(
                  map((updatedRoles: string[]) => {
                    try {
                        console.log(updatedRoles);
                      const hasAllowedRole = updatedRoles.some((role) =>
                        allowedRoles.includes(role)
                      );

                      if (hasAllowedRole) {
                        return true; // Allow access
                      } else {
                        this.router.navigate(['/unauthorized']);
                        return false;
                      }
                    } catch (error) {
                      console.error('Error checking updated roles:', error);
                      this.router.navigate(['/unauthorized']);
                      return false; // Redirect in case of an error
                    }
                  })
                )
              )
            );
          }
        } catch (error) {
          console.error('Error in canActivate:', error);
          this.router.navigate(['/unauthorized']); // Redirect to unauthorized on error
          return of(false); // Prevent access
        }
      })
    );
  }
}
