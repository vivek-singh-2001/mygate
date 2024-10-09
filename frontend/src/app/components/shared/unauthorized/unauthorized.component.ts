import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
})
export class UnauthorizedComponent {
  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  goBack() {
    this.userService.userRoles$.subscribe({
      next: (roleArray) => {
        if (roleArray.includes('systemAdmin')) {
          this.router.navigate(['/systemAdmin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error(err) {
        console.error(err.message);
      },
    });
  }
}
