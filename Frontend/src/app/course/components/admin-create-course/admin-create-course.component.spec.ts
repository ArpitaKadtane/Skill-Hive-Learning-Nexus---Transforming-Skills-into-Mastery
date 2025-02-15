import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateCourseComponent } from './admin-create-course.component';

describe('AdminCreateCourseComponent', () => {
  let component: AdminCreateCourseComponent;
  let fixture: ComponentFixture<AdminCreateCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
