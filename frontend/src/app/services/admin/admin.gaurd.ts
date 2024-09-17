// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Fetch admin status before proceeding
    return this.adminService.societydetails().pipe(
      take(1), // Ensure it only checks once
      map(isAdmin => {
        if (isAdmin) {
          return true;
        } else {
          this.router.navigate(['/home']); // Redirect if not admin
          return false;
        }
      })
    );
  }
}