export interface Course {
  id: string;
  courseId: string;
  name: string;
  startDate: string; 
  endDate: string; 
  technology: string;
  status: "Upcoming" | "Ongoing"; 
  instructor: string;
  modules: Module[]; // Array to store course modules
}

export interface Module {
  id:string;
  name: string; // Title of the module
  contentUrl: string; // Cloudinary URL of the uploaded PDF
}
