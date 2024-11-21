import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { HouseService } from '../../../../services/houses/houseService';
import { WingService } from '../../../../services/wings/wing.service';
import { EventService } from '../../../../services/events/event.service';
import { AppInitializationService } from '../../../../services/AppInitialization';
import { User } from '../../../../interfaces/user.interface';
import { House } from '../../../../interfaces/house.interface';

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
  styleUrls: ['./navigation.component.css'], // Corrected to styleUrls
})
export class NavigationComponent implements OnInit {
  items: MenuItem[] = [];
  item: MenuItem[] | undefined;
  user!: User;
  houses: House[] = [];
  selectedHouse: string = '';
  isDropdownVisible: boolean = true; // Control dropdown visibility

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly houseService: HouseService,
    private readonly wingService: WingService,
    private readonly eventService: EventService,
    private readonly appInitializationService: AppInitializationService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private initializeMenu(): void {
    this.items = [
      {
        label: 'visitors',
        icon: 'pi pi-id-card',
        command: () => this.goToVisitors(),
      },
      {
        label: this.selectedHouse || 'N/A',
        icon: 'pi pi-home',
        expanded: this.houses.length > 1, // Manually control dropdown visibility
        items:
          this.isDropdownVisible && this.houses.length > 1
            ? this.houses.map((house) => ({
                label: house.house_no,
                icon: 'pi pi-home',
                command: () => this.goToHouse(house),
              }))
            : [],
        // Attach hover events
        onMouseEnter: () => this.showDropdown(),
        onMouseLeave: () => this.hideDropdown(),
      },
      {
        label: 'Community Forum',
        icon: 'pi pi-id-card',
        command: () => this.goToForum(),
      },
      // {
      //   label: 'Projects',
      //   icon: 'pi pi-search',
      // },
      // {
      //   label: 'Contact',
      //   icon: 'pi pi-envelope',
      // },
    ];

    this.item = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.goToProfile(),
      },
      // {
      //   label: 'Settings',
      //   icon: 'pi pi-cog',
      //   command: () => this.goToSettings(),
      // },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  private loadUserData(): void {
    this.appInitializationService.isInitialized.subscribe((isInitialized) => {
      if (isInitialized || this.authService.isLoggedIn()) {
        this.userService.userData$.subscribe({
          next: (data) => {
            this.user = data;
            this.houses = data?.Houses || [];

            this.houseService.selectedHouse$.subscribe({
              next: (house) => {
                this.selectedHouse = house?.house_no || 'Default House';
                this.initializeMenu(); // Ensure menu is updated when house changes
              },
              error: (houseError) => {
                console.error('Failed to fetch selected house:', houseError);
              },
            });

            this.initializeMenu();
          },
          error: (error) => {
            console.error('Error fetching user data:', error);
          },
        });
      }
    });
  }

  goToVisitors() {
    this.router.navigate(['/home/visitors']);
  }

  goToForum(){
    this.router.navigate(['/home/forums'])
  }

  goToProfile() {
    this.router.navigate(['/home/profile']);
  }

  goToSettings() {
    console.log('Navigate to settings');
  }

  logout() {
    this.authService.logout();
  }

  goToHouse(house: House) {
    this.wingService.clearWingDetails();
    this.userService.clearfamilyData();
    this.eventService.clearEvents();
    this.houseService.setSelectedHouse(house);
    this.selectedHouse = house.house_no;
    this.initializeMenu();
    console.log('House selected:', house);
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

  handleKeyDown(event: KeyboardEvent, house: House) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.goToHouse(house);
    }
  }
}
