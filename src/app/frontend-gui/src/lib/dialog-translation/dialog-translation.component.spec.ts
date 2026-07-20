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

  it('omits disabled languages from availableLanguages', () => {
    component.languageByDefault = 'en';
    component.languagesAvailables = [
      { shortname: 'en', name: 'English', enabled: true },
      { shortname: 'ca', name: 'Català', enabled: true },
      { shortname: 'fr', name: 'Français', enabled: false },
    ];
    expect(component.availableLanguages.map((l) => l.shortname)).toEqual(['ca']);
  });

  it('disables accept until a translation value changes', () => {
    fixture = TestBed.createComponent(DialogTranslationComponent);
    component = fixture.componentInstance;
    component.languageByDefault = 'en';
    component.languagesAvailables = [
      { shortname: 'en', name: 'English', enabled: true },
      { shortname: 'ca', name: 'Català', enabled: true },
    ];
    component.translationsMap = new Map([
      ['ca', { translation: 'Catalan', column: 'Language.name' }],
    ]);
    component.ngOnInit();

    expect(component.canAccept).toBe(false);

    component.translationForm.get('caValue')?.setValue('Català');
    expect(component.canAccept).toBe(true);

    component.translationForm.get('caValue')?.setValue('Catalan');
    expect(component.canAccept).toBe(false);
  });
});
