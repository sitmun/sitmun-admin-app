import { TemplateRef, ViewContainerRef } from '@angular/core';
import { Principal } from './principal.service';
import * as i0 from "@angular/core";
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
    set sitmunHasAnyAuthorityOnTerritory(opts: any);
    /** update view */
    private updateView;
    static ɵfac: i0.ɵɵFactoryDef<HasAnyAuthorityOnTerritoryDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<HasAnyAuthorityOnTerritoryDirective, "[sitmunHasAnyAuthorityOnTerritory]", never, { "sitmunHasAnyAuthorityOnTerritory": "sitmunHasAnyAuthorityOnTerritory"; }, {}, never>;
}
