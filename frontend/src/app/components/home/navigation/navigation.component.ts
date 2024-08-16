import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';

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
  items: MenuItem[] | undefined;
  item: MenuItem[] | undefined;
  user:any;


  constructor(private authService:AuthService,private userService : UserService){}

  ngOnInit() :void{

    this.loadUserData()
    this.initializeMenu()
  }

  private initializeMenu(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
      },
      {
        label: 'Features',
        icon: 'pi pi-star',
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
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data.data.user;
      },
      error: (error) => {
        console.error('Failed to fetch user details', error);
      }
    });
  }

  goToProfile() {
    console.log('Navigate to profile');

  }

  goToSettings() {
    console.log('Navigate to settings');
    
  }

  logout() {
   this.authService.logout();
  }

}
