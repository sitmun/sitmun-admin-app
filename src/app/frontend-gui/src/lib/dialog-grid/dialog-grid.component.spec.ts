import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DialogGridComponent } from './dialog-grid.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('DialogGridComponent', () => {
  let component: DialogGridComponent;
  let fixture: ComponentFixture<DialogGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGridComponent ],
      imports: [
        MatDialogModule,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        TranslateService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGridComponent);
    component = fixture.componentInstance;
    component.getAllsTable = [];
    component.columnDefsTable = [];
    component.singleSelectionTable = [];
    component.titlesTable = ['Test Title'];
    component.title = 'Test Dialog';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
