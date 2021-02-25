import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Language } from './language.model';
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
}
