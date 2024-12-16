import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth/auth.service';
import { AppInitializationService } from './services/AppInitialization';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let ActivatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  
  


  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [AuthService, AppInitializationService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ActivatedRoute, useValue: ActivatedRouteSpy },
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });


});
