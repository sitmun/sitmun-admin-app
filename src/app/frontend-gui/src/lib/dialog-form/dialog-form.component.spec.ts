import { ComponentFixture, TestBed } from '@angular/core/testing';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DIALOG_FORM_EVENTS, DialogFormComponent } from './dialog-form.component';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';


describe('DialogFormComponent', () => {
  let component: DialogFormComponent;
  let fixture: ComponentFixture<DialogFormComponent>;
  let dialogRefClose: jest.Mock;
  let dialogOpen: jest.Mock;

  beforeEach(async () => {
    dialogRefClose = jest.fn();
    dialogOpen = jest.fn().mockReturnValue({ componentInstance: {} });

    await TestBed.configureTestingModule({
      declarations: [ DialogFormComponent ],
      imports: [
        MatDialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        }),
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatTooltipModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: dialogRefClose } },
        { provide: MatDialog, useValue: { open: dialogOpen } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        TranslateService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFormComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('doAdd', () => {
    it('does not close the dialog when the form is invalid', () => {
      component.form = new FormGroup({
        name: new FormControl('', Validators.required)
      });

      component.doAdd();

      expect(dialogRefClose).not.toHaveBeenCalled();
      expect(dialogOpen).toHaveBeenCalledWith(DialogMessageComponent);
    });

    it('opens the required-field warning dialog when the form is invalid', () => {
      component.form = new FormGroup({
        name: new FormControl('', Validators.required)
      });

      component.doAdd();

      const warningDialog = dialogOpen.mock.results[0].value.componentInstance;
      expect(warningDialog.hideCancelButton).toBe(true);
    });

    it('closes with ADD when the form is valid', () => {
      component.form = new FormGroup({
        name: new FormControl('value', Validators.required)
      });

      component.doAdd();

      expect(dialogRefClose).toHaveBeenCalledWith(DIALOG_FORM_EVENTS.ADD);
      expect(dialogOpen).not.toHaveBeenCalled();
    });
  });
});
