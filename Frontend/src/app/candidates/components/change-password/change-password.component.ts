import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CandidateService } from '../../services/candidate.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component'; // Import HeaderComponent
import { FooterComponent } from '../footer/footer.component'; // Import HeaderComponent
@Component({
  standalone: true,
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  imports: [FormsModule, CommonModule, RouterModule,HeaderComponent,FooterComponent],


})
export class ChangePasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private candidateService: CandidateService, private router: Router) {}

  togglePasswordVisibility(field: string) {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  cancel(){
    this.confirmPassword = null;
    this.newPassword = null;
    this.currentPassword = null;
    this.errorMessage = null;
    this.successMessage = null;
    this.router.navigate(['/candidate/dashboard'])
  }

  onSubmit() {
    // Reset messages before validating
    this.errorMessage = '';
    this.successMessage = '';

    // Validate fields
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    if (this.newPassword === this.currentPassword) {
      this.errorMessage = 'New password cannot be the same as the current password.';
      return;
    }

    // Password validation regex: At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordPattern.test(this.newPassword)) {
      this.errorMessage = 'New password must be at least 8 characters long and include uppercase, lowercase, digits, and a special character.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New passwords do not match.';
      return;
    }

    // Assuming that we have the candidate's email stored in localStorage
    const email = localStorage.getItem('candidateEmail');
    if (!email) {
      this.errorMessage = 'User not logged in. Please log in first.';
      return;
    }

    // Make API call to change the password
    this.candidateService.changePassword(email, this.currentPassword, this.newPassword).subscribe({
      next: (response) => {
        this.successMessage = 'Password changed successfully!';
        setTimeout(() => this.router.navigate(['candidate/dashboard']), 2000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to change password. Please try again.';
      },
    });
  }
}
