import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRoleComponent } from './assign-role.component';
import { HttpClient } from '@angular/common/http';

describe('AssignRoleComponent', () => {
  let component: AssignRoleComponent;
  let fixture: ComponentFixture<AssignRoleComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    await TestBed.configureTestingModule({
      imports: [AssignRoleComponent,
      ],
      providers:[
        { provide: HttpClient, useValue: httpClientSpy },

      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssignRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
