import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityComponent } from './security.component';
import { HttpClient } from '@angular/common/http';

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    await TestBed.configureTestingModule({
      imports: [SecurityComponent,
        { provide: HttpClient, useValue: httpClientSpy }, 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
