import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { HouseService } from '../../services/houses/houseService';

@Component({
  selector: 'app-apartment',
  standalone: true,
  imports: [ImageModule],
  templateUrl: './apartment.component.html',
  styleUrl: './apartment.component.css',
})
export class ApartmentComponent implements OnInit {
  adminSettings: any[] = [];

  constructor(private houseService: HouseService) {}
  ngOnInit(): void {
    // this.houseService.societyAdminDetails$.subscribe((adminSettings) => {
    //   this.adminSettings = adminSettings;
    //   console.log(adminSettings);
    // });
  }
}
