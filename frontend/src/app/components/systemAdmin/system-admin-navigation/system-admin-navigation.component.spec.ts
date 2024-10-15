import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminNavigationComponent } from './system-admin-navigation.component';

describe('SystemAdminNavigationComponent', () => {
  let component: SystemAdminNavigationComponent;
  let fixture: ComponentFixture<SystemAdminNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemAdminNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemAdminNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
