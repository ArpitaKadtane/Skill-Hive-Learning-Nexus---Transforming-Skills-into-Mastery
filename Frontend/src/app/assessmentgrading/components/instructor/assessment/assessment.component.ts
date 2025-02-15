import { Component, ErrorHandler, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [CommonModule , FormsModule, HttpClientModule],
  providers : [ CourseService],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.css'
})
export class AssessmentComponent implements OnInit{
  courses : any | undefined
  courseId : number | undefined ;
  courseTitle : string | undefined ;
  instId : string  = "";
  constructor(private route: ActivatedRoute , private courseService  : CourseService , private router: Router, private authService:AuthService) {}

  questions : {
    question : string ,
    choices : string[],
    answer : null
  } [] = [{
    question: '',
    choices: ['', '', '', ''] ,
    answer: null
  }] ;

  assessmentName : string | undefined ;

  submittedData: any = null;


  
  ngOnInit(): void {
    const instructorIdtemp = this.authService.getSelectedInstructorId();
    // console.log(instructorIdtemp);
    this.instId = instructorIdtemp ;
    const instructorId = instructorIdtemp !== null ?instructorIdtemp : '' ;
    this.route.params.subscribe(params => {
      this.courseId = +params['id'];
      this.courseService.getCourses(instructorId).subscribe(data => {
        this.courses = data;
        // console.log("from the assessment component ");
        // console.log(data);
        this.courseTitle = this.courses.find((course:any) => course.courseId === this.courseId)?.name
      });
      
    });
    
  }

  addQuestion(){
    if(!this.questions.every((q) => q.question.trim() !== ''))
    {
      alert("Please Fill the Question Field")
    }
    else{
    this.questions.push({
      question: '',
      choices: ['', '', '', ''] ,
      answer: null
    });
  }
  }

  deleteQuestion(index : number){
    this.questions.splice(index , 1)
  }
 
  submitData() {

    const assessmentData = {
      assessmentName : this.assessmentName ,
      questions: this.questions
    };


    const areAllQuestionsFilled = this.questions.every((q) => q.question.trim() !== '');
    const areAllAnswersFilled = this.questions.every((q) => q.answer !== null);

    if(!areAllQuestionsFilled || !areAllAnswersFilled){
      const error = areAllQuestionsFilled ? areAllAnswersFilled ? "" : ", Please select the correct answers Before submit" : "Question Field Not be Empty " ;
      alert(error)
    }
    else if (this.courseId !== undefined) {
      this.courseService.createAssessment(this.courseId, assessmentData).subscribe(
        (response) => {
          this.submittedData = response;
          alert('Assessment saved successfully:');
          this.router.navigate(['/course',this.instId]);
        },
        (error) => {
          alert(error);
        }
      );
    }

  }

  backToCourse(){
    this.router.navigate(['/course',this.instId]);
  }

  trackByFn(index: number, item: any): any {
    return index; 
  }
}