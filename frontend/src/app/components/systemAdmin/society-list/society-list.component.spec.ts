import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyListComponent } from './society-list.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('SocietyListComponent', () => {
  let component: SocietyListComponent;
  let fixture: ComponentFixture<SocietyListComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let ActivatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    await TestBed.configureTestingModule({
      imports: [SocietyListComponent],
      providers:[
        { provide: HttpClient, useValue: httpClientSpy }, 
        { provide: ActivatedRoute, useValue: ActivatedRouteSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocietyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
