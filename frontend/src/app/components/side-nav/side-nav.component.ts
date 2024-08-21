import { Component, OnInit, EventEmitter,Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLinkActive } from '@angular/router';
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
      { label: 'Dashboard', icon: 'pi pi-home', iconSize: 'large', command: () => this.goTo('/dashboard') },
      { label: 'Profile', icon: 'pi pi-user', iconSize: 'large', command: () => this.goTo('/Profile') },
      { label: 'Settings', icon: 'pi pi-cog', iconSize: 'large', command: () => this.goTo('/Settings') },
      { label: 'Messages', icon: 'pi pi-envelope', iconSize: 'large', command: () => this.goTo('/messages') },
    ];
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.expansionChanged.emit(this.isExpanded);
  }

  private goTo(path: string) {
    this.router.navigate([path]);
    this.snackBar.open('Navigated to'+ path, 'Close', {
      duration: 2000,
    }); 
  }
}
  