import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CourseService } from '../../course/services/course.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(private courseService:CourseService){

  }
  ngOnInit() {
  }
  @Input() isMenuOpen: boolean = false; 
  @Output() menuToggle = new EventEmitter<void>();

  toggleSideMenu() {
    this.menuToggle.emit();
  }
}
