import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
})
export class PageNotFoundComponent {
  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  goBack() {
    this.userService.userRoles$.subscribe({
      next:(roleArray)=> {
        if (roleArray.includes('systemAdmin')) {
          this.router.navigate(['/systemAdmin']);
        }
        else{
          this.router.navigate(['/home'])
        }
      },
    });
  }
}
