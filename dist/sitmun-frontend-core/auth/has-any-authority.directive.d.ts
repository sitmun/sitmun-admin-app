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
export declare class HasAnyAuthorityDirective {
    private principal;
    private templateRef;
    private viewContainerRef;
    /** authorities to check */
    authorities: string[];
    /** constructor */
    constructor(principal: Principal, templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef);
    /** territory to check authorities*/
    territory: string;
    /** Set whether current user has any of the given authorities */
    sitmunHasAnyAuthority: string | string[];
    /** update view */
    private updateView();
    static ɵfac: ɵngcc0.ɵɵFactoryDef<HasAnyAuthorityDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<HasAnyAuthorityDirective, "[sitmunHasAnyAuthority]", never, { "sitmunHasAnyAuthority": "sitmunHasAnyAuthority"; "territory": "territory"; }, {}, never>;
}

//# sourceMappingURL=has-any-authority.directive.d.ts.map