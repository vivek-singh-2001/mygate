import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    CommonModule,
    MenubarModule,
    MenuModule,
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
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.checkAdminStatus();
  }

  checkAdminStatus() {
    this.adminService.isUserAdmin().subscribe({
      next: (response) => {
        this.isAdmin = response;
        this.initializeMenuItems();

        this.router.navigate(['/home']);
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
        icon: 'pi pi-envelope',
        iconSize: 'large',
        command: () => this.navigateTo('/home/messages'),
      },
      ...(this.isAdmin
        ? [
            {
              label: 'Apartments',
              icon: 'pi pi-warehouse',
              iconSize: 'large',
              command: () => this.navigateTo('/home/apartments'),
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
