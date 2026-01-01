import {
  Directive,
  Input,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagKeys } from './feature-flag.config';

@Directive({
  selector: '[featureFlag]'
})
export class FeatureFlagDirective implements OnInit, OnDestroy {
  private hasView = false;
  private featureFlagKey?: FeatureFlagKeys;
  private subscription?: Subscription;

  @Input() set featureFlag(feature: FeatureFlagKeys) {
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
    this.subscription = this.featureFlagService.featureFlags$.subscribe(() => {
      this.updateView();
    });
    // Initial check
    this.updateView();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private updateView(): void {
    if (!this.featureFlagKey) {
      return;
    }

    const isEnabled =
      this.featureFlagService.isFeatureEnabled(this.featureFlagKey);

    if (isEnabled && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!isEnabled && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
