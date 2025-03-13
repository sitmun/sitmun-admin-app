import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BtnEditRenderedComponent } from './btn-edit-rendered.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

describe('BtnEditRenderedComponent', () => {
  let component: BtnEditRenderedComponent;
  let fixture: ComponentFixture<BtnEditRenderedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnEditRenderedComponent ],
      imports: [ MatIconModule ],
      schemas: [NO_ERRORS_SCHEMA]
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
