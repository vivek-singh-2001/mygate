import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { User } from '../../../interfaces/user.interface';
import { House } from '../../../interfaces/house.interface';
import { SocietyService } from '../../../services/society/society.Service';
import { Society } from '../../../interfaces/society.interface';
import { tap } from 'rxjs';

@Component({
  selector: 'app-system-admin-navigation',
  standalone: true,
  imports: [
    MenubarModule,
    RippleModule,
    CommonModule,
    InputTextModule,
    AvatarModule,
    BadgeModule,
    MenuModule,
  ],
  templateUrl: './system-admin-navigation.component.html',
  styleUrl: './system-admin-navigation.component.css',
})
export class SystemAdminNavigationComponent {
  items: MenuItem[] = [];
  item: MenuItem[] | undefined;
  user!: User;
  societies!: Society[];
  ApprovedSocieties: string = '';
  houses: House[] = [];
  selectedHouse: string = '';
  isDropdownVisible: boolean = true; // Control dropdown visibility

  constructor(
    private readonly router: Router,
    private readonly societyService: SocietyService,
    private readonly authService: AuthService,
    private readonly userService: UserService,


  ) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  private initializeMenu(): void {


    this.item = [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  private loadUserData(): void {
    this.userService
      .getUserData()
      .pipe(
        tap(() => {
          this.fetchSocietyData();
        })
      )
      .subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (error) => {
          console.error('Failed to fetch user details', error);
        },
      });
  }

  private fetchSocietyData() {
    this.societyService.allSocietyData$.subscribe({
      next: (societies) => {

        this.societies = societies;
        this.ApprovedSocieties = societies.filter(society => society.status == 'approved').length.toString()
        this.initializeMenu();
      },
    });
  }

  goToSocieties() {
    this.router.navigate(['/systemAdmin/societies']);
  }

  logout() {
    this.authService.logout();
  }
}
