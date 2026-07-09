import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { LanguageService, DefaultLanguageChangePreview, DefaultLanguageChangeResult } from '@app/domain/translation/services/language.service';

import { DefaultLanguageChangeDialogComponent, DefaultLanguageChangeDialogData } from './default-language-change-dialog.component';

describe('DefaultLanguageChangeDialogComponent', () => {
  let component: DefaultLanguageChangeDialogComponent;
  let fixture: ComponentFixture<DefaultLanguageChangeDialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<DefaultLanguageChangeDialogComponent>>;
  let mockLanguageService: jest.Mocked<LanguageService>;

  const mockDialogData: DefaultLanguageChangeDialogData = {
    from: 'en',
    to: 'ca',
    languageService: {} as LanguageService
  };

  const mockPreviewComplete: DefaultLanguageChangePreview = {
    currentDefault: 'en',
    requestedDefault: 'ca',
    affectedValues: 100,
    backupUpserts: 100,
    restoredValues: 100,
    missingTranslations: 0,
    missing: []
  };

  const mockPreviewWithMissing: DefaultLanguageChangePreview = {
    currentDefault: 'en',
    requestedDefault: 'ca',
    affectedValues: 100,
    backupUpserts: 100,
    restoredValues: 80,
    missingTranslations: 20,
    missing: [
      { entity: 'Application', element: 1, column: 'Application.name', currentValue: 'Test App' },
      { entity: 'Territory', element: 2, column: 'Territory.name', currentValue: 'Test Territory' }
    ]
  };

  const mockResultComplete: DefaultLanguageChangeResult = {
    previousDefault: 'en',
    currentDefault: 'ca',
    backupUpserts: 100,
    restoredValues: 100,
    preservedValues: 0,
    preservedMissing: []
  };

  const mockResultWithPreserved: DefaultLanguageChangeResult = {
    previousDefault: 'en',
    currentDefault: 'ca',
    backupUpserts: 100,
    restoredValues: 80,
    preservedValues: 20,
    preservedMissing: [
      { entity: 'Application', element: 1, column: 'Application.name', currentValue: 'Test App' }
    ]
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn()
    } as any;
    mockLanguageService = {
      previewDefaultLanguageChange: jest.fn(),
      applyDefaultLanguageChange: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [DefaultLanguageChangeDialogComponent],
      imports: [
        MatProgressSpinnerModule,
        MatButtonModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { ...mockDialogData, languageService: mockLanguageService } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultLanguageChangeDialogComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load preview on init with complete translations', (done) => {
      mockLanguageService.previewDefaultLanguageChange.mockReturnValue(of(mockPreviewComplete));

      fixture.detectChanges(); // triggers ngOnInit

      setTimeout(() => {
        expect(mockLanguageService.previewDefaultLanguageChange).toHaveBeenCalledWith('en', 'ca');
        expect(component.preview).toEqual(mockPreviewComplete);
        expect(component.loading).toBe(false);
        expect(component.error).toBeNull();
        done();
      }, 100);
    });

    it('should load preview on init with missing translations', (done) => {
      mockLanguageService.previewDefaultLanguageChange.mockReturnValue(of(mockPreviewWithMissing));

      fixture.detectChanges();

      setTimeout(() => {
        expect(component.preview).toEqual(mockPreviewWithMissing);
        expect(component.hasMissingTranslations).toBe(true);
        done();
      }, 100);
    });

    it('should handle preview error', (done) => {
      const errorMessage = 'Preview failed';
      mockLanguageService.previewDefaultLanguageChange.mockReturnValue(
        throwError(() => ({ error: { message: errorMessage } }))
      );

      fixture.detectChanges();

      setTimeout(() => {
        expect(component.loading).toBe(false);
        expect(component.error).toBe(errorMessage);
        expect(component.preview).toBeNull();
        done();
      }, 100);
    });

    it('should handle generic preview error without message', (done) => {
      mockLanguageService.previewDefaultLanguageChange.mockReturnValue(
        throwError(() => new Error('Generic error'))
      );

      fixture.detectChanges();

      setTimeout(() => {
        expect(component.error).toBe('Failed to load preview');
        done();
      }, 100);
    });
  });

  describe('confirmation flow', () => {
    beforeEach(() => {
      mockLanguageService.previewDefaultLanguageChange.mockReturnValue(of(mockPreviewComplete));
      fixture.detectChanges();
    });

    it('should apply change without missing translations', (done) => {
      mockLanguageService.applyDefaultLanguageChange.mockReturnValue(of(mockResultComplete));

      component.onConfirm(false);

      setTimeout(() => {
        expect(mockLanguageService.applyDefaultLanguageChange).toHaveBeenCalledWith({
          from: 'en',
          to: 'ca',
          continueOnMissingTranslations: false
        });
        expect(component.result).toEqual(mockResultComplete);
        expect(component.processing).toBe(false);
        done();
      }, 100);
    });

    it('should apply change with continueOnMissingTranslations=true', (done) => {
      mockLanguageService.applyDefaultLanguageChange.mockReturnValue(of(mockResultWithPreserved));

      component.onConfirm(true);

      setTimeout(() => {
        expect(mockLanguageService.applyDefaultLanguageChange).toHaveBeenCalledWith({
          from: 'en',
          to: 'ca',
          continueOnMissingTranslations: true
        });
        expect(component.result).toEqual(mockResultWithPreserved);
        done();
      }, 100);
    });

    it('should handle apply error', (done) => {
      const errorMessage = 'Apply failed';
      mockLanguageService.applyDefaultLanguageChange.mockReturnValue(
        throwError(() => ({ error: { message: errorMessage } }))
      );

      component.onConfirm(false);

      setTimeout(() => {
        expect(component.processing).toBe(false);
        expect(component.error).toBe(errorMessage);
        expect(component.result).toBeNull();
        done();
      }, 100);
    });

    it('should not apply when canProceed is false', () => {
      component.preview = null;
      component.onConfirm(false);

      expect(mockLanguageService.applyDefaultLanguageChange).not.toHaveBeenCalled();
    });
  });

  describe('cancellation', () => {
    it('should close dialog on cancel', () => {
      component.onCancel();
      expect(mockDialogRef.close).toHaveBeenCalledWith({ success: false });
    });
  });

  describe('success dialog close', () => {
    beforeEach(() => {
      mockLanguageService.previewDefaultLanguageChange.mockReturnValue(of(mockPreviewComplete));
      fixture.detectChanges();
    });

    it('should close dialog with success after apply completes', () => {
      jest.useFakeTimers();
      mockLanguageService.applyDefaultLanguageChange.mockReturnValue(of(mockResultComplete));

      component.onConfirm(false);

      expect(component.result).toEqual(mockResultComplete);
      jest.advanceTimersByTime(2100);

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        success: true,
        newDefault: 'ca'
      });
      jest.useRealTimers();
    });
  });

  describe('computed properties', () => {
    beforeEach(() => {
      mockLanguageService.previewDefaultLanguageChange.mockReturnValue(of(mockPreviewComplete));
      fixture.detectChanges();
    });

    it('should return false for hasMissingTranslations when no missing translations', (done) => {
      setTimeout(() => {
        expect(component.hasMissingTranslations).toBe(false);
        done();
      }, 100);
    });

    it('should return true for hasMissingTranslations when translations are missing', (done) => {
      mockLanguageService.previewDefaultLanguageChange.mockReturnValue(of(mockPreviewWithMissing));
      component.ngOnInit();

      setTimeout(() => {
        expect(component.hasMissingTranslations).toBe(true);
        done();
      }, 100);
    });

    it('should return true for canProceed when preview exists and not processing', (done) => {
      setTimeout(() => {
        expect(component.canProceed).toBe(true);
        done();
      }, 100);
    });

    it('should return false for canProceed when processing', (done) => {
      setTimeout(() => {
        component.processing = true;
        expect(component.canProceed).toBe(false);
        done();
      }, 100);
    });

    it('should return false for canProceed when no preview', () => {
      component.preview = null;
      expect(component.canProceed).toBe(false);
    });
  });

  describe('result display', () => {
    beforeEach(() => {
      mockLanguageService.previewDefaultLanguageChange.mockReturnValue(of(mockPreviewComplete));
      fixture.detectChanges();
    });

    it('should show result after successful apply', (done) => {
      mockLanguageService.applyDefaultLanguageChange.mockReturnValue(of(mockResultComplete));

      component.onConfirm(false);

      setTimeout(() => {
        expect(component.result).toBeTruthy();
        expect(component.result?.currentDefault).toBe('ca');
        done();
      }, 100);
    });

    it('should show preserved values in result', (done) => {
      mockLanguageService.applyDefaultLanguageChange.mockReturnValue(of(mockResultWithPreserved));

      component.onConfirm(true);

      setTimeout(() => {
        expect(component.result?.preservedValues).toBe(20);
        expect(component.result?.preservedMissing.length).toBe(1);
        done();
      }, 100);
    });
  });
});
