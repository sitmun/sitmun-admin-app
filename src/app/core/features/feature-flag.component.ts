import { Component, Input } from '@angular/core';
import { FeatureFlagKeys } from './feature-flag.config';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagPipe } from './feature-flag.pipe';

@Component({
  selector: 'app-feature-flag',
  template: `<span>{{ text | featureFlag:flag }}</span>`,
  providers: [FeatureFlagPipe]
})
export class FeatureFlagComponent {
  @Input() text: string;
  @Input() flag: FeatureFlagKeys;

  constructor(private featureFlagService: FeatureFlagService) {}
} 