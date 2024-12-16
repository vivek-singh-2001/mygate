import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDetailsComponent } from './family-details.component';
import { MessageService } from 'primeng/api';

describe('FamilyDetailsComponent', () => {
  let component: FamilyDetailsComponent;
  let fixture: ComponentFixture<FamilyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyDetailsComponent],
      providers:[MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
