import { Component, OnInit, EventEmitter,Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';


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


  ngOnInit() {
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-home' ,iconSize: 'large'},
      { label: 'Profile', icon: 'pi pi-user',iconSize: 'large' },
      { label: 'Settings', icon: 'pi pi-cog',iconSize: 'large' },
      { label: 'Messages', icon: 'pi pi-envelope',iconSize: 'large' },
    ];
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.expansionChanged.emit(this.isExpanded);
  }
}
