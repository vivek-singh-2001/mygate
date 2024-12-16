import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user/user.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;
  let ActivatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);

    Object.defineProperty(userServiceSpy, 'userRoles$', {
      get: jasmine.createSpy().and.returnValue(of(['systemAdmin'])), // mock the observable directly
    });

    

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: ActivatedRouteSpy },
        { provide: UserService, useValue: userServiceSpy },

      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and navigate correctly', () => {
    const mockLoginResponse = { token: 'mock_token' };
    const mockUserResponse = { data: { Houses: [] } };

    ActivatedRouteSpy = {
      queryParams: of(mockLoginResponse), // Mock observable
    } as any;
  

    httpClientSpy.post.and.returnValue(of(mockLoginResponse));
    userServiceSpy.getCurrentUser.and.returnValue(of(mockUserResponse));

    service.login('test@example.com', 'password').subscribe(() => {
      expect(localStorage.getItem('authToken')).toBe('mock_token');
      expect(localStorage.getItem('isLoggedIn')).toBe('true');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/systemAdmin']);
    });

    expect(httpClientSpy.post).toHaveBeenCalledWith(
      `${service['apiUrl']}/login`,
      { email: 'test@example.com', password: 'password' }
    );
  });
  

  it('should handle Google login callback and navigate correctly', fakeAsync(() => {
    const mockParams = { token: 'mock_token' };
    const mockUserResponse = { data: { Houses: [] } };
  
    ActivatedRouteSpy = {
      queryParams: of(mockParams),
    } as any;
  
    userServiceSpy.getCurrentUser.and.returnValue(of(mockUserResponse));
  
    service.handleGoogleLoginCallback();
    tick(); 
  
    expect(localStorage.getItem('authToken')).toBe('mock_token');
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/systemAdmin'], { replaceUrl: true });
  }));
  
  

  it('should log out and navigate to login', () => {
    httpClientSpy.post.and.returnValue(of(null));
  
    service.logout();
  
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(httpClientSpy.post).toHaveBeenCalledWith(`${service['apiUrl']}/logout`, {});
  });

  it('should validate token correctly', () => {
    const validToken = 'header.' + btoa(JSON.stringify({ exp: (Date.now() / 1000) + 3600 })) + '.signature';
    const expiredToken = 'header.' + btoa(JSON.stringify({ exp: (Date.now() / 1000) - 3600 })) + '.signature';
  
    localStorage.setItem('authToken', validToken);
    expect(service.isTokenValid()).toBeTrue();
  
    localStorage.setItem('authToken', expiredToken);
    expect(service.isTokenValid()).toBeFalse();
  });


  
  
  afterEach(() => {
    // Cleanup if needed
  });
});
