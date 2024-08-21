import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from "./navigation/navigation.component";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { MainDisplayComponent } from "./main-display/main-display.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavigationComponent,
    SideNavComponent,
    MainDisplayComponent,
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