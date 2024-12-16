import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsComponent } from './chats.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('ChatsComponent', () => {
  let component: ChatsComponent;
  let fixture: ComponentFixture<ChatsComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let ActivatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    await TestBed.configureTestingModule({
      imports: [ChatsComponent],
      providers:[
        { provide: HttpClient, useValue: httpClientSpy }, 
        { provide: ActivatedRoute, useValue: ActivatedRouteSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
