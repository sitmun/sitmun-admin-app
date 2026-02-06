import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Principal } from '@app/core/auth/principal.service';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *appHasAnyAuthorityOnTerritory="{authorities: 'ROLE_ADMIN', territory: 'TERRITORY_ID'}">...</some-element>
 * ```
 */
@Directive({
    selector: '[appHasAnyAuthorityOnTerritory]',
    standalone: false
})
export class HasAnyAuthorityOnTerritoryDirective implements OnInit {
  /** authorities to check */
  public authorities: string[];

  /** territory to check authorities*/
  public territory: string;

  private destroyRef = inject(DestroyRef);
  private subscriptionInitialized = false;

  /** constructor */
  constructor(private principal: Principal, private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {
  }

  /** Set whether current user has any of the given authorities on territory */
  @Input()
  set appHasAnyAuthorityOnTerritory(opts: any) {
    this.authorities = typeof opts.authorities === 'string' ? [ <string> opts.authorities ] : <string[]> opts.authorities;
    this.territory = opts.territory;
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
