import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { BtnCheckboxFilterComponent } from './btn-checkbox-filter.component';

describe('BtnCheckboxFilterComponent', () => {
  let component: BtnCheckboxFilterComponent;
  let fixture: ComponentFixture<BtnCheckboxFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnCheckboxFilterComponent ],
      imports: [
          TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })
      ],
      providers: [
        TranslateService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnCheckboxFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('reports equals to the parent filter when the value is non-empty', () => {
    const onFloatingFilterChanged = jest.fn();
    component.agInit({
      parentFilterInstance: (callback: (instance: {onFloatingFilterChanged: typeof onFloatingFilterChanged}) => void) => {
        callback({onFloatingFilterChanged});
      },
    } as never);
    component.onChange('true');
    expect(onFloatingFilterChanged).toHaveBeenCalledWith('equals', 'true');
  });

  it('clears the parent filter when the value is empty', () => {
    const onFloatingFilterChanged = jest.fn();
    component.agInit({
      parentFilterInstance: (callback: (instance: {onFloatingFilterChanged: typeof onFloatingFilterChanged}) => void) => {
        callback({onFloatingFilterChanged});
      },
    } as never);
    component.onChange('');
    expect(onFloatingFilterChanged).toHaveBeenCalledWith(null, null);
  });
});
