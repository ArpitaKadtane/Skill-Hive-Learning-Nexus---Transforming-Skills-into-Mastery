import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDashComponent } from './assessment-dash.component';

describe('AssessmentDashComponent', () => {
  let component: AssessmentDashComponent;
  let fixture: ComponentFixture<AssessmentDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentDashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
