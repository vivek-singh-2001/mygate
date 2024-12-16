import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { SecuritySideNavigationComponent } from './security-side-navigation.component';
import { AdminService } from '../../../services/admin/admin.service';  // Adjust this path to your actual service

describe('SecuritySideNavigationComponent', () => {
  let component: SecuritySideNavigationComponent;
  let fixture: ComponentFixture<SecuritySideNavigationComponent>;
  let httpClientSpy: { get: jasmine.Spy };  

  beforeEach(async () => {
 
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    
    await TestBed.configureTestingModule({
      imports: [
        SecuritySideNavigationComponent,
      ],
      providers: [
        AdminService,  
        { provide: HttpClient, useValue: httpClientSpy } 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SecuritySideNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
