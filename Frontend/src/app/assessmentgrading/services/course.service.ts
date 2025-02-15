import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, scheduled } from 'rxjs';
import { map  ,switchMap} from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { animateChild } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://localhost:3000/courses';
  private apiUrlCandidate = 'http://localhost:3000/additionalDetails_Candidates';
  private apiUrlInstructor = "http://localhost:3000/instructorDetails";
  constructor(private http: HttpClient) { }

  course : any[] = []

  //corrected 
  getCourses(instructorId: any): Observable<any> {
    return forkJoin([
      this.http.get<any[]>(this.apiUrlInstructor), 
      this.http.get<any[]>(this.apiUrl)            
    ]).pipe(
      map(([instructors, courses]) => {
        const instructor = instructors.find(inst => inst.id === instructorId);
  
        if (!instructor) return []; 
  
        return instructor.assignedCourses.map((course:any) => {
          const matchingCourse = courses.find(c => c.id === course.id); 
          return {
            courseId: course.id,     
            title: course.name,      
            tech: course.technology, 
            state: course.status,    
            instructorId: instructor.id, 
            assessment: matchingCourse ? matchingCourse.assessment : [] 
          };
        });
      })
    );
  }
  //corrected
  createAssessment(courseId: any, assessmentData: any): Observable<any> {

    return this.http.get<any[]>(this.apiUrl).pipe(
      map(courses => {
        const course = courses.find(course => course.id == courseId);
        if (course) {
          assessmentData.assessmentID =uuidv4();
          assessmentData.createdAt = new Date().toISOString();
          assessmentData.schedule = {
            isScheduled : false ,
            scheduledDetails : ''
          }
          if(!course.assessment){
            course.assessment=[];
          }
          course.assessment.push(assessmentData);
          const courseIdInDb = course.id;
          return course;
        } else {
          // console.log(courseId);
          throw new Error('Course not found');
        }
      }),
      switchMap((course) => {
        return this.http.put<any>(`${this.apiUrl}/${course.id}`, course, {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
  }
  //corrected
  updateAssessment(courseId : any , assessmentData : any): Observable<any> {

    // console.log(assessmentData);
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(courses => {
        const course = courses.find(course => course.id === courseId);
        if (course) {
          course.assessment.forEach( (assessments : any )=> {
            if(assessmentData.assessmentID === assessments.assessmentID)
            {
              assessments.questions = assessmentData.questions ;
            }
          })
          const courseIdInDb = course.id;
          return course;
        } else {
          throw new Error('Course not found');
        }
      }),
      switchMap((course) => {
        return this.http.put<any>(`${this.apiUrl}/${course.id}`, course, {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
  }
  //corrected
  scheduleAssessment(courseId: any , assessmentID:string , scheduleDetails : any): Observable<any>{

    return this.http.get<any[]>(this.apiUrl).pipe(
      map(courses => {
        const course = courses.find(course => course.id === courseId.toString());
        if (course) {
          const selectedAssessment = course.assessment.find((assessments :any) => assessments.assessmentID === assessmentID)
          if (selectedAssessment) {
            if (!selectedAssessment.schedule) {
              selectedAssessment.schedule = {};
            }
            window.location.reload();
            selectedAssessment.schedule.isScheduled = true;
            selectedAssessment.schedule.scheduledDetails = scheduleDetails;
            return course; 
          } else {
            throw new Error('Assessment not found');
          }
        } else {
          throw new Error('Course not found');
        }
      }),
      switchMap((course) => {
        return this.http.patch<any>(`${this.apiUrl}/${course.id}`, course, {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
}
//corrected
deleteAssessment(courseId: any, assessmentID:string): Observable<any> {

  return this.http.get<any[]>(this.apiUrl).pipe(
    map(courses => {
      const course = courses.find(course => course.id === courseId);
      if (course) {
        const assessIndex = course.assessment.findIndex(
          (assess:any) => assess.assessmentID === assessmentID
        )
        if (assessIndex !== -1) {
          course.assessment.splice(assessIndex, 1);
        }
        return course;
      } else {
        throw new Error('Course not found');
      }
    }),
    switchMap((course) => {
      return this.http.patch<any>(`${this.apiUrl}/${course.id}`, course, {
        headers: { 'Content-Type': 'application/json' }
      });
    })
  );
}
//corrected
  getCandidate(userId : string): Observable<any> {
    return this.http.get<any[]>(this.apiUrlCandidate).pipe(
      map((users) => {
        const user = users.find(user => user.id === userId)
        return user
      })
    );
  }
  //from updating assessment component
  //corrected
  getAssessmentDetails(courseId : any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((courses) => {
        const course = courses.find(course => course.id == courseId);   
        // console.log(course)   
        if (course && course.assessment) {  // ✅ Ensure course and assessment exist
          const assessments = course.assessment.filter((assessment: any) => assessment.schedule.isScheduled === true);
      
          return assessments.map((assessment: any) => ({
            assessmentName: assessment.assessmentName,
            assessmentID: assessment.assessmentID,
            createdAt: assessment.createdAt,
            scheduledDetails: assessment.schedule.scheduledDetails,
            totalQuestions: assessment.questions.length,
            isActive: false,
          }));
        }
        
        // console.log('Assessment not found');
        return [];
      })
      
    );
  }

  //doing - not sure what is this and where it is from .
  getAssessmentDetailsUpdated(courseId : any , userId :  any ) : Observable <any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((courses) => {
        const course = courses.find(course => course.courseId === courseId);
        if(course){
          const assessments = course.assessment.filter( (assessment:any) => assessment.schedule.isScheduled === true) ;
          
          const assessmentDetails =assessments.map((assessment: any) => ({
            assessmentName: assessment.assessmentName,
            assessmentID: assessment.assessmentID,
            createdAt: assessment.createdAt,
            scheduledDetails: assessment.schedule.scheduledDetails,
            totalQuestions : assessment.questions.length,
            isCompleted : Array.isArray(assessment.assessmentCompletions) 
            ? assessment.assessmentCompletions.some((user: any) => user.userId === userId) 
            : false,
            isActive : false ,
          }));
          
          return assessmentDetails;
        }
        return false
      })
    );
  }


  //form updating assessment components
  //corrected
  getAssessmentQuestions(courseId : any , assessmentID : number): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((courses) => {
        const course = courses.find(course => course.id === courseId);
        if(course){
          const assessments = course.assessment.find( (assessment:any) => assessment.schedule.isScheduled === true && assessment.assessmentID === assessmentID) ;

          const assessmentDetails ={
            assessmentName: assessments.assessmentName,
            createdAt: assessments.createdAt,
            scheduledDetails: assessments.schedule.scheduledDetails,
            totalQuestions : assessments.questions.length,
            questions : assessments.questions
          }
          return assessmentDetails;
        }
        return false
      })
    );
  }

  //corrected
  completeAssessment(courseId : any , assessmentID : string , userId : any , completionDate : Date  , assessmentData : any ): Observable<any>{
    // console.log("form the course service -> assessmentData");
    assessmentData.startAt = assessmentData.startAt.toString();
    assessmentData.completionAt = assessmentData.completionAt.toString();
    // console.log(assessmentData);
    const fetchUpdateCourse = this.http.get<any[]>(this.apiUrl).pipe(
      map(courses => {
        const course = courses.find(course => course.id === courseId);
        if (course) {
          const selectedAssessment = course.assessment.find((assessments :any) => assessments.assessmentID === assessmentID)
          if (selectedAssessment) {
            if (!selectedAssessment.assessmentCompletions) {
              selectedAssessment.assessmentCompletions = [];
            }
            selectedAssessment.assessmentCompletions.push({
              userId : userId ,
              completionDate : completionDate ,
              assessmentData : assessmentData
            })
            return course; 
          } else {
            throw new Error('Assessment not found');
          }
        } else {
          throw new Error('Course not found');
        }
      }),
      switchMap((course) => {
        return this.http.put<any>(`${this.apiUrl}/${course.id}`, course, {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );

    const fetchUpdateUser=  this.http.get<any[]>(this.apiUrlCandidate).pipe(
      map(users => {
        const user = users.find(user => user.id === userId);
        if(user){
          const course = user.enrolledCourses.find(( course :any) => course.courseId === courseId)
          if(!course.assessmentData){
            course.assessmentData = []
          }
          course.assessmentData.push({
            assessmentID : assessmentID ,
            completionDate : completionDate ,
            assessmentData : assessmentData
          })
          course.assessmentStatus = true ;
          return user;
        }
        else{
          throw new Error("can't fetch the user details")
        }
      }),
      switchMap((user)=>{
        return this.http.put<any>(`${this.apiUrlCandidate}/${user.id}`, user, {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    )

    return forkJoin([fetchUpdateCourse , fetchUpdateUser]);
  }


  //corrected
  canAttempt(userId : any , courseId : any , assessmentID : any): Observable<any>{
 
    return this.http.get<any[]>(this.apiUrlCandidate).pipe(
      map(users => {
        const user = users.find(user => user.id === userId);
        if(user){
          const course = user.enrolledCourses.find(( course :any) => course.courseId === courseId)
          if(course)
          {
            const assessment = course.assessmentData?.find((assessment:any)=>assessment.assessmentID === assessmentID)
            if(assessment){
              return false ;
            }
            else
            return true ;
          }else{
            throw new Error("Cant fetch Course details")
          }
        }
        else{
          throw new Error("can't fetch the user details")
        }
      })
    )
  }

}
