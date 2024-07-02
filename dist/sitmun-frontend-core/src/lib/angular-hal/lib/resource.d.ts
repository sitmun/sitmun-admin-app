import { HalOptions } from './rest.service';
import { SubTypeBuilder } from './subtype-builder';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/** Abstract resource class*/
export declare abstract class Resource {
    /** proxy URL */
    proxyUrl: string;
    /** root URL */
    rootUrl: string;
    /** links */
    _links: any;
    /** subtypes */
    _subtypes: Map<string, any>;
    /** get subtypes */
    get subtypes(): Map<string, any>;
    /** set subtypes */
    set subtypes(_subtypes: Map<string, any>);
    /** constructor*/
    constructor();
    /** Get collection of related resources */
    getRelationArray<T extends Resource>(type: {
        new (): T;
    }, relation: string, _embedded?: string, options?: HalOptions, builder?: SubTypeBuilder): Observable<T[]>;
    /** Get related resource */
    getRelation<T extends Resource>(type: {
        new (): T;
    }, relation: string, builder?: SubTypeBuilder): Observable<T>;
    /** Adds the given resource to the bound collection by the relation */
    addRelation<T extends Resource>(relation: string, resource: T): Observable<any>;
    /** Bind the given resource to this resource by the given relation*/
    updateRelation<T extends Resource>(relation: string, resource: T): Observable<any>;
    /** Bind the given resource to this resource by the given relation*/
    substituteRelation<T extends Resource>(relation: string, resource: T): Observable<any>;
    /** Bind the given resource to this resource by the given relation*/
    substituteAllRelation<T extends Resource>(relation: string, resources: Resource[]): Observable<any>;
    /** Unbind the resource with the given relation from this resource*/
    deleteRelation<T extends Resource>(relation: string, resource: T): Observable<any>;
    /** Unbind the resource with the given relation from this resource*/
    deleteAllRelation<T extends Resource>(relation: string): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<Resource, never>;
    static ɵprov: i0.ɵɵInjectableDef<Resource>;
}
