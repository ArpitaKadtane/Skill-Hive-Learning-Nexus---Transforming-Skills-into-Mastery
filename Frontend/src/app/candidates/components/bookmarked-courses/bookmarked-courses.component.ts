import { CommonModule, NgFor } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-bookmarked-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookmarked-courses.component.html',
  styleUrl: './bookmarked-courses.component.css'
})
export class BookmarkedCoursesComponent implements OnInit {

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: object) {

  }
  bookmarkedCourses: any[] = [];

  ngOnInit() {
    this.loadBookmarkedCourses();
  }

  loadBookmarkedCourses() {
    var storedCourses = "";
    if (isPlatformBrowser(this.platformId)) {
      storedCourses = localStorage.getItem('bookmarkedCourses');
    }

    if (storedCourses) {
      this.bookmarkedCourses = JSON.parse(storedCourses);
    } else {
      this.bookmarkedCourses = []; // Ensure it doesn't break if localStorage is empty
    }

    // console.log("Loaded bookmarked courses:", this.bookmarkedCourses);
  }

  // Function to calculate the duration
  calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert time difference to days

    return `${diffDays} days`; // Return duration in days
  }

  removeBookmark(courseId: string) {
    this.bookmarkedCourses = this.bookmarkedCourses.filter(course => course.id !== courseId);
    localStorage.setItem('bookmarkedCourses', JSON.stringify(this.bookmarkedCourses));
  }


  navigateCourse(courseid: any) {
    this.router.navigate([`candidate/course-view/${courseid}`])
  }

}
