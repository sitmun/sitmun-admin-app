import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { Language } from '@app/domain/translation/models/language.model';

import {
  LiteralTranslationCreateDialogComponent,
  LiteralTranslationCreateDialogResult,
} from './literal-translation-create-dialog.component';

describe('LiteralTranslationCreateDialogComponent', () => {
  let component: LiteralTranslationCreateDialogComponent;
  let fixture: ComponentFixture<LiteralTranslationCreateDialogComponent>;
  let dialogRef: { close: jest.Mock };

  const languages: Language[] = [
    { id: 2, shortname: 'es', name: 'Spanish', order: 2 } as Language,
    { id: 1, shortname: 'ca', name: 'Catalan', order: 1 } as Language,
  ];

  beforeEach(async () => {
    dialogRef = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [
        LiteralTranslationCreateDialogComponent,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({ getTranslation: () => of({}) }),
          },
        }),
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { languages, defaultLanguage: 'ca' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LiteralTranslationCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates controls for every language ordered by administrator order', () => {
    expect(component.orderedLanguages.map((language) => language.shortname)).toEqual(['ca', 'es']);
    expect(component.controlFor(languages[0])).toBeTruthy();
    expect(component.controlFor(languages[1])).toBeTruthy();
  });

  it('keeps source language translation synced with the literal', () => {
    component.literalControl.setValue('hello');

    expect(component.controlFor({ shortname: 'ca' } as Language).value).toBe('hello');
  });

  it('closes with translations when saved', () => {
    component.literalControl.setValue('hello');
    component.controlFor({ shortname: 'es' } as Language).setValue('hola');

    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith({
      literal: 'hello',
      sourceLanguage: 'ca',
      translations: {
        ca: 'hello',
        es: 'hola',
      },
    } satisfies LiteralTranslationCreateDialogResult);
  });
});
