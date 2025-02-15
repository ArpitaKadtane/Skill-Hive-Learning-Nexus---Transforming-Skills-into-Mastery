import { Component, ElementRef, EventEmitter, HostListener, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { InstructorService } from '../../../instructor/services/instructor.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule,
    MatToolbarModule, MatExpansionModule, CommonModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  searchForm: FormGroup;
  private router = inject(Router);
  opened: boolean = false
  openSearch: boolean = false;
  searchFound: boolean = false;
  baseUrl = 'http://localhost:3000';
  sideMenuOptions;
  adminMenuOptions = [{
    option: "Home",
    url: '/home'
  }, {
    option: "Create courses",
    url: '/admin-create-course'
  }, {
    option: "View courses",
    url: '/admin-view-courses'
  }, {
    option: "Manage courses",
    url: '/admin-view-courses'
  }, {
    option: "View instructor profiles",
    url: '/applicants'
  }, {
    option: "Application details",
    url: '/applicants-details'
  },];
  candidateMenuOptions = [{
    option: "Dashboard",
    url: '/candidate/dashboard'
  }, {
    option: "View All Courses",
    url: '/candidate/all-courses'
  }, {
    option: "Track Learning",
    url: '/candidate/track-my-learning'
  }, {
    option: "Bookmarked Courses",
    url: '/candidate/bookmarked-courses'
  }, {
    option: "Assessments",
    url: '/candidate/assessmentdash'
  }, {
    option: "Update Profile",
    url: '/candidate/update-profile'
  }, {
    option: "Additional Details",
    url: '/register'
  }, {
    option: "Change Password",
    url: '/candidate/change-password'
  }];
  instructorMenuOptions = [{
    option: "Assigned Courses",
    url: '/instructor-profile'
  }, {
    option: "Upload Content",
    url: '/instructor-profile'
  }, {
    option: "Profile",
    url: '/profile'
  }, {
    option: "Profile settings",
    url: '/profile-setting'
  }, {
    option: "Take Assessments",
    url: '/course'
  },];
  filteredOptions = null;
  sideMenu: boolean = false;
  loginData = {
    islogged: false,
    user: null,
    name: null,
    email: null,
    id: null,
  };
  instructorApplied: any = null;
  instructorSelected: any = null;
  instructorid;
  @Output() sideMenuEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef, public authService: AuthService, private toastr: ToastrService,private instructorService:InstructorService) {
    if (this.authService.isAuthenticated() !== null) {
      this.loginData = this.authService.isAuthenticated();
    }
    if (this.authService.instructedApplied() !== null) {
      this.instructorApplied = this.authService.instructedApplied();
    }
    if (this.authService.instructedSelected() !== null) {
      this.instructorSelected = this.authService.instructedSelected();
    }
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchStr: new FormControl('',),
    });

    this.searchForm.get('searchStr').valueChanges.subscribe(response => {
      if (response !== null && response.length > 0) {
        this.searchFound = true;
        if (this.filterData(response).length > 0) {
          this.openSearch = true;
          this.searchFound = false;
        }
      } else {
        this.openSearch = false;
        this.searchFound = false;
      }
    })

    if (this.loginData.user == 'admins') {
      this.sideMenuOptions = this.adminMenuOptions;
    } else if (this.loginData.user == 'users') {
      this.sideMenuOptions = this.candidateMenuOptions;
    } else if (this.loginData.user == 'instructors') {
      this.sideMenuOptions = this.instructorMenuOptions;
      this.instructorService.getInstructorByEmail(this.loginData.email).subscribe((data) => {
        if (data.length > 0) {
          this.instructorid = data[0].id;
        }
      });
    }
  }

  filterData(enteredData) {
    return this.filteredOptions = this.sideMenuOptions.filter(item => item.option.toLowerCase().includes(enteredData.toLowerCase()));
  }

  signUp() {
    this.router.navigate(['signup']);
  }

  signIn() {
    this.router.navigate(['login']);
  }

  instructorApply() {
    this.router.navigate(['/apply-instructor']);
    this.opened = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
    this.opened = false;
  }

  toggleSideMenu() {
    if (this.sideMenu) {
      this.sideMenu = false;
    } else {
      this.sideMenu = true;
    }
    this.sideMenuEvent.emit(this.sideMenu);
  }

  redirectFromSearch(url: string) {
    if (this.loginData.user == 'instructors') {
      this.router.navigate([`${url}/${this.instructorid}`]);
    } else {
      this.router.navigate([url]);
    }
    this.openSearch = false;
    this.searchFound = false;
    this.searchForm.reset();

  }

  closeSearchDropdown() {
    this.openSearch = false;
    this.searchFound = false;
    this.searchForm.reset();
  }

  openDropdown() {
    if (this.opened) {
      this.opened = false;
    }
    else {
      this.opened = true;
    }
  }

  deleteAccount() {
    if (confirm('Confirm account deletion?')) {
      this.authService.deleteAccount(this.loginData.id, this.loginData.user).subscribe({
        next: (next) => {
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['login']);
            this.opened = false;
          }, 3000);
          this.toastr.success('Account deleted successfully.', 'Success');
        }, error: (error) => {
          this.toastr.error('Error deleting account. Please try again later.', 'Error');
        }
      });
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.opened = false;
      this.openSearch = false;
      this.searchFound = false;
      this.searchForm.reset();
      this.sideMenu = false;
    }
  }
}

