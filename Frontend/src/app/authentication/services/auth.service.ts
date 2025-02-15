import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RegisterPostData, User, email } from '../../interfaces/auth';
import { Observable, forkJoin } from 'rxjs';
import { loginDetails } from '../../interfaces/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginDetails: loginDetails = {
    islogged: false,
    user: null,
    id: null,
    email: null,
    name: null,
  };

  private baseUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  registerUser(userData: RegisterPostData, user: string) {
    return this.http.post(`${this.baseUrl}/${user}`, userData);
  }

  addUserToNewsletter(userEmail: any) {
    const user: email = { email: userEmail };
    return this.http.post(`${this.baseUrl}/newsletteremails`, user);
  }

  userAlreadyPresent(email: string, user: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/${user}?email=${email}`);
  }

  isAuthenticated() {
    if (isPlatformBrowser(this.platformId)) {
      const loginData = localStorage.getItem('loginData');
      return loginData ? JSON.parse(loginData) : null;
    }
    return null;
  }

  getCurrentUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const loginData = localStorage.getItem('loginData');
      return loginData ? JSON.parse(loginData) : null;
    }
    return null;
  }

  getSelectedInstructorId(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('selectedInstructorId');
    }
    return null;
  }

  instructedApplied() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('instructorApplied') || null;
    }
    return null;
  }

  instructedSelected() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('instructorSelected') || null;
    }
    return null;
  }

  logout() {
    localStorage.clear();
    this.reloadComponent(null, null);
  }

  reloadComponent(user: string, email: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      if (!user || user === 'admins') {
        this.router.navigate(['/']).then(() => window.location.reload());
      } else if (user === 'users') {
        this.router.navigate(['candidate/dashboard']).then(() => window.location.reload());
      } else {
        forkJoin([
          this.http.get<any>(`${this.baseUrl}/applicantDetails?email=${email}`),
          this.http.get<any>(`${this.baseUrl}/instructorDetails?email=${email}`)
        ]).subscribe(([applicantResponse, instructorResponse]) => {
          if (applicantResponse.length === 0 && instructorResponse.length === 0) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('instructorApplied', 'false');
              localStorage.setItem('instructorSelected', 'false');
            }
            this.router.navigate(['/apply-instructor']).then(() => window.location.reload());
          } else if (applicantResponse.length >= 1) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('instructorApplied', 'true');
              localStorage.setItem('instructorSelected', 'false');
            }
            this.router.navigate([`/application-status/${applicantResponse[0].id}`]).then(() => window.location.reload());
          } else {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('instructorSelected', 'true');
              localStorage.setItem('selectedInstructorId', instructorResponse[0].id);
            }
            this.router.navigate([`/instructor-profile/${instructorResponse[0].id}`]).then(() => window.location.reload());
          }
        });
      }
    });
  }

  deleteAccount(id: string, user: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${user}/${id}`, {});
  }

  localStorage(data: loginDetails) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('loginData', JSON.stringify(data));
    }
  }

  getUserDetails(email: string, password: string, user: string): Observable<User[]> {
    const details: Observable<User[]> = this.http.get<User[]>(`${this.baseUrl}/${user}?email=${email}&password=${password}`);

    details.subscribe({
      next: (response) => {
        if (response.length >= 1) {
          if (user === 'users' && isPlatformBrowser(this.platformId)) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('candidateName', response[0].fullName);
            localStorage.setItem('candidateEmail', response[0].email);
          }
          this.loginDetails = {
            islogged: true,
            user,
            id: response[0].id,
            email: response[0].email,
            name: response[0].fullName,
          };
          this.localStorage(this.loginDetails);
        } else {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.clear();
          }
        }
      }
    });

    return details;
  }
}
