import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityVisitorComponent } from './security-visitor.component';

describe('SecurityVisitorComponent', () => {
  let component: SecurityVisitorComponent;
  let fixture: ComponentFixture<SecurityVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityVisitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
