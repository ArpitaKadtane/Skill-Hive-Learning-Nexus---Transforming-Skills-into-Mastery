import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { ToastrService } from 'ngx-toastr';
import { NewsletterComponent } from '../../../instructor/components/newsletter/newsletter.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, NewsletterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private toastr: ToastrService,private router:Router) { }
  ngOnInit(): void {
    this.contactForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [Validators.required]),
    });
  }

  public OnFormSubmit(e: Event) {

    emailjs
      .sendForm('service_064xbcq', 'template_v6qlxih', e.target as HTMLFormElement, {
        publicKey: 'Op0whPQMuucxSHLz6',
      })
      .then(
        () => {
          this.toastr.success('Thank you for contacting us. We will get back to you soon.', 'Message send successfully')
          this.router.navigate(['home']);
        },
        (error) => {
          this.toastr.error('Something went wrong. Sorry for the inconvenience. Try again after some time.', 'Message not sent');
          this.router.navigate(['home']);
        },
      );
  }
}
