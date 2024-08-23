import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';

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
            const loggedInUserWingId = this.userData.Houses[0]['WingId'];
            console.log('userid', this.societyId, this.userData);
            // Return observable to fetch society users
            return this.userService.getUsersBySocietyIdAndWingId(this.societyId,loggedInUserWingId);
          } else {
            throw new Error('User data not available');
          }
        })
      )
      .subscribe({
        next: (societyUsers: any) => {
          // const loggedInUserWingId = this.userData.Houses[0]['WingId'];

          this.SocietyUsers = societyUsers.data.users.filter(
            (user: any) =>
              user.id !== this.userData.id &&
              user.isowner === true 
          );
          console.log(this.SocietyUsers, 'society members');
        },
        error: (error) => {
          console.error('Failed to fetch society users', error);
        },
      });
  }
}
