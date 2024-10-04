import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { User } from '../../interfaces/user.interface';
import { House } from '../../interfaces/house.interface';

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
  houses: House[] = [];
  selectedHouse: string = '';
  isDropdownVisible: boolean = true; // Control dropdown visibility

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private initializeMenu(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
      },
      {
        label: 'Projects',
        icon: 'pi pi-search',
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
      },
    ];

    this.item = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.goToProfile(),
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: () => this.goToSettings(),
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  private loadUserData(): void {
    this.userService.getUserData().subscribe({
      next: (data) => {
        console.log(data);
        
        this.user = data;
        this.user.role = data.Roles[0].name
        this.initializeMenu();
      },
      error: (error) => {
        console.error('Failed to fetch user details', error);
      },
    });
  }

  goToProfile() {
    console.log('Navigate to profile');
    this.router.navigate(['/home/profile']);
  }

  goToSettings() {
    console.log('Navigate to settings');
  }

  logout() {
    this.authService.logout();
  }

  showDropdown() {
    if (this.houses.length > 1) {
      this.isDropdownVisible = true;
    }
  }

  hideDropdown() {
    this.isDropdownVisible = false;
  }

  // To keep dropdown open when hovering over dropdown
  onDropdownMouseEnter() {
    this.isDropdownVisible = true;
  }

  onDropdownMouseLeave() {
    this.hideDropdown();
  }
}
