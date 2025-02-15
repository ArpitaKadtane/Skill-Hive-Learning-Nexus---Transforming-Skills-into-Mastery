import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CourseService } from '../../../assessmentgrading/services/course.service';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './upcoming-events.component.html',
  styleUrl: './upcoming-events.component.css'
})
export class UpcomingEventsComponent {

  courses: any[] = [];
  assessments: any[] = [];

  constructor(private courseService: CourseService,private router:Router) {}

  // ngOnInit(): void {
  //   this.courseService.getCourses().subscribe((data) => {
  //     this.courses = data;
  //     this.assessments = this.extractAssessments(data);
  //   });
  // }

  extractAssessments(courses: any[]): any[] {
    let assessments: any[] = [];
    courses.forEach((course) => {
      if (course.assessment) {
        course.assessment.forEach((assess) => {
          assessments.push({
            courseTitle: course.title,
            assessmentName: assess.assessmentName,
            scheduledDuration: assess.schedule?.scheduledDetails?.duration || 'N/A',
            totalQuestions: assess.questions.length,
          });
        });
      }
    });
    console.log(assessments)
    return assessments;
  }
  // currentYear = new Date().getFullYear();
  // currentMonth = new Date().getMonth();
  // selectedDate = new Date().toISOString().split('T')[0];

  // weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // monthNames = [
  //   'January', 'February', 'March', 'April', 'May', 'June',
  //   'July', 'August', 'September', 'October', 'November', 'December'
  // ];

  // tasks = {
  //   '2025-01-21': ['JavaScript Basics Quiz at 10:00 AM', 'Submit Responsive Web Design Project by 6:00 PM'],
  //   '2025-01-26': ['Python Programming Assessment at 3:00 PM', 'Machine Learning: Weekly Quiz at 8:00 PM'],
  //   '2025-02-28': ['Advanced CSS Certification Test at 11:30 AM', 'Web Development Debugging Challenge at 5:00 PM'],
  //   '2025-03-02': ['Data Visualization Challenge at 1:00 PM', 'Complete UX Design Case Study by 11:59 PM'],
  //   '2025-03-10': ['React.js Intermediate Quiz at 9:00 AM', 'Submit API Integration Mini-Project by 5:00 PM'],
  //   '2025-03-12': ['Digital Marketing Live Exam at 7:00 PM'],
  //   '2025-03-15': ['Cloud Computing Certification Assessment at 12:00 PM', 'Complete Git & GitHub Final Quiz by 8:00 PM'],
  //   '2025-03-18': ['DevOps Automation Task Submission by 11:59 PM'],
  //   '2025-03-20': ['Blockchain Technology Final Exam at 10:00 AM', 'Complete Ethical Hacking Assessment by 4:00 PM'],
  //   '2025-03-22': ['AWS Cloud Practitioner Certification Test at 3:00 PM'],
  //   '2025-03-25': ['Kubernetes Mastery Quiz at 5:00 PM'],
  //   '2025-03-28': ['End-of-Course Assessment for Full Stack Development at 9:00 PM']
  // };
  

  // get daysInMonth() {
  //   const days = [];
  //   const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
  //   const numDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
  
  //   for (let i = 0; i < firstDay; i++) {
  //     days.push({ day: '', date: null, hasEvents: false });
  //   }
  
  //   for (let i = 1; i <= numDays; i++) {
  //     const date = new Date(this.currentYear, this.currentMonth, i)
  //       .toLocaleDateString('en-CA');
  //     days.push({ 
  //       day: i, 
  //       date, 
  //       hasEvents: this.tasks[date] ? true : false 
  //     });
  //   }
  
  //   return days;
  // }

  

  // prevMonth() {
  //   this.currentMonth--;
  //   if (this.currentMonth < 0) {
  //     this.currentMonth = 11;
  //     this.currentYear--;
  //   }
  // }

  // nextMonth() {
  //   this.currentMonth++;
  //   if (this.currentMonth > 11) {
  //     this.currentMonth = 0;
  //     this.currentYear++;
  //   }
  // }

  // selectDate(date: string | null) {
  //   if (date) {
  //     this.selectedDate = new Date(date).toISOString().split('T')[0];
  //   }
  // }
  

  // getTasksForSelectedDate() {
  //   return this.tasks[this.selectedDate] || ['No tasks for this day.'];
  // }

  navigateToAssesment(){
    this.router.navigate(['assessmentdash'])
  }
}

