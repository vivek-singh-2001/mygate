import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let ActivatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers:[{ provide: HttpClient, useValue: httpClientSpy }, 
        { provide: ActivatedRoute, useValue: ActivatedRouteSpy },]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
