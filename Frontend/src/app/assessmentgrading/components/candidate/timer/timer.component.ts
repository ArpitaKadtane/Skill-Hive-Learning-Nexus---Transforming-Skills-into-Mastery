import { Component , EventEmitter, Input, OnInit, Output} from '@angular/core';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent implements OnInit {
  @Input() durationInMinutes: number = 1; 
  @Output() timerEnded = new EventEmitter<void>();

  private subscription!: Subscription;
  totalSeconds!: number;
  minutes: number = 0;
  seconds: number = 0;
  hours : number = 0;

  ngOnInit(): void {
    this.totalSeconds = this.durationInMinutes * 60;
    this.startTimer();
  }

  startTimer(): void {
    this.subscription = interval(1000).subscribe(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
        this.hours = Math.floor(this.totalSeconds / 3600);
        this.minutes =Math.floor((this.totalSeconds % 3600) / 60);
        this.seconds = this.totalSeconds % 60;
      } else {
        this.subscription.unsubscribe();
        this.timerEnded.emit(); 
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
