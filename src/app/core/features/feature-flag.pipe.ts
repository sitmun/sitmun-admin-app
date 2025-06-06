import { Pipe, PipeTransform } from '@angular/core';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagKeys } from './feature-flag.config';

@Pipe({
  name: 'featureFlag',
  pure: true
})
export class FeatureFlagPipe implements PipeTransform {
  constructor(private featureFlagService: FeatureFlagService) {}

  transform(text: string, featureKey: FeatureFlagKeys): string {
    if (!text) return '';
    const config = this.featureFlagService.getFeatureConfig(featureKey);
    return config?.experimental ? `${text} 🚧` : text;
  }
} 