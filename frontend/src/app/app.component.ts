import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppInitializationService } from './services/AppInitialization';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
})
export class AppComponent  {
  title = 'frontend';

  constructor(
    private readonly appInitializationService: AppInitializationService,
    private readonly authService: AuthService,
  ) {
    if (this.authService.isLoggedIn()) {
      console.log("is initialized called................................")
     this.appInitializationService.initialize().subscribe();
    }
  }
}

