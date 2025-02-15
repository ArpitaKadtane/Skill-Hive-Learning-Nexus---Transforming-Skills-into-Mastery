import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { InstructorService } from '../../../instructor/services/instructor.service';

@Component({
  selector: 'app-admin-view-courses',
  templateUrl: './admin-view-courses.component.html',
  styleUrls: ['./admin-view-courses.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AdminViewCoursesComponent implements OnInit {
  courses: any[] = [];
  instructors: any[] = []; // Store instructors list
  filterInstructor: string = '';
  filterTechnology: string = '';
  filterStatus: string = '';
  selectedCourse: any = null;

  totalCourses: number = 0;
  displayCount: number = 0;

  constructor(private courseService: CourseService, private instructorService: InstructorService) {}

  ngOnInit() {
    this.loadCourses();
    this.fetchInstructors();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe((data: any[]) => {
      const currentDate = new Date();
      this.courses = data.map((course) => {
        const startDate = new Date(course.startDate);
        const endDate = new Date(course.endDate);

        if (currentDate < startDate) {
          course.status = 'Upcoming';
        } else if (currentDate >= startDate && currentDate <= endDate) {
          course.status = 'Ongoing';
        } else {
          course.status = 'Past';
        }

        return course;
      });

      this.totalCourses = this.courses.length;
      this.animateCount();
    });
  }

  fetchInstructors() {
    this.instructorService.getInstructor().subscribe(
      (data) => {
        this.instructors = data;
      },
      (error) => {
        console.error('Error fetching instructors:', error);
      }
    );
  }

  animateCount() {
    let count = 0;
    const interval = setInterval(() => {
      if (count < this.totalCourses) {
        count++;
        this.displayCount = count;
      } else {
        clearInterval(interval);
      }
    }, 50);
  }

  filteredCourses() {
    return this.courses.filter((course) => {
      const matchesInstructor = this.filterInstructor
        ? course.instructor.toLowerCase().includes(this.filterInstructor.toLowerCase())
        : true;

      const matchesTechnology = this.filterTechnology
        ? course.technology.toLowerCase().includes(this.filterTechnology.toLowerCase())
        : true;

      const matchesStatus = this.filterStatus
        ? course.status === this.filterStatus
        : true;

      return matchesInstructor && matchesTechnology && matchesStatus;
    });
  }

  editCourse(course: any) {
    this.selectedCourse = JSON.parse(JSON.stringify(course));
  }

  updateSelectedInstructorName() {
    const selectedInstructor = this.instructors.find(inst => inst.id === this.selectedCourse.instructorId);
    this.selectedCourse.instructor = selectedInstructor ? selectedInstructor.fullName : '';
  }

  updateCourse() {
    if (this.selectedCourse) {
      const currentDate = new Date();
      const startDate = new Date(this.selectedCourse.startDate);
      const endDate = new Date(this.selectedCourse.endDate);

      if (currentDate < startDate) {
        this.selectedCourse.status = 'Upcoming';
      } else if (currentDate >= startDate && currentDate <= endDate) {
        this.selectedCourse.status = 'Ongoing';
      } else {
        this.selectedCourse.status = 'Past';
      }

      this.courseService.updateCourse(this.selectedCourse).subscribe(() => {
        this.loadCourses();
        this.selectedCourse = null;
      });
    }
  }

  cancelEdit() {
    this.selectedCourse = null;
  }

  confirmDelete(course: any) {
    if (confirm(`Are you sure you want to delete the course: ${course.name}?`)) {
      this.deleteCourse(course);
    }
  }

  deleteCourse(course: any) {
    this.courseService.deleteCourse(course.id).subscribe(() => {
      this.loadCourses();
    });
  }
}
