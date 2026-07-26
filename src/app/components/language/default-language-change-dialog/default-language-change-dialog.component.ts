import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {
  DefaultLanguageChangePreview,
  DefaultLanguageChangeResult,
  LanguageService
} from '@app/domain/translation/services/language.service';

export interface DefaultLanguageChangeDialogData {
  from: string;
  fromName?: string;
  to: string;
  toName?: string;
  languageService: LanguageService;
}

@Component({
  selector: 'app-default-language-change-dialog',
  templateUrl: './default-language-change-dialog.component.html',
  styleUrls: ['./default-language-change-dialog.component.scss'],
  standalone: false
})
export class DefaultLanguageChangeDialogComponent implements OnInit {
  loading = true;
  error: string | null = null;
  preview: DefaultLanguageChangePreview | null = null;
  result: DefaultLanguageChangeResult | null = null;
  processing = false;

  constructor(
    public dialogRef: MatDialogRef<DefaultLanguageChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DefaultLanguageChangeDialogData
  ) {}

  ngOnInit(): void {
    this.loadPreview();
  }

  private loadPreview(): void {
    this.loading = true;
    this.error = null;

    this.data.languageService.previewDefaultLanguageChange(this.data.from, this.data.to).subscribe({
      next: (preview) => {
        this.preview = preview;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load preview';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }

  onConfirm(continueOnMissing: boolean): void {
    if (!this.preview) return;

    this.processing = true;
    this.error = null;

    this.data.languageService.applyDefaultLanguageChange({
      from: this.data.from,
      to: this.data.to,
      continueOnMissingTranslations: continueOnMissing
    }).subscribe({
      next: (result) => {
        this.result = result;
        this.processing = false;
        // Auto-close after showing success
        setTimeout(() => {
          this.dialogRef.close({
            success: true,
            newDefault: result.currentDefault
          });
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to apply change';
        this.processing = false;
      }
    });
  }

  get hasMissingTranslations(): boolean {
    return (this.preview?.missingTranslations || 0) > 0;
  }

  get canProceed(): boolean {
    return this.preview !== null && !this.loading && !this.processing && this.result === null;
  }

  get fromLabel(): string {
    return this.data.fromName ? `${this.data.fromName} (${this.data.from})` : this.data.from;
  }

  get toLabel(): string {
    return this.data.toName ? `${this.data.toName} (${this.data.to})` : this.data.to;
  }
}
