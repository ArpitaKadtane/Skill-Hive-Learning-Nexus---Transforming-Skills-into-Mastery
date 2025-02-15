import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorAppliedComponent } from './instructor-applied.component';

describe('InstructorAppliedComponent', () => {
  let component: InstructorAppliedComponent;
  let fixture: ComponentFixture<InstructorAppliedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorAppliedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructorAppliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
