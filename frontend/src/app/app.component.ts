import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppInitializationService } from './services/AppInitialization';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Fixed: `styleUrl` should be `styleUrls`
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(
    private appInitializationService: AppInitializationService,
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    if (this.authService.isLoggedIn()) {
      this.appInitializationService.initialize().subscribe();
    }
  }

  ngOnInit() {
    // this.themeService.setTheme(this.themeService.getActiveTheme());
  }

  // toggleTheme() {
  //   this.themeService.toggleTheme();
  // }

  // getCurrentTheme() {
  //   return this.themeService.getActiveTheme();
  // }
}
