import { Component } from '@angular/core';
import { SystemAdminNavigationComponent } from "../../components/system-admin-navigation/system-admin-navigation.component";
import { SystemAdminSideNavigationComponent } from "../../components/system-admin-side-navigation/system-admin-side-navigation.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-admin',
  standalone: true,
  imports: [SystemAdminNavigationComponent, SystemAdminSideNavigationComponent,CommonModule,
    RouterOutlet],
  templateUrl: './system-admin.component.html',
  styleUrl: './system-admin.component.css'
})
export class SystemAdminComponent {
  isSidebarExpanded: boolean = false;

  onSidebarExpansionChanged(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
}
