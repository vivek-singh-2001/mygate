import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-google-callback',
  template: `<p>hello</p>`,
})
export class GoogleCallbackComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.handleGoogleLoginCallback();
  }
}
