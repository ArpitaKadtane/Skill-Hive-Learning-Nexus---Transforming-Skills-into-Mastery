import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CandidateService } from '../../services/candidate.service';


@Component({
  selector: 'app-track-my-learning',
  templateUrl: './track-my-learning.component.html',
  styleUrls: ['./track-my-learning.component.css'],
  standalone: true,
  imports: [CommonModule]

})
export class TrackMyLearningComponent implements OnInit {
  private apiUrl = 'http://localhost:3000/courses';
  totalEnrolledCourses: number;
  completedCourses: number;
  hoursSpent: number;
  overallPerformance: number;
  candidateEmail: any = '';
  courses: any[] = [];
  filteredCourses: any[] = [];

  constructor(private http: HttpClient, private router: Router, private candidateService: CandidateService) { }

  ngOnInit(): void {
    this.candidateEmail = this.candidateService.getUserEmail();
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.filteredCourses = data.filter((course) =>
          course.enrolledCandidates.includes(this.candidateEmail),
        );
        // console.log('Filtered Courses:', this.filteredCourses);

        this.totalEnrolledCourses = this.filteredCourses.length;

        // Calculate completed courses
        this.completedCourses = this.filteredCourses.filter(course =>
          this.getProgress(course) === 100
        ).length;

        this.overallPerformance = this.totalEnrolledCourses > 0
          ? Math.round((this.completedCourses / this.totalEnrolledCourses) * 100)
          : 0;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  calculateAssessmentScore(course: any): any {
    const userId = localStorage.getItem('candidateId');
    const assessment = course.assessment?.[0]; // Assuming one assessment per course
    
    if (!assessment || !assessment.assessmentCompletions) return '--';
  
    const userCompletion = assessment.assessmentCompletions.find(
      (completion: any) => completion.userId === userId
    );
  
    if (!userCompletion || !userCompletion.assessmentData) return '--';
  
    const totalQuestions = userCompletion.assessmentData.questions.length;
    let correctAnswers = 0;
  
    userCompletion.assessmentData.questions.forEach((question: any) => {
      // console.log(question.userAnswer)
      if (question.userAnswer === question.answer) {
        correctAnswers++;
      }
    });
      return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  }
  



  navigateCourse(courseid: any) {
    this.router.navigate([`candidate/course-view/${courseid}`])
  }

  calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return `${daysDiff} Days`;
  }

  getProgress(course: any): number {
    if (!course.modules || course.modules.length === 0) return 0;
  
    const userEmail = this.candidateEmail; // Get logged-in user's email
    const userProgress = course.userProgress?.[userEmail]; // Check user progress
    
    if (!userProgress || !userProgress.completedModules) return 0;
  
    const completedModules = userProgress.completedModules.length;
    const totalModules = course.modules.length;
  
    return Math.round((completedModules / totalModules) * 100);
  }
  

}
