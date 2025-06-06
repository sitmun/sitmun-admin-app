import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagKeys } from './feature-flag.config';

@Directive({
  selector: '[featureFlag]'
})
export class FeatureFlagDirective implements OnInit {
  private hasView = false;

  @Input() set featureFlag(feature: FeatureFlagKeys) {
    const isEnabled = this.featureFlagService.isFeatureEnabled(feature);
    
    if (isEnabled && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!isEnabled && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureFlagService: FeatureFlagService
  ) {}

  ngOnInit() {}
}