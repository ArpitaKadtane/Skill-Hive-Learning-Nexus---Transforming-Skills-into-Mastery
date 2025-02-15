import { Component } from '@angular/core';
import { IntroductionComponent } from '../introduction/introduction.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [IntroductionComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  subscribe() {
    throw new Error('Method not implemented.');
    }
    email: any;
      toggleMenu() {
        const navList = document.querySelector('.nav-links');
        if (navList) {
          navList.classList.toggle('active');
        }
      }
}
