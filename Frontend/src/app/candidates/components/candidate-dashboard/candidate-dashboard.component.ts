import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Ensure Router and RouterModule are imported
import { HeaderComponent } from '../header/header.component'; // Import HeaderComponent
import { FooterComponent } from '../footer/footer.component'; // Import FooterComponent
import { CandidateService } from '../../services/candidate.service';
import { response } from 'express';
import { error } from 'console';
import { SideMenuComponent } from "../../../side-menu/side-menu.component";
import { UpdateProfileComponent } from "../update-profile/update-profile.component";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent,FooterComponent],
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.css'] // Corrected here
})
export class CandidateDashboardComponent implements OnInit {
  candidateName: string | null = '';
  activeTab: string = 'enrollCourse';
  userProfile: any;
  private apiUrl = 'http://localhost:3000/courses';
  enrolledCourses : any =[];

  candidateEmail;

  constructor(private router: Router,private candidateservice:CandidateService,private http: HttpClient) {}

  ngOnInit() {
    this.candidateEmail = this.candidateservice.getUserEmail();
    this.fetchCourses();
    if (typeof window !== 'undefined' && window.localStorage) {
      const loggedIn = localStorage.getItem('loggedIn');
      if (loggedIn !== 'true') {
        this.router.navigate(['/login']);
      } else {
        this.candidateservice.getAdditionalDetailsByEmail(localStorage.getItem('candidateEmail')).subscribe(
          (response)=>{
            this.userProfile = response?.profilePicture
          },
          (error)=>{
            // console.log(error)
          }
        )
        this.candidateName = localStorage.getItem('candidateName');
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
          this.activeTab = savedTab;  // Set the active tab from localStorage
        }
      }
    } else {
      // Handle the case where localStorage is not available
      console.warn('localStorage is not available.');
    }
  }

  fetchCourses(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.enrolledCourses = data.filter((course) =>
          course?.enrolledCandidates?.includes(this.candidateEmail)
        );
        // console.log('Enrolled Courses:', this.enrolledCourses);
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  scrollCourses(direction:any) {
    const container = document.getElementById('coursesContainer');
    const scrollAmount = 300 + 20; // Card width (500px) + gap (20px)
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
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
  
  

  
  navigateToCourse(courseid:any){
    this.router.navigate([`candidate/course-view/${courseid}`])
  }


  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
    localStorage.setItem('activeTab', tabName);  // Save the active tab to localStorage
  }
}
