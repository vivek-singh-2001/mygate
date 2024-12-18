import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../../../../environments/environment';
import { WingService } from '../../../../../services/wings/wing.service';

@Component({
  selector: 'app-wing-details',
  standalone: true,
  imports: [CommonModule, SidebarModule, ButtonModule],
  templateUrl: './wing-details.component.html',
  styleUrl: './wing-details.component.css',
})
export class WingDetailsComponent implements OnInit {
  wingId: string | null = null;
  wingName: string | null = '';
  houses: any[] = [];
  isLoading = false;
  isSidebarLoading: boolean = false;
  sidebarVisible: boolean = false;
  selectedHouse: any = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly wingService: WingService
  ) {}

  ngOnInit(): void {
    // Get the wingId from the URL
    this.route.paramMap.subscribe((params) => {
      this.wingName = params.get('name');
      this.wingId = params.get('id');

      // Fetch house data if wingId is present
      if (this.wingId) {
        this.fetchHousesByWingId(this.wingId);
      }
    });
  }

  fetchHousesByWingId(wingId: string): void {
    this.isLoading = true;

    this.wingService.fetchHousesByWingId(wingId).subscribe({
      next: (response: any) => {
        this.houses = response.data.wingHouseDetails;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error fetching house data:', error);
        this.isLoading = false;
      },
    });
  }
  
  onViewHouse(house: any) {
    this.selectedHouse = house;
    this.isSidebarLoading = true;
    this.sidebarVisible = true;
    this.http
      .get<any>(`${environment.apiUrl}/houseuser/houseDetails/${house.id}`)
      .subscribe({
        next: (response) => {
          console.log('response', response);

          if (response.data.HouseDetails.length > 0) {
            this.selectedHouse.familyDetails = response.data.HouseDetails.sort(
              (a: any, b: any) =>
                (b.User?.isOwner ? 1 : 0) - (a.User?.isOwner ? 1 : 0)
            );
          } else {
            this.selectedHouse.familyDetails = null;
          }
          this.isSidebarLoading = false;
        },
        error: (error) => {
          console.error('Error fetching house user data:', error);
          this.isSidebarLoading = false;
        },
      });
  }
  goBack() {
    this.router.navigate(['/home/apartments/']);
  }
}
