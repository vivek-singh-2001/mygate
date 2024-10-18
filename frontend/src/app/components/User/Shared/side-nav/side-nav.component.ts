import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    CommonModule,
    MenubarModule,
    PanelMenuModule,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent implements OnInit {
  @Output() expansionChanged = new EventEmitter<boolean>();

  isExpanded: boolean = false;
  items!: MenuItem[string];
  isAdmin: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly userService: UserService
  ) {}

  ngOnInit() {
    this.checkAdminStatus();
  }

  checkAdminStatus() {
    this.userService.userRoles$.subscribe({
      next: (roles) => {
        if (roles.includes('societyAdmin')) {
          this.isAdmin = true;
          this.initializeMenuItems();
        } else {
          this.isAdmin = false;
          this.initializeMenuItems();
        }
      },
    });
  }

  initializeMenuItems() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        iconSize: 'large',
        command: () => this.navigateTo('/home/dashboard'),
      },
      {
        label: 'Messages',
        icon: 'pi pi-comments',
        iconSize: 'large',
        command: () => this.navigateTo('/home/messages'),
      },
      {
        label: 'Notice',
        icon: 'pi pi-bell',
        iconSize: 'large',
        command: () => this.navigateTo('/home/notice'),
      },
      {
        label: 'Events',
        icon: 'pi pi-calendar-plus',
        iconSize: 'large',
        command: () => this.navigateTo('/home/events'),
      },
      {
        label: 'Complaints',
        icon: 'pi pi-pen-to-square',
        iconSize: 'large',
        command: () => this.navigateTo('/home/complaints'),
      },
      {
        label: 'Visitors',
        icon: 'pi pi-id-card',
        iconSize: 'large',
        command: () => this.navigateTo('/home/visitors'),
      },
      ...(this.isAdmin
        ? [
            {
              label: 'Admin Control',
              iconSize: 'large',
              icon: 'pi pi-briefcase',
              items: [
                {
                  label: 'Apartments',
                  icon: 'pi pi-warehouse',
                  command: () => this.navigateTo('/home/apartments'),
                },
                {
                  label: 'Assign Houses',
                  icon: 'pi pi-user-plus',
                  command: () =>
                    this.navigateTo('/home/apartments/allocate-house'),
                },
                {
                  label: 'Users',
                  icon: 'pi pi-users',
                  command: () => this.navigateTo('/home/apartments/users'),
                },
                {
                  label: 'Add Security',
                  icon: 'pi pi-lock',
                  command: () => this.navigateTo('/home/apartments/AddSecurityGaurd'),
                },
                {
                  label: 'Assign Staff Shift',
                  icon: 'pi pi-hourglass',
                  command: () => this.navigateTo('/home/apartments/AssignShift'),
                },
              ],
              // command: () => this.navigateTo('/home/apartments'),
            },
          ]
        : []),
    ];
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.expansionChanged.emit(this.isExpanded);
  }

  navigateTo(route: string) {
    this.router.navigate([route]).then(() => {
      console.log('Current route:', this.router.url);
    });
    this.snackBar.open(`Navigated to ${route}`, 'Close', { duration: 1000 });
  }
}
