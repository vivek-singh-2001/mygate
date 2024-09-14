// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.adminService.isAdmin$.pipe(
      map(isAdmin => {     
        console.log(isAdmin);
           
        if (isAdmin) {
          return true;
        } else {
          this.router.navigate(['/home']);
          return false;
        }
      })
    );
  }
}