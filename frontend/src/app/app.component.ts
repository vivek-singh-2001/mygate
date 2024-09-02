import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppInitializationService } from './services/AppInitialization';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Fixed: `styleUrl` should be `styleUrls`
})
export class AppComponent {
  title = 'frontend';

  constructor(private appInitializationService: AppInitializationService,
    private authService: AuthService
  ) {
    // Ensure that initialization logic is appropriate
    if (this.authService.isLoggedIn()) {
      this.appInitializationService.initialize().subscribe();
    }
  }
}
