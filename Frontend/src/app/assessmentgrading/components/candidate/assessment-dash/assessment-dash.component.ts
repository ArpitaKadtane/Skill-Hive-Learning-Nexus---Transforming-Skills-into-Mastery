import { Component } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CandidateService } from '../../../../candidates/services/candidate.service';

@Component({
  selector: 'app-assessment-dash',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assessment-dash.component.html',
  styleUrl: './assessment-dash.component.css',
  providers: [CourseService]
})

export class AssessmentDashComponent {
  user: any;
  userId: any;
  userName;
  selectedCourse: any;
  candidateAssessment: any[];

  constructor(private CourseService: CourseService, private router: Router, private candidateService:CandidateService) {}

  ngOnInit(): void {
    this.userId = this.candidateService.getUserId();
    this.userName = this.candidateService.getUserName();
  
    this.CourseService.getCandidate(this.userId).subscribe(data => {
      this.user = data;
      // console.log(this.user);
  
      if (this.user?.enrolledCourses && this.user?.enrolledCourses.length > 0) {
        this.selectedCourse = this.user?.enrolledCourses[0]; // Select the first course by default
        this.checkCourseCompletion(this.selectedCourse.courseId); // ✅ Check completion status
        this.loadAssessmentData(this.selectedCourse.courseId);
      } else {
        // console.log("No enrolled courses found.");
        this.selectedCourse = null;
        this.candidateAssessment = [];
      }
    });
  }
  
  // ✅ Function to check if course is completed in localStorage
  checkCourseCompletion(courseId: string) {
    const completedCourses = JSON.parse(localStorage.getItem('completed') || '[]');
    if (completedCourses.includes(courseId)) {
      // console.log(`Course ${courseId} is completed.`);
      this.selectedCourse.isCompleted = true;
    } else {
    //   console.log(`Course ${courseId} is NOT completed.`);
      this.selectedCourse.isCompleted = false;
    }
  }
  
  // ✅ Modify course selection to check completion status
  courseSelected(course: any) {
    this.selectedCourse = course;
    this.checkCourseCompletion(course.courseId);
    this.loadAssessmentData(course.courseId);
  }
  

  // ✅ Function to load assessments for a selected course
// Load assessments only if the course is completed
loadAssessmentData(courseId: string): void {
  if (!this.selectedCourse?.isCompleted) {
    this.candidateAssessment = []; // Clear previous data
    return;
  }

  this.CourseService.getAssessmentDetails(courseId).subscribe(data => {
    if (Array.isArray(data)) {
      const isActive = this.selectedCourse?.assessmentStatus === false && this.selectedCourse?.completionPercentage === 100;
      const isCompleted = this.selectedCourse?.assessmentStatus;

      this.candidateAssessment = data.map((assessment: any) => ({
        ...assessment, isActive, isCompleted
      }));
    } else {
      this.candidateAssessment = [];
    }
  });
}



  // ✅ Attempt Assessment
  attemptAssessment(assessmentID: string) {
    this.CourseService.canAttempt(this.userId, this.selectedCourse.courseId , assessmentID).subscribe(data => {
      if (data) {
        if (confirm("Are you sure?")) {
          this.router.navigate(['/insideassessment'], {
            state: {
              courseId: this.selectedCourse.courseId,
              userId: this.userId,
              assessmentID: assessmentID,
              userName: this.userName,
              courseName: this.selectedCourse.title
            }
          });
        }
      } else {
        alert("You can't reattempt the assessment");
      }
    });
  }

  // ✅ Review Assessment
  reviewAssessment(assessmentID: string) {
    const selectedCourseData = this.user?.enrolledCourses?.find((data: any) => data.courseId === this.selectedCourse.courseId);

    if (selectedCourseData?.assessmentData) {
      const assessment = selectedCourseData.assessmentData.find((data: any) => data.assessmentID === assessmentID);
      
      if (!assessment) {
        alert("You did not complete the assessment");
      } else {
        this.router.navigate(['/report'], {
          state: {
            userName: this.userName,
            courseName: selectedCourseData.title,
            courseId :  this.selectedCourse.courseId,
            assessmentData: selectedCourseData.assessmentData[0]?.assessmentData,
          }
        });
      }
    } else {
      alert("You did not complete the assessment");
    }
  }
}
