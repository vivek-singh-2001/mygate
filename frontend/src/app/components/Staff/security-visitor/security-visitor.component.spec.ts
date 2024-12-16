import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityVisitorComponent } from './security-visitor.component';
import { HttpClient } from '@angular/common/http';

describe('SecurityVisitorComponent', () => {
  let component: SecurityVisitorComponent;
  let fixture: ComponentFixture<SecurityVisitorComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    await TestBed.configureTestingModule({
      imports: [SecurityVisitorComponent,
        { provide: HttpClient, useValue: httpClientSpy }, 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
