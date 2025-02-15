import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shortlisted_instructor } from '../models/shortlisted_instrtuctor.model';
import { AuthService } from '../../authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiurl = 'http://localhost:3000/applicantDetails'; // API URL for applicants
  private shortlistedUrl = 'http://localhost:3000/instructorDetails'; // API URL for shortlisted instructors

  // Post applicant in database
  submitInstructorData(formData: any): Observable<any> {
    return this.http.post(this.apiurl, formData);
  }

  // Get applicants from the database
  getInstructor(): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl);
  }

  //get instructor details through email
  getInstructorByEmail(email: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/instructorDetails?email=${email}`);
  }

  // Delete the instructor
  deleteInstructor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiurl}/${id}`);
  }

  // Get shortlisted instructors to check for duplicates
  getShortlistedInstructors(): Observable<any[]> {
    return this.http.get<any[]>(this.shortlistedUrl);
  }

  // Add to Shortlisted
  addToShortlisted(instructor: any): Observable<any> {
    return this.http.post<any>(this.shortlistedUrl, instructor);
  }

  // Delete the shortlisted instructor
  deleteShortlistedInstructor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.shortlistedUrl}/${id}`);
  }

  // Update Instructor Status (New Method)
  updateInstructorStatus(id: number, status: string): Observable<any> {
    const url = `${this.shortlistedUrl}/${id}`;
    return this.http.patch(url, { status });  // Update only the status field
  }

  getInstructorById(id: string): Observable<any> {
    return this.http.get<any>(`${this.shortlistedUrl}/${id}`)
  }

  updateInstructor(id: string, instructorData: shortlisted_instructor): Observable<any> {
    return this.http.put<any>(`${this.shortlistedUrl}/${id}`, instructorData);
  }

}
