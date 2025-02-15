import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateRegistrationComponent } from './candidate-registration.component';

describe('CandidateRegistrationComponent', () => {
  let component: CandidateRegistrationComponent;
  let fixture: ComponentFixture<CandidateRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CandidateRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
