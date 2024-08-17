import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { concatMap } from 'rxjs/operators';

// interface User {
//   id: number;
//   name: string;
// }

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  societyDetails: any;
  users: any;
  societyId: string = '';
  @Output() userSelected = new EventEmitter<any>();

  constructor(private userService: UserService) {}

  
  ngOnInit() {
    this.userService.getSocietyByUserId().pipe(
      concatMap((societyDetails: any) => {
        this.societyDetails = societyDetails.data.society;
        console.log(this.societyDetails, 'society details');
        return this.userService.getUsersBySocietyId(this.societyDetails.id);
      })
    ).subscribe({
      next: (users: any) => {
        this.users = users.data.users;
        console.log(this.users, 'society members');
      },
      error: (error) => {
        console.error('Error occurred:', error);
      },
      complete: () => {
        console.log('Completed');
      }
    });
  }
  selectUser(user: any) {
    this.userSelected.emit(user);
  }

  getSocietyDetailss() {
    this.userService.getSocietyByUserId().subscribe((societyDetails: any) => {
      this.societyDetails = societyDetails.data.society;
      console.log(this.societyDetails, 'society details');
    });
  }

  getSocietyUsers() {
    this.userService
      .getUsersBySocietyId(this.societyDetails.id)
      .subscribe((users: any) => {
        this.users = users.data.users;
        console.log(this.users, 'society members');
      });
  }
}
