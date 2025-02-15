import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'candidate-view-courses',
  templateUrl: './candidate-view-courses.component.html',
  styleUrls: ['./candidate-view-courses.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class CandidateViewCoursesComponent implements OnInit {
  courses: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.courseService.getCourses().subscribe(
      (data) => {
        this.courses = data;
      },
      () => {
        this.errorMessage = 'Failed to load courses. Please try again later.';
      }
    );
  }

  isEnrolled(course: any): boolean {
    return course.enrolledCandidates?.includes('AnonymousUser');
  }

  enrollInCourse(course: any): void {
    if (this.isEnrolled(course)) {
      this.successMessage = 'You are already enrolled in this course.';
      return;
    }

    const updatedCourse = {
      ...course,
      enrolledCandidates: [...(course.enrolledCandidates || []), 'AnonymousUser'],
    };

    this.courseService.updateCourse(updatedCourse).subscribe(
      () => {
        course.enrolledCandidates = updatedCourse.enrolledCandidates; // Update local state immediately
        this.successMessage = 'Successfully enrolled in the course.';
        this.errorMessage = '';
      },
      () => {
        this.successMessage = '';
        this.errorMessage = 'Failed to enroll in course. Please try again later.';
      }
    );
  }
}
