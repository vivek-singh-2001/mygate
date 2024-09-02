import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { HouseService } from '../../../services/houses/houseService';
import { BehaviorSubject, EMPTY } from 'rxjs';

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

  constructor(private userService: UserService, private houseService:HouseService) {
  }

  ngOnInit() {

    this.houseService.selectedHouse$.pipe(
      switchMap(selectedHouse => {
        // this.selectedHouse$ = selectedHouse.house;
        if (selectedHouse) {
          console.log("selected house ", selectedHouse);
          
          const societyId = selectedHouse.Wing.SocietyId;
          const wingId = selectedHouse.WingId;
          return this.userService.getUsersBySocietyIdAndWingId(societyId, wingId);
        } else {
          return EMPTY; 
        }
      })
    ).subscribe({
      next: (societyUsers: any) => {
        this.SocietyUsers = societyUsers.data.users.filter(
          (user: any) => user.isowner === true
        );
      },
      error: (error) => {
        console.error('Failed to fetch society users', error);
      },
    });

  }
  selectUser(user: any) {
    this.userSelected.emit(user);
  }



}
