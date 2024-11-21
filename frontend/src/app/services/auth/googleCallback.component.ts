import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { AppComponent } from '../../app.component';
import { MessageService } from 'primeng/api';

@Component({
  standalone: true,
  imports: [AppComponent],
  selector: 'app-google-callback',
  template: `<p><app-root></app-root></p>`,
  providers: [MessageService]
})
export class GoogleCallbackComponent implements OnInit {
  constructor(private readonly authService: AuthService, private readonly messageService: MessageService) {}
  ngOnInit(): void {
    this.authService.handleGoogleLoginCallback();
  }
}
