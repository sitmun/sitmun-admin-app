import { Component, Input } from '@angular/core';

import { FeatureFlagKeys } from './feature-flag.config';
import { FeatureFlagPipe } from './feature-flag.pipe';
import { FeatureFlagService } from './feature-flag.service';

@Component({
  selector: 'app-feature-flag',
  template: `
    <span [class.experimental]="isExperimental()" style="display: inline-flex; align-items: center; gap: 4px;">
      <span [style.color]="isExperimental() ? 'var(--mat-warn-main, #f44336)' : 'inherit'">{{ text | featureFlag:flag }}</span>
      <mat-icon *ngIf="isExperimental()" style="font-size: 18px; width: 18px; height: 18px; line-height: 18px; color: var(--mat-warn-main, #f44336);">science</mat-icon>
    </span>
  `,
  providers: [FeatureFlagPipe]
})
export class FeatureFlagComponent {
  @Input() text: string;
  @Input() flag: FeatureFlagKeys;

  constructor(private featureFlagService: FeatureFlagService) {}

  isExperimental(): boolean {
    return this.featureFlagService.isFeatureExperimental(this.flag);
  }
} 