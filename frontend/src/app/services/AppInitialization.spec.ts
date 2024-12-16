import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { AppInitializationService } from './AppInitialization';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { HouseService } from './houses/houseService';
import { AdminService } from './admin/admin.service';
import { ActivatedRoute } from '@angular/router';

describe('AppInitializationService', () => {
  let service: AppInitializationService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let ActivatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        AppInitializationService,
        AuthService,
        UserService,
        HouseService,
        AdminService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ActivatedRoute, useValue: ActivatedRouteSpy },
      ],
    });

    service = TestBed.inject(AppInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
