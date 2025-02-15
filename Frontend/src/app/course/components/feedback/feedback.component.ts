import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],  // Add RouterModule here
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent implements OnInit {
  courseId: string = '5a20'; // Hardcoded courseId ID for now
  userId: string = 'user123'; // Hardcoded user ID for now 
  courseRating: number = 0;
  instructorRating: number = 0;
  suggestions: string = '';
  certificateGenerated: boolean = false; // To track certificate generation

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['courseId'];
  }

  setCourseRating(rating: number): void {
    this.courseRating = rating;
  }

  setInstructorRating(rating: number): void {
    this.instructorRating = rating;
  }

  submitFeedback(): void {
    if (!this.courseRating || !this.instructorRating) {
      alert('Please provide both course and instructor ratings to continue.');
      return;
    }

    const feedback = {
      id: this.generateUniqueId(),
      userId: this.userId,
      courseId: this.courseId, // Storing courseId along with feedback
      courseRating: this.courseRating,
      instructorRating: this.instructorRating,
      suggestions: this.suggestions,
    };

    this.http.post('http://localhost:3000/feedbacks', feedback).subscribe(() => {
      alert('Feedback submitted successfully!');
      // this.certificateGenerated = true; // Show the certificate link after feedback submission
      window.history.back();
    });
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
