import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { HouseService } from './houses/houseService';

@Injectable({
  providedIn: 'root',
})
export class AppInitializationService {
  private readonly isInitialized$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly houseService: HouseService,
  ) {}

  initialize(): Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      return this.fetchUserData().pipe(
        take(1),
        tap(() => this.isInitialized$.next(true))
      );
    } else {
      this.isInitialized$.next(true);
      this.authService.logout();
      return this.isInitialized$.asObservable();
    }
  }
  private fetchUserData(): Observable<boolean> {
    return this.userService.getUserData().pipe(
      tap((user) => {
        this.houseService.setHouses(user.data.Houses)
      }),
      map(() => true)
    );
  }
  get isInitialized(): Observable<boolean> {
    return this.isInitialized$.asObservable();
  }
}
