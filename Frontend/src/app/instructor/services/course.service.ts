import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private http = inject(HttpClient);

  getCourseById(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/courses/${id}`);
  }

  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/courses');
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/courses/${id}`);
  }

  addCourse(course: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/courses', course);
  }

  updateCourse(id: string, course: any): Observable<any> {
    return this.http.put<any>(`http://localhost:3000/courses/${id}`, course);
  }

  deleteModule(courseId: string, moduleId: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/courses/${courseId}/modules/${moduleId}`);
  }
}
