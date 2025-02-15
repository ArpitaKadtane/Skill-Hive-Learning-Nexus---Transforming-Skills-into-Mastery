import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CandidateService } from '../../services/candidate.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-candidate-login',
  standalone: true,
  templateUrl: './candidate-login.component.html',
  styleUrls: ['./candidate-login.component.css'],
  imports: [FormsModule, CommonModule, RouterModule,HeaderComponent,FooterComponent],
})
export class CandidateLoginComponent implements OnInit{
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private candidateService: CandidateService,
    private router: Router
  ) {}
  ngOnInit() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  onLogin() {
    if (!this.email.trim() && !this.password.trim()) {
      this.errorMessage = 'Both email and password are required.';
      return;
    }
    if (!this.email.trim()) {
      this.errorMessage = 'Email field is required.';
      return;
    }
    if (!this.password.trim()) {
      this.errorMessage = 'Password field is required.';
      return;
    }

    this.candidateService.loginCandidate(this.email.trim(), this.password.trim()).subscribe({
      next: (response) => {
        if (response.length > 0) {
          const user = response[0];
          this.successMessage = 'Login successful!!!';
          alert(this.successMessage);
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('candidateName', user.fullName);
          this.router.navigate(['candidate/dashboard']);
        } else {
          this.errorMessage = '401 (Unauthorized) Invalid username or password.';
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        this.errorMessage = 'Server error. Please try again later.';
      },
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
