import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenManagementComponent } from './screen-management.component';

describe('ScreenManagementComponent', () => {
  let component: ScreenManagementComponent;
  let fixture: ComponentFixture<ScreenManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScreenManagementComponent]
    });
    fixture = TestBed.createComponent(ScreenManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
