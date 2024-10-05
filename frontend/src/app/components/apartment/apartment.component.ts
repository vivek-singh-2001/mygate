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
  
    // Directly subscribe to userSocietyId$
    this.userService.userSocietyId$
      .pipe(
        switchMap((societyId) => {
          
          
          if (!societyId) {
            throw new Error('Society ID is missing');
          }
  
          // Fetch the society data using the societyId
          return this.societyService.fetchSocietyData(societyId);
        }),
        map((responseData: any) => {
          console.log('Fetched society data:', responseData);
          this.isLoading = false;
  
          // Sort the society data based on ID
          return responseData.societyDetails.sort((a: any, b: any) => a.id - b.id);
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
