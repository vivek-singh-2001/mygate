import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingUserComponent } from './pending-user.component';
import { HttpClient } from '@angular/common/http';

describe('PendingUserComponent', () => {
  let component: PendingUserComponent;
  let fixture: ComponentFixture<PendingUserComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    await TestBed.configureTestingModule({
      imports: [PendingUserComponent,
      ],
      providers:[
        { provide: HttpClient, useValue: httpClientSpy }, 

      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
