import { CommonModule } from '@angular/common';
import { Component , OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';

@Component({
  selector: 'app-update-assess',
  standalone: true,
  imports: [CommonModule , FormsModule , HttpClientModule],
  templateUrl: './update-assess.component.html',
  providers : [CourseService],
  styleUrl: './update-assess.component.css'
})
export class UpdateAssessComponent implements OnInit{
  assessmentId : string= "" ;
  courseId = 0 ;
  assessmentData : any | undefined ;
  data : any | undefined ;
  instId : string = "";

  questions : {
    question : string ,
    choices : string[],
    answer : null
  } [] = [{
    question: '',
    choices: ['', '', '', ''] ,
    answer: null
  }] ;
  constructor( private courseService  : CourseService , private router: Router, private authService:AuthService) {}

  ngOnInit(): void {
    this.instId = this.authService.getSelectedInstructorId();
    // console.log(this.instId);
    this.assessmentId = history.state.assessmentId ;
    this.courseId =history.state.courseId ;
    this.courseService.getAssessmentDetails(history.state.courseId).subscribe(data=>{
      this.assessmentData = data.map((assessment:any)=>{
        if(assessment.assessmentID === history.state.assessmentId)
        {
          return assessment ;
        }
      })[0];
      // console.log("from the update assesment ts");
      // console.log(this.assessmentData)
     }
    )
    this.courseService.getAssessmentQuestions(history.state.courseId ,history.state.assessmentId).subscribe(data=>{ 
      this.questions = data.questions
      this.assessmentData.questions = data.questions ;
    })
    
  }

  backToCourse(){
    this.router.navigate(['/course' ,this.instId]);
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

   

    const areAllQuestionsFilled = this.questions.every((q) => q.question.trim() !== '');
    const areAllAnswersFilled = this.questions.every((q) => q.answer !== null);

    if(!areAllQuestionsFilled || !areAllAnswersFilled){
      const error = areAllQuestionsFilled ? areAllAnswersFilled ? "" : ", Please select the correct answers Before submit" : "Question Field Not be Empty " ;
      alert(error)
    }
    else{
      this.courseService.updateAssessment(this.courseId, this.assessmentData).subscribe(
        (response) => {
          alert('Assessment saved successfully:');
          this.router.navigate(['/course',this.instId]);
        },
        (error) => {
          alert('Error saving assessment:'+error);
        }
      );
    }

  }
  trackByFn(index: number, item: any): any {
    return index; 
  }
}
