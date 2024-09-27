import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppInitializationService } from './services/AppInitialization';
import { AuthService } from './services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
})
export class AppComponent  {
  title = 'frontend';
  private authSubscription = Subscription;

  constructor(
    private appInitializationService: AppInitializationService,
    private authService: AuthService,
  ) {
    if (this.authService.isLoggedIn()) {
     this.appInitializationService.initialize().subscribe();
    }
  }
}

