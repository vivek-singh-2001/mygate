import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { HouseService } from './houses/houseService';


@Injectable({
  providedIn: 'root',
})
export class AppInitializationService {
  private isInitialized$ = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private houseService: HouseService,
    private router: Router
  ) {}

  initialize(): Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      return this.fetchUserData().pipe(
        take(1),
        tap(() => this.isInitialized$.next(true))
      );
    } else {
      this.isInitialized$.next(true);
      this.router.navigate(['/login']);
      return this.isInitialized$.asObservable();
    }
  }

  private fetchUserData(): Observable<boolean> {
    return this.userService.getCurrentUser().pipe(
      tap((user) => {
        console.log('from initializer user', user );

        this.houseService.setHouses(user.data.user.Houses);
        console.log('from initializer', user.data.user.Houses );
      }),
      map(() => true)
    );
  }

  get isInitialized(): Observable<boolean> {
    return this.isInitialized$.asObservable();
  }
}
