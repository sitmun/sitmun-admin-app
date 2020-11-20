import { TemplateRef, ViewContainerRef } from '@angular/core';
import { Principal } from './principal.service';
/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *sitmunHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *sitmunHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
import * as ɵngcc0 from '@angular/core';
export declare class HasAnyAuthorityOnTerritoryDirective {
    private principal;
    private templateRef;
    private viewContainerRef;
    /** authorities to check */
    authorities: string[];
    /** territory to check authorities*/
    territory: string;
    /** constructor */
    constructor(principal: Principal, templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef);
    /** Set whether current user has any of the given authorities on territory */
    sitmunHasAnyAuthorityOnTerritory: any;
    /** update view */
    private updateView();
    static ɵfac: ɵngcc0.ɵɵFactoryDef<HasAnyAuthorityOnTerritoryDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<HasAnyAuthorityOnTerritoryDirective, "[sitmunHasAnyAuthorityOnTerritory]", never, { "sitmunHasAnyAuthorityOnTerritory": "sitmunHasAnyAuthorityOnTerritory"; }, {}, never>;
}

//# sourceMappingURL=has-any-authority-on-territory.directive.d.ts.map