import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DialogMessageComponent } from './dialog-message.component';

describe('DialogMessageComponent', () => {
  let component: DialogMessageComponent;
  let fixture: ComponentFixture<DialogMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMessageComponent ],
      imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
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
    fixture = TestBed.createComponent(DialogMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses default mini-fab actions when destructive is false', () => {
    component.destructive = false;
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('mat-dialog-actions button');
    expect(buttons.length).toBe(2);
    expect(fixture.nativeElement.querySelector('mat-dialog-actions button[mat-mini-fab]')).toBeTruthy();
  });

  it('uses mini-fab actions with discard icon when destructive is true', () => {
    component.destructive = true;
    component.acceptLabel = 'entity.tree.discardNodeChanges.discard';
    component.cancelLabel = 'entity.tree.discardNodeChanges.keepEditing';
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('mat-dialog-actions button[mat-mini-fab]');
    expect(buttons.length).toBe(2);
    expect(fixture.nativeElement.querySelector('mat-dialog-actions mat-icon').textContent.trim()).toBe('cancel');
    expect(fixture.nativeElement.querySelectorAll('mat-dialog-actions mat-icon')[1].textContent.trim()).toBe('delete');
  });
});
