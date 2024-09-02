import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { AppComponent } from '../../app.component';

@Component({
  standalone: true,
  imports: [AppComponent],
  selector: 'app-google-callback',
  template: `<p><app-root></app-root></p>`,
})
export class GoogleCallbackComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.handleGoogleLoginCallback();
  }
}
