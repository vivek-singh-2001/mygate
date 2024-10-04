import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from "../../components/navigation/navigation.component";
import { SideNavComponent } from "../../components/side-nav/side-nav.component";
import { RouterOutlet } from '@angular/router';


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