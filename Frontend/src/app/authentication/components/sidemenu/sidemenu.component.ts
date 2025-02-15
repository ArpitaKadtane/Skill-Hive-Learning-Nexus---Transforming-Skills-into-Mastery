import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  @Output() closeSideMenu:EventEmitter<boolean>=new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef) { }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeSideMenu.emit(true);
    }
  }
}
