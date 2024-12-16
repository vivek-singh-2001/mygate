import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentComponent } from './apartment.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

describe('ApartmentComponent', () => {
  let component: ApartmentComponent;
  let fixture: ComponentFixture<ApartmentComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let ActivatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;


  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    await TestBed.configureTestingModule({
      imports: [ApartmentComponent],
      providers: [

        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ActivatedRoute, useValue: ActivatedRouteSpy },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ApartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
