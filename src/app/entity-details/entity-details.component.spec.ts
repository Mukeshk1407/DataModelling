import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDetailsComponent } from './entity-details.component';

describe('EntityDetailsComponent', () => {
  let component: EntityDetailsComponent;
  let fixture: ComponentFixture<EntityDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityDetailsComponent],
    });
    fixture = TestBed.createComponent(EntityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
