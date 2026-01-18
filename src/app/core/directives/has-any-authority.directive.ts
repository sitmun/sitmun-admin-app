import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Principal } from '@app/core/auth/principal.service';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *appHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *appHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
  selector: '[appHasAnyAuthority]'
})
export class HasAnyAuthorityDirective implements OnInit {
  /** authorities to check */
  public authorities: string[];

  private destroyRef = inject(DestroyRef);
  private subscriptionInitialized = false;

  /** constructor */
  constructor(private principal: Principal, private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {
  }

  /** territory to check authorities*/
  @Input() territory: string;

  /** Set whether current user has any of the given authorities */
  @Input()
  set appHasAnyAuthority(value: string|string[]) {
    this.authorities = typeof value === 'string' ? [ <string> value ] : <string[]> value;
    this.updateView();
  }

  ngOnInit(): void {
    // Subscribe to authentication state changes only once
    if (!this.subscriptionInitialized) {
      this.principal.getAuthenticationState()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((_identity) => this.updateView());
      this.subscriptionInitialized = true;
    }
  }

  /** update view */
  private updateView(): void {
    if (this.territory){
      this.principal.hasAnyAuthorityOnTerritory(this.authorities,this.territory).then((result) => {
        this.viewContainerRef.clear();
        if (result) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      });

    } else {
      this.principal.hasAnyAuthority(this.authorities).then((result) => {
        this.viewContainerRef.clear();
        if (result) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      });
    }
  }
}
