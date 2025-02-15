import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorApplyComponent } from './instructor-apply.component';

describe('InstructorApplyComponent', () => {
  let component: InstructorApplyComponent;
  let fixture: ComponentFixture<InstructorApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorApplyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructorApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
