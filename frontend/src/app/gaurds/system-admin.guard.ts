import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class SystemAdminGuard implements CanActivate {
  constructor(private readonly userService: UserService, private readonly router: Router) {}

  canActivate(
  ): Observable<boolean> {
    return this.userService.userRoles$.pipe(
      switchMap((roles: string[] | null) => {
        if (roles && roles.length > 0) {
          return of(roles.includes('systemAdmin'));
        } else {
          return this.userService.getCurrentUser().pipe(
            switchMap(() =>
              this.userService.userRoles$.pipe(
                map((updatedRoles: string[]) => {
                  if (updatedRoles.includes('systemAdmin')) {
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
