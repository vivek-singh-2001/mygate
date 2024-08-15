import { Component } from '@angular/core';
import { NavigationComponent } from "./navigation/navigation.component";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { MainDisplayComponent } from "./main-display/main-display.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavigationComponent, SideNavComponent, MainDisplayComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  
}