import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { BtnCheckboxFilterComponent } from './btn-checkbox-filter.component';

describe('BtnCheckboxFilterRenderedComponent', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
