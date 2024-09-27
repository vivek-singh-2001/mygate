import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticessComponent } from './practicess.component';

describe('PracticessComponent', () => {
  let component: PracticessComponent;
  let fixture: ComponentFixture<PracticessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
