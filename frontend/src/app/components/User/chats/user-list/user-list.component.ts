import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { HouseService } from '../../../../services/houses/houseService';
import { BehaviorSubject, EMPTY, Subscription } from 'rxjs';

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
    private userService: UserService,
    private houseService: HouseService
  ) {}

  ngOnInit() {
    this.subscription = this.houseService.selectedHouse$
      .pipe(
        switchMap((selectedHouse) => {
          if (selectedHouse) {
            console.log("helooooooooooooooooooooooo", selectedHouse);
            
            // const societyId = selectedHouse.Floor.Wing.societyId;
            // const wingId = selectedHouse.Floor.Wing.wingId;
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
