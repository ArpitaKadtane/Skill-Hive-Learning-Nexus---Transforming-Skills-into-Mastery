import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import { ActivatedRoute } from '@angular/router';
import { shortlisted_instructor } from '../../models/shortlisted_instrtuctor.model';
import { InstructorService } from '../../services/instructor.service';
import { error } from 'console';
import { CourseService } from '../../../course/services/course.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, EditProfileModalComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  
  coursesIds =[];
  instructorId: string | null = null;
  instructordetails: shortlisted_instructor = {
    fullName: '',
    email: '',
    teachingDomain: '',
    upcoming_courses: '',
    start_date: '',
    end_date: '',
    candidateEnrolled: 0,
    instructorRating: 0,
    assignedCourses: [],
    about: '',
    experience: 0,
    linkedin: '',
    location: '',
    Graduated: '',
    languages: [],
    photoUrl: '',
    Ratings: 0,
  };
  constructor(private route: ActivatedRoute, private instructorService: InstructorService, private courseServie : CourseService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.instructorId = params.get('id'); // Get ID from route parameters
      // console.log('Instructor ID:', this.instructorId);
    });

    this.instructorService.getInstructorById(this.instructorId).subscribe({
      next: (instructordata) => {
        this.instructordetails = instructordata;
      },
      error: (error) => {
        // console.log("error while fetching instructor detiails", error)
      }
    });
    
    this.instructorService.getInstructorById(this.instructorId).subscribe({
      next:(instructorData)=>{
        var avg_rating = 0;
        for( var i=0; i< instructorData.assignedCourses.length;i++){
          this.coursesIds.push(instructorData.assignedCourses[i].id);
        }
        for(var i=0;i< this.coursesIds.length;i++){
          this.courseServie.getCourseById(this.coursesIds[i]).subscribe({
            next:(course)=>{
              if(course.avgRating){                
                 avg_rating = avg_rating + course.avgRating;
              }
            },
            error:(err)=>{
              // console.log("error inside the loop of fetchibng the courese for removing instrtor fielod",err)
            }
          })
        }
        
        this.instructordetails.Ratings = avg_rating/this.coursesIds.length;
      },
      error:(err)=>{
        // console.log("error while fteching instructorid for deleting the instructor", err);
      },
    })
  }



  isModalOpen = true;
  profileData = {
    name: 'John Doe',
    title: 'Software Engineer',
    location: 'New York',
    about: 'Passionate developer with expertise in Angular.'
  };

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleSave(updatedProfile: any) {
    this.profileData = updatedProfile;
    this.isModalOpen = false;
  }
}
