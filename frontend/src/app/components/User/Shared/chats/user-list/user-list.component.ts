import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import {  EMPTY, Subscription } from 'rxjs';
import { UserService } from '../../../../../services/user/user.service';
import { HouseService } from '../../../../../services/houses/houseService';

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
  private subscription!: Subscription;

  constructor(
    private readonly userService: UserService,
    private readonly houseService: HouseService
  ) {}

  ngOnInit() {
    this.subscription = this.houseService.selectedHouse$
      .pipe(
        switchMap((selectedHouse) => {
          if (selectedHouse) {
            
            return this.userService.getUsersBySocietyIdAndWingId(
              selectedHouse.Floor.Wing.societyId,
              selectedHouse.Floor.wingId
            );
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe({
        next: (societyUsers: any) => {
          this.SocietyUsers = societyUsers.data.users;
        },
        error: (error) => {
          console.error('Failed to fetch society users', error);
        },
        complete: () => {
          if (this.subscription) {
            this.subscription.unsubscribe();
          }
        },
      });
  }
  selectUser(user: any) {
    this.userSelected.emit(user);
  }
}
