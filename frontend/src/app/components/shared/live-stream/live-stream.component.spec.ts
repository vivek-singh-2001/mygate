import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveStreamComponent } from './live-stream.component';
import { HttpClient } from '@angular/common/http';

describe('LiveStreamComponent', () => {
  let component: LiveStreamComponent;
  let fixture: ComponentFixture<LiveStreamComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);

    await TestBed.configureTestingModule({
      imports: [LiveStreamComponent,
      
      ],
      providers:[
        { provide: HttpClient, useValue: httpClientSpy }, 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
