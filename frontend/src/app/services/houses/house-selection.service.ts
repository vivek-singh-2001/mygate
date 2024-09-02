import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HouseSelectionService {
  private selectedHouseSubject = new BehaviorSubject<string | null>(null);
  selectedHouse$ = this.selectedHouseSubject.asObservable();

  constructor() {}

  setSelectedHouse(houseNumber: string): void {
    this.selectedHouseSubject.next(houseNumber);
  }

  getSelectedHouse(): Observable<string | null> {
    return this.selectedHouse$;
  }
}
