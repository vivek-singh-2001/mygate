import { Component, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-security-side-navigation',
  standalone: true,
  imports: [SidebarModule,
    ButtonModule,
    CommonModule,
    MenubarModule,
    PanelMenuModule],
  templateUrl: './security-side-navigation.component.html',
  styleUrl: './security-side-navigation.component.css'
})
export class SecuritySideNavigationComponent {
  @Output() expansionChanged = new EventEmitter<boolean>();

  isExpanded: boolean = false;
  items!: MenuItem[string];
  isAdmin: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly adminService: AdminService
  ) {}

  ngOnInit() {
    this.initializeMenuItems();

  }

  initializeMenuItems() {
    this.items = [
      {
        label: 'visitors',
        icon: 'pi pi-id-card',
        iconSize: 'large',
        command: () => this.navigateTo('/Security/visitors'),
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
