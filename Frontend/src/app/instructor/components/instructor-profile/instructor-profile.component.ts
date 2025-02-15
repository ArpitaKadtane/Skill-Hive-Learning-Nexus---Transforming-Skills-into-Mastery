import { Component, inject, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InstructorService } from '../../services/instructor.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { shortlisted_instructor } from '../../models/shortlisted_instrtuctor.model';
import { catchError, forkJoin, throwError } from 'rxjs';
import { error, log } from 'console';
import { AuthService } from '../../../authentication/services/auth.service';




@Component({
  selector: 'app-instructor-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './instructor-profile.component.html',
  styleUrl: './instructor-profile.component.css'
})
export class InstructorProfileComponent implements OnInit {

  instructorId !: string;
  allCourses: any[] = [];
  unassignedCourses: any[] = [];
  alreadyAssginedCourses: any[] = [];
  selectedCourseId!: string;
  // selectedInstructorName!:string;
  instructorProfileDetails!: shortlisted_instructor;

  isAdmin: boolean = false;
  isInstructor: boolean = false;

  loginData = {
    islogged: false,
    user: null,
    name: null,
    email: null,
    id: null,
  };
  private route = inject(ActivatedRoute);
  private instructorService = inject(InstructorService);
  private courseService = inject(CourseService);
  private router = inject(Router);

  constructor(public authService: AuthService,) {
    if (this.authService.isAuthenticated() !== null) {
      this.loginData = this.authService.isAuthenticated();
    }
  }

  ngOnInit() {
    const idparm = this.route.snapshot.paramMap.get('id');
    if (idparm) {
      this.instructorId = idparm;
    }
    if (!idparm) {
      console.error('no instructor id provided');
      return;
    }

    if (this.loginData.user === 'admins') {
      this.isAdmin = true;
    } else if (this.loginData.user === 'instructors') {
      this.isInstructor = true;
    }


    this.fetchallCourses();
    this.fetchAssignedCourses();
  }

  fetchAssignedCourses() {
    this.instructorService.getInstructorById(this.instructorId).subscribe({
      next: (instructor) => {
        this.instructorProfileDetails = instructor;
        this.alreadyAssginedCourses = instructor.assignedCourses;
        // console.log(this.alreadyAssginedCourses);
      },
      error: (err) => {
        // console.log("error while fetching instructor by id", err);
      }
    })
  }

  fetchallCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.allCourses = data;
        this.unassignedCourses = this.allCourses.filter((course) => !course.instructor);
      },
      error: (err) => {
        // console.log("error while fetching the courses", err)
      }
    })
  }

  assignCourse() {

    if (!this.isAdmin)
      return;

    const courseIndex = this.unassignedCourses.findIndex((course) => course.id === this.selectedCourseId);
    if (courseIndex > -1) {
      const course = this.unassignedCourses[courseIndex];

      const updatedCourse = { ...course, instructor: this.instructorProfileDetails.fullName, instructorId:this.instructorId };

      this.alreadyAssginedCourses.push(course);
      this.unassignedCourses.splice(courseIndex, 1);

      //updating course array in the backend

      this.courseService.updateCourse(course.id, updatedCourse).subscribe({
        error: (err) => {
          // console.log(" error updating the course", err);
          return;
        }
      })

      // updating instructor also

      const updatedInstructor: shortlisted_instructor = {
        ...this.instructorProfileDetails,
        assignedCourses: this.alreadyAssginedCourses
      }

      this.instructorService.updateInstructor(this.instructorId, updatedInstructor).subscribe({
        error: (err) => {
          // console.log('error while updating the instructor assigned course array', err);
        }
      })
      this.selectedCourseId = '';
    }
  }


  deleteCourse(courseId: string) {

    if (!this.isAdmin)
      return;

    const courseToUnassign = this.alreadyAssginedCourses.find(course => course.id === courseId);
    // console.log(courseToUnassign);
    if (!courseToUnassign) {
      return;
    }
    const updatedCourse: any = {
      id: courseToUnassign.id,
      courseId: courseToUnassign.courseId,
      name: courseToUnassign.name,
      startDate: courseToUnassign.startDate,
      endDate: courseToUnassign.endDate,
      technology: courseToUnassign.technology,
      status: courseToUnassign.status,
      instructor: "",
      modules: courseToUnassign.modules,
      thumbnail: courseToUnassign.thumbnail,
      assessment: courseToUnassign?.assessment,
      feedback: courseToUnassign.feedback,
      avgRating: "",
      enrolledCandidates: courseToUnassign?.enrolledCandidates,
      isEnrolled: courseToUnassign?.isEnrolled
      // Set to empty string instead of null since instructor is of type string
    };

    this.alreadyAssginedCourses = this.alreadyAssginedCourses.filter(course => course.id !== courseId);
    this.unassignedCourses = [...this.unassignedCourses, updatedCourse];

    forkJoin({
      courseUpdate: this.courseService.updateCourse(courseId, updatedCourse),
      instructorUpdate: this.instructorService.updateInstructor(this.instructorId, { ...this.instructorProfileDetails, assignedCourses: this.alreadyAssginedCourses })
    }).pipe(catchError(error => {
      this.alreadyAssginedCourses = [...this.alreadyAssginedCourses, courseToUnassign];
      this.unassignedCourses = this.unassignedCourses.filter(course => course.id !== courseId);
      return throwError(() => error);
    })).subscribe({
      next: () => {
        // console.log('course successfully unassigned from instructor');
      },
      error: (err) => {
        console.error('error unassigning course', err);
      }
    })
  }

  deleteInstructor(instructorId: string) {

    if (!this.isAdmin)
      return;

    this.instructorService.getInstructorById(instructorId).subscribe({
      next: (instructorData) => {
        const coursesId = [];

        for (var i = 0; i < instructorData.assignedCourses.length; i++) {
          coursesId.push(instructorData.assignedCourses[i].id);
        }
        for (var i = 0; i < coursesId.length; i++) {
          this.courseService.getCourseById(coursesId[i]).subscribe({
            next: (course) => {
              const updatedcourse = course
              updatedcourse.instructor = '';
              this.courseService.updateCourse(course.id, updatedcourse).subscribe({
                next: () => {
                  // console.log("successin updating the course instructor");
                },
                error: (err) => {
                  // console.log("erro in updating the course instructor")
                }
              })
            },
            error: (err) => {
              // console.log("error inside the loop of fetchibng the courese for removing instrtor fielod", err)
            }
          })
        }
      },
      error: (err) => {
        // console.log("error while fteching instructorid for deleting the instructor", err);
      },
    })
    this.instructorService.deleteShortlistedInstructor(instructorId).subscribe({
      next: () => {
        // console.log(`${instructorId} has been deleted successfully`)
        this.router.navigate(['./available-tutors'])
      },
      error: (err) => {
        // console.log("error during deleting sortlisted instructor", err);
      }
    })
  }
}
