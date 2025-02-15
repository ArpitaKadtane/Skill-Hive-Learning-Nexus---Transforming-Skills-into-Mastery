import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructor-view-courses',
  templateUrl: './instructor-view-courses.component.html',
  styleUrls: ['./instructor-view-courses.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class InstructorViewCoursesComponent implements OnInit {
  courses: any[] = [];
  instructorId: string = 'Sandeep';
  errorMessage: string = '';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.courseService.getCoursesByInstructor(this.instructorId).subscribe(
      (data) => {
        this.courses = data;
      },
      () => {
        this.errorMessage = 'Failed to load courses. Please try again later.';
      }
    );
  }

  getStatus(course: any): string {
    const today = new Date();
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);

    if (today < startDate) {
      return 'Upcoming';
    } else if (today >= startDate && today <= endDate) {
      return 'Ongoing';
    } else {
      return 'Completed';
    }
  }
}
