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
import { WingService } from '../../services/wings/wing.service';
import { House } from '../../interfaces/house.interface';
import { EventService } from '../Dashboard/calander/services/event.service';

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
  user: any;
  houses: any[] = [];
  selectedHouse: string = '';
  private usersubscription!: Subscription;
  isDropdownVisible: boolean = true; // Control dropdown visibility

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private houseService: HouseService,
    private wingService: WingService,
    private eventService: EventService
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
        this.houses = data.Houses || [];
        this.houseService.selectedHouse$.subscribe({
          next: (house) => {
            this.selectedHouse = house.house_no || 'Default House';
            this.initializeMenu(); // Ensure menu is updated when house changes
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
