import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DialogGridComponent } from './dialog-grid.component';

describe('DialogGridComponent', () => {
  let component: DialogGridComponent;
  let fixture: ComponentFixture<DialogGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        DialogGridComponent,
        MatDialogModule,
        NoopAnimationsModule,
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
        { provide: MatDialogRef, useValue: { 
           
          close: () => {} 
        } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        TranslateService
      ]
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
