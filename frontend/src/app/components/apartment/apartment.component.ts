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
  imports: [ImageModule,CommonModule,RouterModule],
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
    this.userService.getUserData().pipe(
      switchMap((data) => {
        // Fetch society data based on the user's house
        return this.societyService.fetchSocietyData(data.Houses[0].Wing.SocietyId).pipe(
          // Ensure societyData$ is returned after fetching society data
          switchMap(() => this.societyService.societyData$)
        );
      }),
      map((data) => {
        this.societyData = data.sort((a:any,b:any)=>a.id-b.id);
        this.isLoading = false;  
        return data;
      })
    ).subscribe({
      error: (error) => {
        console.error('Failed to fetch society data', error);
        this.isLoading = false;  
      },
    });
  }

  goToWingDetails(name: string, id: number) {
    console.log(`Navigating to: /home/apartments/wingDetails/${name}`);
    this.router.navigate([`/home/apartments/wingDetails/${name}/${id}`])
      .then(success => console.log('Navigation successful:', success))
      .catch(err => console.error('Navigation error:', err));
  }
  
}  
