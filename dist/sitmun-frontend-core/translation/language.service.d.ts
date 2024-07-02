import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Language } from './language.model';
import * as i0 from "@angular/core";
export declare class LanguageService extends RestService<Language> {
    private http;
    /** API resource path */
    LANGUAGES_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove translation*/
    remove(item: Language): Observable<Object>;
    /** save translation*/
    save(item: Language): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<LanguageService, never>;
    static ɵprov: i0.ɵɵInjectableDef<LanguageService>;
}
