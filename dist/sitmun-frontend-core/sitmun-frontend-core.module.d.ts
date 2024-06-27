import { ModuleWithProviders } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as i0 from "@angular/core";
import * as i1 from "./auth/has-any-authority.directive";
import * as i2 from "./auth/has-any-authority-on-territory.directive";
import * as i3 from "@ngx-translate/core";
/** load i18n assets*/
export declare function createTranslateLoader(http: HttpClient): TranslateHttpLoader;
/** SITMUN frontend core module */
export declare class SitmunFrontendCoreModule {
    static forRoot(): ModuleWithProviders<SitmunFrontendCoreModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<SitmunFrontendCoreModule, [typeof i1.HasAnyAuthorityDirective, typeof i2.HasAnyAuthorityOnTerritoryDirective], [typeof i3.TranslateModule], [typeof i1.HasAnyAuthorityDirective, typeof i2.HasAnyAuthorityOnTerritoryDirective, typeof i3.TranslateModule]>;
    static ɵinj: i0.ɵɵInjectorDef<SitmunFrontendCoreModule>;
}
