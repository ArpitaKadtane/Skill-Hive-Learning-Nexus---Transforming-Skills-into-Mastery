import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../../../../candidates/components/footer/footer.component";
import { SideMenuComponent } from "../../../../side-menu/side-menu.component";
import { HeaderComponent } from "../../../../candidates/components/header/header.component";
@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, SideMenuComponent, HeaderComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit{
  assessmentData : any | undefined ;
  courseName : string | undefined ;
  courseId: any | undefined;

  ngOnInit(): void {
      this.assessmentData = history.state.assessmentData ;
      this.courseName =history.state.courseName ;
      this.courseId = history.state.courseId
  }

isMenuVisible: boolean = false;

onMenuToggle() {
  this.isMenuVisible = !this.isMenuVisible;
}
  constructor( private router: Router){}

  completeReview(){
    this.router.navigate(['/candidate/assessmentdash'])
  }
}
