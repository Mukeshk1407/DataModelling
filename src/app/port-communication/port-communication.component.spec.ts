import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortCommunicationComponent } from './port-communication.component';

describe('PortCommunicationComponent', () => {
  let component: PortCommunicationComponent;
  let fixture: ComponentFixture<PortCommunicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortCommunicationComponent]
    });
    fixture = TestBed.createComponent(PortCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
