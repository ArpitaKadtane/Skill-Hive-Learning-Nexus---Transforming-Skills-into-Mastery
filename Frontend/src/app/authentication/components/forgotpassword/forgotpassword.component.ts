import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { confirmPasswordValidator } from '../../../shared/confirm-password.validator';
import { HttpClient } from '@angular/common/http';
import { CountdownEvent, CountdownModule } from 'ngx-countdown';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CountdownModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule
  ]
})
export class ForgotpasswordComponent implements OnInit {
  emailForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;
  otpSent: boolean = false;
  otpVerified: boolean = false;
  isSubmitting: boolean = false;
  cannotSubmit: boolean = false;
  timer: boolean = false;
  private baseUrl = 'http://localhost:3000';
  private emailUrl = 'http://localhost:4000/send-email';
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  private StrongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ForgotpasswordComponent>,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.emailForm = new FormGroup({
      user: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')])
    });

    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.pattern(this.StrongPasswordRegx)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: confirmPasswordValidator });

  }

  currentTitle(): string {
    if (!this.otpSent)
      return 'Forgot Password?';
    else
      return 'Enter OTP';
  }

  currentSubTitle(): string {
    if (!this.otpSent)
      return 'A one-time passcode will be sent to this email for verification if registered';
    else
      return 'Enter the one-time passcode sent to your registered email';
  }

  requestOTP() {
    const email = this.emailForm.get('email').value;
    const user = this.emailForm.get('user').value;
    this.authService.userAlreadyPresent(email,user).subscribe({
      next: (users) => {
        if (users.length >= 1) {
          this.isSubmitting = true;
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const otpExpiry = new Date(Date.now() + 10 * 60000).toISOString();
          const data = {
            "otp": otp,
            "email": email,
          };
          this.http.patch(`${this.baseUrl}/${user}/${users[0].id}`, {
            otp,
            otpExpiry
          }).subscribe({
            next: (response) => {
            }
          });
          this.http.post(this.emailUrl, data, { responseType: 'text' }).subscribe({
            next: (response) => {
              this.isSubmitting = false;
              this.toastr.success('OTP send successfully', 'Success');
              this.otpSent = true;
            },
            error: (err) => {
              this.isSubmitting = false;
              this.toastr.error('Error sending OTP', 'Error');
              this.timer = true;
              this.cannotSubmit = true;
            }
          });
        } else {
          this.toastr.error('User not found', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Something went wrong', 'Error');
      },
    });
  }

  onTimerFinished(e: CountdownEvent) {
    if (e.action == 'done') {
      this.cannotSubmit = false;
      this.timer = false;
    }
  }

  verifyOTP() {
    const email = this.emailForm.get('email').value;
    const user = this.emailForm.get('user').value;
    const otpEntered = this.otpForm.get('otp').value;
    this.http.get<any[]>(`${this.baseUrl}/${user}?email=${email}`).subscribe({
      next: (users) => {
        const otpExpiry = new Date(users[0].otpExpiry);
        const now = new Date();
        if (otpExpiry < now) {
          this.otpSent = false;
          this.toastr.error('This OTP has expired. Please request a new one.', 'Error');
        } else if (otpEntered === users[0].otp) {
          this.otpVerified = true;
          this.toastr.success('OTP verified successfully', 'Success');
        } else {
          this.toastr.error('Invalid OTP', 'Error');
        }
      },
      error: (error) => {
        this.toastr.error('Something went wrong', 'Error');
      }
    });
  }

  resetPassword() {
    const email = this.emailForm.get('email').value;
    const user = this.emailForm.get('user').value;
    const newPassword = this.passwordForm.get('password').value;

    this.authService.userAlreadyPresent(email,user).subscribe({
      next: (users) => {
        if (users[0].password === newPassword) {
          this.toastr.error('New password must differ from the old one.', 'Error');
        } else {
          this.http.patch(`${this.baseUrl}/${user}/${users[0].id}`, {
            password: newPassword,
            otp: null,
            otpExpiry: null
          }).subscribe({
            next: (response) => {
              this.toastr.success('Password reset successfully', 'Success');
              this.closeDialog()
            }, error: (error) => {
              this.toastr.error('Error resetting password', 'Error');
            }
          });
        }

      }, error: (error) => {
        this.toastr.error('Something went wrong', 'Error');
      }
    });
  }

  passwordClick(event: Event) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  confirmPasswordClick(event: Event) {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}