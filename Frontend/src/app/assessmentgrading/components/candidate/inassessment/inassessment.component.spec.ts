import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InassessmentComponent } from './inassessment.component';

describe('InassessmentComponent', () => {
  let component: InassessmentComponent;
  let fixture: ComponentFixture<InassessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InassessmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InassessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
