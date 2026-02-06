import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DialogTranslationComponent } from './dialog-translation.component';


describe('DialogTranslationComponent', () => {
  let component: DialogTranslationComponent;
  let fixture: ComponentFixture<DialogTranslationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTranslationComponent ],
      imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatIconTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        }),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          close: () => {}
        } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        TranslateService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(DialogTranslationComponent);
    component = fixture.componentInstance;
    component.translationsMap = new Map<string, any>();
    component.languagesAvailables = [];
    component.languageByDefault = 'en';
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
