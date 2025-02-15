import { StdioNull } from "child_process";


export interface shortlisted_instructor {
    fullName: string;
    email: string;
    teachingDomain: string;
    upcoming_courses: string;
    start_date: string;
    end_date: string;
    candidateEnrolled: number;
    instructorRating: number;   
    assignedCourses:any[];
    about: string;
    experience: number;
    linkedin: string;
    location: string;
    Graduated: string;
    languages: string[];
    photoUrl:string;
    Ratings:number;
}

export interface iselectedFilters {
    ratings: string[], subjects: string[]
  };