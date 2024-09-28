import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectIfLoggedInGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUrl = state.url;
    if (this.authService.isLoggedIn() && currentUrl === '/login' ) {  
      if (currentUrl !== this.router.url) {
        this.router.navigate(['/home']);
      }
      return false;
    }
    return true;
  }
}
