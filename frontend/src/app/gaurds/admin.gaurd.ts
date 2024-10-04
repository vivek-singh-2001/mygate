// admin.guard.ts
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
    private userService:UserService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Fetch admin status before proceeding
    return this.userService.userRoles$.pipe(
      switchMap((roles: string[] | null) => {
        if (roles && roles.length > 0) {
          return of(roles.includes('societyAdmin'));
        } else {
          // If roles are not available, trigger user data loading
          return this.userService.getCurrentUser().pipe(
            switchMap(() =>
              // After fetching user data, check the updated userRoles$
              this.userService.userRoles$.pipe(
                map((updatedRoles: string[]) => {
                  if (updatedRoles.includes('societyAdmin')) {
                    return true;
                  } else {
                    this.router.navigate(['/unauthorized']);
                    return false;
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