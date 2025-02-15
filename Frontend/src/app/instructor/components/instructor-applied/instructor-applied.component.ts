import { Component, inject, OnInit } from '@angular/core';
import { InstructorService } from '../../services/instructor.service';
import { CommonModule } from '@angular/common';
import { shortlisted_instructor } from '../../models/shortlisted_instrtuctor.model';
import { AfterapplyBannerComponent } from '../afterapply-banner/afterapply-banner.component';

@Component({
  selector: 'app-instructor-applied',
  standalone: true,
  imports: [CommonModule, AfterapplyBannerComponent],
  templateUrl: './instructor-applied.component.html',
  styleUrls: ['./instructor-applied.component.css'],
})
export class InstructorAppliedComponent implements OnInit {
  private instructorService = inject(InstructorService);

  instructors: any[] = [];

  ngOnInit(): void {

    this.instructorService.getInstructor().subscribe({
      next: (data) => {
        this.instructors = data;
        // console.log('Instructors fetched:', this.instructors);
      },
      error: (error) => {
        // console.log('Error fetching instructors:', error);
      },
    });
  }

  rejectInstructor(id: number): void {
    this.instructors = this.instructors.filter((instructor) => instructor.id !== id);

    this.instructorService.deleteInstructor(id).subscribe({
      next: () => {
        // console.log(`Instructor with ID ${id} removed successfully`);
      },
      error: (error) => {
        // console.log('Error removing instructor:', error);
      },
    });
  }

  shortlistInstructor(instructor: any): void {

    const shortlistedInstructor: shortlisted_instructor = {
      fullName: instructor.fullName,
      email: instructor.email,
      teachingDomain: instructor.teachingDomain,
      upcoming_courses: instructor.upcomingCourses || 'Angular Complete Guide',
      start_date: instructor.start_date || '24-12-23',
      end_date: instructor.end_date || '24-10-14',
      candidateEnrolled: instructor.candidateEnrolled || 47,
      instructorRating: instructor.instructorRating || 4.5,
      assignedCourses: instructor.assignedCourses || [],
      about: instructor.about || 'Passionate developer with expertise in Angular.',
      experience: instructor.experience || 5,
      linkedin: instructor.linkedin || 'https://www.linkedin.com/',
      location: instructor.location || 'New York',
      languages: instructor.languages || 'English',
      Graduated: instructor.graduated || 'MIT',
      photoUrl: instructor.photoUrl || 'https://img.icons8.com/arcade/64/gender-neutral-user--v2.png',
      Ratings: 0
    };


    this.instructorService.addToShortlisted(shortlistedInstructor).subscribe({
      next: () => {
        this.rejectInstructor(instructor.id)
      }
    })





    //       this.instructorService.addToShortlisted(shortlistedInstructor).subscribe({
    //         next: () => {
    //           console.log(`Instructor with ID ${instructor.id} shortlisted successfully`);

    //         },
    //         error: (error) => {
    //           console.log('Error shortlisting instructor:', error);
    //         },
    //       });
    //     },
    //     error: (error) => {
    //       console.log('Error fetching shortlisted instructors:', error);
    //     }
    //   });
    // }

    // Update the status of an instructor
    // updateStatus(instructor: any, status: string): void {
    //   if (instructor.status === status) {
    //     console.log(`Instructor with ID ${instructor.id} already has the status '${status}'`);
    //     return; // No need to update if status is the same
    //   }

    //   instructor.status = status; // Update the local status
    //   this.instructorService.updateInstructorStatus(instructor.id, status).subscribe({
    //     next: () => {
    //       console.log(`Instructor with ID ${instructor.id} status updated to ${status}`);
    //     },
    //     error: (error) => {
    //       console.log('Error updating instructor status:', error);
    //     },
    //   });
    // }

    // trackByInstructorId(index: number, instructor: any): number {
    //   return instructor.id; // Helps with efficient rendering of instructors
    // }
  }
}
