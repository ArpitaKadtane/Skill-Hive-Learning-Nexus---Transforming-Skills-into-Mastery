import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CloudinaryService } from '../../services/cloudinary.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterapplyBannerComponent } from '../afterapply-banner/afterapply-banner.component';
import { FooterComponent } from '../../../authentication/components/footer/footer.component';

@Component({
  selector: 'app-upload-course',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NgxDropzoneModule,AfterapplyBannerComponent, FooterComponent],
  templateUrl: './upload-course.component.html',
  styleUrl: './upload-course.component.css'
})
export class UploadCourseComponent {
  private courseId!: string;
  private cloudinary = inject(CloudinaryService);
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private routes = inject (Router);


  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId')!;
  } 
  courseForm = new FormGroup({
    teachingDomain: new FormControl('', Validators.required), 
    lecturetitle: new FormControl('', Validators.required),  
    pdfFile: new FormControl(null, Validators.required) 
  });
  
  files: File[] = [];
  uploadedFiles:SafeResourceUrl[] = [];
 onSelect(event:any){
  this.files.push(...event.addedFiles);
 }

 onRemove(event:any){
  this.files.splice(this.files.indexOf(event),1);
 }

 onCancel(){
  this.routes.navigate(['/manage-course', this.courseId]);
 }

 onSubmit(){
if(!this.files[0]){
  alert('Please select a file');
  return;
}

for(let i=0;i<this.files.length;i++){
  const file_data = this.files[i];
  const data = new FormData();
  console.log( "uploading ",file_data);
  data.append('file',file_data);
  data.append('upload_preset','pdf_upload_presets');
  data.append('cloud_name','skillhivec');
  this.cloudinary.uploadImage(data).subscribe({
    next: (response) => {
      console.log(response);
      if (response && response.secure_url) {
        this.uploadedFiles.push(this.sanitizer.bypassSecurityTrustResourceUrl(response.secure_url)); 
        this.storeFileInDB(response.secure_url);
      }
    },
    error: (error) => {
      console.log(error);
    }
  });

  }

}


storeFileInDB(fileUrl: string) {
  this.http.get<any>(`http://localhost:3000/courses/${this.courseId}`).subscribe({
    next: (course) => {
      console.log("chosed course", course);
      const newModule = {
        id: Math.random().toString(36).substring(7), // Generate random ID
        name: this.courseForm.value.lecturetitle, // Get lecture title
        type: "pdf",
        contentUrl: fileUrl, 
        completed: true
      };

      if (!course.modules) {
        course.modules = [];
      }
      course.modules.push(newModule);

      this.http.patch(`http://localhost:3000/courses/${this.courseId}`, { modules: course.modules }).subscribe({
        next: () => {console.log('Module added to Mock JSON Server')
          this.routes.navigate(['/manage-course', this.courseId]);
        }
        ,
        error: (err) => console.error('Error updating JSON Server', err) 
      });
    },
    error: (err) => console.error('Error fetching course', err)
  });
}

}
