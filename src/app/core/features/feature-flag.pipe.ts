import { Pipe, PipeTransform } from '@angular/core';

import { FeatureFlagKeys } from './feature-flag.config';
import { FeatureFlagService } from './feature-flag.service';

@Pipe({
    name: 'featureFlag',
    pure: true,
    standalone: false
})
export class FeatureFlagPipe implements PipeTransform {
  constructor(private featureFlagService: FeatureFlagService) {}

  transform(text: string, _featureKey: FeatureFlagKeys): string {
    if (!text) return '';
    // Just return the text - icon is handled by FeatureFlagComponent
    return text;
  }
} 