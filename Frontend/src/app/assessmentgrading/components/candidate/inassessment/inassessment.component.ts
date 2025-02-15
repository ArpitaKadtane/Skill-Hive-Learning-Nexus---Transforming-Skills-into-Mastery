import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CanComponentDeactivate } from '../candeactivate.guard';
import { TimerComponent } from '../timer/timer.component';
import { CourseService } from '../../../services/course.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inassessment',
  standalone: true,
  imports: [TimerComponent, CommonModule, FormsModule],
  templateUrl: './inassessment.component.html',
  styleUrl: './inassessment.component.css',
  providers: [CourseService]
})
export class InassessmentComponent implements CanComponentDeactivate, OnInit {

  courseId: number | undefined;
  assessmentID: string | undefined;
  userId: number | undefined;
  assessmentData: any | undefined;
  duration: number | undefined;
  isConfirmLeave: boolean = false;
  userName: string | undefined;
  courseName: string | undefined;
  selectedQuestion: number = 1;


  constructor(private CourseService: CourseService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.courseId = history.state.courseId;
    this.assessmentID = history.state.assessmentID;
    this.userId = history.state.userId;
    this.userName = history.state.userName;
    this.courseName = history.state.courseName;
    this.CourseService.getAssessmentQuestions(history.state.courseId, history.state.assessmentID).subscribe(data => {
      this.assessmentData = data
      this.assessmentData.startAt = new Date();

      if (!localStorage.getItem('assessEndTime')) {
        const now = new Date();
        const futureTime = new Date(now.getTime() + data.scheduledDetails.duration * 60000);
        localStorage.setItem('assessEndTime', futureTime.toString())
      }

      const now = new Date();
      const nowHours = now.getHours();
      const nowMinutes = now.getMinutes();
      const assessEnd = localStorage.getItem('assessEndTime') == null ? "" : localStorage.getItem('assessEndTime');
      if (assessEnd !== null) {
        const date = new Date(assessEnd);
        const endHours = date.getHours();
        const endMinutes = date.getMinutes();
        const totalNowMinutes = nowHours * 60 + nowMinutes;
        const totalEndMinutes = endHours * 60 + endMinutes;
        this.duration = Math.abs(totalEndMinutes - totalNowMinutes);
      }
    }
    )
  }

  canDeactivate(): boolean {
    if (this.isConfirmLeave) {
      return true;
    }
    const confirmDeactivation = confirm('Assessment will be submitted automatically, Are you sure you want to leave this page?');
    if (confirmDeactivation) {
      if (this.courseId && this.assessmentID && this.userId)
        this.onSubmit(this.courseId, this.assessmentID, this.userId);
    }
    return confirmDeactivation;
  }

  onTimerEnd(): void {
    alert('Time is up! Assessment Ends , Congrdulations on completing Assessments');
    if (this.courseId && this.assessmentID && this.userId)
      this.onSubmit(this.courseId, this.assessmentID, this.userId);
  }

  onSubmit(courseId: number, assessmentID: string, userId: number): void {
    if (confirm("are sure you want to submit ? ")) {
      localStorage.removeItem('assessEndTime');
      this.assessmentData.completionAt = new Date();
      this.CourseService.completeAssessment(courseId, assessmentID, userId, this.assessmentData.completionAt, this.assessmentData).subscribe(
        (response) => {
          this.isConfirmLeave = true;
          alert("Assessment Saved Successfully")
          this.router.navigate(['/report'], {
            state: {
              userName: this.userName,
              courseName: this.courseName,
              assessmentData: this.assessmentData,
              courseId: this.courseId
            }
          });
        },
        (error) => {
          console.log(error)
          alert("Oops! Error in saving assessment");
        }
      )
    }

  }

  onChangeQuestions(questionNumber: any): void {
    this.selectedQuestion = questionNumber;
    console.log(this.assessmentData.questions[this.selectedQuestion - 1]);
  }

}
