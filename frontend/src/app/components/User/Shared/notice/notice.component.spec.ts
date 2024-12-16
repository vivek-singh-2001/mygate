import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeComponent } from './notice.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('NoticeComponent', () => {
  let component: NoticeComponent;
  let fixture: ComponentFixture<NoticeComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let ActivatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);


    await TestBed.configureTestingModule({
      imports: [NoticeComponent],
      providers:[
        { provide: HttpClient, useValue: httpClientSpy }, 
        { provide: ActivatedRoute, useValue: ActivatedRouteSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
