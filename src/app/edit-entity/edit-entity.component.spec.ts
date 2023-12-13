import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEntityComponent } from './edit-entity.component';

describe('EditEntityComponent', () => {
  let component: EditEntityComponent;
  let fixture: ComponentFixture<EditEntityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEntityComponent]
    });
    fixture = TestBed.createComponent(EditEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
