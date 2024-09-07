import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { SocietyService } from '../../services/society/society.Service';
import { UserService } from '../../services/user/user.service';
import { map, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apartment',
  standalone: true,
  imports: [ImageModule,CommonModule],
  templateUrl: './apartment.component.html',
  styleUrl: './apartment.component.css',
})
export class ApartmentComponent implements OnInit {
  constructor(
    private societyService: SocietyService,
    private userService: UserService
  ) {}

  societyData: any[] = [];
  isLoading = false;

  ngOnInit(): void {
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
        return data;
      })
    ).subscribe();
  }
}  
