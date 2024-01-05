import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDetailsPopupComponent } from './error-details-popup.component';

describe('ErrorDetailsPopupComponent', () => {
  let component: ErrorDetailsPopupComponent;
  let fixture: ComponentFixture<ErrorDetailsPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorDetailsPopupComponent]
    });
    fixture = TestBed.createComponent(ErrorDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
