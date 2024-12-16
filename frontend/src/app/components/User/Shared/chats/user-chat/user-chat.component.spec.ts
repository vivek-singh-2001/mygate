import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChatComponent } from './user-chat.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('UserChatComponent', () => {
  let component: UserChatComponent;
  let fixture: ComponentFixture<UserChatComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let ActivatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;


  beforeEach(async () => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);

    await TestBed.configureTestingModule({
      imports: [UserChatComponent],
      providers:[
        { provide: HttpClient, useValue: httpClientSpy }, 
 { provide: ActivatedRoute, useValue: ActivatedRouteSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
