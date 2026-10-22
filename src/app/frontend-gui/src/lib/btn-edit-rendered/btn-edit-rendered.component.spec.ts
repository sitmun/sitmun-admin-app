import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

import { BtnEditRenderedComponent } from './btn-edit-rendered.component';

describe('BtnEditRenderedComponent', () => {
  let component: BtnEditRenderedComponent;
  let fixture: ComponentFixture<BtnEditRenderedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnEditRenderedComponent ],
      imports: [ MatIconModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnEditRenderedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('calls clicked with the cell value when the button is clicked', () => {
    const clicked = jest.fn();
    component.params = {clicked, value: 'row-1'};
    fixture.debugElement.query(By.css('button')).triggerEventHandler('click', {});
    expect(clicked).toHaveBeenCalledWith('row-1');
  });
});
