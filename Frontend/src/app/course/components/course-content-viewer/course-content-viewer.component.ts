import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../../../authentication/services/auth.service';

@Component({
  selector: 'app-course-content-viewer',
  templateUrl: './course-content-viewer.component.html',
  styleUrls: ['./course-content-viewer.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CourseContentViewerComponent implements OnInit {
  courseId: string = '';
  course: any = {
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    technology: '',
    status: '',
    instructor: '',
    enrolledCandidates: [],
    thumbnail: '',
    modules: [],
    avgRating: 0,
    feedback: [],
    isEnrolled: false,
    userProgress: {}
  };

  currentModuleIndex: number = 0;
  progress: number = 0;
  safePdfUrl: SafeResourceUrl | null = null;
  safeVideoUrl: SafeResourceUrl | null = null;
  showCompletionPopup: boolean = false;
  currentUser: any;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['courseId'];
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCourse();
  }

  loadCourse(): void {
    this.courseService.getCourseById(this.courseId).subscribe((data) => {
      this.course = data;
      this.initializeUserProgress();
      this.updateProgress();
      this.updateContentUrls();
    });
  }

  initializeUserProgress(): void {
    if (!this.course.userProgress) {
      this.course.userProgress = {};
    }
    const userKey = this.getUserKey();
    if (!userKey) {
      console.error("User key not found!");
      return;
    }
    if (!this.course.userProgress[userKey]) {
      this.course.userProgress[userKey] = { completedModules: [] };
    }
  }

  updateContentUrls(): void {
    const module = this.course.modules[this.currentModuleIndex];
    this.safePdfUrl = module?.contentUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(module.contentUrl) : null;
    this.safeVideoUrl = module?.videoUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(module.videoUrl) : null;
  }

  selectModule(index: number): void {
    this.currentModuleIndex = index;
    this.updateContentUrls();
  }

  nextModule(): void {
    if (this.currentModuleIndex < this.course.modules.length - 1) {
      this.currentModuleIndex++;
      this.updateContentUrls();
    } else if (this.progress === 100) {
      this.showCompletionPopup = true;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previousModule(): void {
    if (this.currentModuleIndex > 0) {
      this.currentModuleIndex--;
      this.updateContentUrls();
    }
  }

  markAsCompleted(): void {
    const moduleId = this.course.modules[this.currentModuleIndex]?.id;
    const userKey = this.getUserKey();

    if (!moduleId || !userKey) {
      console.error("Invalid module or user key!");
      return;
    }

    if (!this.course.userProgress[userKey].completedModules.includes(moduleId)) {
      this.course.userProgress[userKey].completedModules.push(moduleId);
      
      // ✅ Force UI Update
      this.course = { ...this.course };

      this.updateProgress();
      this.saveProgress();
    }
  }

  isModuleCompleted(moduleId: string): boolean {
    const userKey = this.getUserKey();
    return userKey && this.course.userProgress[userKey]?.completedModules.includes(moduleId);
  }

  updateProgress(): void {
    const userKey = this.getUserKey();
    if (!userKey) return;
  
    const completedModules = this.course.userProgress[userKey].completedModules.length;
    const totalModules = this.course.modules.length || 1;
    this.progress = Math.round((completedModules / totalModules) * 100);
  
    if (this.progress === 100) {
      let completedCourses: string[] = [];
  
      // ✅ Check if localStorage has 'completed' key
      if (!localStorage.getItem('completed')) {
        completedCourses = [this.course.id]; // Create a new array
      } else {
        completedCourses = JSON.parse(localStorage.getItem('completed') || '[]');
        if (!completedCourses.includes(this.course.id)) {
          completedCourses.push(this.course.id);
        }
      }
  
      // ✅ Ensure we always update localStorage
      localStorage.setItem('completed', JSON.stringify(completedCourses));
  
      this.showCompletionPopup = true;
    }
  }
  
  
  
  

  saveProgress(): void {
    this.courseService.updateCourse(this.course).subscribe();
  }

  navigateToAssessment(): void {
    this.router.navigate(['/candidate/assessmentdash']);
  }

  closePopup(): void {
    this.showCompletionPopup = false;
  }

  private getUserKey(): string | null {
    return this.currentUser?.email || this.currentUser?.id || null;
  }
}
