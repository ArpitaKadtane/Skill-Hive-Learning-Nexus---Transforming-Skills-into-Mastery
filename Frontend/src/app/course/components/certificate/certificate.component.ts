import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CandidateService } from '../../../candidates/services/candidate.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  courseId: string = '';
  courseName: string = '';
  fullName: string = '';
  instructor: string = '';
  currentDate: string = new Date().toLocaleDateString();
  loggedInUserEmail: string = this.candidateService.getUserEmail() || '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router,private candidateService:CandidateService) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';

    // Fetch logged-in user details
    this.http.get<any[]>('http://localhost:3000/users').subscribe(users => {
      const user = users.find(u => u.email === this.loggedInUserEmail);
      if (user) {
        this.fullName = user.fullName;
      } else {
        console.error('Logged-in candidate not found.');
      }
    });

    // Fetch course details
    this.http.get<any[]>('http://localhost:3000/courses').subscribe(courses => {
      const course = courses.find(c => c.id === this.courseId);
      if (course) {
        this.courseName = course.name;
        this.instructor = course.instructor;
      }
    });
  }

  downloadPDF(): void {
    const element = document.getElementById('certificate');
    if (!element) return;

    // Hide buttons before capturing
    const buttons = document.querySelector('.button-container') as HTMLElement;
    if (buttons) buttons.style.display = 'none';

    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg');
      const doc = new jsPDF('landscape');
      doc.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      doc.save(`${this.fullName}_certificate.pdf`);

      // Show buttons again
      if (buttons) buttons.style.display = 'flex';
    });
  }

  downloadJPG(): void {
    const element = document.getElementById('certificate');
    if (!element) return;

    // Hide buttons before capturing
    const buttons = document.querySelector('.button-container') as HTMLElement;
    if (buttons) buttons.style.display = 'none';

    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${this.fullName}_certificate.jpg`;
      link.click();

      // Show buttons again
      if (buttons) buttons.style.display = 'flex';
    });
  }

  home() {
    this.router.navigate(['/candidate']);
  }

  feedback() {
    this.router.navigate(['/feedback/5692']);
  }

  certificate() {
    this.router.navigate(['/certificate/5692']);
  }
}
