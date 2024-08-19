import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { __values } from 'tslib';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  userData: any;
  SocietyUsers: any;
  societyId: string = '';
  @Output() userSelected = new EventEmitter<any>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.fetchUserAndSocietyUsers();
  }
  selectUser(user: any) {
    this.userSelected.emit(user);
  }

  fetchUserAndSocietyUsers() {
    this.userService
      .getCurrentUser()
      .pipe(
        switchMap(() => {
          // Ensure userData has been updated
          this.userData = this.userService.getCurrentUserData();
          if (this.userData) {
            this.societyId = this.userData.Houses[0]['Wing']['SocietyId'];
            console.log(this.societyId);
            // Return observable to fetch society users
            return this.userService.getUsersBySocietyId(this.societyId);
          } else {
            throw new Error('User data not available');
          }
        })
      )
      .subscribe({
        next: (societyUsers: any) => {
          this.SocietyUsers = societyUsers.data.users;
          console.log(this.SocietyUsers, 'society members');
        },
        error: (error) => {
          console.error('Failed to fetch society users', error);
        },
      });
  }
}
