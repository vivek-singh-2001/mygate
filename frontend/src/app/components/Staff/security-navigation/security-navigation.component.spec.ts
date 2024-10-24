import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityNavigationComponent } from './security-navigation.component';

describe('SecurityNavigationComponent', () => {
  let component: SecurityNavigationComponent;
  let fixture: ComponentFixture<SecurityNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
