import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { UserService } from '../user/user.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HouseService {


  private societyApiUrl = 'http://localhost:7500/api/v1/society';


  private housesSubject = new BehaviorSubject<any[]>([]);
  private selectedHouseSubject = new BehaviorSubject<any>(null);
  private societyAdminDetailsSubject = new BehaviorSubject<any>(null);

  houses$ = this.housesSubject.asObservable();
  selectedHouse$ = this.selectedHouseSubject.asObservable();
  societyAdminDetails$ = this.societyAdminDetailsSubject.asObservable();


  constructor(private userService:UserService, private http:HttpClient){}

  setHouses(houses: any[]) {
    this.housesSubject.next(houses);
    if (houses.length > 0) {
      this.setSelectedHouse(houses[0]); // Set the default selected house
    }
  }

  getHouses() {
    return this.housesSubject.asObservable();
  }

  setSelectedHouse(house: any) {
    this.selectedHouseSubject.next(house);
  }

  getSelectedHouse() {
    return this.selectedHouseSubject.asObservable();
  }

  getSocietyAdminsDetails(societyId: string) {
    return this.http.get(`${this.societyApiUrl}/SocietyAdminsDetails/${societyId}`).pipe(
      tap((user)=>{
        this.societyAdminDetailsSubject.next(user);
      })
    )
  }

  getAdminsDetails(){
    this.selectedHouse$.subscribe({
      next: (selectedHouse) => {
        if (selectedHouse) {
          console.log('Selected House:', selectedHouse);
          const societyId = selectedHouse.Wing.Society.id;
          const wingId = selectedHouse.Wing.id;
          this.getSocietyAdminsDetails(societyId)
        } else {
          console.log('No house selected');
        }
      },
      error: (error) => {
        console.error('Error fetching selected house', error);
      }
    });
  }
}
