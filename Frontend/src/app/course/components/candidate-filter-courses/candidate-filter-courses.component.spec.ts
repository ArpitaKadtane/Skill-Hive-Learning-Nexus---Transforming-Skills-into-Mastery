import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateFilterCourses } from './candidate-filter-courses.component';

describe('CandidateFilterCourses', () => {
  let component: CandidateFilterCourses;
  let fixture: ComponentFixture<CandidateFilterCourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateFilterCourses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateFilterCourses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
