import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  DestroyRef,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FeatureFlagKeys } from './feature-flag.config';
import { FeatureFlagService } from './feature-flag.service';

/**
 * Structural directive that conditionally renders content based on feature flag state.
 * Usage: <ng-container *appFeatureFlag="'FEATURE_KEY'">...</ng-container>
 */
@Directive({
    selector: '[appFeatureFlag]',
    standalone: false
})
export class FeatureFlagDirective implements OnInit {
  private hasView = false;
  private featureFlagKey?: FeatureFlagKeys;
  private destroyRef = inject(DestroyRef);

  @Input('appFeatureFlag') set featureFlag(feature: FeatureFlagKeys) {
    this.featureFlagKey = feature;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureFlagService: FeatureFlagService
  ) {}

  ngOnInit() {
    // Subscribe to feature flag changes
    this.featureFlagService.featureFlags$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateView();
      });
    // Initial check
    this.updateView();
  }

  private updateView(): void {
    if (!this.featureFlagKey) {
      return;
    }

    const isEnabled =
      this.featureFlagService.isFeatureEnabled(this.featureFlagKey);

    // Only update view if state has actually changed
    if (isEnabled && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!isEnabled && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
    // If state matches view state (enabled+hasView or !enabled+!hasView), do nothing
  }
}
