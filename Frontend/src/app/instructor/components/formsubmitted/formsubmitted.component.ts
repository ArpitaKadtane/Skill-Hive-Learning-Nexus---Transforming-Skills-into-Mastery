import { Component, OnInit } from '@angular/core';
import { BeforApplyBannerComponent } from "../befor-apply-banner/befor-apply-banner.component";
import { NewsletterComponent } from '../newsletter/newsletter.component';
import { Router } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';

@Component({
  selector: 'app-formsubmitted',
  standalone: true,
  imports: [BeforApplyBannerComponent, NewsletterComponent],
  templateUrl: './formsubmitted.component.html',
  styleUrl: './formsubmitted.component.css'
})
export class FormsubmittedComponent {
  subscribe() {
    throw new Error('Method not implemented.');
  }
  email: any;
  toggleMenu() {
    const navList = document.querySelector('.nav-links');
    if (navList) {
      navList.classList.toggle('active');
    }
  }
}
