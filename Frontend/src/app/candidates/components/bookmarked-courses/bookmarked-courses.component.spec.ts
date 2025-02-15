import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkedCoursesComponent } from './bookmarked-courses.component';

describe('BookmarkedCoursesComponent', () => {
  let component: BookmarkedCoursesComponent;
  let fixture: ComponentFixture<BookmarkedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookmarkedCoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookmarkedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
