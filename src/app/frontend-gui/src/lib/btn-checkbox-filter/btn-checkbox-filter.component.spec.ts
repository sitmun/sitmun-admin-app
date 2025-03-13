import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BtnCheckboxFilterComponent } from './btn-checkbox-filter.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('BtnCheckboxFilterRenderedComponent', () => {
  let component: BtnCheckboxFilterComponent;
  let fixture: ComponentFixture<BtnCheckboxFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnCheckboxFilterComponent ],
      imports: [
        TranslateModule.forRoot()
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
