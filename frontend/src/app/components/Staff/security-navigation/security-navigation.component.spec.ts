import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityNavigationComponent } from './security-navigation.component';
import { HttpClient } from '@angular/common/http';

describe('SecurityNavigationComponent', () => {
  let component: SecurityNavigationComponent;
  let fixture: ComponentFixture<SecurityNavigationComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    await TestBed.configureTestingModule({
      imports: [SecurityNavigationComponent,
 { provide: HttpClient, useValue: httpClientSpy }, 
      ]
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
