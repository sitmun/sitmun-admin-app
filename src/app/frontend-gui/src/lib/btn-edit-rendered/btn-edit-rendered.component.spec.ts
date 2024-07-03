import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BtnEditRenderedComponent } from './btn-edit-rendered.component';

describe('BtnEditRenderedComponent', () => {
  let component: BtnEditRenderedComponent;
  let fixture: ComponentFixture<BtnEditRenderedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnEditRenderedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnEditRenderedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
