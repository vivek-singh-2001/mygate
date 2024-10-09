import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminSideNavigationComponent } from './system-admin-side-navigation.component';

describe('SystemAdminSideNavigationComponent', () => {
  let component: SystemAdminSideNavigationComponent;
  let fixture: ComponentFixture<SystemAdminSideNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemAdminSideNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemAdminSideNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
