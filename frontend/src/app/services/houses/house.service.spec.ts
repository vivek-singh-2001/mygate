import { TestBed } from '@angular/core/testing';
import { HouseService } from './houseService';
import { BehaviorSubject } from 'rxjs';

describe('HouseService', () => {
  let service: HouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HouseService],
    });
    service = TestBed.inject(HouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and retrieve houses correctly', () => {
    const houses = [{ id: 1, name: 'House A' }, { id: 2, name: 'House B' }];
    service.setHouses(houses);

    service.getHouses().subscribe((retrievedHouses) => {
      expect(retrievedHouses).toEqual(houses);
    });
  });

  it('should set and retrieve the selected house', () => {
    const house = { id: 1, name: 'House A' };
    service.setSelectedHouse(house);

    service.getSelectedHouse().subscribe((selectedHouse) => {
      expect(selectedHouse).toEqual(house);
    });
  });
});