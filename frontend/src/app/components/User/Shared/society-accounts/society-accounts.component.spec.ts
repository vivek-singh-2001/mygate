import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyAccountsComponent } from './society-accounts.component';

describe('SocietyAccountsComponent', () => {
  let component: SocietyAccountsComponent;
  let fixture: ComponentFixture<SocietyAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocietyAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocietyAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
