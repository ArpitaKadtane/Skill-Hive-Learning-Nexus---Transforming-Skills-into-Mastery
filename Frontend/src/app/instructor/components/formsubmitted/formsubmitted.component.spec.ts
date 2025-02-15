import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsubmittedComponent } from './formsubmitted.component';

describe('FormsubmittedComponent', () => {
  let component: FormsubmittedComponent;
  let fixture: ComponentFixture<FormsubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsubmittedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormsubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
