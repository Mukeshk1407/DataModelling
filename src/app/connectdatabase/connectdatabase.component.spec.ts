import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectdatabaseComponent } from './connectdatabase.component';

describe('ConnectdatabaseComponent', () => {
  let component: ConnectdatabaseComponent;
  let fixture: ComponentFixture<ConnectdatabaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectdatabaseComponent]
    });
    fixture = TestBed.createComponent(ConnectdatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
