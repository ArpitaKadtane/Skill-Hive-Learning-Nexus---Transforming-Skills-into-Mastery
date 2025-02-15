import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShceduleDialogComponent } from './shcedule-dialog.component';

describe('ShceduleDialogComponent', () => {
  let component: ShceduleDialogComponent;
  let fixture: ComponentFixture<ShceduleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShceduleDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShceduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
