import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class HouseService {
  private housesSubject = new BehaviorSubject<any[]>([]);
  private selectedHouseSubject = new BehaviorSubject<any>(null);
  private societyAdminDetailsSubject = new BehaviorSubject<any>(null);

  houses$ = this.housesSubject.asObservable();
  selectedHouse$ = this.selectedHouseSubject.asObservable();
  societyAdminDetails$ = this.societyAdminDetailsSubject.asObservable();

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
}
