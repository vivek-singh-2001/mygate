import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../../components/User/Shared/navigation/navigation.component';
import { SecurityNavigationComponent } from '../../components/Staff/security-navigation/security-navigation.component';
import { SecuritySideNavigationComponent } from '../../components/Staff/security-side-navigation/security-side-navigation.component';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [  NavigationComponent,
    SecurityNavigationComponent,
    SecuritySideNavigationComponent,
    CommonModule,
    RouterOutlet],
  templateUrl: './security.component.html',
  styleUrl: './security.component.css'
})
export class SecurityComponent {
  isSidebarExpanded: boolean = false;

  onSidebarExpansionChanged(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
}
