import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { HouseService } from './houses/houseService';
import { AdminService } from './admin/admin.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializationService {
  private isInitialized$ = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private houseService: HouseService,
    private adminService: AdminService,
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
