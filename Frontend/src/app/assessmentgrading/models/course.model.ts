export interface Course {
    title: string;
    createdAt: string;
    instructorId: number;
    courseId: number;
    assessment: Assessment[];
    id: string;
  }
  
  export interface Assessment {
    assessmentName: string;
    questions: Question[];
    assessmentID: string;
    createdAt: string;
    schedule: {
            isScheduled:  boolean,
            scheduledDetails: {
              assessmentDate: string,
              startTime: string,
              endTime: string
            }
    }
  }
  
  export interface Question {
    question: string;
    choices: string[];
    answer: string;
  }
  
  export interface User {
    name: string;
    userId: number;
    entrolledCourses: EntrolledCourses[];
  }

  export interface EntrolledCourses{

      title: string ;
      createdAt: string ;
      instructorId: number;
      courseId: number;
      entrolled: string ;
      assessmentData: AssessmentData[]
    
  }

  export interface AssessmentData{

  }