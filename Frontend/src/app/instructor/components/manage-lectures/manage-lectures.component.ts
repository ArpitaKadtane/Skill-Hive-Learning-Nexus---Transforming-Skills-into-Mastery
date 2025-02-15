import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule
import { AfterapplyBannerComponent } from '../afterapply-banner/afterapply-banner.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Module, Course } from '../../models/course.model';

@Component({
  selector: 'app-manage-lectures',
  standalone: true,
  imports: [CommonModule, AfterapplyBannerComponent, RouterLink], // ✅ Add CommonModule here
  templateUrl: './manage-lectures.component.html',
  styleUrl: './manage-lectures.component.css'
})
export class ManageLecturesComponent {
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedModuleId!: string;
  public courseId!: string;
  public modules: Module[] = [];
  public course!: Course;
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId')!;
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.modules = course.modules;
        // console.log('Modules fetched:', this.modules[0]);
      }
    });
  }

  deleteModule(courseId: string, moduleId: string) {
    const permission = confirm('Are you sure you want to delete this module?');
    if (!permission) {
      // console.log('User cancelled the operation');
      return;
    }
    this.courseService.getCourseById(courseId).subscribe({
      next: (course: Course) => {
        course.modules = course.modules.filter(module => module.id !== moduleId);
        this.courseService.updateCourse(courseId, course).subscribe({
          next: (course) => {
            this.course = course;
          }
        });
      }
    });
  }

  openFileUploadDialog(moduleId: string) {
    this.selectedModuleId = moduleId;
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  reuploadModule(event: any) {
    const file = event.target.files[0];
    if (!file || !this.selectedModuleId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'pdf_upload_presets'); // Cloudinary preset

    fetch('https://api.cloudinary.com/v1_1/skillhivec/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        const newUrl = data.secure_url;
        this.updateModuleContent(this.selectedModuleId, newUrl);
      })
      .catch(error => console.error('Upload failed:', error));
  }

  updateModuleContent(moduleId: string, newUrl: string) {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course: Course) => {
        const module = course.modules.find(m => m.id === moduleId);
        if (module) {
          module.contentUrl = newUrl;

          this.courseService.updateCourse(this.courseId, course).subscribe({
            next: () => {
              this.modules = [...course.modules];
              alert('Module updated successfully');
            },
            error: (err) => console.error('Error updating module:', err)
          });
        }
      }
    });
  }
  
  downloadModule(contentUrl: string) {
    const link = document.createElement('a');
    link.href = contentUrl;
    link.setAttribute('download', 'CourseMaterial.pdf'); // Suggests a file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}