import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { HouseService } from '../../services/houses/houseService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
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
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent implements OnInit {
  items: MenuItem[] = [];
  item: MenuItem[] | undefined;
  user: any;
  houses: any[] = [];
  selectedHouse: string = '';
  private usersubscription!: Subscription;
  private housesubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private houseService: HouseService
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
        label: this.selectedHouse,
        icon: 'pi pi-home',
        items: this.houses.map((house) => ({
          label: house.house_no,
          icon: 'pi pi-home',
          command: () => this.goToHouse(house),
        })),
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
    this.usersubscription = this.userService.getUserData().subscribe({
      next: (data) => {  
        this.user = data;
        this.houses = data.Houses;
        this.houseService.selectedHouse$.subscribe({
          next: (house) => {
            this.selectedHouse = house.house_no;
          },
        });
        this.initializeMenu();
      },
      error: (error) => {
        console.error('Failed to fetch user details', error);
      },
      complete: () => {
        if (this.usersubscription) {
          this.usersubscription.unsubscribe();
        }
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

  goToHouse(house: any) {
    this.houseService.setSelectedHouse(house);
    this.selectedHouse = house.house_no;
    this.initializeMenu();
    
  }
}
