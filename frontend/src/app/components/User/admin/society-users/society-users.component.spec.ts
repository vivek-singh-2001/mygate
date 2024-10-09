import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyUsersComponent } from './society-users.component';

describe('SocietyUsersComponent', () => {
  let component: SocietyUsersComponent;
  let fixture: ComponentFixture<SocietyUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocietyUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocietyUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
