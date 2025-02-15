import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InstructorService } from '../../../services/instructor.service';
import { BeforApplyBannerComponent } from '../../befor-apply-banner/befor-apply-banner.component';
import { NewsletterComponent } from '../../newsletter/newsletter.component';
import { CloudinaryService } from '../../../services/cloudinary.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { finalize } from 'rxjs/operators';

interface FormErrors {
  [key: string]: string;
}

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    BeforApplyBannerComponent,
    NewsletterComponent,
    NgxDropzoneModule
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.css',
})
export class RegistrationFormComponent {
  files: File[] = [];
  uploadedFiles: SafeResourceUrl[] = [];
  isSubmitting = false;
  formErrors: FormErrors = {};

  instructorForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z\s]*$/),
    ]),
    contactNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{10,15}$/),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    experience: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(50),
    ]),
    teachingDomain: new FormControl('', [
      Validators.required,
    ]),
    specialization: new FormControl('', [
      Validators.required,
    ]),
    degree: new FormControl('', [
      Validators.required
    ]),
    certifications: new FormControl(''), 
    resume: new FormControl(null)
  });

  private instructorservice = inject(InstructorService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private cloudinary = inject(CloudinaryService);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    // Subscribe to form value changes to show real-time validation
    this.instructorForm.valueChanges.subscribe(() => {
      this.validateForm();
    });
  }

  validateForm(): boolean {
    this.formErrors = {};
    
    if (this.instructorForm.invalid) {
      Object.keys(this.instructorForm.controls).forEach(key => {
        const control = this.instructorForm.get(key);
        if (control?.errors) {
          if (control.errors['required']) {
            this.formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
          } else if (control.errors['pattern']) {
            switch (key) {
              case 'fullName':
                this.formErrors[key] = 'Name should only contain letters';
                break;
              case 'contactNumber':
                this.formErrors[key] = 'Contact number should be 10-15 digits';
                break;
              case 'email':
                this.formErrors[key] = 'Please enter a valid email address';
                break;
              default:
                this.formErrors[key] = 'Invalid format';
            }
          } else if (control.errors['min']) {
            this.formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} must be at least ${control.errors['min'].min}`;
          } else if (control.errors['max']) {
            this.formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} must not exceed ${control.errors['max'].max}`;
          }
        }
      });
      // console.log('Form Errors:', this.formErrors); // Debugging
      return Object.keys(this.formErrors).length === 0;
    }
    return true;
  }

  onCancel() {
    if (this.instructorForm.dirty) {
      const confirmation = confirm('Are you sure you want to cancel? Your changes will not be saved.');
      if (confirmation) {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  onSelect(event: any) {
    const allowedTypes = ['application/pdf'];
    
    const validFiles = event.addedFiles.filter((file: File) => {

      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a PDF.`);
        return false;
      }
      return true;
    });

    this.files.push(...validFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  async onSubmit() {
    if (this.isSubmitting) return;
    
    if (!this.validateForm()) {
      alert('Please correct the inputs in the form before submitting.');
      return;
    }

    if (this.files.length === 0) {
      alert('Please upload your resume.');
      return;
    }

    this.isSubmitting = true;
    const formData = this.instructorForm.value;

    try {
      // Upload files first
      const uploadPromises = this.files.map(file => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'pdf_upload_presets');
        data.append('cloud_name', 'skillhivec');
        return this.cloudinary.uploadImage(data).toPromise();
      });

      const uploadResults = await Promise.all(uploadPromises);
      formData.resume = uploadResults.map(result => result.secure_url).join(',');

      // Submit form data
      await this.submitInstructorData(formData);
      
      alert('Form submitted successfully!');
      this.router.navigate(['/successfully-submitted']);
    } catch (error) {
      // console.error('Error during submission:', error);
      alert('An error occurred while submitting the form. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  private submitInstructorData(formData: any) {
    return this.instructorservice.submitInstructorData(formData)
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .toPromise();
  }
}