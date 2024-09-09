import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WingDetailsComponent } from './wing-details.component';

describe('WingDetailsComponent', () => {
  let component: WingDetailsComponent;
  let fixture: ComponentFixture<WingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
