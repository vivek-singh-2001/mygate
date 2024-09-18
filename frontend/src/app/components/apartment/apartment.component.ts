import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { SocietyService } from '../../services/society/society.Service';
import { UserService } from '../../services/user/user.service';
import { map, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-apartment',
  standalone: true,
  imports: [ImageModule, CommonModule, RouterModule],
  templateUrl: './apartment.component.html',
  styleUrl: './apartment.component.css',
})
export class ApartmentComponent implements OnInit {
  constructor(
    private societyService: SocietyService,
    private userService: UserService,
    private router: Router
  ) {}

  societyData: any[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;

    // Fetch user data and then society data based on house
    this.userService
      .getUserData()
      .pipe(
        switchMap((userData) => {
          const houses = userData?.Houses;
          const societyId = houses?.[0]?.Wing?.SocietyId;

          if (!societyId) {
            throw new Error('User data is incomplete or societyId is missing');
          }

          return this.societyService.fetchSocietyData(societyId);
        }),
        map((responseData: any) => {
          console.log('soccc', responseData);
          this.isLoading = false;
          return responseData.societyDetails.sort(
            (a: any, b: any) => a.id - b.id
          );
        })
      )
      .subscribe({
        next: (sortedSocietyData) => {
          this.societyData = sortedSocietyData;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Failed to fetch society data', error);
        },
      });
  }
  goToWingDetails(name: string, id: number) {
    this.router
      .navigate([`/home/apartments/wingDetails/${name}/${id}`])
      .then((success) => console.log('Navigation successful:', success))
      .catch((err) => console.error('Navigation error:', err));
  }
}
