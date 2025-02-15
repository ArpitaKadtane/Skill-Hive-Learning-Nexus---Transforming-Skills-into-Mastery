import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// Fixed import name to match the actual component name
import { ForgotpasswordComponent } from '../forgotpassword/forgotpassword.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      user: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  hide = signal(true);

  hideClick(event: Event) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  OnFormSubmit() {
    const { email, password, user } = this.loginForm.value;
    this.authService.getUserDetails(email, password, user).subscribe({
      next: (response) => {
        if (response.length >= 1) {
          this.authService.reloadComponent(user, email);
        } else {
          this.authService.userAlreadyPresent(email, user).subscribe(
            {
              next: (response) => {
                if (response.length >= 1) {
                  this.toastr.error('Password is wrong', 'Wrong Credentials');
                } else {
                  this.toastr.error('Email address not found. Account creation required.', 'Account not found.');
                }
              },
              error: (error) => {
                this.toastr.error('Email or Password is wrong', 'Wrong Credentials');
              }
            }
          );
        }
      },
      error: (err) => {
        this.toastr.error('Something went wrong', 'Error');
      },
    });
  }

  openPopup() {
    const dialogRef = this.dialog.open(ForgotpasswordComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.toastr.success('Please login with your new password');
      }
    });
  }
}