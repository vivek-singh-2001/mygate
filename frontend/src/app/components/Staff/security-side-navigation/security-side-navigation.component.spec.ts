import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritySideNavigationComponent } from './security-side-navigation.component';

describe('SecuritySideNavigationComponent', () => {
  let component: SecuritySideNavigationComponent;
  let fixture: ComponentFixture<SecuritySideNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuritySideNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecuritySideNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
