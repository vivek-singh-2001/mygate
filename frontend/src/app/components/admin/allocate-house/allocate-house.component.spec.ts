import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateHouseComponent } from './allocate-house.component';

describe('AllocateHouseComponent', () => {
  let component: AllocateHouseComponent;
  let fixture: ComponentFixture<AllocateHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocateHouseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocateHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
