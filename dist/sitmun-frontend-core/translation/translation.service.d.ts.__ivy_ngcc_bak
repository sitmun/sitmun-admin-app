import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Translation } from './translation.model';
export declare class TranslationService extends RestService<Translation> {
    private http;
    /** API resource path */
    TRANSLATION_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove translation*/
    remove(item: Translation): Observable<Object>;
    /** save translation*/
    save(item: Translation): Observable<any>;
}
