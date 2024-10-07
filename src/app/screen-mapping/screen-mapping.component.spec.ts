import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenMappingComponent } from './screen-mapping.component';

describe('ScreenMappingComponent', () => {
  let component: ScreenMappingComponent;
  let fixture: ComponentFixture<ScreenMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScreenMappingComponent]
    });
    fixture = TestBed.createComponent(ScreenMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
