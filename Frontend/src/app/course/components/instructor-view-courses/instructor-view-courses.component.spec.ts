import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorViewCoursesComponent } from './instructor-view-courses.component';

describe('InstructorViewCoursesComponent', () => {
  let component: InstructorViewCoursesComponent;
  let fixture: ComponentFixture<InstructorViewCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorViewCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorViewCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
