import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGaurdComponent } from './security-gaurd.component';

describe('SecurityGaurdComponent', () => {
  let component: SecurityGaurdComponent;
  let fixture: ComponentFixture<SecurityGaurdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityGaurdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityGaurdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
