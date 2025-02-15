import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { shortlisted_instructor } from '../../models/shortlisted_instrtuctor.model';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxDropzoneModule],
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css']
})
export class EditProfileModalComponent {

  instructorId: string | null = null;
  instructorData!: shortlisted_instructor;
  files: File[] = [];
  profileData: shortlisted_instructor = {
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
    photoUrl:'',
    Ratings:0,
  };

  constructor(private route: ActivatedRoute, private instructorService: InstructorService, private router: Router, private cloudinary: CloudinaryService) { }

  ngOnInit(): void {
    this.instructorId = this.route.snapshot.paramMap.get('id');
    // console.log(" model ki id", this.instructorId)
    if (this.instructorId) {
      this.getInstructorData(this.instructorId);
    }
  }

  getInstructorData(id: string) {
    this.instructorService.getInstructorById(id).subscribe({
      next: (response) => {
        this.instructorData = response;
        // console.log("mila kuch ", this.instructorData)
        this.populateForm();
      },
      error: (error) => {
        console.error('Error fetching instructor data:', error);
      }
    });
  }

  populateForm() {
    if (this.instructorData) {
      this.profileData = {
        fullName: this.instructorData.fullName ?? '',
        email: this.instructorData.email ?? '',
        teachingDomain: this.instructorData.teachingDomain ?? '',
        upcoming_courses: this.instructorData.upcoming_courses ?? '',
        start_date: this.instructorData.start_date ?? '',
        end_date: this.instructorData.end_date ?? '',
        candidateEnrolled: this.instructorData.candidateEnrolled ?? 0,
        instructorRating: this.instructorData.instructorRating ?? 0,
        assignedCourses: this.instructorData.assignedCourses ?? [],
        about: this.instructorData.about ?? '',
        experience: this.instructorData.experience ?? 0,
        Graduated: this.instructorData.Graduated ?? '',
        languages: this.instructorData.languages ?? [],
        linkedin: this.instructorData.linkedin ?? '',
        location: this.instructorData.location ?? '',
        photoUrl: this.instructorData.photoUrl ?? 'https://img.icons8.com/arcade/64/gender-neutral-user--v2.png',
        Ratings:this.instructorData.Ratings ?? 4.5
      };
    }
  }

  handleSave() {
    if (this.instructorId) {
      if (this.instructorId) {
        if (this.files.length > 0) {
          for (let i = 0; i < this.files.length; i++) {
            const file_data = this.files[i];
            const data = new FormData();
            data.append('file', file_data);
            data.append('upload_preset', 'pdf_upload_presets');
            data.append('cloud_name', 'skillhivec');
    
            this.cloudinary.uploadImage(data).subscribe({
              next: (response) => {
                if (response && response.secure_url) {
                  this.profileData.photoUrl = response.secure_url;
                }
                this.updateInstructorProfile();
              },
              error: (error) => {
                // console.log(error);
              }
            });
          }
        } else {
        
          this.updateInstructorProfile();
        }
      }
    }
  }


  updateInstructorProfile() {
     
    window.alert("updating profile");
        this.instructorService.updateInstructor(this.instructorId, this.profileData).subscribe({
      next: (updatedData) => {
        // console.log('Instructor data updated successfully:', updatedData);
        window.alert('profile updated successfully')
        this.router.navigate([`/profile/${this.instructorId}`]);
      },
      error: (error) => {
        console.error('Error updating instructor data:', error);
      }
    });
  }

  handleClose() {
    this.router.navigate([`/profile/${this.instructorId}`]);
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

}

