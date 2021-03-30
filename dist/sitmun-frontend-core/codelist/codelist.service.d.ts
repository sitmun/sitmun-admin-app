import { CodeList } from './codelist.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Connection manager service */
export declare class CodeListService extends RestService<CodeList> {
    private http;
    /** API resource path */
    CODELIST_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove connection*/
    remove(item: CodeList): Observable<Object>;
    /** save connection*/
    save(item: CodeList): Observable<any>;
}
