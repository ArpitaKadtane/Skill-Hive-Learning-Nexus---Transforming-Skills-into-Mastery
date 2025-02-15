import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  userProfile: string;

  constructor(private candidateservice:CandidateService){

  }
  ngOnInit() {
    this.candidateservice.getAdditionalDetailsByEmail(localStorage.getItem('candidateEmail')).subscribe(
      (response)=>{
        this.userProfile = response?.profilePicture
      },
      (error)=>{
        console.log(error)
      }
    )
  }
  @Input() isMenuOpen: boolean = false; 
  @Output() menuToggle = new EventEmitter<void>();

  toggleSideMenu() {
    this.menuToggle.emit();
  }
}
