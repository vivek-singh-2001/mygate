import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../../components/User/navigation/navigation.component';
import { SideNavComponent } from '../../components/User/side-nav/side-nav.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavigationComponent,
    SideNavComponent,
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isSidebarExpanded: boolean = false;

  onSidebarExpansionChanged(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
}