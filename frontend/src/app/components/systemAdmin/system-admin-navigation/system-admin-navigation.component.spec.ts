import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemAdminNavigationComponent } from './system-admin-navigation.component';
import { HttpClient } from '@angular/common/http';
import { SocietyService } from '../../../services/society/society.Service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { of } from 'rxjs';

describe('SystemAdminNavigationComponent', () => {
  let component: SystemAdminNavigationComponent;
  let fixture: ComponentFixture<SystemAdminNavigationComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    // Create spies for the dependencies
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { paramMap: { get: () => 'test' } } });
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUserData']);

    // Mock the `getUserData` method to return a mock observable
    userServiceSpy.getUserData.and.returnValue(of({ id: 1, name: 'Test User' }));

    await TestBed.configureTestingModule({
      imports: [SystemAdminNavigationComponent],
      providers: [
        SocietyService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemAdminNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
