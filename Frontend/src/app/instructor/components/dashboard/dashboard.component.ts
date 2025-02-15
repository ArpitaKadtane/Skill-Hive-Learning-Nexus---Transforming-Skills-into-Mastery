import { Component, ElementRef, EventEmitter, HostListener, inject, Input, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../authentication/services/auth.service';
import { InstructorService } from '../../services/instructor.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private router = inject(Router);
  private instructorService = inject(InstructorService);

  loginData = {
    islogged: false,
    user: null,
    name: null,
    email: null,
    id: null,
  };

  instructorid: string = '';
  ngOnInit() {

    const email = this.loginData.email; // Replace with actual email
    this.instructorService.getInstructorByEmail(email).subscribe((data) => {
      if (data.length > 0) {
        this.instructorid = data[0].id; // Assuming the API returns an array
        // console.log('Instructor Details:', this.instructorid);
      } else {
        // console.log('No instructor found');
      }
    });
  }

  @Input() isHidden: boolean = true; // Dashboard starts hidden
  @Output() closeSideMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public authService: AuthService, private elementRef: ElementRef) {
    if (this.authService.isAuthenticated() !== null) {
      this.loginData = this.authService.isAuthenticated();
    }
  }

  toggleSidebar() {
    this.isHidden = !this.isHidden;
  }

  hideDashboard() {
    this.isHidden = true;
  }

  isActive(route: string): boolean {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    return this.router.url === route;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  sideMenuClicked() {
    this.closeSideMenu.emit(true);
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeSideMenu.emit(true);
    }
  }
}

