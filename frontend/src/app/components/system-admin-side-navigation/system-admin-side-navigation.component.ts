import { Component, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-system-admin-side-navigation',
  standalone: true,
  imports: [SidebarModule,
    ButtonModule,
    CommonModule,
    MenubarModule,
    PanelMenuModule],
  templateUrl: './system-admin-side-navigation.component.html',
  styleUrl: './system-admin-side-navigation.component.css'
})
export class SystemAdminSideNavigationComponent {
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
    this.initializeMenuItems();

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
