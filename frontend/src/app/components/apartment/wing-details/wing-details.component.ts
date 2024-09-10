import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

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
  sidebarVisible: boolean = false;
  selectedHouse: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

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

  // Method to call the API and fetch houses by wingId
  fetchHousesByWingId(wingId: string): void {
    this.isLoading = true;
    const apiUrl = `http://localhost:7500/api/v1/house/wingHouseDetails/${wingId}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        this.houses = response.data.wingHouseDetails;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching house data:', error);
        this.isLoading = false;
      },
    });
  }
  onViewHouse(house: any) {
    this.selectedHouse = house;
    this.sidebarVisible = true;
    this.isLoading = true;
    this.http
      .get<any>(
        `http://localhost:7500/api/v1/houseuser/houseDetails/${house.id}`
      )
      .subscribe({
        next: (response) => {
          if (response.data.HouseDetails.length > 0) {
            this.selectedHouse.familyDetails = response.data.HouseDetails.sort(
              (a: any, b: any) => (b.User.isOwner ? 1 : 0) - (a.User.isOwner ? 1 : 0)
            );
            this.isLoading = false;
          } else {
            this.selectedHouse.familyDetails = null;
            this.isLoading = false;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching house user data:', error);
          this.isLoading = false;
        },
      });
  }
}
