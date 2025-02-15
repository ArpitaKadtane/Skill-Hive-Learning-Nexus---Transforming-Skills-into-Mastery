import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule,],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent {
  newsLetterForm: FormGroup;
  constructor(private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.newsLetterForm = new FormGroup({
      email: new FormControl('',[Validators.email, Validators.required]),
    });
  }

  subscribe(): void {
    this.authService.addUserToNewsletter(this.newsLetterForm.value.email).subscribe({
      next: (response) => {
        this.newsLetterForm.reset();
        this.toastr.success('Thank you for subscribing to our weekly newsletter!', 'Subscribed Successfully');
      },
      error: (err) => {
        this.toastr.error('An error occurred. Please try again later.', 'Not subscribed');
      },
    });
  }
}
