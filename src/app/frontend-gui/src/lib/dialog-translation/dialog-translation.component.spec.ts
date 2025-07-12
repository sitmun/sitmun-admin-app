import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogTranslationComponent } from './dialog-translation.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DialogTranslationComponent', () => {
  let component: DialogTranslationComponent;
  let fixture: ComponentFixture<DialogTranslationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTranslationComponent ],
      imports: [
        MatDialogModule,
        MatIconModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        TranslateService,
        MatIconRegistry
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTranslationComponent);
    component = fixture.componentInstance;
    component.translationsMap = new Map<string, any>();
    component.languagesAvailables = [];
    component.languageByDefault = 'en';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
