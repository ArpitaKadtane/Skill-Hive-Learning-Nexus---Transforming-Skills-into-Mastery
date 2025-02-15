import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { InstructorService } from '../../../instructor/services/instructor.service';

@Component({
  selector: 'app-admin-create-course',
  templateUrl: './admin-create-course.component.html',
  styleUrls: ['./admin-create-course.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminCreateCourseComponent implements OnInit {
  instructors: any[] = [];

  course = {
    id: this.generateId(),
    name: '',
    startDate: '',
    endDate: '',
    technology: '',
    status: '',
    instructorId: '',  // Optional
    instructor: '',  // Store instructor's name
    thumbnail: '',
    enrolledCandidates: [],
    assessment: []
  };

  constructor(private courseService: CourseService, private instructorService: InstructorService) {}

  ngOnInit(): void {
    this.fetchInstructors();
    this.course.instructor='';
  }

  fetchInstructors(): void {
    this.instructorService.getInstructor().subscribe(
      (data) => {
        this.instructors = data;
      },
      (error) => {
        console.error('Error fetching instructors:', error);
      }
    );
  }

  updateInstructorName(): void {
    console.log("Changed");
    const selectedInstructor = this.instructors.find(inst => inst.id === this.course.instructorId);
    this.course.instructor = selectedInstructor ? selectedInstructor.fullName : '';
  }

  onSubmit(): void {
    this.updateStatus();
    this.courseService.createCourse(this.course).subscribe(() => {
      alert('Course created successfully!');
    });
  }

  updateStatus(): void {
    const currentDate = new Date();
    const startDate = new Date(this.course.startDate);
    const endDate = new Date(this.course.endDate);

    if (currentDate < startDate) {
      this.course.status = 'Upcoming';
    } else if (currentDate >= startDate && currentDate <= endDate) {
      this.course.status = 'Ongoing';
    } else if (currentDate > endDate) {
      this.course.status = 'Past';
    } else {
      this.course.status = '';
    }
  }

  private generateId(): string {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `C-${randomNum}`;
  }
}
