import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackMyLearningComponent } from './track-my-learning.component';

describe('TrackMyLearningComponent', () => {
  let component: TrackMyLearningComponent;
  let fixture: ComponentFixture<TrackMyLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackMyLearningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackMyLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
