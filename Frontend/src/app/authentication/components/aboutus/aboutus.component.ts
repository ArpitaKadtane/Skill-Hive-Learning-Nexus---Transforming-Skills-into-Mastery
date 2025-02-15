import { Component } from '@angular/core';
import { NewsletterComponent } from '../../../instructor/components/newsletter/newsletter.component';

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [NewsletterComponent],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.scss'
})
export class AboutusComponent {

}
