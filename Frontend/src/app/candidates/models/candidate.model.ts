// candidate.model.ts
export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  password: string;
}

export interface AdditionalDetails {
  profilePicture: string;
email:string;
  phoneNumber: string;
  location: string;
  companyName: string;
  status: string;
  specialization: string;
  gender: string;
  enrolledCourses : String[]
}
