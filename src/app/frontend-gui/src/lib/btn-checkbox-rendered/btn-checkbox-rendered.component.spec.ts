import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BtnCheckboxRenderedComponent } from './btn-checkbox-rendered.component';

describe('BtnCheckboxRenderedComponent', () => {
  let component: BtnCheckboxRenderedComponent;
  let fixture: ComponentFixture<BtnCheckboxRenderedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnCheckboxRenderedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnCheckboxRenderedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
