import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemAdminComponent } from './system-admin.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { of } from 'rxjs';

describe('SystemAdminComponent', () => {
  let component: SystemAdminComponent;
  let fixture: ComponentFixture<SystemAdminComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    // Create spies for dependencies
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { paramMap: { get: () => 'test' } } });
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUserData', 'getCurrentUser']);

    // Mock return values
    userServiceSpy.getUserData.and.returnValue(of({ id: 1, name: 'Test User' }));
    userServiceSpy.getCurrentUser.and.returnValue(of({ id: 1, name: 'Test User' }));

    await TestBed.configureTestingModule({
      imports: [SystemAdminComponent],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
