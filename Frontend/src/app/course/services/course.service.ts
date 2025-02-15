import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/courses'; // API endpoint
  private feedbackApiUrl = 'http://localhost:3000/feedback'; // Feedback endpoint

  constructor(private http: HttpClient) {}

  // Get all courses
  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError('getCourses', []))
    );
  }

  // Get a single course by ID
  getCourseById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError('getCourseById'))
    );
  }

  // Create a new course
  createCourse(course: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, course).pipe(
      catchError(this.handleError('createCourse'))
    );
  }

  // Update an existing course
  updateCourse(course: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${course.id}`, course).pipe(
      catchError(this.handleError('updateCourse'))
    );
  }

  // Update a specific field of a course (patch)
  updateCourseField(id: string | number, updates: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, updates).pipe(
      catchError(this.handleError('updateCourseField'))
    );
  }

  // Delete a course
  deleteCourse(id: string | number): Observable<void> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0), // Ensure it returns `void`
      catchError(this.handleError('deleteCourse'))
    );
  }

  // Enroll a candidate in a course
  enrollCandidate(id: string | number, candidateId: string): Observable<any> {
    return this.getCourseById(id).pipe(
      switchMap((course) => {
        const updatedCandidates = Array.from(new Set([...(course.enrolledCandidates || []), candidateId]));
        return this.updateCourseField(id, { enrolledCandidates: updatedCandidates });
      }),
      catchError(this.handleError('enrollCandidate'))
    );
  }

  // Get all courses enrolled by a specific candidate
  getEnrolledCourses(candidateId: string): Observable<any[]> {
    return this.getCourses().pipe(
      map((courses) => courses.filter((course) => course.enrolledCandidates?.includes(candidateId))),
      catchError(this.handleError('getEnrolledCourses', []))
    );
  }

  // Check if a candidate is enrolled in a course
  isCandidateEnrolled(id: string | number, candidateId: string): Observable<boolean> {
    return this.getCourseById(id).pipe(
      map((course) => course.enrolledCandidates?.includes(candidateId) || false),
      catchError(() => of(false)) // Return `false` in case of error
    );
  }

  // Get the number of enrolled candidates for a course
  getEnrolledCandidatesCount(id: string | number): Observable<number> {
    return this.getCourseById(id).pipe(
      map((course) => course.enrolledCandidates?.length || 0),
      catchError(() => of(0)) // Return `0` in case of error
    );
  }

  // Get all courses assigned to a specific instructor
  getCoursesByInstructor(instructorName: string): Observable<any[]> {
    return this.getCourses().pipe(
      map((courses) => courses.filter((course) => course.instructor === instructorName)),
      catchError(this.handleError('getCoursesByInstructor', []))
    );
  }

  // Update modules for a course
  updateCourseModules(id: string | number, modules: any[]): Observable<any> {
    return this.updateCourseField(id, { modules }).pipe(
      catchError(this.handleError('updateCourseModules'))
    );
  }

  // Submit feedback for a course
  submitFeedback(feedback: any): Observable<any> {
    return this.http.post<any>(this.feedbackApiUrl, feedback).pipe(
      catchError(this.handleError('submitFeedback'))
    );
  }

  // Get the thumbnail URL of a course
  getCourseThumbnail(id: string | number): Observable<string> {
    return this.getCourseById(id).pipe(
      map((course) => course.thumbnail || ''),
      catchError(() => of(''))
    );
  }

  // Utility: Handle HTTP errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return throwError(() => new Error(error.message || 'Server Error'));
    };
  }
}
