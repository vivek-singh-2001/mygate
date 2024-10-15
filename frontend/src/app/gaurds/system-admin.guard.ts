import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class SystemAdminGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.userService.userRoles$.pipe(
      switchMap((roles: string[] | null) => {        
        if (roles && roles.length > 0) {
          const isSystemAdmin = roles.includes('systemAdmin');
          console.log('Roles:', roles, 'Is systemAdmin:', isSystemAdmin);
          if (isSystemAdmin) {
            return of(true);
          } else {
            this.router.navigate(['/unauthorized']);
            return of(false);
          }
        } else {
          return this.userService.getCurrentUser().pipe(
            switchMap(() =>
              this.userService.userRoles$.pipe(
                map((updatedRoles: string[]) => {
                  const isSystemAdmin = updatedRoles.includes('systemAdmin');
                  console.log(
                    'Updated Roles:',
                    updatedRoles,
                    'Is systemAdmin:',
                    isSystemAdmin
                  );
                  if (isSystemAdmin) {
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
