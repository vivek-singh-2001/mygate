import { Component, OnInit, EventEmitter,Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';



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

  constructor(private router: Router,private snackBar: MatSnackBar){}


  ngOnInit() {
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-home', iconSize: 'large', command: () => this.goToDashboard() },
      { label: 'Profile', icon: 'pi pi-user', iconSize: 'large', command: () => this.goToProfile() },
      { label: 'Settings', icon: 'pi pi-cog', iconSize: 'large', command: () => this.goToSettings() },
      { label: 'Messages', icon: 'pi pi-envelope', iconSize: 'large', command: () => this.goToMessages() },
    ];
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.expansionChanged.emit(this.isExpanded);
  }

   
  private goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  private goToProfile() {
    this.router.navigate(['/profile']);
  }

  private goToSettings() {
    this.router.navigate(['/settings']);
  }

  private goToMessages() {
    console.log('msg button clicked')
    // this.router.navigate(['/messages']);
    this.snackBar.open('Message button clicked!', 'Close', {
      duration: 2000, // Adjust duration as needed
    });
  }
}
