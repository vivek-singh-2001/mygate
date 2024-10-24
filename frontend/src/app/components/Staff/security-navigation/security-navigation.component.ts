import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { SocietyService } from '../../../services/society/society.Service';
import { House } from '../../../interfaces/house.interface';
import { Society } from '../../../interfaces/society.interface';
import { User } from '../../../interfaces/user.interface';
import { MenuItem } from 'primeng/api';
import { tap } from 'rxjs';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-security-navigation',
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
  templateUrl: './security-navigation.component.html',
  styleUrl: './security-navigation.component.css',
})
export class SecurityNavigationComponent {
  items: MenuItem[] = [];
  item: MenuItem[] | undefined;
  user!: any;
  societies!: Society[];
  ApprovedSocieties: string = '';
  houses: House[] = [];
  selectedHouse: string = '';
  isDropdownVisible: boolean = true; // Control dropdown visibility

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly societyService:SocietyService
  
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    // this.societyService.fetchSocietyData('').subscribe()
    
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
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.user = data.data;
        this.initializeMenu();
      },
      error: (error) => {
        console.error('Failed to fetch user details', error);
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
