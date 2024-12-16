import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateHouseComponent } from './allocate-house.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

describe('AllocateHouseComponent', () => {
  let component: AllocateHouseComponent;
  let fixture: ComponentFixture<AllocateHouseComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let ActivatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    await TestBed.configureTestingModule({
      imports: [AllocateHouseComponent],
      providers:[
        { provide: HttpClient, useValue: httpClientSpy }, 
        { provide: ActivatedRoute, useValue: ActivatedRouteSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocateHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
