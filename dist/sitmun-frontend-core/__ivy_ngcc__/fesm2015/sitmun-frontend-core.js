import { throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { parse } from 'url';
import { HttpHeaders, HttpParams, HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { isNullOrUndefined, isPrimitive } from 'util';
import { Injectable, Inject, Injector, Directive, Input, TemplateRef, ViewContainerRef, NgModule, defineInjectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/expand';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * REST array of resource implementation
 * @template T
 */
import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from '@angular/common/http';
import * as ɵngcc2 from '@angular/router';
import * as ɵngcc3 from '@ngx-translate/core';
class ResourceArray {
    constructor() {
        /**
         * total number of elements in this array
         */
        this.totalElements = 0;
        /**
         * total number of pages in the response
         */
        this.totalPages = 1;
        /**
         * page number in the response
         */
        this.pageNumber = 1;
        /**
         * array components
         */
        this.result = [];
        /**
         * push a new resource to the array
         */
        this.push = (el) => {
            this.result.push(el);
        };
        /**
         * length of the array
         */
        this.length = () => {
            return this.result.length;
        };
        /**
         * load array data from REST request
         */
        this.init = (type, response, sortInfo) => {
            /** @type {?} */
            const result = ResourceHelper.createEmptyResult(this._embedded);
            result.sortInfo = sortInfo;
            ResourceHelper.instantiateResourceCollection(type, response, result);
            return result;
        };
        /**
         * Load next page
         */
        this.next = (type) => {
            if (this.next_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.next_uri), { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, this.sortInfo)), catchError(error => throwError(error)));
            }
            return throwError('no next defined');
        };
        /**
         * Load previous page
         */
        this.prev = (type) => {
            if (this.prev_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.prev_uri), { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, this.sortInfo)), catchError(error => throwError(error)));
            }
            return throwError('no prev defined');
        };
        /**
         * Load first page
         */
        this.first = (type) => {
            if (this.first_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.first_uri), { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, this.sortInfo)), catchError(error => throwError(error)));
            }
            return throwError('no first defined');
        };
        /**
         * Load last page
         */
        this.last = (type) => {
            if (this.last_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.last_uri), { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, this.sortInfo)), catchError(error => throwError(error)));
            }
            return throwError('no last defined');
        };
        /**
         * Load page with given pageNumber
         */
        this.page = (type, pageNumber) => {
            this.self_uri = this.self_uri.replace('{?page,size,sort}', '');
            this.self_uri = this.self_uri.replace('{&sort}', '');
            /** @type {?} */
            let urlParsed = parse(ResourceHelper.getProxy(this.self_uri));
            /** @type {?} */
            let query = ResourceArray.replaceOrAdd(urlParsed.query, 'size', this.pageSize.toString());
            query = ResourceArray.replaceOrAdd(query, 'page', pageNumber.toString());
            /** @type {?} */
            let uri = urlParsed.query ?
                ResourceHelper.getProxy(this.self_uri).replace(urlParsed.query, query) : ResourceHelper.getProxy(this.self_uri).concat(query);
            uri = this.addSortInfo(uri);
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, this.sortInfo)), catchError(error => throwError(error)));
        };
        /**
         * Sort collection based on given sort attribute
         */
        this.sortElements = (type, ...sort) => {
            this.self_uri = this.self_uri.replace('{?page,size,sort}', '');
            this.self_uri = this.self_uri.replace('{&sort}', '');
            /** @type {?} */
            let uri = ResourceHelper.getProxy(this.self_uri).concat('?', 'size=', this.pageSize.toString(), '&page=', this.pageNumber.toString());
            uri = this.addSortInfo(uri);
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, sort)), catchError(error => throwError(error)));
        };
        /**
         * Load page with given size
         */
        this.size = (type, size) => {
            /** @type {?} */
            let uri = ResourceHelper.getProxy(this.self_uri).concat('?', 'size=', size.toString());
            uri = this.addSortInfo(uri);
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, this.sortInfo)), catchError(error => throwError(error)));
        };
    }
    /**
     * Add sort info to given URI
     * @param {?} uri
     * @return {?}
     */
    addSortInfo(uri) {
        if (this.sortInfo) {
            for (const item of this.sortInfo) {
                uri = uri.concat('&sort=', item.path, ',', item.order);
            }
        }
        return uri;
    }
    /**
     * Add replace or add param value to query string
     * @param {?} query
     * @param {?} field
     * @param {?} value
     * @return {?}
     */
    static replaceOrAdd(query, field, value) {
        if (query) {
            /** @type {?} */
            let idx = query.indexOf(field);
            /** @type {?} */
            let idxNextAmp = query.indexOf('&', idx) == -1 ? query.indexOf('/', idx) : query.indexOf('&', idx);
            if (idx != -1) {
                /** @type {?} */
                let seachValue = query.substring(idx, idxNextAmp);
                query = query.replace(seachValue, field + '=' + value);
            }
            else {
                query = query.concat("&" + field + '=' + value);
            }
        }
        else {
            query = "?" + field + '=' + value;
        }
        return query;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * REST API access helper
 */
class ResourceHelper {
    /**
     * get request option params
     * @param {?} params
     * @param {?=} options
     * @return {?}
     */
    static optionParams(params, options) {
        if (options) {
            if (options.params) {
                for (const param of options.params) {
                    params = params.append(param.key, param.value.toString());
                }
            }
            if (options.size) {
                params = params.append('size', options.size.toString());
            }
            if (options.sort) {
                for (const s of options.sort) {
                    /** @type {?} */
                    let sortString = '';
                    sortString = s.path ? sortString.concat(s.path) : sortString;
                    sortString = s.order ? sortString.concat(',').concat(s.order) : sortString;
                    params = params.append('sort', sortString);
                }
            }
        }
        return params;
    }
    /**
     * resolve resource relations
     * @param {?} resource
     * @return {?}
     */
    static resolveRelations(resource) {
        /** @type {?} */
        const result = {};
        for (const key in resource) {
            if (!isNullOrUndefined(resource[key])) {
                if (ResourceHelper.className(resource[key])
                    .find((className) => className == 'Resource')) {
                    if (resource[key]['_links'])
                        result[key] = resource[key]['_links']['self']['href'];
                }
                else if (Array.isArray(resource[key])) {
                    /** @type {?} */
                    let array = resource[key];
                    if (array) {
                        result[key] = new Array();
                        array.forEach((element) => {
                            if (isPrimitive(element)) {
                                result[key].push(element);
                            }
                            else {
                                result[key].push(this.resolveRelations(element));
                            }
                        });
                    }
                }
                else {
                    result[key] = resource[key];
                }
            }
        }
        return /** @type {?} */ (result);
    }
    /**
     * create an empty resource from embedded data
     * @template T
     * @param {?} _embedded
     * @return {?}
     */
    static createEmptyResult(_embedded) {
        /** @type {?} */
        let resourceArray = new ResourceArray();
        resourceArray._embedded = _embedded;
        return resourceArray;
    }
    /**
     * get resource class name
     * @param {?} obj
     * @return {?}
     */
    static getClassName(obj) {
        /** @type {?} */
        var funcNameRegex = /function (.+?)\(/;
        /** @type {?} */
        var results = (funcNameRegex).exec(obj.constructor.toString());
        return (results && results.length > 1) ? results[1] : '';
    }
    /**
     * get resource class name from a prototype object
     * @param {?} objProto
     * @return {?}
     */
    static className(objProto) {
        /** @type {?} */
        let classNames = [];
        /** @type {?} */
        let obj = Object.getPrototypeOf(objProto);
        /** @type {?} */
        let className;
        while ((className = ResourceHelper.getClassName(obj)) !== 'Object') {
            classNames.push(className);
            obj = Object.getPrototypeOf(obj);
        }
        return classNames;
    }
    /**
     * instantiate a ResourceCollection from response embedded data
     * @template T
     * @param {?} type
     * @param {?} payload
     * @param {?} result
     * @param {?=} builder
     * @return {?}
     */
    static instantiateResourceCollection(type, payload, result, builder) {
        for (const embeddedClassName of Object.keys(payload[result._embedded])) {
            /** @type {?} */
            let embedded = payload[result._embedded];
            /** @type {?} */
            const items = embedded[embeddedClassName];
            for (let item of items) {
                /** @type {?} */
                let instance = new type();
                instance = this.searchSubtypes(builder, embeddedClassName, instance);
                this.instantiateResource(instance, item);
                result.push(instance);
            }
        }
        result.totalElements = payload.page ? payload.page.totalElements : result.length;
        result.totalPages = payload.page ? payload.page.totalPages : 1;
        result.pageNumber = payload.page ? payload.page.number : 1;
        result.pageSize = payload.page ? payload.page.size : 20;
        result.self_uri = payload._links && payload._links.self ? payload._links.self.href : undefined;
        result.next_uri = payload._links && payload._links.next ? payload._links.next.href : undefined;
        result.prev_uri = payload._links && payload._links.prev ? payload._links.prev.href : undefined;
        result.first_uri = payload._links && payload._links.first ? payload._links.first.href : undefined;
        result.last_uri = payload._links && payload._links.last ? payload._links.last.href : undefined;
        return result;
    }
    /**
     * search subtypes
     * @template T
     * @param {?} builder
     * @param {?} embeddedClassName
     * @param {?} instance
     * @return {?}
     */
    static searchSubtypes(builder, embeddedClassName, instance) {
        if (builder && builder.subtypes) {
            /** @type {?} */
            let keys = builder.subtypes.keys();
            Array.from(keys).forEach((subtypeKey) => {
                if (embeddedClassName.toLowerCase().startsWith(subtypeKey.toLowerCase())) {
                    /** @type {?} */
                    let subtype = builder.subtypes.get(subtypeKey);
                    instance = new subtype();
                }
            });
        }
        return instance;
    }
    /**
     * instantiate a Resource from response
     * @template T
     * @param {?} entity
     * @param {?} payload
     * @return {?}
     */
    static instantiateResource(entity, payload) {
        for (const p in payload) {
            //TODO array init
            /* if(entity[p].constructor === Array && isNullOrUndefined(payload[p]))
                             entity[p] = [];
                         else*/
            entity[p] = payload[p];
        }
        return entity;
    }
    /**
     * set proxy URL
     * @param {?} proxy_uri
     * @return {?}
     */
    static setProxyUri(proxy_uri) {
        ResourceHelper.proxy_uri = proxy_uri;
    }
    /**
     * set Root URI
     * @param {?} root_uri
     * @return {?}
     */
    static setRootUri(root_uri) {
        ResourceHelper.root_uri = root_uri;
    }
    /**
     * get proxy URL
     * @return {?}
     */
    static getURL() {
        return ResourceHelper.proxy_uri && ResourceHelper.proxy_uri != '' ?
            ResourceHelper.addSlash(ResourceHelper.proxy_uri) :
            ResourceHelper.addSlash(ResourceHelper.root_uri);
    }
    /**
     * add slash to URI
     * @param {?} uri
     * @return {?}
     */
    static addSlash(uri) {
        /** @type {?} */
        let uriParsed = parse(uri);
        if (isNullOrUndefined(uriParsed.search) && uri && uri[uri.length - 1] != '/')
            return uri + '/';
        return uri;
    }
    /**
     * get proxy from URL
     * @param {?} url
     * @return {?}
     */
    static getProxy(url) {
        if (!ResourceHelper.proxy_uri || ResourceHelper.proxy_uri == '')
            return url;
        return ResourceHelper.addSlash(url.replace(ResourceHelper.root_uri, ResourceHelper.proxy_uri));
    }
    /**
     * set HttpClient
     * @param {?} http
     * @return {?}
     */
    static setHttp(http) {
        ResourceHelper.http = http;
    }
    /**
     * get HttpClient
     * @return {?}
     */
    static getHttp() {
        return ResourceHelper.http;
    }
    /**
     * get root URI
     * @return {?}
     */
    static getRootUri() {
        return ResourceHelper.root_uri;
    }
}
/**
 * HttpHeaders
 */
ResourceHelper.headers = new HttpHeaders();
/**
 * Proxy URL
 */
ResourceHelper.proxy_uri = null;
/**
 * Root URL
 */
ResourceHelper.root_uri = null;
/**
 * HttpClient
 */
ResourceHelper.http = null;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Abstract resource class
 * @abstract
 */
class Resource {
    /**
     * constructor
     */
    constructor() {
    }
    /**
     * get subtypes
     * @return {?}
     */
    get subtypes() {
        return this._subtypes;
    }
    /**
     * set subtypes
     * @param {?} _subtypes
     * @return {?}
     */
    set subtypes(_subtypes) {
        this._subtypes = _subtypes;
    }
    /**
     * Get collection of related resources
     * @template T
     * @param {?} type
     * @param {?} relation
     * @param {?=} _embedded
     * @param {?=} options
     * @param {?=} builder
     * @return {?}
     */
    getRelationArray(type, relation, _embedded, options, builder) {
        /** @type {?} */
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        /** @type {?} */
        const result = ResourceHelper.createEmptyResult(isNullOrUndefined(_embedded) ? "_embedded" : _embedded);
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            /** @type {?} */
            let observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), {
                headers: ResourceHelper.headers,
                params: params
            });
            return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result, builder)), map((array) => array.result));
        }
        else {
            return of([]);
        }
    }
    /**
     * Get related resource
     * @template T
     * @param {?} type
     * @param {?} relation
     * @param {?=} builder
     * @return {?}
     */
    getRelation(type, relation, builder) {
        /** @type {?} */
        let result = new type();
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            /** @type {?} */
            let observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), { headers: ResourceHelper.headers });
            return observable.pipe(map((data) => {
                if (builder) {
                    for (const embeddedClassName of Object.keys(data['_links'])) {
                        if (embeddedClassName == 'self') {
                            /** @type {?} */
                            let href = data._links[embeddedClassName].href;
                            /** @type {?} */
                            let idx = href.lastIndexOf('/');
                            /** @type {?} */
                            let realClassName = href.replace(ResourceHelper.getRootUri(), "").substring(0, idx);
                            result = ResourceHelper.searchSubtypes(builder, realClassName, result);
                            break;
                        }
                    }
                }
                return ResourceHelper.instantiateResource(result, data);
            }));
        }
        else {
            return of(null);
        }
    }
    /**
     * Adds the given resource to the bound collection by the relation
     * @template T
     * @param {?} relation
     * @param {?} resource
     * @return {?}
     */
    addRelation(relation, resource) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            /** @type {?} */
            let header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
            return ResourceHelper.getHttp().post(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
        }
        else {
            return throwError('no relation found');
        }
    }
    /**
     * Bind the given resource to this resource by the given relation
     * @template T
     * @param {?} relation
     * @param {?} resource
     * @return {?}
     */
    updateRelation(relation, resource) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            /** @type {?} */
            let header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
            return ResourceHelper.getHttp().patch(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
        }
        else {
            return throwError('no relation found');
        }
    }
    /**
     * Bind the given resource to this resource by the given relation
     * @template T
     * @param {?} relation
     * @param {?} resource
     * @return {?}
     */
    substituteRelation(relation, resource) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            /** @type {?} */
            let header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
            return ResourceHelper.getHttp().put(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
        }
        else {
            return throwError('no relation found');
        }
    }
    /**
     * Bind the given resource to this resource by the given relation
     * @template T
     * @param {?} relation
     * @param {?} resources
     * @return {?}
     */
    substituteAllRelation(relation, resources) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            /** @type {?} */
            let header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
            return ResourceHelper.getHttp().put(ResourceHelper.getProxy(this._links[relation].href), resources.map((resource) => resource._links.self.href), { headers: header });
        }
        else {
            return throwError('no relation found');
        }
    }
    /**
     * Unbind the resource with the given relation from this resource
     * @template T
     * @param {?} relation
     * @param {?} resource
     * @return {?}
     */
    deleteRelation(relation, resource) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(resource._links)) {
            /** @type {?} */
            let link = resource._links['self'].href;
            /** @type {?} */
            let idx = link.lastIndexOf('/') + 1;
            if (idx == -1)
                return throwError('no relation found');
            /** @type {?} */
            let relationId = link.substring(idx);
            return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(this._links[relation].href + '/' + relationId), { headers: ResourceHelper.headers });
        }
        else {
            return throwError('no relation found');
        }
    }
    /**
     * Unbind the resource with the given relation from this resource
     * @template T
     * @param {?} relation
     * @return {?}
     */
    deleteAllRelation(relation) {
        return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(this._links[relation].href), { headers: ResourceHelper.headers });
    }
}
Resource.ɵfac = function Resource_Factory(t) { return new (t || Resource)(); };
Resource.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: Resource, factory: Resource.ɵfac });
/** @nocollapse */
Resource.ctorParameters = () => [];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(Resource, [{
        type: Injectable
    }], function () { return []; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * User model
 */
class User extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * ExternalService
 */
class ExternalService {
    /**
     * constructor
     * @param {?} externalConfigurationService
     */
    constructor(externalConfigurationService) {
        this.externalConfigurationService = externalConfigurationService;
        ResourceHelper.setProxyUri(externalConfigurationService.getProxyUri());
        ResourceHelper.setRootUri(externalConfigurationService.getRootUri());
        ResourceHelper.setHttp(externalConfigurationService.getHttp());
    }
    /**
     * update ExternalConfigurationHandler
     * @param {?} externalConfigurationService
     * @return {?}
     */
    updateExternalConfigurationHandlerInterface(externalConfigurationService) {
        this.externalConfigurationService = externalConfigurationService;
        ResourceHelper.setProxyUri(externalConfigurationService.getProxyUri());
        ResourceHelper.setRootUri(externalConfigurationService.getRootUri());
        ResourceHelper.setHttp(externalConfigurationService.getHttp());
    }
    /**
     * get ExternalConfiguration
     * @return {?}
     */
    getExternalConfiguration() {
        return this.externalConfigurationService.getExternalConfiguration();
    }
    /**
     * get proxy URL
     * @return {?}
     */
    getProxyUri() {
        return this.externalConfigurationService.getProxyUri();
    }
    /**
     * get Root URI
     * @return {?}
     */
    getRootUri() {
        return this.externalConfigurationService.getRootUri();
    }
    /**
     * get URL
     * @return {?}
     */
    getURL() {
        return ResourceHelper.getURL();
    }
    /**
     * get HttpClient
     * @return {?}
     */
    getHttp() {
        return ResourceHelper.getHttp();
    }
}
ExternalService.ɵfac = function ExternalService_Factory(t) { return new (t || ExternalService)(ɵngcc0.ɵɵinject('ExternalConfigurationService')); };
ExternalService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: ExternalService, factory: ExternalService.ɵfac });
/** @nocollapse */
ExternalService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: ['ExternalConfigurationService',] }] }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(ExternalService, [{
        type: Injectable
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: ['ExternalConfigurationService']
            }] }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * ResourceService
 */
class ResourceService {
    /**
     * constructor
     * @param {?} externalService
     */
    constructor(externalService) {
        this.externalService = externalService;
    }
    /**
     * get URL
     * @return {?}
     */
    static getURL() {
        return ResourceHelper.getURL();
    }
    /**
     * get all resources from a base URI of a given type
     * @template T
     * @param {?} type
     * @param {?} resource
     * @param {?} _embedded
     * @param {?=} options
     * @param {?=} subType
     * @return {?}
     */
    getAll(type, resource, _embedded, options, subType) {
        /** @type {?} */
        const uri = this.getResourceUrl(resource);
        /** @type {?} */
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        /** @type {?} */
        const result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        result.sortInfo = options ? options.sort : undefined;
        /** @type {?} */
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result, subType)), catchError(error => throwError(error)));
    }
    /**
     * get resource from a base URI and a given id
     * @template T
     * @param {?} type
     * @param {?} resource
     * @param {?} id
     * @return {?}
     */
    get(type, resource, id) {
        /** @type {?} */
        const uri = this.getResourceUrl(resource).concat('/', id);
        /** @type {?} */
        const result = new type();
        this.setUrlsResource(result);
        /** @type {?} */
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers });
        return observable.pipe(map(data => ResourceHelper.instantiateResource(result, data)), catchError(error => throwError(error)));
    }
    /**
     * get resource from its selflink
     * @template T
     * @param {?} type
     * @param {?} resourceLink
     * @return {?}
     */
    getBySelfLink(type, resourceLink) {
        /** @type {?} */
        const result = new type();
        this.setUrlsResource(result);
        /** @type {?} */
        let observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(resourceLink), { headers: ResourceHelper.headers });
        return observable.pipe(map(data => ResourceHelper.instantiateResource(result, data)), catchError(error => throwError(error)));
    }
    /**
     * search resources from a given base path, query and options
     * @template T
     * @param {?} type
     * @param {?} query
     * @param {?} resource
     * @param {?} _embedded
     * @param {?=} options
     * @return {?}
     */
    search(type, query, resource, _embedded, options) {
        /** @type {?} */
        const uri = this.getResourceUrl(resource).concat('/search/', query);
        /** @type {?} */
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        /** @type {?} */
        const result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        /** @type {?} */
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result)), catchError(error => throwError(error)));
    }
    /**
     * search a single resource from a given base path, query and options
     * @template T
     * @param {?} type
     * @param {?} query
     * @param {?} resource
     * @param {?=} options
     * @return {?}
     */
    searchSingle(type, query, resource, options) {
        /** @type {?} */
        const uri = this.getResourceUrl(resource).concat('/search/', query);
        /** @type {?} */
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        /** @type {?} */
        const result = new type();
        this.setUrlsResource(result);
        /** @type {?} */
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResource(result, response)), catchError(error => throwError(error)));
    }
    /**
     * search resources from a given base path, custom query and options
     * @template T
     * @param {?} type
     * @param {?} query
     * @param {?} resource
     * @param {?} _embedded
     * @param {?=} options
     * @return {?}
     */
    customQuery(type, query, resource, _embedded, options) {
        /** @type {?} */
        const uri = this.getResourceUrl(resource + query);
        /** @type {?} */
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        /** @type {?} */
        const result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        /** @type {?} */
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result)), catchError(error => throwError(error)));
    }
    /**
     * get resource given a relation link
     * @template T
     * @param {?} type
     * @param {?} resourceLink
     * @return {?}
     */
    getByRelation(type, resourceLink) {
        /** @type {?} */
        let result = new type();
        this.setUrlsResource(result);
        /** @type {?} */
        let observable = ResourceHelper.getHttp().get(resourceLink, { headers: ResourceHelper.headers });
        return observable.pipe(map(data => ResourceHelper.instantiateResource(result, data)), catchError(error => throwError(error)));
    }
    /**
     * get resource array given a relation link
     * @template T
     * @param {?} type
     * @param {?} resourceLink
     * @param {?} _embedded
     * @param {?=} builder
     * @return {?}
     */
    getByRelationArray(type, resourceLink, _embedded, builder) {
        /** @type {?} */
        const result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        /** @type {?} */
        let observable = ResourceHelper.getHttp().get(resourceLink, { headers: ResourceHelper.headers });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result, builder)), catchError(error => throwError(error)));
    }
    /**
     * count resources given a path
     * @param {?} resource
     * @return {?}
     */
    count(resource) {
        /** @type {?} */
        const uri = this.getResourceUrl(resource).concat('/search/countAll');
        return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, observe: 'body' }).pipe(map((response) => Number(response.body)), catchError(error => throwError(error)));
    }
    /**
     * create resource from self link and entity data
     * @template T
     * @param {?} selfResource
     * @param {?} entity
     * @return {?}
     */
    create(selfResource, entity) {
        /** @type {?} */
        const uri = ResourceHelper.getURL() + selfResource;
        /** @type {?} */
        const payload = ResourceHelper.resolveRelations(entity);
        this.setUrlsResource(entity);
        /** @type {?} */
        let observable = ResourceHelper.getHttp().post(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
        return observable.pipe(map((response) => {
            if (response.status >= 200 && response.status <= 207)
                return ResourceHelper.instantiateResource(entity, response.body);
            else if (response.status == 500) {
                /** @type {?} */
                let body = response.body;
                return throwError(body.error);
            }
        }), catchError(error => throwError(error)));
    }
    /**
     * update resource from a given entity data
     * @template T
     * @param {?} entity
     * @return {?}
     */
    update(entity) {
        /** @type {?} */
        const uri = ResourceHelper.getProxy(entity._links.self.href);
        /** @type {?} */
        const payload = ResourceHelper.resolveRelations(entity);
        this.setUrlsResource(entity);
        /** @type {?} */
        let observable = ResourceHelper.getHttp().put(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
        return observable.pipe(map((response) => {
            if (response.status >= 200 && response.status <= 207)
                return ResourceHelper.instantiateResource(entity, response.body);
            else if (response.status == 500) {
                /** @type {?} */
                let body = response.body;
                return throwError(body.error);
            }
        }), catchError(error => throwError(error)));
    }
    /**
     * patch resource from a given entity data
     * @template T
     * @param {?} entity
     * @return {?}
     */
    patch(entity) {
        /** @type {?} */
        const uri = ResourceHelper.getProxy(entity._links.self.href);
        /** @type {?} */
        const payload = ResourceHelper.resolveRelations(entity);
        this.setUrlsResource(entity);
        /** @type {?} */
        let observable = ResourceHelper.getHttp().patch(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
        return observable.pipe(map((response) => {
            if (response.status >= 200 && response.status <= 207)
                return ResourceHelper.instantiateResource(entity, response.body);
            else if (response.status == 500) {
                /** @type {?} */
                let body = response.body;
                return throwError(body.error);
            }
        }), catchError(error => throwError(error)));
    }
    /**
     * delete resource from a given entity data
     * @template T
     * @param {?} entity
     * @return {?}
     */
    delete(entity) {
        /** @type {?} */
        const uri = ResourceHelper.getProxy(entity._links.self.href);
        return ResourceHelper.getHttp().delete(uri, { headers: ResourceHelper.headers }).pipe(catchError(error => throwError(error)));
    }
    /**
     * whether a resource array has next page of results
     * @template T
     * @param {?} resourceArray
     * @return {?}
     */
    hasNext(resourceArray) {
        return resourceArray.next_uri != undefined;
    }
    /**
     * whether a resource array has previous page of results
     * @template T
     * @param {?} resourceArray
     * @return {?}
     */
    hasPrev(resourceArray) {
        return resourceArray.prev_uri != undefined;
    }
    /**
     * whether a resource array has first page of results
     * @template T
     * @param {?} resourceArray
     * @return {?}
     */
    hasFirst(resourceArray) {
        return resourceArray.first_uri != undefined;
    }
    /**
     * whether a resource array has last page of results
     * @template T
     * @param {?} resourceArray
     * @return {?}
     */
    hasLast(resourceArray) {
        return resourceArray.last_uri != undefined;
    }
    /**
     * get resource array next page of results
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @return {?}
     */
    next(resourceArray, type) {
        return resourceArray.next(type);
    }
    /**
     * get resource array previous page of results
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @return {?}
     */
    prev(resourceArray, type) {
        return resourceArray.prev(type);
    }
    /**
     * get resource array first page of results
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @return {?}
     */
    first(resourceArray, type) {
        return resourceArray.first(type);
    }
    /**
     * get resource array last page of results
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @return {?}
     */
    last(resourceArray, type) {
        return resourceArray.last(type);
    }
    /**
     * get resource array page of results given a page number
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    page(resourceArray, type, id) {
        return resourceArray.page(type, id);
    }
    /**
     * sort resource array with a given sorting params
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @param {...?} sort
     * @return {?}
     */
    sortElements(resourceArray, type, ...sort) {
        return resourceArray.sortElements(type, ...sort);
    }
    /**
     * get resource array size
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @param {?} size
     * @return {?}
     */
    size(resourceArray, type, size) {
        return resourceArray.size(type, size);
    }
    /**
     * get resource URL from a given path
     * @param {?=} resource
     * @return {?}
     */
    getResourceUrl(resource) {
        /** @type {?} */
        let url = ResourceService.getURL();
        if (!url.endsWith('/')) {
            url = url.concat('/');
        }
        if (resource) {
            return url.concat(resource);
        }
        return url;
    }
    /**
     * set proxy and root urls of given resource array
     * @template T
     * @param {?} result
     * @return {?}
     */
    setUrls(result) {
        result.proxyUrl = this.externalService.getProxyUri();
        result.rootUrl = this.externalService.getRootUri();
    }
    /**
     * set proxy and root urls of given resource
     * @template T
     * @param {?} result
     * @return {?}
     */
    setUrlsResource(result) {
        result.proxyUrl = this.externalService.getProxyUri();
        result.rootUrl = this.externalService.getRootUri();
    }
}
ResourceService.ɵfac = function ResourceService_Factory(t) { return new (t || ResourceService)(ɵngcc0.ɵɵinject(ExternalService)); };
ResourceService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: ResourceService, factory: ResourceService.ɵfac });
/** @nocollapse */
ResourceService.ctorParameters = () => [
    { type: ExternalService }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(ResourceService, [{
        type: Injectable
    }], function () { return [{ type: ExternalService }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * REST API access interface
 * @template T
 */
class RestService {
    /**
     * constructor
     * @param {?} type
     * @param {?} resource
     * @param {?} injector
     * @param {?=} _embedded
     */
    constructor(type, resource, injector, _embedded) {
        this.injector = injector;
        /**
         * _embedded field name
         */
        this._embedded = '_embedded';
        this.type = type;
        this.resource = resource;
        this.resourceService = injector.get(ResourceService);
        if (!isNullOrUndefined(_embedded))
            this._embedded = _embedded;
    }
    /**
     * error handler
     * @param {?} error
     * @return {?}
     */
    handleError(error) {
        return RestService.handleError(error);
    }
    /**
     * error handler
     * @param {?} error
     * @return {?}
     */
    static handleError(error) {
        return throwError(error);
    }
    /**
     * get all resources with optional options an subType params
     * @param {?=} options
     * @param {?=} subType
     * @return {?}
     */
    getAll(options, subType) {
        return this.resourceService.getAll(this.type, this.resource, this._embedded, options, subType).pipe(mergeMap((resourceArray) => {
            if (options && options.notPaged && !isNullOrUndefined(resourceArray.first_uri)) {
                options.notPaged = false;
                options.size = resourceArray.totalElements;
                return this.getAll(options);
            }
            else {
                this.resourceArray = resourceArray;
                return of(resourceArray.result);
            }
        }));
    }
    /**
     * get resource from a given id
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this.resourceService.get(this.type, this.resource, id);
    }
    /**
     * get resource from self link
     * @param {?} selfLink
     * @return {?}
     */
    getBySelfLink(selfLink) {
        return this.resourceService.getBySelfLink(this.type, selfLink);
    }
    /**
     * search resources from a given query string and optional options params
     * @param {?} query
     * @param {?=} options
     * @return {?}
     */
    search(query, options) {
        return this.resourceService.search(this.type, query, this.resource, this._embedded, options).pipe(mergeMap((resourceArray) => {
            if (options && options.notPaged && !isNullOrUndefined(resourceArray.first_uri)) {
                options.notPaged = false;
                options.size = resourceArray.totalElements;
                return this.search(query, options);
            }
            else {
                this.resourceArray = resourceArray;
                return of(resourceArray.result);
            }
        }));
    }
    /**
     * search resource from a given query string and optional options params
     * @param {?} query
     * @param {?=} options
     * @return {?}
     */
    searchSingle(query, options) {
        return this.resourceService.searchSingle(this.type, query, this.resource, options);
    }
    /**
     * search resources from a given custom query string and optional options params
     * @param {?} query
     * @param {?=} options
     * @return {?}
     */
    customQuery(query, options) {
        return this.resourceService.customQuery(this.type, query, this.resource, this._embedded, options).pipe(mergeMap((resourceArray) => {
            if (options && options.notPaged && !isNullOrUndefined(resourceArray.first_uri)) {
                options.notPaged = false;
                options.size = resourceArray.totalElements;
                return this.customQuery(query, options);
            }
            else {
                this.resourceArray = resourceArray;
                return of(resourceArray.result);
            }
        }));
    }
    /**
     * get resource array given a relation link
     * @param {?} relation
     * @param {?=} builder
     * @return {?}
     */
    getByRelationArray(relation, builder) {
        return this.resourceService.getByRelationArray(this.type, relation, this._embedded, builder).pipe(map((resourceArray) => {
            this.resourceArray = resourceArray;
            return resourceArray.result;
        }));
    }
    /**
     * get resource given a relation link
     * @param {?} relation
     * @return {?}
     */
    getByRelation(relation) {
        return this.resourceService.getByRelation(this.type, relation);
    }
    /**
     * count resources given a path
     * @return {?}
     */
    count() {
        return this.resourceService.count(this.resource);
    }
    /**
     * create resource from self link and entity data
     * @param {?} entity
     * @return {?}
     */
    create(entity) {
        return this.resourceService.create(this.resource, entity);
    }
    /**
     * update resource from a given entity data
     * @param {?} entity
     * @return {?}
     */
    update(entity) {
        return this.resourceService.update(entity);
    }
    /**
     * patch resource from a given entity data
     * @param {?} entity
     * @return {?}
     */
    patch(entity) {
        return this.resourceService.patch(entity);
    }
    /**
     * delete resource from a given entity data
     * @param {?} entity
     * @return {?}
     */
    delete(entity) {
        return this.resourceService.delete(entity);
    }
    /**
     * get total number of elements of resource array
     * @return {?}
     */
    totalElement() {
        if (this.resourceArray && this.resourceArray.totalElements)
            return this.resourceArray.totalElements;
        return 0;
    }
    /**
     * whether a resource array has first page of results
     * @return {?}
     */
    hasFirst() {
        if (this.resourceArray)
            return this.resourceService.hasFirst(this.resourceArray);
        return false;
    }
    /**
     * whether a resource array has next page of results
     * @return {?}
     */
    hasNext() {
        if (this.resourceArray)
            return this.resourceService.hasNext(this.resourceArray);
        return false;
    }
    /**
     * whether a resource array has previous page of results
     * @return {?}
     */
    hasPrev() {
        if (this.resourceArray)
            return this.resourceService.hasPrev(this.resourceArray);
        return false;
    }
    /**
     * whether a resource array has last page of results
     * @return {?}
     */
    hasLast() {
        if (this.resourceArray)
            return this.resourceService.hasLast(this.resourceArray);
        return false;
    }
    /**
     * get resource array next page of results
     * @return {?}
     */
    next() {
        if (this.resourceArray)
            return this.resourceService.next(this.resourceArray, this.type).pipe(map((resourceArray) => {
                this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        else
            throwError('no resourceArray found');
    }
    /**
     * get resource array previous page of results
     * @return {?}
     */
    prev() {
        if (this.resourceArray)
            return this.resourceService.prev(this.resourceArray, this.type).pipe(map((resourceArray) => {
                this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        else
            throwError('no resourceArray found');
    }
    /**
     * get resource array first page of results
     * @return {?}
     */
    first() {
        if (this.resourceArray)
            return this.resourceService.first(this.resourceArray, this.type)
                .pipe(map((resourceArray) => {
                this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        else
            throwError('no resourceArray found');
    }
    /**
     * get resource array last page of results
     * @return {?}
     */
    last() {
        if (this.resourceArray)
            return this.resourceService.last(this.resourceArray, this.type)
                .pipe(map((resourceArray) => {
                this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        else
            throwError('no resourceArray found');
    }
    /**
     * get resource array page of results given a page number
     * @param {?} pageNumber
     * @return {?}
     */
    page(pageNumber) {
        if (this.resourceArray)
            return this.resourceService.page(this.resourceArray, this.type, pageNumber).pipe(map((resourceArray) => {
                this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        else
            throwError('no resourceArray found');
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Account manager service
 */
class AccountService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(User, "account", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.ACCOUNT_API = this.API + '/account';
    }
    /**
     * get logged in user account
     * @return {?}
     */
    get() {
        /** @type {?} */
        let result;
        result = this.http.get(this.ACCOUNT_API);
        return result;
    }
    /**
     * save account
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        result = this.http.post(this.ACCOUNT_API, item);
        return result;
    }
    /**
     * change logged in user account
     * @param {?} item
     * @return {?}
     */
    changePassword(item) {
        /** @type {?} */
        let result;
        result = this.http.post(this.ACCOUNT_API + "/change-password", item);
        return result;
    }
}
AccountService.ɵfac = function AccountService_Factory(t) { return new (t || AccountService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
AccountService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: AccountService, factory: AccountService.ɵfac });
/** @nocollapse */
AccountService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AccountService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Authentication service
 */
class AuthService {
    /**
     * constructor
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
        /**
         * API base URL
         */
        this.SERVER_API_URL = '/api';
    }
    /**
     * get current user jwt token from session storage
     * @return {?}
     */
    getToken() {
        return sessionStorage.getItem('authenticationToken');
    }
    /**
     * login operation
     * @param {?} credentials
     * @return {?}
     */
    login(credentials) {
        /** @type {?} */
        const data = {
            username: credentials.username,
            password: credentials.password
        };
        return this.http.post(this.SERVER_API_URL + '/authenticate', data, { observe: 'response' }).map(authenticateSuccess.bind(this));
        /**
         * @param {?} resp
         * @return {?}
         */
        function authenticateSuccess(resp) {
            /** @type {?} */
            const bearerToken = resp.headers.get('Authorization');
            if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
                /** @type {?} */
                const jwt = bearerToken.slice(7, bearerToken.length);
                this.storeAuthenticationToken(jwt);
                //const expiresAt = moment().add( resp.headers.get('Token-Validity'),'milisecond');
                //sessionStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
                return jwt;
            }
        }
    }
    /**
     * login operation with jwt token
     * @param {?} jwt
     * @return {?}
     */
    loginWithToken(jwt) {
        if (jwt) {
            this.storeAuthenticationToken(jwt);
            return Promise.resolve(jwt);
        }
        else {
            return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
        }
    }
    /**
     * store jwt token in session storage
     * @param {?} jwt
     * @return {?}
     */
    storeAuthenticationToken(jwt) {
        sessionStorage.setItem('authenticationToken', jwt);
    }
    /**
     * check whether current user is logged in
     * @return {?}
     */
    isLoggedIn() {
        //return moment().isBefore(this.getExpiration());
        return this.getToken();
    }
    /**
     * check whether current user is logged out
     * @return {?}
     */
    isLoggedOut() {
        return !this.isLoggedIn();
    }
    /**
     * logout operation
     * @return {?}
     */
    logout() {
        return new Observable((observer) => {
            //localStorage.removeItem('authenticationToken');
            sessionStorage.removeItem('authenticationToken');
            //sessionStorage.removeItem('expires_at');
            observer.complete();
        });
    }
}
AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
AuthService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac });
/** @nocollapse */
AuthService.ctorParameters = () => [
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AuthService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Interceptor for authentication token in API requests
 */
class AuthInterceptor {
    /**
     * constructor
     */
    constructor() {
        /**
         * API base path
         */
        this.SERVER_API_URL = '/api';
        this.TEST_SERVER_API_URL = 'http://localhost:8080/api';
    }
    /**
     * request handler
     * @param {?} request
     * @param {?} next
     * @return {?}
     */
    intercept(request, next) {
        if (!request || !request.url || !(request.url.includes("api"))) {
            return next.handle(request);
        }
        /** @type {?} */
        const token = sessionStorage.getItem('authenticationToken');
        if (!!token) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                }
            });
        }
        return next.handle(request);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Principal service
 */
class Principal {
    /**
     * constructor
     * @param {?} account
     */
    constructor(account) {
        this.account = account;
        this.authenticated = false;
        this.authenticationState = new Subject();
    }
    /**
     * authenticate with given identity
     * @param {?} identity
     * @return {?}
     */
    authenticate(identity) {
        this.userIdentity = identity;
        this.authenticated = identity !== null;
        this.authenticationState.next(this.userIdentity);
    }
    /**
     * check whether current user has any of the given authorities
     * @param {?} authorities
     * @return {?}
     */
    hasAnyAuthority(authorities) {
        return Promise.resolve(this.hasAnyAuthorityDirect(authorities));
    }
    /**
     * check whether current user has any of the given authorities on the given territory
     * @param {?} authorities
     * @param {?} territory
     * @return {?}
     */
    hasAnyAuthorityOnTerritory(authorities, territory) {
        return Promise.resolve(this.hasAnyAuthorityDirectOnTerritory(authorities, territory));
    }
    /**
     * check whether current user has any of the given authorities without resolving promises
     * @param {?} authorities
     * @return {?}
     */
    hasAnyAuthorityDirect(authorities) {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.authorities) {
            return false;
        }
        for (let i = 0; i < authorities.length; i++) {
            if (this.userIdentity.authorities.includes(authorities[i])) {
                return true;
            }
        }
        return false;
    }
    /**
     * check whether current user has any of the given authorities on the given territory without resolving promises
     * @param {?} authorities
     * @param {?} territory
     * @return {?}
     */
    hasAnyAuthorityDirectOnTerritory(authorities, territory) {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.authorities) {
            return false;
        }
        for (let i = 0; i < authorities.length; i++) {
            if (this.userIdentity.authoritiesPerTerritory[territory] && this.userIdentity.authoritiesPerTerritory[territory].includes(authorities[i])) {
                return true;
            }
        }
        return false;
    }
    /**
     * check whether current user has the given authority
     * @param {?} authority
     * @return {?}
     */
    hasAuthority(authority) {
        if (!this.authenticated) {
            return Promise.resolve(false);
        }
        return this.identity().then((id) => {
            return Promise.resolve(id.authorities && id.authorities.includes(authority));
        }, () => {
            return Promise.resolve(false);
        });
    }
    /**
     * check whether current user has the given authority on the given territory
     * @param {?} authority
     * @param {?} territory
     * @return {?}
     */
    hasAuthorityOnTerritory(authority, territory) {
        if (!this.authenticated) {
            return Promise.resolve(false);
        }
        return this.identity().then((id) => {
            return Promise.resolve(id.authoritiesPerTerritory && id.authoritiesPerTerritory[territory] && id.authoritiesPerTerritory[territory].includes(authority));
        }, () => {
            return Promise.resolve(false);
        });
    }
    /**
     * check user identity
     * @param {?=} force
     * @return {?}
     */
    identity(force) {
        if (force === true) {
            this.userIdentity = undefined;
        }
        // check and see if we have retrieved the userIdentity data from the server.
        // if we have, reuse it by immediately resolving
        if (this.userIdentity) {
            return Promise.resolve(this.userIdentity);
        }
        // retrieve the userIdentity data from the server, update the identity object, and then resolve.
        return this.account.get().toPromise().then((response) => {
            /** @type {?} */
            const account = response;
            if (account) {
                this.userIdentity = account;
                this.authenticated = true;
            }
            else {
                this.userIdentity = null;
                this.authenticated = false;
            }
            this.authenticationState.next(this.userIdentity);
            return this.userIdentity;
        }).catch((err) => {
            this.userIdentity = null;
            this.authenticated = false;
            this.authenticationState.next(this.userIdentity);
            return null;
        });
    }
    /**
     * check whether current user is authenticated
     * @return {?}
     */
    isAuthenticated() {
        return this.authenticated;
    }
    /**
     * check whether current user identity is resolved
     * @return {?}
     */
    isIdentityResolved() {
        return this.userIdentity !== undefined;
    }
    /**
     * get current user authentication state
     * @return {?}
     */
    getAuthenticationState() {
        return this.authenticationState.asObservable();
    }
}
Principal.ɵfac = function Principal_Factory(t) { return new (t || Principal)(ɵngcc0.ɵɵinject(AccountService)); };
Principal.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: Principal, factory: Principal.ɵfac });
/** @nocollapse */
Principal.ctorParameters = () => [
    { type: AccountService }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(Principal, [{
        type: Injectable
    }], function () { return [{ type: AccountService }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Interceptor for authentication expired response in API requests
 */
class AuthExpiredInterceptor {
    /**
     * constructor
     * @param {?} router
     * @param {?} authService
     * @param {?} principal
     */
    constructor(router, authService, principal) {
        this.router = router;
        this.authService = authService;
        this.principal = principal;
    }
    /**
     * request handler
     * @param {?} request
     * @param {?} next
     * @return {?}
     */
    intercept(request, next) {
        return next.handle(request).do((event) => { }, (err) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    this.authService.logout().subscribe();
                    this.principal.authenticate(null);
                    this.router.navigate(['/']);
                }
            }
        });
    }
}
AuthExpiredInterceptor.ɵfac = function AuthExpiredInterceptor_Factory(t) { return new (t || AuthExpiredInterceptor)(ɵngcc0.ɵɵinject(ɵngcc2.Router), ɵngcc0.ɵɵinject(AuthService), ɵngcc0.ɵɵinject(Principal)); };
AuthExpiredInterceptor.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: AuthExpiredInterceptor, factory: AuthExpiredInterceptor.ɵfac });
/** @nocollapse */
AuthExpiredInterceptor.ctorParameters = () => [
    { type: Router },
    { type: AuthService },
    { type: Principal }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AuthExpiredInterceptor, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc2.Router }, { type: AuthService }, { type: Principal }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Login service
 */
class LoginService {
    /**
     * constructor
     * @param {?} authServerProvider
     * @param {?} principal
     */
    constructor(authServerProvider, principal) {
        this.authServerProvider = authServerProvider;
        this.principal = principal;
    }
    /**
     * Login operation
     * @param {?} credentials
     * @param {?=} callback
     * @return {?}
     */
    login(credentials, callback) {
        /** @type {?} */
        const cb = callback || function () { };
        return new Promise((resolve, reject) => {
            this.authServerProvider.login(credentials).subscribe((data) => {
                this.principal.identity(true).then((account) => {
                    // After the login the language will be changed to
                    // the language selected by the user during his registration
                    resolve(data);
                });
                return cb();
            }, (err) => {
                this.logout();
                reject(err);
                return cb(err);
            });
        });
    }
    /**
     * login with jwt token
     * @param {?} jwt
     * @return {?}
     */
    loginWithToken(jwt) {
        return this.authServerProvider.loginWithToken(jwt);
    }
    /**
     * logout operation
     * @return {?}
     */
    logout() {
        this.authServerProvider.logout().subscribe();
        this.principal.authenticate(null);
    }
}
LoginService.ɵfac = function LoginService_Factory(t) { return new (t || LoginService)(ɵngcc0.ɵɵinject(AuthService), ɵngcc0.ɵɵinject(Principal)); };
LoginService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: LoginService, factory: LoginService.ɵfac });
/** @nocollapse */
LoginService.ctorParameters = () => [
    { type: AuthService },
    { type: Principal }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(LoginService, [{
        type: Injectable
    }], function () { return [{ type: AuthService }, { type: Principal }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * User manager service
 */
class UserService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(User, "users", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.USER_API = this.API + '/users';
    }
    /**
     * remove user
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save user
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.USER_API, item);
        }
        return result;
    }
    /**
     * change password o given user id
     * @param {?} id
     * @param {?} item
     * @return {?}
     */
    changePassword(id, item) {
        /** @type {?} */
        let result;
        result = this.http.post(this.USER_API + "/" + id + "/change-password", item);
        return result;
    }
}
UserService.ɵfac = function UserService_Factory(t) { return new (t || UserService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
UserService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: UserService, factory: UserService.ɵfac });
/** @nocollapse */
UserService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(UserService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * User position model
 */
class UserPosition extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * User position manager service
 */
class UserPositionService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(UserPosition, "user-positions", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.USER_POSITION_API = this.API + '/user-positions';
    }
    /**
     * remove user position
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save user position
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.user != null) {
                item.substituteRelation('user', item.user).subscribe(result => {
                }, error => console.error(error));
            }
            if (item.territory != null) {
                item.substituteRelation('territory', item.territory).subscribe(result => {
                }, error => console.error(error));
            }
        }
        else {
            item.territory = item.territory._links.self.href;
            item.user = item.user._links.self.href;
            result = this.http.post(this.USER_POSITION_API, item);
        }
        return result;
    }
}
UserPositionService.ɵfac = function UserPositionService_Factory(t) { return new (t || UserPositionService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
UserPositionService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: UserPositionService, factory: UserPositionService.ɵfac });
/** @nocollapse */
UserPositionService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(UserPositionService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * User permission model
 */
class UserConfiguration extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * User configuration manager service
 */
class UserConfigurationService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(UserConfiguration, "user-configurations", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.USER_CONFIGURATION_API = this.API + '/user-configurations';
    }
    /**
     * remove user configuration
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save user configuration
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.user != null) {
                item.substituteRelation('user', item.user).subscribe(result => {
                }, error => console.error(error));
            }
            if (item.territory != null) {
                item.substituteRelation('territory', item.territory).subscribe(result => {
                }, error => console.error(error));
            }
            if (item.role != null) {
                item.substituteRelation('role', item.role).subscribe(result => {
                }, error => console.error(error));
            }
        }
        else {
            item.territory = item.territory._links.self.href;
            item.role = item.role._links.self.href;
            item.user = item.user._links.self.href;
            result = this.http.post(this.USER_CONFIGURATION_API, item);
        }
        return result;
    }
}
UserConfigurationService.ɵfac = function UserConfigurationService_Factory(t) { return new (t || UserConfigurationService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
UserConfigurationService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: UserConfigurationService, factory: UserConfigurationService.ɵfac });
/** @nocollapse */
UserConfigurationService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(UserConfigurationService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Territory model
 */
class Territory extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Territory manager service
 */
class TerritoryService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Territory, "territories", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.TERRITORY_API = this.API + '/territories';
    }
    /**
     * remove territory
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save territory
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item.type != null)
            item.type = item.type._links.self.href;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.TERRITORY_API, item);
        }
        return result;
    }
}
TerritoryService.ɵfac = function TerritoryService_Factory(t) { return new (t || TerritoryService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
TerritoryService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: TerritoryService, factory: TerritoryService.ɵfac });
/** @nocollapse */
TerritoryService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(TerritoryService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Territory type model
 */
class TerritoryType extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * TerritoryType manager service
 */
class TerritoryTypeService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(TerritoryType, "territory-types", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.TERRITORYTYPE_API = this.API + '/territory-types';
    }
    /**
     * remove territory type
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save territory type
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.TERRITORYTYPE_API, item);
        }
        return result;
    }
}
TerritoryTypeService.ɵfac = function TerritoryTypeService_Factory(t) { return new (t || TerritoryTypeService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
TerritoryTypeService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: TerritoryTypeService, factory: TerritoryTypeService.ɵfac });
/** @nocollapse */
TerritoryTypeService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(TerritoryTypeService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Role model
 */
class Role extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Role manager service
 */
class RoleService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Role, "roles", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.ROLE_API = this.API + '/roles';
    }
    /**
     * remove role
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save role
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.ROLE_API, item);
        }
        return result;
    }
}
RoleService.ɵfac = function RoleService_Factory(t) { return new (t || RoleService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
RoleService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: RoleService, factory: RoleService.ɵfac });
/** @nocollapse */
RoleService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(RoleService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Connection model
 */
class Connection extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Connection manager service
 */
class ConnectionService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Connection, "connections", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.CONNECTION_API = this.API + '/connections';
    }
    /**
     * remove connection
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save connection
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.CONNECTION_API, item);
        }
        return result;
    }
}
ConnectionService.ɵfac = function ConnectionService_Factory(t) { return new (t || ConnectionService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
ConnectionService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: ConnectionService, factory: ConnectionService.ɵfac });
/** @nocollapse */
ConnectionService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(ConnectionService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * GEOADMIN_task id
  @type {?} */
const GEOADMIN_TREE_TASK_ID = "geoadmin";
/**
 * Task model
 */
class Task extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task manager service
 */
class TaskService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Task, "tasks", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.CONNECTION_API = this.API + '/tasks';
    }
    /**
     * remove task
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save task
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        /** @type {?} */
        const taskType = item.type;
        /** @type {?} */
        const taskGroup = item.group;
        /** @type {?} */
        let taskConnection = item.connection;
        /** @type {?} */
        let taskUI = item.ui;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.CONNECTION_API, item);
        }
        return result;
    }
}
TaskService.ɵfac = function TaskService_Factory(t) { return new (t || TaskService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
TaskService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: TaskService, factory: TaskService.ɵfac });
/** @nocollapse */
TaskService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(TaskService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task type model
 */
class TaskType extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * TaskType manager service
 */
class TaskTypeService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(TaskType, "task-types", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.CONNECTION_API = this.API + '/task-types';
    }
    /**
     * remove task type
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save task type
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.CONNECTION_API, item);
        }
        return result;
    }
}
TaskTypeService.ɵfac = function TaskTypeService_Factory(t) { return new (t || TaskTypeService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
TaskTypeService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: TaskTypeService, factory: TaskTypeService.ɵfac });
/** @nocollapse */
TaskTypeService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(TaskTypeService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task group model
 */
class TaskGroup extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task group manager service
 */
class TaskGroupService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(TaskGroup, "task-groups", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.CONNECTION_API = this.API + '/task-groups';
    }
    /**
     * remove task group
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save task group
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.CONNECTION_API, item);
        }
        return result;
    }
}
TaskGroupService.ɵfac = function TaskGroupService_Factory(t) { return new (t || TaskGroupService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
TaskGroupService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: TaskGroupService, factory: TaskGroupService.ɵfac });
/** @nocollapse */
TaskGroupService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(TaskGroupService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task parameter model
 */
class TaskParameter extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task parameter manager service
 */
class TaskParameterService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(TaskParameter, "task-parameters", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.TASK_PARAMETER_API = this.API + '/task-parameters';
    }
    /**
     * remove task parameter
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save task parameter
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.task != null) {
                item.substituteRelation('task', item.task).subscribe(result => {
                }, error => console.error(error));
            }
        }
        else {
            item.task = item.task._links.self.href;
            result = this.http.post(this.TASK_PARAMETER_API, item);
        }
        return result;
    }
}
TaskParameterService.ɵfac = function TaskParameterService_Factory(t) { return new (t || TaskParameterService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
TaskParameterService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: TaskParameterService, factory: TaskParameterService.ɵfac });
/** @nocollapse */
TaskParameterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(TaskParameterService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task availability model
 */
class TaskAvailability extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task availability manager service
 */
class TaskAvailabilityService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(TaskAvailability, "task-availabilities", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.TASK_AVAILABILITY_API = this.API + '/task-availabilities';
    }
    /**
     * remove task availability
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save task availability
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.task != null) {
                item.substituteRelation('task', item.task).subscribe(result => {
                }, error => console.error(error));
            }
            if (item.territory != null) {
                item.substituteRelation('territory', item.territory).subscribe(result => {
                }, error => console.error(error));
            }
        }
        else {
            item.territory = item.territory._links.self.href;
            item.task = item.task._links.self.href;
            result = this.http.post(this.TASK_AVAILABILITY_API, item);
        }
        return result;
    }
}
TaskAvailabilityService.ɵfac = function TaskAvailabilityService_Factory(t) { return new (t || TaskAvailabilityService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
TaskAvailabilityService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: TaskAvailabilityService, factory: TaskAvailabilityService.ɵfac });
/** @nocollapse */
TaskAvailabilityService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(TaskAvailabilityService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task UI model
 */
class TaskUI extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task UI manager service
 */
class TaskUIService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(TaskUI, "task-uis", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.CONNECTION_API = this.API + '/task-uis';
    }
    /**
     * remove task UI
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save task UI
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.CONNECTION_API, item);
        }
        return result;
    }
}
TaskUIService.ɵfac = function TaskUIService_Factory(t) { return new (t || TaskUIService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
TaskUIService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: TaskUIService, factory: TaskUIService.ɵfac });
/** @nocollapse */
TaskUIService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(TaskUIService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service model
 */
class Service extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service manager service
 */
class ServiceService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Service, "services", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.SERVICE_API = this.API + '/services';
    }
    /**
     * remove service
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save service
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        /** @type {?} */
        let serviceConnection = item.connection;
        if (item.connection != null) {
            if (typeof item.connection._links != 'undefined') {
                item.connection = item.connection._links.self.href;
            }
            else {
                serviceConnection._links = {};
                serviceConnection._links.self = {};
                serviceConnection._links.self.href = "";
            }
        }
        if (item._links != null) {
            //update relations
            delete item.connection;
            if (serviceConnection._links.self.href == '') {
                item.deleteRelation('connection', serviceConnection).subscribe(result => {
                }, error => console.error(error));
            }
            else {
                item.substituteRelation('connection', serviceConnection).subscribe(result => {
                }, error => console.error(error));
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.SERVICE_API, item);
        }
        return result;
    }
}
ServiceService.ɵfac = function ServiceService_Factory(t) { return new (t || ServiceService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
ServiceService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: ServiceService, factory: ServiceService.ɵfac });
/** @nocollapse */
ServiceService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(ServiceService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service parameter model
 */
class ServiceParameter extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service parameter manager service
 */
class ServiceParameterService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(ServiceParameter, "service-parameters", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.SERVICE_PARAMETER_API = this.API + '/service-parameters';
    }
    /**
     * remove service parameter
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save service parameter
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            if (item.service != null) {
                /** @type {?} */
                let service = item.service;
                delete item.service;
                item.substituteRelation('service', service).subscribe(result => {
                }, error => console.error(error));
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            item.service = item.service._links.self.href;
            result = this.http.post(this.SERVICE_PARAMETER_API, item);
        }
        return result;
    }
}
ServiceParameterService.ɵfac = function ServiceParameterService_Factory(t) { return new (t || ServiceParameterService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
ServiceParameterService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: ServiceParameterService, factory: ServiceParameterService.ɵfac });
/** @nocollapse */
ServiceParameterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(ServiceParameterService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Cartography
 */
class Cartography extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Cartography manager service
 */
class CartographyService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Cartography, "cartographies", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.CARTOGRAPHY_API = this.API + '/cartographies';
    }
    /**
     * remove cartography
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save cartography
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        /** @type {?} */
        let cartographyConnection = item.connection;
        /** @type {?} */
        const cartographyService = item.service;
        /** @type {?} */
        const cartographySelectionService = item.selectionService;
        if (item.service != null)
            item.service = item.service._links.self.href;
        if (item.selectionService != null)
            item.selectionService = item.selectionService._links.self.href;
        if (item.connection != null) {
            if (typeof item.connection._links != 'undefined') {
                item.connection = item.connection._links.self.href;
            }
            else {
                cartographyConnection._links = {};
                cartographyConnection._links.self = {};
                cartographyConnection._links.self.href = "";
            }
        }
        if (item._links != null) {
            //update relations
            delete item.connection;
            delete item.service;
            delete item.selectionService;
            if (cartographyConnection._links.self.href == '') {
                item.deleteRelation('connection', cartographyConnection).subscribe(result => {
                    item.substituteRelation('service', cartographyService).subscribe(result => {
                        item.substituteRelation('selectionService', cartographySelectionService).subscribe(result => {
                        }, error => console.error(error));
                    }, error => console.error(error));
                }, error => console.error(error));
            }
            else {
                item.substituteRelation('connection', cartographyConnection).subscribe(result => {
                    item.substituteRelation('service', cartographyService).subscribe(result => {
                        item.substituteRelation('selectionService', cartographySelectionService).subscribe(result => {
                        }, error => console.error(error));
                    }, error => console.error(error));
                }, error => console.error(error));
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.CARTOGRAPHY_API, item);
        }
        return result;
    }
}
CartographyService.ɵfac = function CartographyService_Factory(t) { return new (t || CartographyService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
CartographyService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: CartographyService, factory: CartographyService.ɵfac });
/** @nocollapse */
CartographyService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(CartographyService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Cartography group
 */
class CartographyGroup extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * CartographyGroup manager service
 */
class CartographyGroupService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(CartographyGroup, "cartography-groups", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.CARTOGRAPHY_GROUP_API = this.API + '/cartography-groups';
    }
    /**
     * remove cartography group
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save cartography group
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.CARTOGRAPHY_GROUP_API, item);
        }
        return result;
    }
}
CartographyGroupService.ɵfac = function CartographyGroupService_Factory(t) { return new (t || CartographyGroupService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
CartographyGroupService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: CartographyGroupService, factory: CartographyGroupService.ɵfac });
/** @nocollapse */
CartographyGroupService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(CartographyGroupService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Cartography availability model
 */
class CartographyAvailability extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * CartographyAvailability manager service
 */
class CartographyAvailabilityService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(CartographyAvailability, "cartography-availabilities", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.CARTOGRAPHY_AVAILABILITY_API = this.API + '/cartography-availabilities';
    }
    /**
     * remove cartography availability
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save cartography availability
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.cartography != null) {
                item.substituteRelation('cartography', item.cartography).subscribe(result => {
                }, error => console.error(error));
            }
            if (item.territory != null) {
                item.substituteRelation('territory', item.territory).subscribe(result => {
                }, error => console.error(error));
            }
        }
        else {
            item.territory = item.territory._links.self.href;
            item.cartography = item.cartography._links.self.href;
            result = this.http.post(this.CARTOGRAPHY_AVAILABILITY_API, item);
        }
        return result;
    }
}
CartographyAvailabilityService.ɵfac = function CartographyAvailabilityService_Factory(t) { return new (t || CartographyAvailabilityService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
CartographyAvailabilityService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: CartographyAvailabilityService, factory: CartographyAvailabilityService.ɵfac });
/** @nocollapse */
CartographyAvailabilityService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(CartographyAvailabilityService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Background model
 */
class Background extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Background manager service
 */
class BackgroundService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Background, "backgrounds", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.BACKGROUND_API = this.API + '/backgrounds';
    }
    /**
     * remove background
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save background
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        /** @type {?} */
        let backgroundCartographyGroup = item.cartographyGroup;
        if (item.cartographyGroup != null) {
            if (typeof item.cartographyGroup._links != 'undefined') {
                item.cartographyGroup = item.cartographyGroup._links.self.href;
            }
            else {
                backgroundCartographyGroup._links = {};
                backgroundCartographyGroup._links.self = {};
                backgroundCartographyGroup._links.self.href = "";
            }
        }
        if (item._links != null) {
            //update relations
            delete item.cartographyGroup;
            if (backgroundCartographyGroup._links.self.href == '') {
                item.deleteRelation('cartographyGroup', backgroundCartographyGroup).subscribe(result => {
                }, error => console.error(error));
            }
            else {
                item.substituteRelation('cartographyGroup', backgroundCartographyGroup).subscribe(result => {
                }, error => console.error(error));
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.BACKGROUND_API, item);
        }
        return result;
    }
}
BackgroundService.ɵfac = function BackgroundService_Factory(t) { return new (t || BackgroundService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
BackgroundService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: BackgroundService, factory: BackgroundService.ɵfac });
/** @nocollapse */
BackgroundService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(BackgroundService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Tree model
 */
class Tree extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Tree manager service
 */
class TreeService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Tree, "trees", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.TREE_API = this.API + '/trees';
    }
    /**
     * remove tree
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save tree
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.TREE_API, item);
        }
        return result;
    }
}
TreeService.ɵfac = function TreeService_Factory(t) { return new (t || TreeService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
TreeService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: TreeService, factory: TreeService.ɵfac });
/** @nocollapse */
TreeService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(TreeService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Tree node model
 */
class TreeNode extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Tree node manager service
 */
class TreeNodeService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(TreeNode, "tree-nodes", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.TREE_NODE_API = this.API + '/tree-nodes';
    }
    /**
     * remove tree node
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save tree node
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            /** @type {?} */
            const itemTree = item.tree;
            /** @type {?} */
            const itemCartography = item.cartography;
            /** @type {?} */
            const itemParent = item.parent;
            delete item.tree;
            delete item.cartography;
            delete item.parent;
            result = this.http.put(item._links.self.href, item);
            if (itemTree != null) {
                item.substituteRelation('tree', itemTree).subscribe(result => {
                }, error => console.error(error));
            }
            if (itemCartography != null) {
                item.substituteRelation('cartography', itemCartography).subscribe(result => {
                }, error => console.error(error));
            }
            if (itemParent != null) {
                item.substituteRelation('parent', itemParent).subscribe(result => {
                }, error => console.error(error));
            }
        }
        else {
            if (item.tree && item.tree._links && item.tree._links.self) {
                item.tree = item.tree._links.self.href;
            }
            if (item.cartography && item.cartography._links && item.cartography._links.self) {
                item.cartography = item.cartography._links.self.href;
            }
            result = this.http.post(this.TREE_NODE_API, item);
        }
        return result;
    }
}
TreeNodeService.ɵfac = function TreeNodeService_Factory(t) { return new (t || TreeNodeService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
TreeNodeService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: TreeNodeService, factory: TreeNodeService.ɵfac });
/** @nocollapse */
TreeNodeService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(TreeNodeService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * Territorial appliction name
  @type {?} */
const TERRITORIAL_APP_NAME = "Aplicación Territorial";
/**
 * Application model
 */
class Application extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Application manager service
 */
class ApplicationService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Application, "applications", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.APPLICATION_API = this.API + '/applications';
    }
    /**
     * remove application
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save application
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        /** @type {?} */
        let applicationSituationMap = item.situationMap;
        if (item.situationMap != null) {
            if (typeof item.situationMap._links != 'undefined') {
                item.situationMap = item.situationMap._links.self.href;
            }
            else {
                applicationSituationMap._links = {};
                applicationSituationMap._links.self = {};
                applicationSituationMap._links.self.href = "";
            }
        }
        if (item._links != null) {
            //update relations
            delete item.situationMap;
            if (applicationSituationMap._links.self.href == '') {
                item.deleteRelation('situationMap', applicationSituationMap).subscribe(result => {
                }, error => console.error(error));
            }
            else {
                item.substituteRelation('situationMap', applicationSituationMap).subscribe(result => {
                }, error => console.error(error));
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.APPLICATION_API, item);
        }
        return result;
    }
}
ApplicationService.ɵfac = function ApplicationService_Factory(t) { return new (t || ApplicationService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
ApplicationService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: ApplicationService, factory: ApplicationService.ɵfac });
/** @nocollapse */
ApplicationService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(ApplicationService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Application background model
 */
class ApplicationBackground extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Application background manager service
 */
class ApplicationBackgroundService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(ApplicationBackground, "application-backgrounds", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.APPLICATION_BACKGROUND_API = this.API + '/application-backgrounds';
    }
    /**
     * remove application background
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save application background
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.application != null) {
                item.substituteRelation('application', item.application).subscribe(result => {
                }, error => console.error(error));
            }
            if (item.background != null) {
                item.substituteRelation('background', item.background).subscribe(result => {
                }, error => console.error(error));
            }
        }
        else {
            item.application = item.application._links.self.href;
            item.background = item.background._links.self.href;
            result = this.http.post(this.APPLICATION_BACKGROUND_API, item);
        }
        return result;
    }
}
ApplicationBackgroundService.ɵfac = function ApplicationBackgroundService_Factory(t) { return new (t || ApplicationBackgroundService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
ApplicationBackgroundService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: ApplicationBackgroundService, factory: ApplicationBackgroundService.ɵfac });
/** @nocollapse */
ApplicationBackgroundService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(ApplicationBackgroundService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Application parameter model
 */
class ApplicationParameter extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Application parameter manager service
 */
class ApplicationParameterService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(ApplicationParameter, "application-parameters", injector);
        this.http = http;
        /**
         * API base path
         */
        this.API = '/api';
        /**
         * API resource path
         */
        this.APPLICATION_PARAMETER_API = this.API + '/application-parameters';
    }
    /**
     * remove application
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save application
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.application != null) {
                item.substituteRelation('application', item.application).subscribe(result => {
                }, error => console.error(error));
            }
        }
        else {
            item.application = item.application._links.self.href;
            result = this.http.post(this.APPLICATION_PARAMETER_API, item);
        }
        return result;
    }
}
ApplicationParameterService.ɵfac = function ApplicationParameterService_Factory(t) { return new (t || ApplicationParameterService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
ApplicationParameterService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: ApplicationParameterService, factory: ApplicationParameterService.ɵfac });
/** @nocollapse */
ApplicationParameterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(ApplicationParameterService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Layer model: configure Layer data and displaying configuration
 */
class Layer {
    constructor() {
        /**
         * layer visibility
         */
        this.visibility = false;
        /**
         * Transparency (Transparent) 0-1 (Opaque)
         */
        this.opacity = 1.0;
        /**
         * Service attributions
         */
        this.attributions = "";
        /**
         * Description
         */
        this.desc = "";
        /**
         * Transparent request parameter?
         */
        this.url_transparent = "true";
        /**
         * Request Background parameter color (Hexa)
         */
        this.url_bgcolor = "0x000000";
        /**
         * Extent for tiled services
         */
        this.extent = null;
        /**
         * Enabled for GetFeatureInfo requests (enabled to use the viewer features information tool)
         */
        this.queryable = false;
    }
}
/**
 * Optional parameter model: configure parameter-value pair to add to the request layer URL
 */
class OptionalParameter {
}
/**
 * Layer configuration model: modify the configuration of a layer when interacting with the map (make visible, move the layer ...)
 */
class LayerConfiguration {
}
/**
 * Layer group model
 */
class LayerGroup {
}
/**
 * Map options configuration model
 */
class MapOptionsConfiguration {
}
/**
 * Map component status model
 */
class MapComponentStatus {
    constructor() {
        /**
         * loaded?
         */
        this.loaded = false;
    }
}
/** Map configuration manager service*/
class MapConfigurationManagerService {
    /**
     * constructor
     */
    constructor() {
        //
        this.layersSubject = new BehaviorSubject([]);
        this.layers = null;
        this.baseLayerGroupsSubject = new BehaviorSubject([]);
        this.baseLayerGroups = null;
        this.layerConfigurationSubject = new BehaviorSubject([]);
        this.addLayersSubject = new BehaviorSubject([]);
        this.removeLayersSubject = new BehaviorSubject([]);
        this.situationMapConfigurationSubject = new BehaviorSubject([]);
        this.mapOptionsConfigurationSubject = new BehaviorSubject([]);
        this.mapComponentStatusSubject = new BehaviorSubject([]);
        /**
         * layer count
         */
        this.count = 0;
    }
    /**
     * configure the overlay layers of the map, by passing as a parameter an array of objects of type Layer objects defining the layers to load.
     * @param {?} configuration
     * @return {?}
     */
    loadLayersConfiguration(configuration) {
        if (this.layers != null) {
            this.clearLayers(false);
        }
        this.setLayers(configuration);
    }
    /**
     * configure the base layers of the map by passing as a parameter an array of objects of type LayerGroup each of them with the corresponding Layer objects defining the layers to load.
     * @param {?} configuration
     * @return {?}
     */
    loadBaseLayersConfiguration(configuration) {
        this.setBaseLayerGroups(configuration);
    }
    /**
     * get base layer groups
     * @return {?}
     */
    getBaseLayerGroups() {
        return this.baseLayerGroupsSubject.asObservable();
    }
    /**
     * set base layer groups
     * @param {?} groups
     * @return {?}
     */
    setBaseLayerGroups(groups) {
        this.baseLayerGroups = groups;
        this.refreshBaseLayerGroups();
    }
    /**
     * @return {?}
     */
    refreshBaseLayerGroups() {
        // Send the new values so that all subscribers are updated
        this.baseLayerGroupsSubject.next(this.baseLayerGroups);
    }
    /**
     * get layers
     * @return {?}
     */
    getLayers() {
        return this.layersSubject.asObservable();
    }
    /**
     * remove all layers from map
     * @param {?} refresh
     * @return {?}
     */
    clearLayers(refresh) {
        while (this.layers.length) {
            this.layers.pop();
        }
        if (refresh) {
            this.refreshLayers();
        }
    }
    /**
     * set layers
     * @param {?} layers
     * @return {?}
     */
    setLayers(layers) {
        this.layers = layers;
        this.refreshLayers();
    }
    /**
     * add given layer to map
     * @param {?} layer
     * @return {?}
     */
    addLayer(layer) {
        this.layers.push(layer);
        this.refreshAddLayers(layer);
    }
    /**
     * add given layer to map at given index
     * @param {?} layer
     * @param {?} index
     * @return {?}
     */
    addLayerAt(layer, index) {
        if (index == 0) {
            this.layers = [layer].concat(this.layers);
        }
        else if (index >= this.layers.length) {
            this.layers.push(layer);
        }
        else {
            this.layers = this.layers.slice(0, index)
                .concat([layer])
                .concat(this.layers.slice(index, this.layers.length));
        }
        this.refreshAddLayers(layer);
        this.refreshLayerConfiguration(layer.id, null, null, index);
    }
    /**
     * remove given layer from map
     * @param {?} layer
     * @return {?}
     */
    removeLayer(layer) {
        /** @type {?} */
        var index = this.layers.indexOf(layer);
        this.removeLayerIndex(index);
    }
    /**
     * remove layer with given id from map
     * @param {?} id
     * @return {?}
     */
    removeLayerId(id) {
        /** @type {?} */
        var index = -1;
        for (var i = 0, iLen = this.layers.length; i < iLen; i++) {
            if (this.layers[i].id == id) {
                index = i;
                break;
            }
        }
        this.removeLayerIndex(index);
    }
    /**
     * remove layer at given index from map
     * @param {?} index
     * @return {?}
     */
    removeLayerIndex(index) {
        /** @type {?} */
        var layer = this.layers[index];
        this.layers.splice(index, 1);
        this.refreshRemoveLayers(layer);
    }
    /**
     * refresh layers
     * @return {?}
     */
    refreshLayers() {
        // Send the new values so that all subscribers are updated
        this.layersSubject.next(this.layers);
    }
    /**
     * Observable for layers added
     * @return {?}
     */
    getLayersAdded() {
        return this.addLayersSubject.asObservable();
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    refreshAddLayers(layer) {
        // Send the new values so that all subscribers are updated
        this.addLayersSubject.next([layer]);
    }
    /**
     * @return {?}
     */
    getLayersRemoved() {
        return this.removeLayersSubject.asObservable();
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    refreshRemoveLayers(layer) {
        // Send the new values so that all subscribers are updated
        this.removeLayersSubject.next([layer]);
    }
    /**
     * @return {?}
     */
    getLayerConfigurationListener() {
        return this.layerConfigurationSubject.asObservable();
    }
    /**
     * @param {?} id
     * @return {?}
     */
    getLayerIndexById(id) {
        /** @type {?} */
        var index = -1;
        for (var i = 0, iLen = this.layers.length; i < iLen; i++) {
            if (this.layers[i].id == id) {
                index = i;
                break;
            }
        }
        return index;
    }
    /**
     * move layer with given id to the given index
     * @param {?} id
     * @param {?} index
     * @return {?}
     */
    moveLayer(id, index) {
        /** @type {?} */
        var layerIndex = this.getLayerIndexById(id);
        if (layerIndex != -1) {
            /** @type {?} */
            var layer = this.layers.splice(layerIndex, 1);
            this.layers =
                this.layers.slice(0, index)
                    .concat(layer)
                    .concat(this.layers.slice(index, this.layers.length));
        }
        this.refreshLayerConfiguration(id, null, null, index);
    }
    /**
     * change visibility of layer with given id to the given value
     * @param {?} id
     * @param {?} visibility
     * @return {?}
     */
    changeLayerVisibility(id, visibility) {
        this.refreshLayerConfiguration(id, null, visibility, null);
    }
    /**
     * change opacity of layer with given id to the given value
     * @param {?} id
     * @param {?} opacity
     * @return {?}
     */
    changeLayerOpacity(id, opacity) {
        this.refreshLayerConfiguration(id, opacity, null, null);
    }
    /**
     * @param {?} id
     * @param {?} opacity
     * @param {?} visibility
     * @param {?} position
     * @return {?}
     */
    refreshLayerConfiguration(id, opacity, visibility, position) {
        /** @type {?} */
        var layer = new LayerConfiguration();
        layer.id = id;
        layer.opacity = opacity;
        layer.visibility = visibility;
        layer.position = position;
        this.layerConfigurationSubject.next([layer]);
    }
    /**
     * @return {?}
     */
    getSituationMapConfigurationListener() {
        return this.situationMapConfigurationSubject.asObservable();
    }
    /**
     * configure the situation map of the map component by passing as a parameter an array of objects of type LayerGroup, each of them with the corresponding Layer objects defining the layers to load as situation map.
     * @param {?} layers
     * @return {?}
     */
    loadSituationMapConfiguration(layers) {
        // Send the new values so that all subscribers are updated
        this.situationMapConfigurationSubject.next(layers);
    }
    /**
     * @return {?}
     */
    getMapOptionsConfigurationListener() {
        return this.mapOptionsConfigurationSubject.asObservable();
    }
    /**
     * load map options configuration
     * @param {?} configuration
     * @return {?}
     */
    loadMapOptionsConfiguration(configuration) {
        // Send the new values so that all subscribers are updated
        this.mapOptionsConfigurationSubject.next([configuration]);
    }
    /**
     * @return {?}
     */
    getMapComponentStatusListener() {
        return this.mapComponentStatusSubject.asObservable();
    }
    /**
     * set map component status
     * @param {?} status
     * @return {?}
     */
    setMapComponentStatus(status) {
        //Notify the map component status
        this.mapComponentStatusSubject.next([status]);
    }
}
MapConfigurationManagerService.ɵfac = function MapConfigurationManagerService_Factory(t) { return new (t || MapConfigurationManagerService)(); };
MapConfigurationManagerService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: MapConfigurationManagerService, factory: MapConfigurationManagerService.ɵfac, providedIn: 'root' });
/** @nocollapse */
MapConfigurationManagerService.ctorParameters = () => [];
/** @nocollapse */ MapConfigurationManagerService.ngInjectableDef = defineInjectable({ factory: function MapConfigurationManagerService_Factory() { return new MapConfigurationManagerService(); }, token: MapConfigurationManagerService, providedIn: "root" });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(MapConfigurationManagerService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * \@whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * \@howToUse
 * ```
 *     <some-element *sitmunHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *sitmunHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
class HasAnyAuthorityDirective {
    /**
     * constructor
     * @param {?} principal
     * @param {?} templateRef
     * @param {?} viewContainerRef
     */
    constructor(principal, templateRef, viewContainerRef) {
        this.principal = principal;
        this.templateRef = templateRef;
        this.viewContainerRef = viewContainerRef;
    }
    /**
     * Set whether current user has any of the given authorities
     * @param {?} value
     * @return {?}
     */
    set sitmunHasAnyAuthority(value) {
        this.authorities = typeof value === 'string' ? [/** @type {?} */ (value)] : /** @type {?} */ (value);
        this.updateView();
        // Get notified each time authentication state changes.
        this.principal.getAuthenticationState().subscribe((identity) => this.updateView());
    }
    /**
     * update view
     * @return {?}
     */
    updateView() {
        if (this.territory) {
            this.principal.hasAnyAuthorityOnTerritory(this.authorities, this.territory).then((result) => {
                this.viewContainerRef.clear();
                if (result) {
                    this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
            });
        }
        else {
            this.principal.hasAnyAuthority(this.authorities).then((result) => {
                this.viewContainerRef.clear();
                if (result) {
                    this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
            });
        }
    }
}
HasAnyAuthorityDirective.ɵfac = function HasAnyAuthorityDirective_Factory(t) { return new (t || HasAnyAuthorityDirective)(ɵngcc0.ɵɵdirectiveInject(Principal), ɵngcc0.ɵɵdirectiveInject(ɵngcc0.TemplateRef), ɵngcc0.ɵɵdirectiveInject(ɵngcc0.ViewContainerRef)); };
HasAnyAuthorityDirective.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: HasAnyAuthorityDirective, selectors: [["", "sitmunHasAnyAuthority", ""]], inputs: { sitmunHasAnyAuthority: "sitmunHasAnyAuthority", territory: "territory" } });
/** @nocollapse */
HasAnyAuthorityDirective.ctorParameters = () => [
    { type: Principal },
    { type: TemplateRef },
    { type: ViewContainerRef }
];
HasAnyAuthorityDirective.propDecorators = {
    territory: [{ type: Input }],
    sitmunHasAnyAuthority: [{ type: Input }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(HasAnyAuthorityDirective, [{
        type: Directive,
        args: [{
                selector: '[sitmunHasAnyAuthority]'
            }]
    }], function () { return [{ type: Principal }, { type: ɵngcc0.TemplateRef }, { type: ɵngcc0.ViewContainerRef }]; }, { sitmunHasAnyAuthority: [{
            type: Input
        }], territory: [{
            type: Input
        }] }); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * \@whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * \@howToUse
 * ```
 *     <some-element *sitmunHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *sitmunHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
class HasAnyAuthorityOnTerritoryDirective {
    /**
     * constructor
     * @param {?} principal
     * @param {?} templateRef
     * @param {?} viewContainerRef
     */
    constructor(principal, templateRef, viewContainerRef) {
        this.principal = principal;
        this.templateRef = templateRef;
        this.viewContainerRef = viewContainerRef;
    }
    /**
     * Set whether current user has any of the given authorities on territory
     * @param {?} opts
     * @return {?}
     */
    set sitmunHasAnyAuthorityOnTerritory(opts) {
        this.authorities = typeof opts.authorities === 'string' ? [/** @type {?} */ (opts.authorities)] : /** @type {?} */ (opts.authorities);
        this.territory = opts.territory;
        this.updateView();
        // Get notified each time authentication state changes.
        this.principal.getAuthenticationState().subscribe((identity) => this.updateView());
    }
    /**
     * update view
     * @return {?}
     */
    updateView() {
        if (this.territory) {
            this.principal.hasAnyAuthorityOnTerritory(this.authorities, this.territory).then((result) => {
                this.viewContainerRef.clear();
                if (result) {
                    this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
            });
        }
        else {
            this.principal.hasAnyAuthority(this.authorities).then((result) => {
                this.viewContainerRef.clear();
                if (result) {
                    this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
            });
        }
    }
}
HasAnyAuthorityOnTerritoryDirective.ɵfac = function HasAnyAuthorityOnTerritoryDirective_Factory(t) { return new (t || HasAnyAuthorityOnTerritoryDirective)(ɵngcc0.ɵɵdirectiveInject(Principal), ɵngcc0.ɵɵdirectiveInject(ɵngcc0.TemplateRef), ɵngcc0.ɵɵdirectiveInject(ɵngcc0.ViewContainerRef)); };
HasAnyAuthorityOnTerritoryDirective.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: HasAnyAuthorityOnTerritoryDirective, selectors: [["", "sitmunHasAnyAuthorityOnTerritory", ""]], inputs: { sitmunHasAnyAuthorityOnTerritory: "sitmunHasAnyAuthorityOnTerritory" } });
/** @nocollapse */
HasAnyAuthorityOnTerritoryDirective.ctorParameters = () => [
    { type: Principal },
    { type: TemplateRef },
    { type: ViewContainerRef }
];
HasAnyAuthorityOnTerritoryDirective.propDecorators = {
    sitmunHasAnyAuthorityOnTerritory: [{ type: Input }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(HasAnyAuthorityOnTerritoryDirective, [{
        type: Directive,
        args: [{
                selector: '[sitmunHasAnyAuthorityOnTerritory]'
            }]
    }], function () { return [{ type: Principal }, { type: ɵngcc0.TemplateRef }, { type: ɵngcc0.ViewContainerRef }]; }, { sitmunHasAnyAuthorityOnTerritory: [{
            type: Input
        }] }); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * load i18n assets
 * @param {?} http
 * @return {?}
 */
function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
const ɵ0 = (createTranslateLoader);
/**
 * SITMUN frontend core module
 */
class SitmunFrontendCoreModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: SitmunFrontendCoreModule,
            providers: [
                TerritoryService,
                TerritoryTypeService,
                RoleService,
                AccountService,
                AuthService,
                UserService,
                ConnectionService,
                TaskService,
                TaskTypeService,
                TaskUIService,
                TaskGroupService,
                TaskParameterService,
                TaskAvailabilityService,
                ServiceService,
                ServiceParameterService,
                CartographyService,
                CartographyGroupService,
                CartographyAvailabilityService,
                BackgroundService,
                TreeService,
                TreeNodeService,
                ApplicationService,
                ApplicationParameterService,
                ApplicationBackgroundService,
                AuthInterceptor,
                AuthExpiredInterceptor,
                Principal,
                UserPositionService,
                UserConfigurationService,
                LoginService,
                MapConfigurationManagerService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthExpiredInterceptor,
                    multi: true
                }
            ]
        };
    }
}
SitmunFrontendCoreModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: SitmunFrontendCoreModule });
SitmunFrontendCoreModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function SitmunFrontendCoreModule_Factory(t) { return new (t || SitmunFrontendCoreModule)(); }, imports: [[
            /*RouterModule,
                HttpClientModule,
                CommonModule,
                AngularHalModule,*/
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: ɵ0,
                    deps: [HttpClient]
                }
            }),
        ], TranslateModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(SitmunFrontendCoreModule, { declarations: function () { return [HasAnyAuthorityDirective, HasAnyAuthorityOnTerritoryDirective]; }, imports: function () { return [ɵngcc3.TranslateModule]; }, exports: function () { return [HasAnyAuthorityDirective, HasAnyAuthorityOnTerritoryDirective, TranslateModule]; } }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(SitmunFrontendCoreModule, [{
        type: NgModule,
        args: [{
                imports: [
                    /*RouterModule,
                        HttpClientModule,
                        CommonModule,
                        AngularHalModule,*/
                    TranslateModule.forRoot({
                        loader: {
                            provide: TranslateLoader,
                            useFactory: ɵ0,
                            deps: [HttpClient]
                        }
                    }),
                ],
                declarations: [
                    HasAnyAuthorityDirective,
                    HasAnyAuthorityOnTerritoryDirective
                ],
                exports: [
                    HasAnyAuthorityDirective,
                    HasAnyAuthorityOnTerritoryDirective,
                    TranslateModule
                ]
            }]
    }], null, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Angular HAL module
 */
class AngularHalModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: AngularHalModule,
            providers: [
                ExternalService,
                HttpClient,
                {
                    provide: ResourceService,
                    useClass: ResourceService,
                    deps: [ExternalService]
                }
            ]
        };
    }
}
AngularHalModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: AngularHalModule });
AngularHalModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function AngularHalModule_Factory(t) { return new (t || AngularHalModule)(); }, providers: [
        ExternalService,
        HttpClient,
        {
            provide: ResourceService,
            useClass: ResourceService,
            deps: [ExternalService]
        }
    ], imports: [[HttpClientModule], HttpClientModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(AngularHalModule, { imports: function () { return [HttpClientModule]; }, exports: function () { return [HttpClientModule]; } }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AngularHalModule, [{
        type: NgModule,
        args: [{
                imports: [HttpClientModule],
                declarations: [],
                exports: [HttpClientModule],
                providers: [
                    ExternalService,
                    HttpClient,
                    {
                        provide: ResourceService,
                        useClass: ResourceService,
                        deps: [ExternalService]
                    }
                ]
            }]
    }], null, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { AccountService, AuthService, AuthInterceptor, AuthExpiredInterceptor, LoginService, Principal, User, UserService, UserPosition, UserPositionService, UserConfiguration, UserConfigurationService, Territory, TerritoryService, TerritoryType, TerritoryTypeService, Role, RoleService, Connection, ConnectionService, GEOADMIN_TREE_TASK_ID, Task, TaskService, TaskType, TaskTypeService, TaskGroup, TaskGroupService, TaskParameter, TaskParameterService, TaskAvailability, TaskAvailabilityService, TaskUI, TaskUIService, Service, ServiceService, ServiceParameter, ServiceParameterService, Cartography, CartographyService, CartographyGroup, CartographyGroupService, CartographyAvailability, CartographyAvailabilityService, Background, BackgroundService, Tree, TreeService, TreeNode, TreeNodeService, TERRITORIAL_APP_NAME, Application, ApplicationService, ApplicationBackground, ApplicationBackgroundService, ApplicationParameter, ApplicationParameterService, Layer, OptionalParameter, LayerConfiguration, LayerGroup, MapOptionsConfiguration, MapComponentStatus, MapConfigurationManagerService, createTranslateLoader, SitmunFrontendCoreModule, ExternalService, RestService, Resource, ResourceArray, ResourceHelper, AngularHalModule, ResourceService as ɵc, HasAnyAuthorityOnTerritoryDirective as ɵb, HasAnyAuthorityDirective as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWNvcmUuanMiLCJzb3VyY2VzIjpbIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLWFycmF5LnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UtaGVscGVyLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvZXh0ZXJuYWwuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYWNjb3VudC9hY2NvdW50LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLmludGVyY2VwdG9yLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvcHJpbmNpcGFsLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLWV4cGlyZWQuaW50ZXJjZXB0b3IudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9sb2dpbi5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3VzZXIvdXNlci5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3VzZXIvdXNlci1wb3NpdGlvbi5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24uc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItY29uZmlndXJhdGlvbi5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItY29uZmlndXJhdGlvbi5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGVycml0b3J5L3RlcnJpdG9yeS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktdHlwZS5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9yb2xlL3JvbGUubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY29ubmVjdGlvbi9jb25uZWN0aW9uLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2suc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stdHlwZS5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stdHlwZS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay1ncm91cC5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stZ3JvdXAuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stcGFyYW1ldGVyLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay1wYXJhbWV0ZXIuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stYXZhaWxhYmlsaXR5Lm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay1hdmFpbGFiaWxpdHkuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stdWkubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXVpLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3NlcnZpY2Uvc2VydmljZS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3NlcnZpY2Uvc2VydmljZS1wYXJhbWV0ZXIubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5Lm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvYmFja2dyb3VuZC5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS1ub2RlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS1ub2RlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24ubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24uc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLWJhY2tncm91bmQuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24tcGFyYW1ldGVyLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvbWFwL21hcC1jb25maWd1cmF0aW9uLW1hbmFnZXIuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LmRpcmVjdGl2ZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LW9uLXRlcnJpdG9yeS5kaXJlY3RpdmUudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvc2l0bXVuLWZyb250ZW5kLWNvcmUubW9kdWxlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvYW5ndWxhci1oYWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbIm9ic2VydmFibGVUaHJvd0Vycm9yIiwidXJsLnBhcnNlIiwib2JzZXJ2YWJsZU9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsQUFBQTtBQUFzQztBQUFJO0FBRWpCO0FBQWU7QUFTeEM7OzthQXVCMkIsQ0FBQztBQXZCNUI7QUFBc0I7QUFBb0I7Y0F5QmxCLENBQUMsZkF6QjZCO0FBRXBEO0FBQVksNkJBcUJhLENBQUM7QUFDNUI7QUFJd0IsQ0FBQyxEQUpiO0FBQ0E7Z0JBU2EsRUFBRSxsQkFUSCwwQkFBQSxDQUFDO0FBQ3pCO0FBQ087QUFDQTtnQkFTSSxDQUFDLEVBQUssbkJBVEUsMEJBQUssQ0FBQztTQVVqQixUQVRSO0NBU1ksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGxCQVJ0QjtBQVNGLEFBUlM7QUFBWSxzQkFHRCxFQUFFO0FBQzNCOzZCQU9hLDdCQU5GO0tBT0gsTEFORztBQU1JLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQzdCLDdCQVBrQixvQkFBWixDQUFDLEVBQUs7QUFDakIsWUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3QixTQUFLO0FBQ0w7QUFDVztFQU1RLENBQUMsSUFBa0IsRUFBRSxUQUw3QjtLQUswQyxFQUFFLFFBQWdCLGZBTGhELHNCQUFWO2lDQU1MLGpDQU5hLFlBQ2IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUtwQixNQUFNLEdBQXFCLFRBSnpDLFNBQUs7QUFDTDtBQUd1RCxDQUFDLGlCQUFpQixDQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxuQ0FGbEY7R0FHSCxNQUFNLENBQUMsVkFGSjtNQUVZLEdBQUcsUUFBUSxDQUFDLGFBQzNCLGNBQWMsQ0FBQyw5Q0FIQSxvQkFBSixDQUFDLElBQWtCLEVBQUUsUUFBYSxFQUFFLFFBQWdCO3VCQUduQixDQUFDLElBQUksNUJBSHFCO0NBR25CLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxhQUNyRSxPQUFPLE1BQU0sQ0FBQyxVQUNqQix4REFKTSxZQUFILE1BQU0sTUFBTSxHQUFxQixjQUFjLENBQUMsaUJBQWlCLENBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdGLFlBQVEsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7V0FNeEIsQ0FBQyxJQUFrQixtQkFDdEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLGtCQUNmLE9BQU8sL0VBUG5CLFlBQVEsY0FBYyxDQUFDLDZCQUE2QixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7V0FPNUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsMUJBTmhELFlBQVEsT0FBTyxNQUFNLENBQUM7QUFDdEIsU0FBSztFQUt5RCxDQUFDLFFBQVEsWEFKdkU7QUFJd0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUMsT0FBTyx6QkFIckY7Q0FHdUYsREFGdkY7R0FFcUcsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FDL0csR0FBRyxDQUFDLHhCQUhHLG9CQUFaLENBQUMsSUFBa0I7QUFHRixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSw5QkFIckIsWUFDN0IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0NBRW1DLENBQUMsUUFBUSxDQUFDLENBQUMsRUFDekQsVUFBVSxDQUFDLEtBQUssSUFBSUEsVUFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFFLENBQUMsY0FDMUQsYUFDRCxPQUFPQSxVQUFvQixDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFDbEQsNEVBR00sQ0FBQyxJQUFrQixtQkFDdEIsSUFBSSx4T0FUWixnQkFBWSxPQUFPLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUMvRyxHQUFHLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFDekQsVUFBVSxDQUFDLEtBQUssSUFBSUEsVUFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFFLENBQUM7RUFPbkQsQ0FBQyxRQUFRLEVBQUUsYkFOM0IsYUFBUztpQkFPRyxPQUFPLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxqREFONUMsWUFBUSxPQUFPQSxVQUFvQixDQUFDLGlCQUFpQixDQUFDLENBQUM7RUFNUixDQUFDLEhBTGhELFNBQUs7TUFLeUQsQ0FBQyxQQUovRDtHQUl1RSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFDLE9BQU8sN0JBSHJGO0NBR3VGLERBRnZGO0dBRXFHLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQy9HLEdBQUcsQ0FBQyx4QkFIRyxvQkFBWixDQUFDLElBQWtCO0FBR0YsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsOUJBSHJCLFlBQzdCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtDQUVtQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQ3pELFVBQVUsQ0FBQyxLQUFLLElBQUlBLFVBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBRSxDQUFDLGNBQzFELGFBQ0QsT0FBT0EsVUFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQ2xELDBFQUdPLENBQUMsSUFBa0IsbUJBQ3ZCLElBQUksdE9BVFosZ0JBQVksT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FDL0csR0FBRyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQ3pELFVBQVUsQ0FBQyxLQUFLLElBQUlBLFVBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBRSxDQUFDO0FBT25ELENBQUMsU0FBUyxFQUFFLFpBTjVCLGFBQVM7Z0JBT0csT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsaERBTjVDLFlBQVEsT0FBT0EsVUFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0NBTVIsQ0FBQyxGQUxoRCxTQUFLO0tBS3lELENBQUMsTkFKL0Q7RUFJdUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBQyx0QkFIL0U7RUFHc0YsRUFBRSxKQUZ4RjtNQUVzRyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUNoSCxHQUFHLENBQUMsM0JBSEcscUJBQVgsQ0FBQyxJQUFrQjtFQUdILElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGhDQUhwQixZQUM5QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7RUFFa0MsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUN6RCxVQUFVLENBQUMsS0FBSyxJQUFJQSxVQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUUsQ0FBQyxjQUMxRCxhQUNELE9BQU9BLFVBQW9CLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxVQUNuRCx3RUFHTSxDQUFDLElBQWtCLG1CQUN0QixJQUFJLElBQUksMU9BVGhCLGdCQUFZLE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQ2hILEdBQUcsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUN6RCxVQUFVLENBQUMsS0FBSyxJQUFJQSxVQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUUsQ0FBQztBQU9sRCxRQUFRLEVBQUUsVkFOM0IsYUFBUztjQU9HLE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxsREFOaEQsWUFBUSxPQUFPQSxVQUFvQixDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDeEQsU0FBSztFQUt5RCxDQUFDLFFBQVEsWEFKdkU7QUFJd0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUMsT0FBTyx6QkFIckY7Q0FHdUYsREFGdkY7R0FFcUcsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FDL0csR0FBRyxDQUFDLHhCQUhHLG9CQUFaLENBQUMsSUFBa0I7QUFHRixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSw5QkFIckIsWUFDN0IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0NBRW1DLENBQUMsUUFBUSxDQUFDLENBQUMsRUFDekQsVUFBVSxDQUFDLEtBQUssSUFBSUEsVUFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFFLENBQUMsY0FDMUQsYUFDRCxPQUFPQSxVQUFvQixDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFDbEQseUZBR00sQ0FBQyxJQUFrQixFQUFFLGhPQVJoQyxnQkFBWSxPQUFPLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUMvRyxHQUFHLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFDekQsVUFBVSxDQUFDLEtBQUssSUFBSUEsVUFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFFLENBQUM7QUFNakIsQUFMbEQsYUFBUztLQU1ELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsM0NBTDlDLFlBQVEsT0FBT0EsVUFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZELFNBQUs7Q0FJNEQsRUFBRSxFQUFFLENBQUMsQ0FBQyxQQUh2RTtRQUlRLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyx0Q0FIM0I7RUFHa0MsQ0FBQyxIQUZsQztBQUUyQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE5BRnJDLG9CQUFiLENBQUMsSUFBa0IsRUFBRSxVQUFrQjtJQUcxQyxJQUFJLFNBQVMsR0FBR0MsS0FBUyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsbEVBSGpCLFlBQ2pELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0NBRy9ELElBQUksS0FBSyxHQUFXLGFBQWEsQ0FBQywxREFGMUMsWUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVQLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLDVCQUQ5RTtDQUNnRixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsYUFDbEcsS0FBSyxHQUFHLGFBQWEsQ0FBQyxZQUFZLDFFQUZiLFlBQXJCLElBQUksU0FBUyxHQUFHQSxLQUFTLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUUvQixLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQywxQkFEckU7S0FDNkUsRUFBRSxDQUFDLENBQUMsMENBR3pFLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLLG1CQUNyQiwvRkFMaUIsWUFBckIsSUFBSSxLQUFLLEdBQVcsYUFBYSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7TUFLaEYsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLGNBQWMsQ0FBQyxoRkFKcEcsWUFBUSxLQUFLLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0VBSTJCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyx6QkFIbkk7Q0FHd0ksQ0FBQyxDQUFDLGFBQ2xJLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLHZDQUZKLFlBQW5CLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLO0VBRUMsQ0FBQyxDQUFDLGFBQzVCLE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUM1RSxHQUFHLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSw5SUFIdEQsZ0JBQVksY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBR2hGLENBQUMsUUFBUSxDQUFDLENBQUMsRUFDekQsVUFBVSxDQUFDLEtBQUssSUFBSUQscENBSGhDLFlBQVEsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7S0FHZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFFLENBQUMsVUFDMUQsK0dBR2MsQ0FBQyxJQUFrQixFQUFFLEdBQUcsSUFBWSxtQkFDL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsOUxBUDdCLFlBQVEsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVFLEdBQUcsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUN6RCxVQUFVLENBQUMsS0FBSyxJQUFJQSxVQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUUsQ0FBQztHQUsxQixDQUFDLEpBSnRDLFNBQUs7QUFJd0MsQ0FBQyxEQUg5QztRQUdpRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLGFBQy9ELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEseERBSDFCO0FBRzJCLE9BQU8sQ0FBQyxSQUZuQztLQUU0QyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFhBRnRDLDRCQUFKLENBQUMsSUFBa0IsRUFBRSxHQUFHLElBQVk7SUFHL0MsSUFBSSxHQUFHLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsMUVBSGhCLFlBQ3RELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFFVyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLDlEQUQ5SSxZQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBRXJELEdBQUcsR0FBRyxJQUFJLENBQUMscEJBRG5CO0VBQzhCLENBQUMsR0FBRyxDQUFDLENBQUMsYUFDNUIsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVFLEdBQUcsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGxKQUh6QixZQUFyQixJQUFJLEdBQUcsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7R0FHcEYsQ0FBQyxDQUFDLEVBQ2hELFVBQVUsQ0FBQyxLQUFLLElBQUlBLFVBQW9CLENBQUMsdENBSHJELFlBQVEsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7RUFHc0IsQ0FBQyxDQUFDLENBQUUsQ0FBQyxVQUMxRCxtRkFHTSxDQUFDLElBQWtCLEVBQUUsSUFBWSxnREFDcEMsSUFBSSxHQUFHLEdBQUcsY0FBYyxDQUFDLHZMQVBqQyxZQUFRLE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUM1RSxHQUFHLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUNoRCxVQUFVLENBQUMsS0FBSyxJQUFJQSxVQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUUsQ0FBQztLQUt0QixDQUFDLElBQUksVkFKOUMsU0FBSztBQUkwQyxRQUFRLENBQUMsQ0FBQyxWQUh6RDtJQUcrRCxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMscENBRnBGO0FBQ0E7QUFFSCxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyw1QkFGYixvQkFBWixDQUFDLElBQWtCLEVBQUUsSUFBWTtHQUdwQyxPQUFPLGNBQWMsQ0FBQyx6QkFIcUI7R0FHZCxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVFLEdBQUcsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLG5HQUowQixZQUN4RSxJQUFJLEdBQUcsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztHQUdyQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQ3pELFVBQVUsQ0FBQyxLQUFLLElBQUlBLHBDQUhoQyxZQUFRLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBR2dCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBRSxDQUFDLFVBQzFELHVHQUdPLFdBQVcsQ0FBQyxHQUFXLFlBQzNCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxjQUNmLEtBQUssak1BUmpCLFlBQVEsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVFLEdBQUcsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUN6RCxVQUFVLENBQUMsS0FBSyxJQUFJQSxVQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUUsQ0FBQztJQU14QyxJQUFJLFJBTDNCLFNBQUs7Q0FLMEIsSUFBSSxMQUpuQztBQUlvQyxBQUgvQjtBQUd1QyxFQUFFLGtCQUM5QixHQUFHLEdBQUcsR0FBRyxDQUFDLDlCQUpiO0VBSW1CLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxsQkFIdkM7QUFHMkMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxsQkFIdkM7QUFHd0MsQUFGNUQ7TUFHRSxVQUNKLGhCQUpVLElBRFAsV0FBVyxDQUFDLEdBQVc7RUFNM0IsT0FBTyxHQUFHLENBQUMsYkFMbkIsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDM0IsWUFBWSxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDOUMsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkUsYUFBYTtBQUNiLFNBQVM7WUFLRyxPQUFPLG5CQUpuQixRQUFRLE9BQU8sR0FBRyxDQUFDO0FBQ25CO0tBRytCLENBQUMsTkFGaEM7R0FFNkMsRUFBRSxLQUFhLEVBQUUsS0FBYSxZQUNuRSxJQUFJLEtBQUssRUFBRSx4Q0FGWjtBQUNKO0tBRVMsSUFBSSxHQUFHLEdBQVcsS0FBSyxDQUFDLHJCQUZUO0lBRWdCLENBQUMsS0FBSyxDQUFDLENBQUMsWkFGQTtBQUF3QjtBQUNwRTtHQUVLLElBQUksVUFBVSxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQywzQ0FGN0MsSUFESCxPQUFPLFlBQVksQ0FBQyxLQUFhLEVBQUUsS0FBYSxFQUFFLEtBQWE7QUFHWCxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLG5CQUhKLFFBQ3ZFLElBQUksS0FBSyxFQUFFO0NBRW1FLEVBQUUsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLDNCQURoSDtBQUNrSCxHQUFHLENBQUMsQ0FBQyxhQUUzRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxqQ0FIRSxZQUFqQixJQUFJLEdBQUcsR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25EO1dBR2dCLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDLGlCQUNsRCxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLDlHQUpuQixZQUFqQixJQUFJLFVBQVUsR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUlyRSxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLHJCQUh2RSxZQUNZLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFO01BR2Qsa0JBQU0seEJBRm5CO1NBR2dCLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLHpEQUgvQixnQkFBakIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFJckQsVUFDSixjQUFNLGNBQ0gsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLHRFQUx4QyxnQkFBZ0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7R0FLMUIsQ0FBQyxKQUo5QyxhQUFhO0FBS0osU0FDRCxPQUFPLGhCQU5ELGlCQUFLO0VBTUMsQ0FBQyxRQUVwQixYQVBELGdCQUFnQixLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUNoRSxhQUFhO0FBQ2IsU0FBUztBQUFDLGFBQUs7aUJDcktmLGpCRHNLQSxZQUFZLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7SUM3SjlDLEpEOEpBLFNBQVM7QUFDVCxRQUFRLE9BQU8sS0FBSyxDQUFDO0FBQ3JCO0FBQ0EsQ0FBQztBQUNEO0FBQUM7QUFBSTtBQUFrQztBQUFrRTtFQzFJckcsRkFqQ0o7S0FpQ1csWUFBWSxDQUFDLE1BQWtCLHhCQWpDdEM7QUFpQ3dDLEFBakNkO0dBaUNrQyxZQUN4RCxJQUFJLG5CQXpCWjtHQXlCbUIsRUFBRSxMQXpCRTtXQTJCWCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsL0JBekJoQztnQkEwQmdCLEtBQUssckJBekJYO0VBeUJpQixLQUFLLElBQUksT0FBTyxDQUFDLE1BQU0sekJBekJmO0FBeUJpQixBQXhCbEQ7R0F5QmtCLEhBeEJwQjtDQXdCMEIsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyx6Q0F4QjFELElBbUJKLE9BQU8sWUFBWSxDQUFDLE1BQWtCLEVBQUUsT0FBb0I7TUFLVSxFQUFFLENBQUMsQ0FBQyxWQUxWLFFBQzVELElBQUksT0FBTyxFQUFFO0tBS0osY0FDSixhQUVELGhDQVBaLFlBQ1ksSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0VBTWhCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQ2QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxsREFOaEMsZ0JBQWdCLEtBQUssTUFBTSxLQUFLLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtFQU1kLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxjQUMzRCxhQUVELElBQUksT0FBTyxDQUFDLDNFQVJ4QixvQkFBb0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFRbEQsRUFBRSxGQVA5QixpQkFBaUI7RUFRRCxLQUFLLE1BQU0sYkFQM0IsYUFBYTtBQU9lLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxsQkFOOUMsWUFDWSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7NkNBTVYsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDLGpFQUx4QyxnQkFBZ0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzthQU1wRCxiQUxwQixhQUFhO1NBS2lCLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxVQUFVLC9CQUpwRCxZQUNZLElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtBQUd1QixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyw1QkFGakYsZ0JBQWdCLEtBQUssTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtDQUcxQixVQUFVLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsbkNBRnREO0lBRTRELENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUMsdkNBRjFELG9CQUFqQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7bUJBR3BCLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxrQkFDOUMsaEZBSGpCLG9CQUFvQixVQUFVLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUM7WUFJcEUsVUFFSixTQUNELE9BQU8sTUFBTSxDQUFDLE1BQ2pCLG5EQVBMLG9CQUFvQixVQUFVLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDO3dEQVUzRixPQUFPLC9EQVRYLG9CQUFvQixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7ZUFTcEMsQ0FBQyxoQkFSNUIsaUJBQWlCO01BUTZCLE5BUDlDLGFBQWE7QUFDYixTQUNTO21CQU1ELG5CQUxSLFFBQVEsT0FBTyxNQUFNLENBQUM7RUFLUixGQUpkLEtBQUs7RUFJZSxHQUFRLEVBQUUsUEFIOUI7QUFHK0IsU0FDdkIsS0FBSyxNQUFNLEdBQUcsSUFBSSwzQkFIbkI7Q0FHMkIsRUFBRSxjQUN4QixJQUFJLENBQUMsdEJBSGQ7WUFHK0IsQ0FBQyxiQUhMO0VBR2EsQ0FBQyxHQUFHLENBQUMsUEFIQztBQUdBLEVBQUUsa0JBQ25DLElBQUksY0FBYyxDQUFDLHZDQUpzQixJQUFyRCxPQUFPLGdCQUFnQixDQUFDLFFBQWtCO1FBSUYsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsdkJBSlQ7b0JBSzdCLElBQUksQ0FBQyxDQUFDLDFCQUpWLFFBQVQsTUFBTSxNQUFNLEdBQVEsRUFBRSxDQUFDO1FBSWEsS0FBSyxTQUFTLElBQUksVUFBVSxDQUFDLHJDQUh6RSxRQUFRLEtBQUssTUFBTSxHQUFHLElBQUksUUFBUSxFQUFFO0NBR3VDLHNCQUN2RCxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsbERBSC9DLFlBQVksSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO3VCQUkzQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsM0RBSDVELGdCQUFnQixJQUFJLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBR0UsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxrQkFDN0Qsc0JBQU0sSUFBSSxLQUFLLENBQUMsbkVBSGpDLHFCQUFxQixJQUFJLENBQUMsQ0FBQyxTQUFpQixLQUFLLFNBQVMsSUFBSSxVQUFVLENBQUMsRUFBRTtLQUduQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLHRCQUZ6RCxvQkFBb0IsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO2dDQUczQixJQUFJLEtBQUssR0FBVSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsMURBRnJELHdCQUF3QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRzFELElBQUksS0FBSyxFQUFFLFhBRi9CLGlCQUFpQjttQkFHTyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQyw3Q0FIaEMscUJBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2FBSWpDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLG5DQUg5QztpQ0FJNEIsSUFBSSxyQ0FKSyxvQkFBakIsSUFBSSxLQUFLLEdBQVUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBSVYsQ0FBQyxPQUFPLENBQUMsRUFBRSxaQUh0RCxvQkFBb0IsSUFBSSxLQUFLLEVBQUU7YUFJQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLHZDQUgxRCx3QkFBd0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7a0JBSXJCLGtDQUNJLHBEQUpqQyx3QkFBd0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU87aUNBS2QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdkRBSnRELDRCQUE0QixJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtlQUlnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsOEJBQ3BELHhEQUo3QixnQ0FBZ0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt1QkFLakMsQ0FBQyxDQUFDLHpCQUozQiw2QkFBNkI7aUJBS1IsakJBSnJCLGlDQUFpQztBQUtoQixzQkFBTSxzQkFDSCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLHhFQUxoRCxnQ0FBZ0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQU1oRSxjQUNKLHRCQU5iLDZCQUE2QjtFQU9wQixTQUNELFhBUFIseUJBQXlCLENBQUMsQ0FBQztRQU9aLE1BQWdCLEVBQUMsaEJBTmhDLHFCQUFxQjtBQU9oQixBQU5MLGlCQUFpQjtBQUFDLHFCQUFLO0FBQ3ZCLG9CQUFvQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hELGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUztNQUtMLE9BQU8saUJBQWlCLENBQXFCLFNBQWlCLHhDQUpsRSxRQUFRLHlCQUFPLE1BQWdCLEVBQUM7QUFDaEMsS0FBSztBQUNMO3FCQUdRLElBQUksYUFBYSxHQUFxQixJQUFJLDdDQUYzQztPQUV3RCxFQUFLLENBQUMsVkFEakU7QUFFSSxhQUFhLENBQUMsU0FBUyxHQUFHLDFCQUZYO09BRW9CLENBQUMsU0FDcEMsakJBSDJDO0tBR3BDLExBSHVEO1VBRzFDLENBQUMsTUFDeEIsakJBSnlFLElBQTFFLE9BQU8saUJBQWlCLENBQXFCLFNBQWlCO0FBQUk7MkNBT2xFLDNDQU5HLFFBQUMsSUFBSSxhQUFhLEdBQXFCLElBQUksYUFBYSxFQUFLLENBQUM7Q0FNMUQsWUFBWSxDQUFDLEdBQVEsakJBTGhDLFFBQVEsYUFBYSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7U0FNcEMsSUFBSSxhQUFhLEdBQUcsN0JBTDVCLFFBQVEsT0FBTyxhQUFhLENBQUM7QUFDN0IsS0FBSztBQUNMO0dBRzhDLENBQUMsSkFGeEM7T0FHQyxJQUFJLE9BQU8sR0FBRyxyQkFGbEI7QUFFbUIsYUFBYSxFQUFFLGZBRlo7QUFFZ0IsQ0FBQyxHQUFHLENBQUMsTEFEOUM7UUFDeUQsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFNBQy9ELDlCQUZDLElBREwsT0FBTyxZQUFZLENBQUMsR0FBUTtNQUdqQixDQUFDLE9BQU8sSUFBSSxsQkFIUztBQUdGLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQzVELHJDQUhZLFFBQVQsSUFBSSxhQUFhLEdBQUcsa0JBQWtCLENBQUM7QUFDL0M7QUFBeUIsUUFBakIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztjQU1uRSxPQUFPLFNBQVMsQ0FBQyxRQUFhLHZDQUxsQyxRQUFRLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNqRSxLQUFLO0lBS0csSkFKUjtBQUlZLFVBQVUsR0FBRyxFQUFFLENBQUMsa0NBQ3BCLElBQUksdERBSFY7RUFHYSxHQUFHLE1BQU0sQ0FBQyxjQUFjLDFCQUhrQjtBQUdqQixRQUFRLENBQUMsQ0FBQyxWQUZ4QjtBQUFtQjtpQkFHckMsSUFBSSxTQUFTLENBQVMsL0JBRnpCLElBREQsT0FBTyxTQUFTLENBQUMsUUFBYTtPQUsxQixPQUFPLENBQUMsU0FBUyx4QkFMYTtFQUtWLGNBQWMsQ0FBQyxqQkFKNUIsUUFBUCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFJMkIsQ0FBQyxHQUFHLENBQUMsTUFBTSxRQUFRLEVBQUUsckJBSDVFO1VBSVksVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUMzQixsREFMYSxRQUFqQixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBS25DLEdBQUcsTUFBTSxDQUFDLFpBSnpCO0NBSXVDLENBQUMsR0FBRyxDQUFDLENBQUMsVUFDcEMsakJBTGdCLFFBQWpCLElBQUksU0FBUyxDQUFTO0dBT3RCLE9BQU8sVUFBVSxDQUFDLE1BQ3JCLDNCQVBMLFFBQ1EsT0FBTyxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLFFBQVEsRUFBRTtBQUM1RSxZQUFZLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsWUFBWSxHQUFHLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QyxTQUFTO0FBQ1QsUUFDUSxPQUFPLFVBQVUsQ0FBQztBQUMxQixLQUFLO0FBQ0w7d0NBRUksT0FBTywvQ0FESjtRQUNpQyxDQUFxQixJQUFrQixFQUFFLGZBQTdFO0dBQXlGLEVBQ2hDLE1BQXdCLEVBQUUsT0FBd0IscEJBRHhGO1NBRWYsS0FBSyxNQUFNLHBCQUYyQjtXQUVWLElBQUksTUFBTSxDQUFDLHRCQUZ5QjtDQUVyQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUywxQkFEMUU7QUFDMkUsQ0FBQyxFQUFFLEhBRG5EO0FBQW1CO21CQUVwQyxJQUFJLFFBQVEsR0FBUSxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLDVEQUZGLElBRHBELE9BQU8sNkJBQTZCLENBQXFCLElBQWtCLEVBQUUsT0FBWSxFQUNoQyxNQUF3QixFQUFFLE9BQXdCOzJCQUduRyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxyRUFINkQsUUFDM0csS0FBSyxNQUFNLGlCQUFpQixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFO0FBR3BFLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLHhCQUZwQzs4Q0FHZ0IsSUFBSSxsREFIUyxZQUFqQixJQUFJLFFBQVEsR0FBUSxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRzlCLEdBQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQyxsQkFGN0M7TUFHZ0IsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLDlDQUgzQixZQUFqQixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUdtQixFQUFFLFFBQVEsQ0FBQyxDQUFDLGlCQUVyRSxyQ0FKaEIsWUFBWSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtHQUloQixDQUFDLG1CQUFtQixDQUFDLFFBQVEsaENBSGpEO0NBR21ELElBQUksQ0FBQyxDQUFDLGlCQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLHBDQUpLLGdCQUFqQixJQUFJLFFBQVEsR0FBTSxJQUFJLElBQUksRUFBRSxDQUFDO0NBSVQsQ0FBQyxDQUFDLGNBQ3pCLFVBQ0osU0FFRCxNQUFNLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLGxGQVB0RCxnQkFBZ0IsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBTzNCLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FDakYsTUFBTSxDQUFDLFVBQVUsekRBUHpCLGdCQUNnQixJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0VBTTdCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyw5QkFMeEQsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FLNEIsR0FBRyxDQUFDLENBQUMsTkFKdkUsYUFBYTtDQUtMLE1BQU0sQ0FBQyxSQUpmLFNBQVM7UUFJZ0IsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUMzRCxNQUFNLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLHpGQUp0QyxRQUNRLE1BQU0sQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0VBR2hELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxTQUV4RCxNQUFNLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksdEVBSjVDLFFBQVEsTUFBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztLQUlwQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxTQUMvRixsRUFKUixRQUFRLE1BQU0sQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFJckQsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsaEVBSDFFLFFBQVEsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztLQUdnQixDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLFNBQy9GLE1BQU0sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsdkdBSDFFLFFBQ1EsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7S0FFdkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxTQUMvRixNQUFNLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsakdBRnBFLFFBQVEsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFFNUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsU0FDbEcsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLGxHQUZsRSxRQUFRLE1BQU0sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElB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QW1CO0FBQVEsSUFBeEIsT0FBTyxPQUFPO0FBQUssUUFDZixPQUFPO0FBQ2YsWUFBWSxRQUFRLEVBQUUsZ0JBQWdCO0FBQ3RDLFlBQVksU0FBUyxFQUFFO0FBQ3ZCLGdCQUFnQixlQUFlO0FBQy9CLGdCQUFnQixVQUFVO0FBQzFCLGdCQUFnQjtBQUNoQixvQkFBb0IsT0FBTyxFQUFFLGVBQWU7QUFDNUMsb0JBQW9CLFFBQVEsRUFBRSxlQUFlO0FBQzdDLG9CQUFvQixJQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUM7QUFDM0MsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTLENBQUM7QUFDVixLQUFLO0FBQ0w7NENBNUJDLFFBQVEsU0FBQztFQUNOLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDLGtCQUMzQixZQUFZLEVBQUUsRUFBRSxrQkFDaEIsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsa0JBQzNCLFNBQVMsRUFBRTtPQUNQLGVBQWU7bUJBQ2Y7U0FBVTtxQkFDVjtTQUNJLE9BQU8sRUFBRSxlQUFlO29CQUN4QixRQUFRLEVBQUU7U0FBZTt5QkFDekIsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDO1dBQzFCLGtCQUFDLGNBQ1Q7Ozs7Ozs7Ozs7Ozs7Ozs7OzBCQUNLO0FBQUM7QUFBQztBQUFJO0FBQ0U7QUFFSztBQUFJO0FBQUM7QUFBSTtBQUNOO0FBR3BCO0FBQUk7QUFBQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQge3Rocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHtjYXRjaEVycm9yLCBtYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHtTb3J0fSBmcm9tICcuL3NvcnQnO1xyXG5pbXBvcnQge0FycmF5SW50ZXJmYWNlfSBmcm9tICcuL2FycmF5LWludGVyZmFjZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMvaW50ZXJuYWwvT2JzZXJ2YWJsZSc7XHJcblxyXG4vKiogUkVTVCBhcnJheSBvZiByZXNvdXJjZSBpbXBsZW1lbnRhdGlvbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VBcnJheTxUIGV4dGVuZHMgUmVzb3VyY2U+IGltcGxlbWVudHMgQXJyYXlJbnRlcmZhY2U8VD4ge1xyXG4gICAgLyoqIHNvcnRpbmcgaW5mbyAqL1xyXG4gICAgcHVibGljIHNvcnRJbmZvOiBTb3J0W107XHJcbiAgICAvKiogcHJveHkgdXJsICovXHJcbiAgICBwdWJsaWMgcHJveHlVcmw6IHN0cmluZztcclxuICAgIC8qKiByb290IHVybCAqL1xyXG4gICAgcHVibGljIHJvb3RVcmw6IHN0cmluZztcclxuXHJcbiAgICAvKiogc2VsZiB1cmwgKi9cclxuICAgIHB1YmxpYyBzZWxmX3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIG5leHQgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgbmV4dF91cmk6IHN0cmluZztcclxuICAgIC8qKiBwcmV2aW91cyByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBwcmV2X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIGZpcnN0IHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIGZpcnN0X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIGxhc3QgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgbGFzdF91cmk6IHN0cmluZztcclxuXHJcbiAgICAvKiogZW1iZWRkZWQgYXJyYXkgbGlzdCAqL1xyXG4gICAgcHVibGljIF9lbWJlZGRlZDtcclxuXHJcbiAgICAvKiogdG90YWwgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgYXJyYXkgKi9cclxuICAgIHB1YmxpYyB0b3RhbEVsZW1lbnRzID0gMDtcclxuICAgIC8qKiB0b3RhbCBudW1iZXIgb2YgcGFnZXMgaW4gdGhlIHJlc3BvbnNlICovXHJcbiAgICBwdWJsaWMgdG90YWxQYWdlcyA9IDE7XHJcbiAgICBcclxuICAgIC8qKiBwYWdlIG51bWJlciBpbiB0aGUgcmVzcG9uc2UgKi9cclxuICAgIHB1YmxpYyBwYWdlTnVtYmVyID0gMTtcclxuICAgIFxyXG4gICAgLyoqIHBhZ2Ugc2l6ZSAqL1xyXG4gICAgcHVibGljIHBhZ2VTaXplOiBudW1iZXI7XHJcblxyXG4gICAgLyoqIGFycmF5IGNvbXBvbmVudHMgKi9cclxuICAgIHB1YmxpYyByZXN1bHQ6IFRbXSA9IFtdO1xyXG5cclxuICAgIC8qKiBwdXNoIGEgbmV3IHJlc291cmNlIHRvIHRoZSBhcnJheSAqL1xyXG4gICAgcHVzaCA9IChlbDogVCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVzdWx0LnB1c2goZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogbGVuZ3RoIG9mIHRoZSBhcnJheSAqL1xyXG4gICAgbGVuZ3RoID0gKCk6IG51bWJlciA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0Lmxlbmd0aDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIGxvYWQgYXJyYXkgZGF0YSBmcm9tIFJFU1QgcmVxdWVzdCAqL1xyXG4gICAgcHJpdmF0ZSBpbml0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzcG9uc2U6IGFueSwgc29ydEluZm86IFNvcnRbXSk6IFJlc291cmNlQXJyYXk8VD4gPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KHRoaXMuX2VtYmVkZGVkKTtcclxuICAgICAgICByZXN1bHQuc29ydEluZm8gPSBzb3J0SW5mbztcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBuZXh0IHBhZ2UgKi9cclxuICAgIG5leHQgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubmV4dF91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5uZXh0X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIG5leHQgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBwcmV2aW91cyBwYWdlICovXHJcbiAgICBwcmV2ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXZfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMucHJldl91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBwcmV2IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgZmlyc3QgcGFnZSAqL1xyXG4gICAgZmlyc3QgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuZmlyc3RfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gZmlyc3QgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBsYXN0IHBhZ2UgKi9cclxuICAgIGxhc3QgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdF91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5sYXN0X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIGxhc3QgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBwYWdlIHdpdGggZ2l2ZW4gcGFnZU51bWJlciovXHJcbiAgICBwYWdlID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgcGFnZU51bWJlcjogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgnez9wYWdlLHNpemUsc29ydH0nLCAnJyk7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgneyZzb3J0fScsICcnKTtcclxuICAgICAgICBsZXQgdXJsUGFyc2VkID0gdXJsLnBhcnNlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpKTtcclxuICAgICAgICBsZXQgcXVlcnk6IHN0cmluZyA9IFJlc291cmNlQXJyYXkucmVwbGFjZU9yQWRkKHVybFBhcnNlZC5xdWVyeSwgJ3NpemUnLCB0aGlzLnBhZ2VTaXplLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHF1ZXJ5ID0gUmVzb3VyY2VBcnJheS5yZXBsYWNlT3JBZGQocXVlcnksICdwYWdlJywgcGFnZU51bWJlci50b1N0cmluZygpKTtcclxuXHJcblxyXG4gICAgICAgIGxldCB1cmkgPSB1cmxQYXJzZWQucXVlcnkgP1xyXG4gICAgICAgICAgICBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5yZXBsYWNlKHVybFBhcnNlZC5xdWVyeSwgcXVlcnkpIDogUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkuY29uY2F0KHF1ZXJ5KTtcclxuICAgICAgICB1cmkgPSB0aGlzLmFkZFNvcnRJbmZvKHVyaSk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBTb3J0IGNvbGxlY3Rpb24gYmFzZWQgb24gZ2l2ZW4gc29ydCBhdHRyaWJ1dGUgKi9cclxuICAgIHNvcnRFbGVtZW50cyA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIC4uLnNvcnQ6IFNvcnRbXSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3s/cGFnZSxzaXplLHNvcnR9JywgJycpO1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3smc29ydH0nLCAnJyk7XHJcbiAgICAgICAgbGV0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLmNvbmNhdCgnPycsICdzaXplPScsIHRoaXMucGFnZVNpemUudG9TdHJpbmcoKSwgJyZwYWdlPScsIHRoaXMucGFnZU51bWJlci50b1N0cmluZygpKTtcclxuICAgICAgICB1cmkgPSB0aGlzLmFkZFNvcnRJbmZvKHVyaSk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHNvcnQpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIHBhZ2Ugd2l0aCBnaXZlbiBzaXplICovXHJcbiAgICBzaXplID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgc2l6ZTogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgbGV0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLmNvbmNhdCgnPycsICdzaXplPScsIHNpemUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdXJpID0gdGhpcy5hZGRTb3J0SW5mbyh1cmkpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogQWRkIHNvcnQgaW5mbyB0byBnaXZlbiBVUkkgKi9cclxuICAgIHByaXZhdGUgYWRkU29ydEluZm8odXJpOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5zb3J0SW5mbykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5zb3J0SW5mbykge1xyXG4gICAgICAgICAgICAgICAgdXJpID0gdXJpLmNvbmNhdCgnJnNvcnQ9JywgaXRlbS5wYXRoLCAnLCcsIGl0ZW0ub3JkZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEFkZCByZXBsYWNlIG9yIGFkZCBwYXJhbSB2YWx1ZSB0byBxdWVyeSBzdHJpbmcgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlcGxhY2VPckFkZChxdWVyeTogc3RyaW5nLCBmaWVsZDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAocXVlcnkpIHtcclxuICAgICAgICAgICAgbGV0IGlkeDogbnVtYmVyID0gcXVlcnkuaW5kZXhPZihmaWVsZCk7XHJcbiAgICAgICAgICAgIGxldCBpZHhOZXh0QW1wOiBudW1iZXIgPSBxdWVyeS5pbmRleE9mKCcmJywgaWR4KSA9PSAtMSA/IHF1ZXJ5LmluZGV4T2YoJy8nLCBpZHgpIDogcXVlcnkuaW5kZXhPZignJicsIGlkeCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VhY2hWYWx1ZSA9IHF1ZXJ5LnN1YnN0cmluZyhpZHgsIGlkeE5leHRBbXApO1xyXG4gICAgICAgICAgICAgICAgcXVlcnkgPSBxdWVyeS5yZXBsYWNlKHNlYWNoVmFsdWUsIGZpZWxkICsgJz0nICsgdmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcXVlcnkgPSBxdWVyeS5jb25jYXQoXCImXCIgKyBmaWVsZCArICc9JyArIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5ID0gXCI/XCIgKyBmaWVsZCArICc9JyArIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcXVlcnk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwSGVhZGVycywgSHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuaW1wb3J0IHtIYWxPcHRpb25zfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZCwgaXNQcmltaXRpdmV9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcclxuXHJcbi8qKiBSRVNUIEFQSSBhY2Nlc3MgaGVscGVyICovXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUhlbHBlciB7XHJcblxyXG4gICAgLyoqIEh0dHBIZWFkZXJzICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGhlYWRlcnM6IEh0dHBIZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcbiAgICAvKiogUHJveHkgVVJMICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBwcm94eV91cmk6IHN0cmluZyA9IG51bGw7XHJcbiAgICAvKiogUm9vdCBVUkwgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJvb3RfdXJpOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgLyoqIEh0dHBDbGllbnQgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGh0dHA6IEh0dHBDbGllbnQgPSBudWxsO1xyXG5cclxuICAgIC8qKiBnZXQgcmVxdWVzdCBoZWFkZXJzICovXHJcbiAgICAvKnB1YmxpYyBzdGF0aWMgZ2V0IGhlYWRlcnMoKTogSHR0cEhlYWRlcnMge1xyXG4gICAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZCh0aGlzLl9oZWFkZXJzKSlcclxuICAgICAgICAgIFJlc291cmNlSGVscGVyLl9oZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLl9oZWFkZXJzO1xyXG4gICAgfSovXHJcblxyXG4gICAgLyoqIHNldCByZXF1ZXN0IGhlYWRlcnMgKi9cclxuICAgIC8qcHVibGljIHN0YXRpYyBzZXQgaGVhZGVycyhoZWFkZXJzOiBIdHRwSGVhZGVycykge1xyXG4gICAgICBSZXNvdXJjZUhlbHBlci5faGVhZGVycyA9IGhlYWRlcnM7XHJcbiAgICB9Ki9cclxuXHJcbiAgICAvKiogZ2V0IHJlcXVlc3Qgb3B0aW9uIHBhcmFtcyAqL1xyXG4gICAgc3RhdGljIG9wdGlvblBhcmFtcyhwYXJhbXM6IEh0dHBQYXJhbXMsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogSHR0cFBhcmFtcyB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwYXJhbSBvZiBvcHRpb25zLnBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQocGFyYW0ua2V5LCBwYXJhbS52YWx1ZS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnc2l6ZScsIG9wdGlvbnMuc2l6ZS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc29ydCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBzIG9mIG9wdGlvbnMuc29ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzb3J0U3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydFN0cmluZyA9IHMucGF0aCA/IHNvcnRTdHJpbmcuY29uY2F0KHMucGF0aCkgOiBzb3J0U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRTdHJpbmcgPSBzLm9yZGVyID8gc29ydFN0cmluZy5jb25jYXQoJywnKS5jb25jYXQocy5vcmRlcikgOiBzb3J0U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3NvcnQnLCBzb3J0U3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhcmFtcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogcmVzb2x2ZSByZXNvdXJjZSByZWxhdGlvbnMgKi9cclxuICAgIHN0YXRpYyByZXNvbHZlUmVsYXRpb25zKHJlc291cmNlOiBSZXNvdXJjZSk6IE9iamVjdCB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBhbnkgPSB7fTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiByZXNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoUmVzb3VyY2VIZWxwZXIuY2xhc3NOYW1lKHJlc291cmNlW2tleV0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoKGNsYXNzTmFtZTogc3RyaW5nKSA9PiBjbGFzc05hbWUgPT0gJ1Jlc291cmNlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2Vba2V5XVsnX2xpbmtzJ10pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gcmVzb3VyY2Vba2V5XVsnX2xpbmtzJ11bJ3NlbGYnXVsnaHJlZiddO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJlc291cmNlW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFycmF5OiBhbnlbXSA9IHJlc291cmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZShlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKHRoaXMucmVzb2x2ZVJlbGF0aW9ucyhlbGVtZW50KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSByZXNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQgYXMgT2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjcmVhdGUgYW4gZW1wdHkgcmVzb3VyY2UgZnJvbSBlbWJlZGRlZCBkYXRhKi9cclxuICAgIHN0YXRpYyBjcmVhdGVFbXB0eVJlc3VsdDxUIGV4dGVuZHMgUmVzb3VyY2U+KF9lbWJlZGRlZDogc3RyaW5nKTogUmVzb3VyY2VBcnJheTxUPiB7XHJcbiAgICAgICAgbGV0IHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4gPSBuZXcgUmVzb3VyY2VBcnJheTxUPigpO1xyXG4gICAgICAgIHJlc291cmNlQXJyYXkuX2VtYmVkZGVkID0gX2VtYmVkZGVkO1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgY2xhc3MgbmFtZSovXHJcbiAgICBzdGF0aWMgZ2V0Q2xhc3NOYW1lKG9iajogYW55KTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLis/KVxcKC87XHJcbiAgICAgICAgdmFyIHJlc3VsdHMgPSAoZnVuY05hbWVSZWdleCkuZXhlYyhvYmouY29uc3RydWN0b3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgcmV0dXJuIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMSkgPyByZXN1bHRzWzFdIDogJyc7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGNsYXNzIG5hbWUgZnJvbSBhIHByb3RvdHlwZSBvYmplY3QqL1xyXG4gICAgc3RhdGljIGNsYXNzTmFtZShvYmpQcm90bzogYW55KTogc3RyaW5nW10ge1xyXG4gICAgICAgIGxldCBjbGFzc05hbWVzID0gW107XHJcbiAgICAgICAgbGV0IG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmpQcm90byk7XHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZTogc3RyaW5nO1xyXG5cclxuICAgICAgICB3aGlsZSAoKGNsYXNzTmFtZSA9IFJlc291cmNlSGVscGVyLmdldENsYXNzTmFtZShvYmopKSAhPT0gJ09iamVjdCcpIHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lcy5wdXNoKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNsYXNzTmFtZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGluc3RhbnRpYXRlIGEgUmVzb3VyY2VDb2xsZWN0aW9uIGZyb20gcmVzcG9uc2UgZW1iZWRkZWQgZGF0YSovXHJcbiAgICBzdGF0aWMgaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb248VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHBheWxvYWQ6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiwgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogUmVzb3VyY2VBcnJheTxUPiB7XHJcbiAgICAgICAgZm9yIChjb25zdCBlbWJlZGRlZENsYXNzTmFtZSBvZiBPYmplY3Qua2V5cyhwYXlsb2FkW3Jlc3VsdC5fZW1iZWRkZWRdKSkge1xyXG4gICAgICAgICAgICBsZXQgZW1iZWRkZWQ6IGFueSA9IHBheWxvYWRbcmVzdWx0Ll9lbWJlZGRlZF07XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gZW1iZWRkZWRbZW1iZWRkZWRDbGFzc05hbWVdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5zdGFuY2U6IFQgPSBuZXcgdHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UgPSB0aGlzLnNlYXJjaFN1YnR5cGVzKGJ1aWxkZXIsIGVtYmVkZGVkQ2xhc3NOYW1lLCBpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnN0YW50aWF0ZVJlc291cmNlKGluc3RhbmNlLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdWx0LnRvdGFsRWxlbWVudHMgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2UudG90YWxFbGVtZW50cyA6IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgcmVzdWx0LnRvdGFsUGFnZXMgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2UudG90YWxQYWdlcyA6IDE7XHJcbiAgICAgICAgcmVzdWx0LnBhZ2VOdW1iZXIgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2UubnVtYmVyIDogMTtcclxuICAgICAgICByZXN1bHQucGFnZVNpemUgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2Uuc2l6ZSA6IDIwO1xyXG5cclxuICAgICAgICByZXN1bHQuc2VsZl91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5zZWxmID8gcGF5bG9hZC5fbGlua3Muc2VsZi5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5uZXh0X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLm5leHQgPyBwYXlsb2FkLl9saW5rcy5uZXh0LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVzdWx0LnByZXZfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3MucHJldiA/IHBheWxvYWQuX2xpbmtzLnByZXYuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQuZmlyc3RfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3MuZmlyc3QgPyBwYXlsb2FkLl9saW5rcy5maXJzdC5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5sYXN0X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLmxhc3QgPyBwYXlsb2FkLl9saW5rcy5sYXN0LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHN1YnR5cGVzKi9cclxuICAgIHN0YXRpYyBzZWFyY2hTdWJ0eXBlczxUIGV4dGVuZHMgUmVzb3VyY2U+KGJ1aWxkZXI6IFN1YlR5cGVCdWlsZGVyLCBlbWJlZGRlZENsYXNzTmFtZTogc3RyaW5nLCBpbnN0YW5jZTogVCkge1xyXG4gICAgICAgIGlmIChidWlsZGVyICYmIGJ1aWxkZXIuc3VidHlwZXMpIHtcclxuICAgICAgICAgICAgbGV0IGtleXMgPSBidWlsZGVyLnN1YnR5cGVzLmtleXMoKTtcclxuICAgICAgICAgICAgQXJyYXkuZnJvbShrZXlzKS5mb3JFYWNoKChzdWJ0eXBlS2V5OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbWJlZGRlZENsYXNzTmFtZS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoc3VidHlwZUtleS50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdWJ0eXBlOiB7IG5ldygpOiBhbnkgfSA9IGJ1aWxkZXIuc3VidHlwZXMuZ2V0KHN1YnR5cGVLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0gbmV3IHN1YnR5cGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogaW5zdGFudGlhdGUgYSBSZXNvdXJjZSBmcm9tIHJlc3BvbnNlICovXHJcbiAgICBzdGF0aWMgaW5zdGFudGlhdGVSZXNvdXJjZTxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCwgcGF5bG9hZDogT2JqZWN0KTogVCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBwIGluIHBheWxvYWQpIHtcclxuICAgICAgICAgICAgLy9UT0RPIGFycmF5IGluaXRcclxuICAgICAgICAgICAgLyogaWYoZW50aXR5W3BdLmNvbnN0cnVjdG9yID09PSBBcnJheSAmJiBpc051bGxPclVuZGVmaW5lZChwYXlsb2FkW3BdKSlcclxuICAgICAgICAgICAgICAgICBlbnRpdHlbcF0gPSBbXTtcclxuICAgICAgICAgICAgIGVsc2UqL1xyXG4gICAgICAgICAgICBlbnRpdHlbcF0gPSBwYXlsb2FkW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgcHJveHkgVVJMICovXHJcbiAgICBzdGF0aWMgc2V0UHJveHlVcmkocHJveHlfdXJpOiBzdHJpbmcpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgPSBwcm94eV91cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBSb290IFVSSSAqL1xyXG4gICAgc3RhdGljIHNldFJvb3RVcmkocm9vdF91cmk6IHN0cmluZykge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnJvb3RfdXJpID0gcm9vdF91cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBVUkwgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLnByb3h5X3VyaSAmJiBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgIT0gJycgP1xyXG4gICAgICAgICAgICBSZXNvdXJjZUhlbHBlci5hZGRTbGFzaChSZXNvdXJjZUhlbHBlci5wcm94eV91cmkpIDpcclxuICAgICAgICAgICAgUmVzb3VyY2VIZWxwZXIuYWRkU2xhc2goUmVzb3VyY2VIZWxwZXIucm9vdF91cmkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBhZGQgc2xhc2ggdG8gVVJJICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhZGRTbGFzaCh1cmk6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHVyaVBhcnNlZCA9IHVybC5wYXJzZSh1cmkpO1xyXG4gICAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZCh1cmlQYXJzZWQuc2VhcmNoKSAmJiB1cmkgJiYgdXJpW3VyaS5sZW5ndGggLSAxXSAhPSAnLycpXHJcbiAgICAgICAgICAgIHJldHVybiB1cmkgKyAnLyc7XHJcbiAgICAgICAgcmV0dXJuIHVyaTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHByb3h5IGZyb20gVVJMICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFByb3h5KHVybDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIVJlc291cmNlSGVscGVyLnByb3h5X3VyaSB8fCBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgPT0gJycpXHJcbiAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmFkZFNsYXNoKHVybC5yZXBsYWNlKFJlc291cmNlSGVscGVyLnJvb3RfdXJpLCBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IEh0dHBDbGllbnQqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXRIdHRwKGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5odHRwID0gaHR0cDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEh0dHBDbGllbnQqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRIdHRwKCk6IEh0dHBDbGllbnQge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5odHRwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcm9vdCBVUkkqL1xyXG4gICAgc3RhdGljIGdldFJvb3RVcmkoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLnJvb3RfdXJpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5pbXBvcnQge3Rocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3IsIG9mIGFzIG9ic2VydmFibGVPZn0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuXHJcbmltcG9ydCB7SHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWR9IGZyb20gJ3V0aWwnO1xyXG5cclxuaW1wb3J0IHtIYWxPcHRpb25zfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzL2ludGVybmFsL09ic2VydmFibGUnO1xyXG5cclxuLyoqIEFic3RyYWN0IHJlc291cmNlIGNsYXNzKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVzb3VyY2Uge1xyXG5cclxuICAgIC8qKiBwcm94eSBVUkwgKi9cclxuICAgIHB1YmxpYyBwcm94eVVybDogc3RyaW5nO1xyXG4gICAgLyoqIHJvb3QgVVJMICovXHJcbiAgICBwdWJsaWMgcm9vdFVybDogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBsaW5rcyAqL1xyXG4gICAgcHVibGljIF9saW5rczogYW55O1xyXG4gICAgLyoqIHN1YnR5cGVzICovXHJcbiAgICBwdWJsaWMgX3N1YnR5cGVzOiBNYXA8c3RyaW5nLCBhbnk+O1xyXG5cclxuICAgIFxyXG4gICAgLyoqIGdldCBzdWJ0eXBlcyAqLyAgICBcclxuICAgIHB1YmxpYyBnZXQgc3VidHlwZXMoKTogTWFwPHN0cmluZywgYW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1YnR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgc3VidHlwZXMgKi9cclxuICAgIHB1YmxpYyBzZXQgc3VidHlwZXMoX3N1YnR5cGVzOiBNYXA8c3RyaW5nLCBhbnk+KSB7XHJcbiAgICAgICAgdGhpcy5fc3VidHlwZXMgPSBfc3VidHlwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBHZXQgY29sbGVjdGlvbiBvZiByZWxhdGVkIHJlc291cmNlcyAqL1xyXG4gICAgcHVibGljIGdldFJlbGF0aW9uQXJyYXk8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlbGF0aW9uOiBzdHJpbmcsIF9lbWJlZGRlZD86IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8VFtdPiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihpc051bGxPclVuZGVmaW5lZChfZW1iZWRkZWQpID8gXCJfZW1iZWRkZWRcIiA6IF9lbWJlZGRlZCk7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbjxUPih0eXBlLCByZXNwb25zZSwgcmVzdWx0LCBidWlsZGVyKSksXHJcbiAgICAgICAgICAgICAgICBtYXAoKGFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiBhcnJheS5yZXN1bHQpLCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBHZXQgcmVsYXRlZCByZXNvdXJjZSAqL1xyXG4gICAgcHVibGljIGdldFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZWxhdGlvbjogc3RyaW5nLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVpbGRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZW1iZWRkZWRDbGFzc05hbWUgb2YgT2JqZWN0LmtleXMoZGF0YVsnX2xpbmtzJ10pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWJlZGRlZENsYXNzTmFtZSA9PSAnc2VsZicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBocmVmOiBzdHJpbmcgPSBkYXRhLl9saW5rc1tlbWJlZGRlZENsYXNzTmFtZV0uaHJlZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IGhyZWYubGFzdEluZGV4T2YoJy8nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZWFsQ2xhc3NOYW1lID0gaHJlZi5yZXBsYWNlKFJlc291cmNlSGVscGVyLmdldFJvb3RVcmkoKSwgXCJcIikuc3Vic3RyaW5nKDAsIGlkeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBSZXNvdXJjZUhlbHBlci5zZWFyY2hTdWJ0eXBlcyhidWlsZGVyLCByZWFsQ2xhc3NOYW1lLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihudWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEFkZHMgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoZSBib3VuZCBjb2xsZWN0aW9uIGJ5IHRoZSByZWxhdGlvbiAqL1xyXG4gICAgcHVibGljIGFkZFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2U6IFQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ3RleHQvdXJpLWxpc3QnKTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wb3N0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEJpbmQgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoaXMgcmVzb3VyY2UgYnkgdGhlIGdpdmVuIHJlbGF0aW9uKi9cclxuICAgIHB1YmxpYyB1cGRhdGVSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucGF0Y2goUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCByZXNvdXJjZS5fbGlua3Muc2VsZi5ocmVmLCB7aGVhZGVyczogaGVhZGVyfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQmluZCB0aGUgZ2l2ZW4gcmVzb3VyY2UgdG8gdGhpcyByZXNvdXJjZSBieSB0aGUgZ2l2ZW4gcmVsYXRpb24qL1xyXG4gICAgcHVibGljIHN1YnN0aXR1dGVSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgLyoqIEJpbmQgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoaXMgcmVzb3VyY2UgYnkgdGhlIGdpdmVuIHJlbGF0aW9uKi9cclxuICAgIHB1YmxpYyBzdWJzdGl0dXRlQWxsUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZXM6IFJlc291cmNlW10pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ3RleHQvdXJpLWxpc3QnKTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wdXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCByZXNvdXJjZXMubWFwKChyZXNvdXJjZSkgPT4gcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiksIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgLyoqIFVuYmluZCB0aGUgcmVzb3VyY2Ugd2l0aCB0aGUgZ2l2ZW4gcmVsYXRpb24gZnJvbSB0aGlzIHJlc291cmNlKi9cclxuICAgIHB1YmxpYyBkZWxldGVSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2UuX2xpbmtzKSkge1xyXG4gICAgICAgICAgICBsZXQgbGluazogc3RyaW5nID0gcmVzb3VyY2UuX2xpbmtzWydzZWxmJ10uaHJlZjtcclxuICAgICAgICAgICAgbGV0IGlkeDogbnVtYmVyID0gbGluay5sYXN0SW5kZXhPZignLycpICsgMTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZHggPT0gLTEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmVsYXRpb25JZDogc3RyaW5nID0gbGluay5zdWJzdHJpbmcoaWR4KTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5kZWxldGUoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYgKyAnLycgKyByZWxhdGlvbklkKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogVW5iaW5kIHRoZSByZXNvdXJjZSB3aXRoIHRoZSBnaXZlbiByZWxhdGlvbiBmcm9tIHRoaXMgcmVzb3VyY2UqL1xyXG4gICAgcHVibGljIGRlbGV0ZUFsbFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5kZWxldGUoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYgKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVXNlckNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL3VzZXItY29uZmlndXJhdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IFVzZXJQb3NpdGlvbiB9IGZyb20gJy4vdXNlci1wb3NpdGlvbi5tb2RlbCc7XHJcblxyXG4vKipcclxuICogVXNlciBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVzZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIHVzZXJuYW1lICovXHJcbiAgcHVibGljIHVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHBhc3N3b3JkICovXHJcbiAgcHVibGljIHBhc3N3b3JkOiBzdHJpbmc7XHJcbiAgLyoqIGZpcnN0IG5hbWUgKi9cclxuICBwdWJsaWMgZmlyc3ROYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGxhc3QgbmFtZSAqL1xyXG4gIHB1YmxpYyBsYXN0TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB3aGV0aGVyIHVzZXIgaXMgYmxvY2tlZCAqL1xyXG4gIHB1YmxpYyBibG9ja2VkOiBib29sZWFuO1xyXG4gIC8qKiB3aGV0aGVyIHVzZXIgaXMgYWRtaW5pc3RyYXRvciAqL1xyXG4gIHB1YmxpYyBhZG1pbmlzdHJhdG9yOiBib29sZWFuO1xyXG4gIC8qKiB1c2VyIHBvc2l0aW9ucyAqL1xyXG4gIHB1YmxpYyBwb3NpdGlvbnM6IFVzZXJQb3NpdGlvbltdO1xyXG4gIC8qKiB1c2VyIHBlcm1pc3Npb25zICovXHJcbiAgcHVibGljIHBlcm1pc3Npb25zOiBVc2VyQ29uZmlndXJhdGlvbltdO1xyXG59XHJcbiIsImltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlfSBmcm9tICcuL2V4dGVybmFsLWNvbmZpZ3VyYXRpb24uaGFuZGxlcic7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9ufSBmcm9tICcuL0V4dGVybmFsQ29uZmlndXJhdGlvbic7XHJcblxyXG5cclxuLyoqIEV4dGVybmFsU2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBFeHRlcm5hbFNlcnZpY2Uge1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoQEluamVjdCgnRXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZScpIHByaXZhdGUgZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTogRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZSkge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFByb3h5VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0Um9vdFVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0SHR0cChleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEh0dHAoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSBFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVyICovXHJcbiAgICBwdWJsaWMgdXBkYXRlRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlOiBFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlKSB7XHJcblx0dGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlID0gZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTtcclxuXHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0UHJveHlVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRQcm94eVVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRSb290VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Um9vdFVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRIdHRwKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0SHR0cCgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEV4dGVybmFsQ29uZmlndXJhdGlvbiAqL1xyXG4gICAgcHVibGljIGdldEV4dGVybmFsQ29uZmlndXJhdGlvbigpOiBFeHRlcm5hbENvbmZpZ3VyYXRpb24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0RXh0ZXJuYWxDb25maWd1cmF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBVUkwgKi9cclxuICAgIHB1YmxpYyBnZXRQcm94eVVyaSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IFJvb3QgVVJJICovXHJcbiAgICBwdWJsaWMgZ2V0Um9vdFVyaSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgVVJMICovXHJcbiAgICBwdWJsaWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldFVSTCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgSHR0cENsaWVudCAqL1xyXG4gICAgcHVibGljIGdldEh0dHAoKTogSHR0cENsaWVudCB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHt0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7Y2F0Y2hFcnJvciwgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7SHR0cFBhcmFtcywgSHR0cFJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuaW1wb3J0IHtFeHRlcm5hbFNlcnZpY2V9IGZyb20gJy4vZXh0ZXJuYWwuc2VydmljZSc7XHJcbmltcG9ydCB7SGFsT3B0aW9uc30gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcy9pbnRlcm5hbC9PYnNlcnZhYmxlJztcclxuXHJcbi8qKiBSZXNvdXJjZVNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VTZXJ2aWNlIHtcclxuXHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGV4dGVybmFsU2VydmljZTogRXh0ZXJuYWxTZXJ2aWNlKSB7fVxyXG5cclxuXHJcbiAgICAvKiogZ2V0IFVSTCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldFVSTCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgYWxsIHJlc291cmNlcyBmcm9tIGEgYmFzZSBVUkkgb2YgYSBnaXZlbiB0eXBlICovXHJcbiAgICBwdWJsaWMgZ2V0QWxsPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZTogc3RyaW5nLCBfZW1iZWRkZWQ6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMsIHN1YlR5cGU/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICByZXN1bHQuc29ydEluZm8gPSBvcHRpb25zID8gb3B0aW9ucy5zb3J0IDogdW5kZWZpbmVkO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtc30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQsIHN1YlR5cGUpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGEgYmFzZSBVUkkgYW5kIGEgZ2l2ZW4gaWQgKi9cclxuICAgIHB1YmxpYyBnZXQ8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlOiBzdHJpbmcsIGlkOiBhbnkpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy8nLCBpZCk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKGRhdGEgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGl0cyBzZWxmbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5U2VsZkxpbms8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkocmVzb3VyY2VMaW5rKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChkYXRhID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggcmVzb3VyY2VzIGZyb20gYSBnaXZlbiBiYXNlIHBhdGgsIHF1ZXJ5IGFuZCBvcHRpb25zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCBxdWVyeTogc3RyaW5nLCByZXNvdXJjZTogc3RyaW5nLCBfZW1iZWRkZWQ6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy9zZWFyY2gvJywgcXVlcnkpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXN9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggYSBzaW5nbGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgcXVlcnkgYW5kIG9wdGlvbnMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2hTaW5nbGU8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvc2VhcmNoLycsIHF1ZXJ5KTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXN9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgcmVzcG9uc2UpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgY3VzdG9tIHF1ZXJ5IGFuZCBvcHRpb25zICovXHJcbiAgICBwdWJsaWMgY3VzdG9tUXVlcnk8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UgKyBxdWVyeSk7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtc30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZUxpbms6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChyZXNvdXJjZUxpbmssIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoZGF0YSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgZGF0YSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb25BcnJheTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2VMaW5rOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQocmVzb3VyY2VMaW5rLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQsIGJ1aWxkZXIpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNvdW50IHJlc291cmNlcyBnaXZlbiBhIHBhdGggKi9cclxuICAgIHB1YmxpYyBjb3VudChyZXNvdXJjZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy9zZWFyY2gvY291bnRBbGwnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ2JvZHknfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKChyZXNwb25zZTogUmVzcG9uc2UpID0+IE51bWJlcihyZXNwb25zZS5ib2R5KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjcmVhdGUgcmVzb3VyY2UgZnJvbSBzZWxmIGxpbmsgYW5kIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBjcmVhdGU8VCBleHRlbmRzIFJlc291cmNlPihzZWxmUmVzb3VyY2U6IHN0cmluZywgZW50aXR5OiBUKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0VVJMKCkgKyBzZWxmUmVzb3VyY2U7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UoZW50aXR5KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wb3N0KHVyaSwgcGF5bG9hZCwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZSd9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShlbnRpdHksIHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyB1cGRhdGU8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShlbnRpdHkuX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dCh1cmksIHBheWxvYWQsIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UoZW50aXR5LCByZXNwb25zZS5ib2R5KTtcclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvZHk6IGFueSA9IHJlc3BvbnNlLmJvZHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoYm9keS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogcGF0Y2ggcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBwYXRjaDxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCkge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KGVudGl0eS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gUmVzb3VyY2VIZWxwZXIucmVzb2x2ZVJlbGF0aW9ucyhlbnRpdHkpO1xyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKGVudGl0eSk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucGF0Y2godXJpLCBwYXlsb2FkLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJ30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDw9IDIwNylcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKGVudGl0eSwgcmVzcG9uc2UuYm9keSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA1MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5OiBhbnkgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGJvZHkuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGRlbGV0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGRlbGV0ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCk6IE9ic2VydmFibGU8T2JqZWN0PiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkoZW50aXR5Ll9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc05leHQ8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubmV4dF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzUHJldjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5wcmV2X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNGaXJzdDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5maXJzdF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNMYXN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5Lmxhc3RfdXJpICE9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IG5leHQgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBuZXh0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubmV4dCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgcHJldjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnByZXYodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGZpcnN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuZmlyc3QodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbGFzdDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5Lmxhc3QodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwYWdlIG9mIHJlc3VsdHMgZ2l2ZW4gYSBwYWdlIG51bWJlciovXHJcbiAgICBwdWJsaWMgcGFnZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgaWQ6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnBhZ2UodHlwZSwgaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzb3J0IHJlc291cmNlIGFycmF5IHdpdGggYSBnaXZlbiBzb3J0aW5nIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIHNvcnRFbGVtZW50czxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgLi4uc29ydDogU29ydFtdKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuc29ydEVsZW1lbnRzKHR5cGUsIC4uLnNvcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgc2l6ZSovXHJcbiAgICBwdWJsaWMgc2l6ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgc2l6ZTogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuc2l6ZSh0eXBlLCBzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIFVSTCBmcm9tIGEgZ2l2ZW4gcGF0aCovXHJcbiAgICBwcml2YXRlIGdldFJlc291cmNlVXJsKHJlc291cmNlPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgdXJsID0gUmVzb3VyY2VTZXJ2aWNlLmdldFVSTCgpO1xyXG4gICAgICAgIGlmICghdXJsLmVuZHNXaXRoKCcvJykpIHtcclxuICAgICAgICAgICAgdXJsID0gdXJsLmNvbmNhdCgnLycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVybC5jb25jYXQocmVzb3VyY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgcHJveHkgYW5kIHJvb3QgdXJscyBvZiBnaXZlbiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHJpdmF0ZSBzZXRVcmxzPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+KSB7XHJcbiAgICAgICAgcmVzdWx0LnByb3h5VXJsID0gdGhpcy5leHRlcm5hbFNlcnZpY2UuZ2V0UHJveHlVcmkoKTtcclxuICAgICAgICByZXN1bHQucm9vdFVybCA9IHRoaXMuZXh0ZXJuYWxTZXJ2aWNlLmdldFJvb3RVcmkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHByb3h5IGFuZCByb290IHVybHMgb2YgZ2l2ZW4gcmVzb3VyY2UgKi9cclxuICAgIHByaXZhdGUgc2V0VXJsc1Jlc291cmNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzdWx0OiBUKSB7XHJcbiAgICAgICAgcmVzdWx0LnByb3h5VXJsID0gdGhpcy5leHRlcm5hbFNlcnZpY2UuZ2V0UHJveHlVcmkoKTtcclxuICAgICAgICByZXN1bHQucm9vdFVybCA9IHRoaXMuZXh0ZXJuYWxTZXJ2aWNlLmdldFJvb3RVcmkoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge29mIGFzIG9ic2VydmFibGVPZiwgdGhyb3dFcnJvciBhcyBvYnNlcnZhYmxlVGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7bWFwLCBtZXJnZU1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuaW1wb3J0IHtTb3J0fSBmcm9tICcuL3NvcnQnO1xyXG5pbXBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5pbXBvcnQge2lzTnVsbE9yVW5kZWZpbmVkfSBmcm9tICd1dGlsJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzL2ludGVybmFsL09ic2VydmFibGUnO1xyXG5pbXBvcnQge0luamVjdG9yfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5cclxuLyoqIEhBTCBwYXJhbSBkYXRhIG1vZGVsICovXHJcbmV4cG9ydCB0eXBlIEhhbFBhcmFtID0geyBrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfTtcclxuLyoqIEhBTCBvcHRpb24gZGF0YSBtb2RlbCAqL1xyXG5leHBvcnQgdHlwZSBIYWxPcHRpb25zID0geyBub3RQYWdlZD86IGJvb2xlYW4sIHNpemU/OiBudW1iZXIsIHNvcnQ/OiBTb3J0W10sIHBhcmFtcz86IEhhbFBhcmFtW10gfTtcclxuXHJcbi8qKiBSRVNUIEFQSSBhY2Nlc3MgaW50ZXJmYWNlICovXHJcbmV4cG9ydCBjbGFzcyBSZXN0U2VydmljZTxUIGV4dGVuZHMgUmVzb3VyY2U+IHtcclxuICAgIC8qKiByZXNvdXJjZSB0eXBlICovXHJcbiAgICBwcml2YXRlIHR5cGU6IGFueTtcclxuICAgIC8qKiByZXNvdXJjZSBwYXRoICovXHJcbiAgICBwcml2YXRlIHJlc291cmNlOiBzdHJpbmc7XHJcbiAgICAvKiogcmVzb3VyY2UgYXJyYXkgKi9cclxuICAgIHB1YmxpYyByZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+O1xyXG4gICAgLyoqIHJlc291cmNlIHNlcnZpY2UgKi9cclxuICAgIHByaXZhdGUgcmVzb3VyY2VTZXJ2aWNlOiBSZXNvdXJjZVNlcnZpY2U7XHJcbiAgICAvKiogX2VtYmVkZGVkIGZpZWxkIG5hbWUgKi9cclxuICAgIHByaXZhdGUgX2VtYmVkZGVkOiBzdHJpbmcgPSAnX2VtYmVkZGVkJztcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHR5cGU6IHsgbmV3KCk6IFQgfSxcclxuICAgICAgICAgICAgICAgIHJlc291cmNlOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvcixcclxuICAgICAgICAgICAgICAgIF9lbWJlZGRlZD86IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZSA9IHJlc291cmNlO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VTZXJ2aWNlID0gaW5qZWN0b3IuZ2V0KFJlc291cmNlU2VydmljZSk7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChfZW1iZWRkZWQpKVxyXG4gICAgICAgICAgICB0aGlzLl9lbWJlZGRlZCA9IF9lbWJlZGRlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZXJyb3IgaGFuZGxlciAqL1xyXG4gICAgcHJvdGVjdGVkIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpOk9ic2VydmFibGU8bmV2ZXI+IHtcclxuICAgICAgICByZXR1cm4gUmVzdFNlcnZpY2UuaGFuZGxlRXJyb3IoZXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBlcnJvciBoYW5kbGVyICovXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpOk9ic2VydmFibGU8bmV2ZXI+IHtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgYWxsIHJlc291cmNlcyB3aXRoIG9wdGlvbmFsIG9wdGlvbnMgYW4gc3ViVHlwZSBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBnZXRBbGwob3B0aW9ucz86IEhhbE9wdGlvbnMsIHN1YlR5cGU/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEFsbCh0aGlzLnR5cGUsIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zLCBzdWJUeXBlKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBbGwob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gYSBnaXZlbiBpZCAqL1xyXG4gICAgcHVibGljIGdldChpZDogYW55KTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldCh0aGlzLnR5cGUsIHRoaXMucmVzb3VyY2UsIGlkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gc2VsZiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlTZWxmTGluayhzZWxmTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEJ5U2VsZkxpbmsodGhpcy50eXBlLCBzZWxmTGluayk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2gocXVlcnk6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5zZWFyY2godGhpcy50eXBlLCBxdWVyeSwgdGhpcy5yZXNvdXJjZSwgdGhpcy5fZW1iZWRkZWQsIG9wdGlvbnMpLnBpcGUoXHJcbiAgICAgICAgICAgIG1lcmdlTWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm5vdFBhZ2VkICYmICFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZUFycmF5LmZpcnN0X3VyaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm5vdFBhZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zaXplID0gcmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaChxdWVyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoU2luZ2xlKHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnNlYXJjaFNpbmdsZSh0aGlzLnR5cGUsIHF1ZXJ5LCB0aGlzLnJlc291cmNlLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlcyBmcm9tIGEgZ2l2ZW4gY3VzdG9tIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBjdXN0b21RdWVyeShxdWVyeTogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmN1c3RvbVF1ZXJ5KHRoaXMudHlwZSwgcXVlcnksIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXN0b21RdWVyeShxdWVyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uQXJyYXkocmVsYXRpb246IHN0cmluZywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QnlSZWxhdGlvbkFycmF5KHRoaXMudHlwZSwgcmVsYXRpb24sIHRoaXMuX2VtYmVkZGVkLCBidWlsZGVyKS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb24ocmVsYXRpb246IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRCeVJlbGF0aW9uKHRoaXMudHlwZSwgcmVsYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb3VudCByZXNvdXJjZXMgZ2l2ZW4gYSBwYXRoICovXHJcbiAgICBwdWJsaWMgY291bnQoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY291bnQodGhpcy5yZXNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSByZXNvdXJjZSBmcm9tIHNlbGYgbGluayBhbmQgZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGNyZWF0ZShlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY3JlYXRlKHRoaXMucmVzb3VyY2UsIGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHVwZGF0ZShlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UudXBkYXRlKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHBhdGNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgcGF0Y2goZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnBhdGNoKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGRlbGV0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGRlbGV0ZShlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5kZWxldGUoZW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyBvZiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHVibGljIHRvdGFsRWxlbWVudCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkgJiYgdGhpcy5yZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHMpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0ZpcnN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNGaXJzdCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzTmV4dCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuaGFzTmV4dCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBwcmV2aW91cyBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc1ByZXYoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc1ByZXYodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0xhc3QoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc0xhc3QodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbmV4dCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5uZXh0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBwcmV2KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnByZXYodGhpcy5yZXNvdXJjZUFycmF5LCB0aGlzLnR5cGUpLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGZpcnN0KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmZpcnN0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbGFzdCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5sYXN0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwYWdlIG9mIHJlc3VsdHMgZ2l2ZW4gYSBwYWdlIG51bWJlciovXHJcbiAgICBwdWJsaWMgcGFnZShwYWdlTnVtYmVyOiBudW1iZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wYWdlKHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlLCBwYWdlTnVtYmVyKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi91c2VyL3VzZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBBY2NvdW50IG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBY2NvdW50U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXI+IHtcclxuICBcclxuICAvKiogQVBJIGJhc2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUEkgPSAnL2FwaSc7XHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFDQ09VTlRfQVBJID0gdGhpcy5BUEkgKyAnL2FjY291bnQnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihVc2VyLCBcImFjY291bnRcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGdldCBsb2dnZWQgaW4gdXNlciBhY2NvdW50Ki9cclxuICBnZXQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodGhpcy5BQ0NPVU5UX0FQSSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhY2NvdW50Ki9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLkFDQ09VTlRfQVBJICwgaXRlbSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8qKiBjaGFuZ2UgbG9nZ2VkIGluIHVzZXIgYWNjb3VudCovICBcclxuICBjaGFuZ2VQYXNzd29yZChpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5BQ0NPVU5UX0FQSStcIi9jaGFuZ2UtcGFzc3dvcmRcIiAsIGl0ZW0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlfSBmcm9tICdyeGpzLWNvbXBhdCc7XHJcbi8vaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcblxyXG4vKiogQXV0aGVudGljYXRpb24gc2VydmljZSovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcclxuICAgIFxyXG4gICAgLyoqIEFQSSBiYXNlIFVSTCAqL1xyXG4gICAgcHVibGljIFNFUlZFUl9BUElfVVJMID0gJy9hcGknO1xyXG4gICAgXHJcbiAgICAvKiogY29uc3RydWN0b3IqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50XHJcbiAgICApIHt9XHJcbiAgICBcclxuICAgIC8qKiBnZXQgY3VycmVudCB1c2VyIGp3dCB0b2tlbiBmcm9tIHNlc3Npb24gc3RvcmFnZSovXHJcbiAgICBnZXRUb2tlbigpIHtcclxuICAgICAgICByZXR1cm4gIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9naW4gb3BlcmF0aW9uICovXHJcbiAgICBsb2dpbihjcmVkZW50aWFscyk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiBjcmVkZW50aWFscy51c2VybmFtZSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IGNyZWRlbnRpYWxzLnBhc3N3b3JkXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy5TRVJWRVJfQVBJX1VSTCArICcvYXV0aGVudGljYXRlJywgZGF0YSwge29ic2VydmUgOiAncmVzcG9uc2UnfSkubWFwKGF1dGhlbnRpY2F0ZVN1Y2Nlc3MuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhlbnRpY2F0ZVN1Y2Nlc3MocmVzcCkge1xyXG4gICAgICAgICAgICBjb25zdCBiZWFyZXJUb2tlbiA9IHJlc3AuaGVhZGVycy5nZXQoJ0F1dGhvcml6YXRpb24nKTtcclxuICAgICAgICAgICAgaWYgKGJlYXJlclRva2VuICYmIGJlYXJlclRva2VuLnNsaWNlKDAsIDcpID09PSAnQmVhcmVyICcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGp3dCA9IGJlYXJlclRva2VuLnNsaWNlKDcsIGJlYXJlclRva2VuLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlQXV0aGVudGljYXRpb25Ub2tlbihqd3QpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zdCBleHBpcmVzQXQgPSBtb21lbnQoKS5hZGQoIHJlc3AuaGVhZGVycy5nZXQoJ1Rva2VuLVZhbGlkaXR5JyksJ21pbGlzZWNvbmQnKTtcclxuICAgICAgICAgICAgICAgIC8vc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZXhwaXJlc19hdCcsIEpTT04uc3RyaW5naWZ5KGV4cGlyZXNBdC52YWx1ZU9mKCkpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBqd3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogbG9naW4gb3BlcmF0aW9uIHdpdGggand0IHRva2VuICovXHJcbiAgICBsb2dpbldpdGhUb2tlbihqd3QpIHtcclxuICAgICAgICBpZiAoand0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoand0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJ2F1dGgtand0LXNlcnZpY2UgUHJvbWlzZSByZWplY3QnKTsgLy8gUHV0IGFwcHJvcHJpYXRlIGVycm9yIG1lc3NhZ2UgaGVyZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogc3RvcmUgand0IHRva2VuIGluIHNlc3Npb24gc3RvcmFnZSovXHJcbiAgICBzdG9yZUF1dGhlbnRpY2F0aW9uVG9rZW4oand0KSB7XHJcbiAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJywgand0KTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGxvZ2dlZCBpbiovXHJcbiAgICBwdWJsaWMgaXNMb2dnZWRJbigpIHtcclxuICAgICAgICAvL3JldHVybiBtb21lbnQoKS5pc0JlZm9yZSh0aGlzLmdldEV4cGlyYXRpb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW4oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGxvZ2dlZCBvdXQqL1xyXG4gICAgaXNMb2dnZWRPdXQoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzTG9nZ2VkSW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9nb3V0IG9wZXJhdGlvbiAqL1xyXG4gICAgbG9nb3V0KCk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgLy9sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicpO1xyXG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICAgICAgICAgIC8vc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnZXhwaXJlc19hdCcpO1xyXG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBcclxufVxyXG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3QsIEh0dHBIYW5kbGVyLCBIdHRwRXZlbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG4vKiogSW50ZXJjZXB0b3IgZm9yIGF1dGhlbnRpY2F0aW9uIHRva2VuIGluIEFQSSByZXF1ZXN0cyAqL1xyXG5leHBvcnQgY2xhc3MgQXV0aEludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcclxuICAgIC8qKiBBUEkgYmFzZSBwYXRoKi9cclxuICAgIHB1YmxpYyBTRVJWRVJfQVBJX1VSTCA9ICcvYXBpJztcclxuICAgIHB1YmxpYyBURVNUX1NFUlZFUl9BUElfVVJMID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGknO1xyXG4gICAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgKSB7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiByZXF1ZXN0IGhhbmRsZXIgKi9cclxuICAgIGludGVyY2VwdChyZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcclxuICAgICAgICBpZiAoIXJlcXVlc3QgfHwgIXJlcXVlc3QudXJsIHx8ICEocmVxdWVzdC51cmwuaW5jbHVkZXMoXCJhcGlcIikpICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxdWVzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicpO1xyXG4gICAgICAgIGlmICghIXRva2VuKSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3QgPSByZXF1ZXN0LmNsb25lKHtcclxuICAgICAgICAgICAgICAgIHNldEhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyB0b2tlblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcXVlc3QpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcy9TdWJqZWN0JztcclxuaW1wb3J0IHsgQWNjb3VudFNlcnZpY2UgfSBmcm9tICcuLi9hY2NvdW50L2FjY291bnQuc2VydmljZSc7XHJcblxyXG4vKiogUHJpbmNpcGFsIHNlcnZpY2UqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBQcmluY2lwYWwge1xyXG4gICAgcHJpdmF0ZSB1c2VySWRlbnRpdHk6IGFueTtcclxuICAgIHByaXZhdGUgYXV0aGVudGljYXRlZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBhdXRoZW50aWNhdGlvblN0YXRlID0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBhY2NvdW50OiBBY2NvdW50U2VydmljZVxyXG4gICAgKSB7fVxyXG5cclxuICAgIC8qKiBhdXRoZW50aWNhdGUgd2l0aCBnaXZlbiBpZGVudGl0eSovXHJcbiAgICBhdXRoZW50aWNhdGUoaWRlbnRpdHkpIHtcclxuICAgICAgICB0aGlzLnVzZXJJZGVudGl0eSA9IGlkZW50aXR5O1xyXG4gICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IGlkZW50aXR5ICE9PSBudWxsO1xyXG4gICAgICAgIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5uZXh0KHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgKi9cclxuICAgIGhhc0FueUF1dGhvcml0eShhdXRob3JpdGllczogc3RyaW5nW10pOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuaGFzQW55QXV0aG9yaXR5RGlyZWN0KGF1dGhvcml0aWVzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkgKi9cclxuICAgIGhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5KGF1dGhvcml0aWVzOiBzdHJpbmdbXSx0ZXJyaXRvcnk6IHN0cmluZyApOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuaGFzQW55QXV0aG9yaXR5RGlyZWN0T25UZXJyaXRvcnkoYXV0aG9yaXRpZXMsdGVycml0b3J5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIHdpdGhvdXQgcmVzb2x2aW5nIHByb21pc2VzKi9cclxuICAgIGhhc0FueUF1dGhvcml0eURpcmVjdChhdXRob3JpdGllczogc3RyaW5nW10pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCB8fCAhdGhpcy51c2VySWRlbnRpdHkgfHwgIXRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXV0aG9yaXRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzLmluY2x1ZGVzKGF1dGhvcml0aWVzW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgb24gdGhlIGdpdmVuIHRlcnJpdG9yeSB3aXRob3V0IHJlc29sdmluZyBwcm9taXNlcyAqL1xyXG4gICAgaGFzQW55QXV0aG9yaXR5RGlyZWN0T25UZXJyaXRvcnkoYXV0aG9yaXRpZXM6IHN0cmluZ1tdLHRlcnJpdG9yeTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMudXNlcklkZW50aXR5IHx8ICF0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF1dGhvcml0aWVzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XSAmJiB0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllc1BlclRlcnJpdG9yeVt0ZXJyaXRvcnldLmluY2x1ZGVzKGF1dGhvcml0aWVzW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIHRoZSBnaXZlbiBhdXRob3JpdHkgKi9cclxuICAgIGhhc0F1dGhvcml0eShhdXRob3JpdHk6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5pZGVudGl0eSgpLnRoZW4oKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoaWQuYXV0aG9yaXRpZXMgJiYgaWQuYXV0aG9yaXRpZXMuaW5jbHVkZXMoYXV0aG9yaXR5KSk7XHJcbiAgICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIHRoZSBnaXZlbiBhdXRob3JpdHkgb24gdGhlIGdpdmVuIHRlcnJpdG9yeSovXHJcbiAgICBoYXNBdXRob3JpdHlPblRlcnJpdG9yeShhdXRob3JpdHk6IHN0cmluZyx0ZXJyaXRvcnk6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5pZGVudGl0eSgpLnRoZW4oKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoaWQuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnkgJiYgaWQuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XSAmJiBpZC5hdXRob3JpdGllc1BlclRlcnJpdG9yeVt0ZXJyaXRvcnldLmluY2x1ZGVzKGF1dGhvcml0eSkpO1xyXG4gICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHVzZXIgaWRlbnRpdHkqL1xyXG4gICAgaWRlbnRpdHkoZm9yY2U/OiBib29sZWFuKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBpZiAoZm9yY2UgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjaGVjayBhbmQgc2VlIGlmIHdlIGhhdmUgcmV0cmlldmVkIHRoZSB1c2VySWRlbnRpdHkgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXHJcbiAgICAgICAgLy8gaWYgd2UgaGF2ZSwgcmV1c2UgaXQgYnkgaW1tZWRpYXRlbHkgcmVzb2x2aW5nXHJcbiAgICAgICAgaWYgKHRoaXMudXNlcklkZW50aXR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmV0cmlldmUgdGhlIHVzZXJJZGVudGl0eSBkYXRhIGZyb20gdGhlIHNlcnZlciwgdXBkYXRlIHRoZSBpZGVudGl0eSBvYmplY3QsIGFuZCB0aGVuIHJlc29sdmUuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWNjb3VudC5nZXQoKS50b1Byb21pc2UoKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhY2NvdW50ID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJJZGVudGl0eSA9IGFjY291bnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLm5leHQodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2VySWRlbnRpdHk7XHJcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJJZGVudGl0eSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUubmV4dCh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBpcyBhdXRoZW50aWNhdGVkICovXHJcbiAgICBpc0F1dGhlbnRpY2F0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaWRlbnRpdHkgaXMgcmVzb2x2ZWQgKi9cclxuICAgIGlzSWRlbnRpdHlSZXNvbHZlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51c2VySWRlbnRpdHkgIT09IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IGN1cnJlbnQgdXNlciBhdXRoZW50aWNhdGlvbiBzdGF0ZSAqL1xyXG4gICAgZ2V0QXV0aGVudGljYXRpb25TdGF0ZSgpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RvciwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwSW50ZXJjZXB0b3IsIEh0dHBSZXF1ZXN0LCBIdHRwSGFuZGxlciwgSHR0cEV2ZW50LCBIdHRwRXJyb3JSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5cclxuLyoqIEludGVyY2VwdG9yIGZvciBhdXRoZW50aWNhdGlvbiBleHBpcmVkIHJlc3BvbnNlIGluIEFQSSByZXF1ZXN0cyAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBdXRoRXhwaXJlZEludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsICAgICBcclxuICAgICAgICBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSwgXHJcbiAgICAgICAgcHJpdmF0ZSBwcmluY2lwYWw6IFByaW5jaXBhbFxyXG4gICAgKSB7fVxyXG5cclxuICAgIC8qKiByZXF1ZXN0IGhhbmRsZXIgKi9cclxuICAgIGludGVyY2VwdChyZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcclxuICAgICAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxdWVzdCkuZG8oKGV2ZW50OiBIdHRwRXZlbnQ8YW55PikgPT4ge30sIChlcnI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnIuc3RhdHVzID09PSA0MDEpIHsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2UubG9nb3V0KCkuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmluY2lwYWwuYXV0aGVudGljYXRlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnLyddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5cclxuLyoqIExvZ2luIHNlcnZpY2UqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBMb2dpblNlcnZpY2Uge1xyXG4gICAgXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgYXV0aFNlcnZlclByb3ZpZGVyOiBBdXRoU2VydmljZSwgXHJcbiAgICAgICAgcHJpdmF0ZSBwcmluY2lwYWw6IFByaW5jaXBhbFxyXG4gICAgKSB7fVxyXG5cclxuICAgIC8qKkxvZ2luIG9wZXJhdGlvbiovXHJcbiAgICBsb2dpbihjcmVkZW50aWFscywgY2FsbGJhY2s/KSB7XHJcbiAgICAgICAgY29uc3QgY2IgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dpbihjcmVkZW50aWFscykuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByaW5jaXBhbC5pZGVudGl0eSh0cnVlKS50aGVuKChhY2NvdW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQWZ0ZXIgdGhlIGxvZ2luIHRoZSBsYW5ndWFnZSB3aWxsIGJlIGNoYW5nZWQgdG9cclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgbGFuZ3VhZ2Ugc2VsZWN0ZWQgYnkgdGhlIHVzZXIgZHVyaW5nIGhpcyByZWdpc3RyYXRpb25cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKCk7XHJcbiAgICAgICAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nb3V0KCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKmxvZ2luIHdpdGggand0IHRva2VuICovXHJcbiAgICBsb2dpbldpdGhUb2tlbihqd3QpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoU2VydmVyUHJvdmlkZXIubG9naW5XaXRoVG9rZW4oand0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9nb3V0IG9wZXJhdGlvbiAqL1xyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgdGhpcy5hdXRoU2VydmVyUHJvdmlkZXIubG9nb3V0KCkuc3Vic2NyaWJlKCk7XHJcbiAgICAgICB0aGlzLnByaW5jaXBhbC5hdXRoZW50aWNhdGUobnVsbCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi91c2VyLm1vZGVsJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFVzZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VXNlcj4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgYmFzZSBwYXRoICovXHJcbiAgcHVibGljIEFQSSA9ICcvYXBpJztcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVVNFUl9BUEkgPSB0aGlzLkFQSSArICcvdXNlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihVc2VyLCBcInVzZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB1c2VyKi9cclxuICByZW1vdmUoaXRlbTogVXNlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHVzZXIqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLlVTRVJfQVBJICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICAgIFxyXG4gIC8qKiBjaGFuZ2UgcGFzc3dvcmQgbyBnaXZlbiB1c2VyIGlkICovXHJcbiAgY2hhbmdlUGFzc3dvcmQoaWQsaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMuVVNFUl9BUEkrXCIvXCIraWQrXCIvY2hhbmdlLXBhc3N3b3JkXCIgLCBpdGVtKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuLi90ZXJyaXRvcnkvdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vdXNlci5tb2RlbCc7XHJcbi8qKlxyXG4gKiBVc2VyIHBvc2l0aW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVXNlclBvc2l0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogZW1haWwgKi9cclxuICBwdWJsaWMgZW1haWw6IHN0cmluZztcclxuICAvKiogb3JnYW5pemF0aW9uIG5hbWUqL1xyXG4gIHB1YmxpYyBvcmdhbml6YXRpb246IHN0cmluZztcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIHN5c3RlbSBkYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgZGF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIHBvc2l0aW9uIHRlcnJpdG9yeSovXHJcbiAgcHVibGljIHRlcnJpdG9yeTogVGVycml0b3J5O1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgdXNlcjogVXNlcjtcclxufVxyXG4iLCJpbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJQb3NpdGlvbiB9IGZyb20gJy4vdXNlci1wb3NpdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBVc2VyIHBvc2l0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyUG9zaXRpb25TZXJ2aWNlICBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXJQb3NpdGlvbj4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgYmFzZSBwYXRoICovXHJcbiAgcHVibGljIEFQSSA9ICcvYXBpJztcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVVNFUl9QT1NJVElPTl9BUEkgPSB0aGlzLkFQSSArICcvdXNlci1wb3NpdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihVc2VyUG9zaXRpb24sIFwidXNlci1wb3NpdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHVzZXIgcG9zaXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBVc2VyUG9zaXRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB1c2VyIHBvc2l0aW9uKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS51c2VyICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndXNlcicsaXRlbS51c2VyKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnVzZXIgPSBpdGVtLnVzZXIuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5VU0VSX1BPU0lUSU9OX0FQSSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFJvbGUgfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuLi90ZXJyaXRvcnkvdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vdXNlci5tb2RlbCc7XHJcblxyXG4vKipcclxuICogVXNlciBwZXJtaXNzaW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVXNlckNvbmZpZ3VyYXRpb24gZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIHJvbGUgKi8gIFxyXG4gIHB1YmxpYyByb2xlOiBSb2xlO1xyXG4gIC8qKiB0ZXJyaXRvcnkgKi8gXHJcbiAgcHVibGljIHRlcnJpdG9yeTogVGVycml0b3J5O1xyXG4gIC8qKiB1c2VyICovXHJcbiAgcHVibGljIHVzZXI6IFVzZXI7XHJcbn1cclxuIiwiaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vdXNlci1jb25maWd1cmF0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFVzZXIgY29uZmlndXJhdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlICBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXJDb25maWd1cmF0aW9uPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSBiYXNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBJID0gJy9hcGknO1xyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBVU0VSX0NPTkZJR1VSQVRJT05fQVBJID0gdGhpcy5BUEkgKyAnL3VzZXItY29uZmlndXJhdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihVc2VyQ29uZmlndXJhdGlvbiwgXCJ1c2VyLWNvbmZpZ3VyYXRpb25zXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB1c2VyIGNvbmZpZ3VyYXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBVc2VyQ29uZmlndXJhdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHVzZXIgY29uZmlndXJhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udXNlciAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3VzZXInLGl0ZW0udXNlcikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0ucm9sZSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3JvbGUnLGl0ZW0ucm9sZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS5yb2xlID0gaXRlbS5yb2xlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0udXNlciA9IGl0ZW0udXNlci5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLlVTRVJfQ09ORklHVVJBVElPTl9BUEkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnlUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktdHlwZS5tb2RlbCc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogYWRkcmVzcyovXHJcbiAgcHVibGljIGFkZHJlc3M6IHN0cmluZztcclxuICAvKiogd2hldGhlciB0ZXJyaXRvcnkgaXMgYmxvY2tlZCovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47XHJcbiAgLyoqIGNvbW1lbnRzKi9cclxuICBwdWJsaWMgY29tbWVudHM6IHN0cmluZztcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIGNvbnRhY3QgZW1haWwgKi8gIFxyXG4gIHB1YmxpYyBlbWFpbDogc3RyaW5nO1xyXG4gIC8qKiBleHRlbnNpb24gKi9cclxuICBwdWJsaWMgZXh0OiBzdHJpbmc7XHJcbiAgLyoqIGxvZ28gaW1hZ2UgVVJMICovXHJcbiAgcHVibGljIGxvZ286IHN0cmluZztcclxuICAvKiogY29udGFjdCBvcmdhbml6YXRpb24gbmFtZSAqL1xyXG4gIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHNjb3BlKi9cclxuICBwdWJsaWMgc2NvcGU6IHN0cmluZztcclxuICAvKiogdHlwZSAqLyAgXHJcbiAgcHVibGljIHR5cGU6IFRlcnJpdG9yeVR5cGU7XHJcbiAgLyoqIHRlcnJpdG9yeSBtZW1iZXJzKi9cclxuICBwdWJsaWMgbWVtYmVyczogVGVycml0b3J5W107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4vdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUZXJyaXRvcnkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUZXJyaXRvcnk+IHtcclxuICBcclxuICAvKiogQVBJIGJhc2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUEkgPSAnL2FwaSc7XHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRFUlJJVE9SWV9BUEkgPSB0aGlzLkFQSSArICcvdGVycml0b3JpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUZXJyaXRvcnksIFwidGVycml0b3JpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRlcnJpdG9yeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSovXHJcbiAgc2F2ZShpdGVtOiBUZXJyaXRvcnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0udHlwZSE9bnVsbClcclxuICAgICAgaXRlbS50eXBlID0gaXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMuVEVSUklUT1JZX0FQSSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IHR5cGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlUeXBlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuL3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeVR5cGUgfSBmcm9tICcuL3RlcnJpdG9yeS10eXBlLm1vZGVsJztcclxuXHJcbi8qKiBUZXJyaXRvcnlUeXBlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlUeXBlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRlcnJpdG9yeVR5cGU+IHtcclxuICBcclxuICAvKiogQVBJIGJhc2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUEkgPSAnL2FwaSc7XHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRFUlJJVE9SWVRZUEVfQVBJID0gdGhpcy5BUEkgKyAnL3RlcnJpdG9yeS10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRlcnJpdG9yeVR5cGUsIFwidGVycml0b3J5LXR5cGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0ZXJyaXRvcnkgdHlwZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRlcnJpdG9yeVR5cGUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0ZXJyaXRvcnkgdHlwZSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMuVEVSUklUT1JZVFlQRV9BUEkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuLyoqXHJcbiAqIFJvbGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBSb2xlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBjb21tZW50cyovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFJvbGUgfSBmcm9tICcuL3JvbGUubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBSb2xlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBSb2xlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFJvbGU+IHtcclxuICBcclxuICAvKiogQVBJIGJhc2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUEkgPSAnL2FwaSc7XHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFJPTEVfQVBJID0gdGhpcy5BUEkgKyAnL3JvbGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoUm9sZSwgXCJyb2xlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgcm9sZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFJvbGUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSByb2xlKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5ST0xFX0FQSSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBDb25uZWN0aW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICAvKiogdXNlciovXHJcbiAgcHVibGljIHVzZXI6IHN0cmluZztcclxuICAvKiogcGFzc3dvcmQqL1xyXG4gIHB1YmxpYyBwYXNzd29yZDogc3RyaW5nO1xyXG4gIC8qKiBjb25uZWN0aW9uIHN0cmluZyovXHJcbiAgcHVibGljIGNvbm5lY3Rpb25TdHJpbmc6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJy4vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ29ubmVjdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDb25uZWN0aW9uPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSBiYXNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBJID0gJy9hcGknO1xyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9IHRoaXMuQVBJICsgJy9jb25uZWN0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvbm5lY3Rpb24sIFwiY29ubmVjdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNvbm5lY3Rpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBDb25uZWN0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY29ubmVjdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBDb25uZWN0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5DT05ORUNUSU9OX0FQSSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi4vY29ubmVjdGlvbi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgUm9sZSB9IGZyb20gJy4uL3JvbGUvcm9sZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tUeXBlIH0gZnJvbSAnLi90YXNrLXR5cGUubW9kZWwnO1xyXG5pbXBvcnQgeyBUYXNrR3JvdXAgfSBmcm9tICcuL3Rhc2stZ3JvdXAubW9kZWwnO1xyXG5pbXBvcnQgeyBUYXNrQXZhaWxhYmlsaXR5IH0gZnJvbSAnLi90YXNrLWF2YWlsYWJpbGl0eS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tQYXJhbWV0ZXIgfSBmcm9tICcuL3Rhc2stcGFyYW1ldGVyLm1vZGVsJztcclxuXHJcbi8vRklYTUUgZW5zdXJlIHRhc2sgY3JlYXRpb24gaW4gYWRtaW4gYXBwIHVwb24gaW5pdGlhbGl6YXRpb24gKGFzIGl0IGlzIGRvbmUgd2l0aCBSb2xlcyBhbmQgZGVmYXVsdCBVc2VycylcclxuLyoqIEdFT0FETUlOX3Rhc2sgaWQgKi9cclxuZXhwb3J0IGNvbnN0IEdFT0FETUlOX1RSRUVfVEFTS19JRDpzdHJpbmcgID0gXCJnZW9hZG1pblwiO1xyXG5cclxuaW1wb3J0IHsgVGFza1VJIH0gZnJvbSAnLi90YXNrLXVpLm1vZGVsJztcclxuLyoqIFRhc2sgbW9kZWwgKi9cclxuZXhwb3J0IGNsYXNzIFRhc2sgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUgKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIG9yZGVyKi9cclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjtcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIHRhc2sgZ3JvdXAqL1xyXG4gIHB1YmxpYyBncm91cDogVGFza0dyb3VwO1xyXG4gIC8qKiB0YXNrIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBUYXNrVHlwZTtcclxuICAvKiogdGFzayBVSSovXHJcbiAgcHVibGljIHVpOiBUYXNrVUk7XHJcbiAgLyoqIHBhcmFtZXRlcnMqL1xyXG4gIHB1YmxpYyBwYXJhbWV0ZXJzOiBUYXNrUGFyYW1ldGVyW107XHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xyXG4gIC8qKiByb2xlcyovXHJcbiAgcHVibGljIHJvbGVzOiBSb2xlW107XHJcbiAgLyoqIGF2YWlsYWJpbGl0aWVzKi9cclxuICBwdWJsaWMgYXZhaWxhYmlsaXRpZXM6IFRhc2tBdmFpbGFiaWxpdHlbXTtcclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi90YXNrLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2s+IHtcclxuXHJcbiAgICAvKiogQVBJIGJhc2UgcGF0aCAqL1xyXG4gICAgcHVibGljIEFQSSA9ICcvYXBpJztcclxuICAgIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gICAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gdGhpcy5BUEkgKyAnL3Rhc2tzJztcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICAgICAgc3VwZXIoVGFzaywgXCJ0YXNrc1wiLCBpbmplY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHJlbW92ZSB0YXNrKi9cclxuICAgIHJlbW92ZShpdGVtOiBUYXNrKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHNhdmUgdGFzayovXHJcbiAgICBzYXZlKGl0ZW06IFRhc2spOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgICAgICBjb25zdCB0YXNrVHlwZSA9IGl0ZW0udHlwZTtcclxuICAgICAgICBjb25zdCB0YXNrR3JvdXAgPSBpdGVtLmdyb3VwO1xyXG4gICAgICAgIGxldCB0YXNrQ29ubmVjdGlvbiA9IGl0ZW0uY29ubmVjdGlvbjtcclxuICAgICAgICBsZXQgdGFza1VJID0gaXRlbS51aTtcclxuICAgICAgICBpZiAoaXRlbS5fbGlua3MgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5DT05ORUNUSU9OX0FQSSwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1R5cGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFza1R5cGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tUeXBlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tUeXBlPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSBiYXNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBJID0gJy9hcGknO1xyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9IHRoaXMuQVBJICsgJy90YXNrLXR5cGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza1R5cGUsIFwidGFzay10eXBlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGFzayB0eXBlKi9cclxuICByZW1vdmUoaXRlbTogVGFza1R5cGUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0YXNrIHR5cGUqL1xyXG4gIHNhdmUoaXRlbTogVGFza1R5cGUpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLkNPTk5FQ1RJT05fQVBJICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIFRhc2sgZ3JvdXAgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrR3JvdXAgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza0dyb3VwIH0gZnJvbSAnLi90YXNrLWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIGdyb3VwIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrR3JvdXBTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGFza0dyb3VwPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSBiYXNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBJID0gJy9hcGknO1xyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9IHRoaXMuQVBJICsgJy90YXNrLWdyb3Vwcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRhc2tHcm91cCwgXCJ0YXNrLWdyb3Vwc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGFzayBncm91cCovXHJcbiAgcmVtb3ZlKGl0ZW06IFRhc2tHcm91cCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgZ3JvdXAqL1xyXG4gIHNhdmUoaXRlbTogVGFza0dyb3VwKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5DT05ORUNUSU9OX0FQSSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VGFza30gZnJvbSAnLi90YXNrLm1vZGVsJzsgIFxyXG4vKipcclxuICogVGFzayBwYXJhbWV0ZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrUGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBvcmRlciovICBcclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjtcclxuICBcclxuICAvKiogdGFzayovICBcclxuICBwdWJsaWMgdGFzazpUYXNrO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrUGFyYW1ldGVyIH0gZnJvbSAnLi90YXNrLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBwYXJhbWV0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBUYXNrUGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tQYXJhbWV0ZXI+IHtcclxuICBcclxuICAvKiogQVBJIGJhc2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUEkgPSAnL2FwaSc7XHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRBU0tfUEFSQU1FVEVSX0FQSSA9IHRoaXMuQVBJICsgJy90YXNrLXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrUGFyYW1ldGVyLCBcInRhc2stcGFyYW1ldGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGFzayBwYXJhbWV0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBUYXNrUGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBwYXJhbWV0ZXIqL1xyXG4gIHNhdmUoaXRlbTogVGFza1BhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS50YXNrICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGFzaycsaXRlbS50YXNrKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGFzayA9IGl0ZW0udGFzay5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLlRBU0tfUEFSQU1FVEVSX0FQSSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4uL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi90YXNrLm1vZGVsJztcclxuLyoqXHJcbiAqIFRhc2sgYXZhaWxhYmlsaXR5IG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza0F2YWlsYWJpbGl0eSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogdGVycml0b3J5Ki9cclxuICBwdWJsaWMgdGVycml0b3J5OiBUZXJyaXRvcnk7XHJcbiAgLyoqIHRhc2sqL1xyXG4gIHB1YmxpYyB0YXNrOiBUYXNrO1xyXG59XHJcbiIsImltcG9ydCB7IFRhc2tBdmFpbGFiaWxpdHkgfSBmcm9tICcuL3Rhc2stYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIGF2YWlsYWJpbGl0eSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIFRhc2tBdmFpbGFiaWxpdHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGFza0F2YWlsYWJpbGl0eT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgYmFzZSBwYXRoICovXHJcbiAgcHVibGljIEFQSSA9ICcvYXBpJztcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEFTS19BVkFJTEFCSUxJVFlfQVBJID0gdGhpcy5BUEkgKyAnL3Rhc2stYXZhaWxhYmlsaXRpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrQXZhaWxhYmlsaXR5LCBcInRhc2stYXZhaWxhYmlsaXRpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICByZW1vdmUoaXRlbTogVGFza0F2YWlsYWJpbGl0eSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICBzYXZlKGl0ZW06IFRhc2tBdmFpbGFiaWxpdHkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS50YXNrID0gaXRlbS50YXNrLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMuVEFTS19BVkFJTEFCSUxJVFlfQVBJICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIFRhc2sgVUkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrVUkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHRvb2x0aXAqLyAgXHJcbiAgcHVibGljIHRvb2x0aXA6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiBvcmRlciovIFxyXG4gIHB1YmxpYyBvcmRlcjogbnVtYmVyO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrVUkgfSBmcm9tICcuL3Rhc2stdWkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgVUkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tVSVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrVUk+IHtcclxuICBcclxuICAvKiogQVBJIGJhc2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUEkgPSAnL2FwaSc7XHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gdGhpcy5BUEkgKyAnL3Rhc2stdWlzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza1VJLCBcInRhc2stdWlzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0YXNrIFVJKi9cclxuICByZW1vdmUoaXRlbTogVGFza1VJKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBVSSovXHJcbiAgc2F2ZShpdGVtOiBUYXNrVUkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7ICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMuQ09OTkVDVElPTl9BUEkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0Nvbm5lY3Rpb259IGZyb20gJy4uL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7U2VydmljZVBhcmFtZXRlcn0gZnJvbSAnLi9zZXJ2aWNlLXBhcmFtZXRlci5tb2RlbCc7XHJcbi8qKlxyXG4gKiBTZXJ2aWNlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2VydmljZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG5cclxuICAvKiogdXJsKi8gIFxyXG4gIHB1YmxpYyB1cmw6IHN0cmluZztcclxuXHJcbiAgLyoqIHByb2plY3Rpb25zKi8gIFxyXG4gIHB1YmxpYyBwcm9qZWN0aW9uczogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBsZWdlbmQqL1xyXG4gIHB1YmxpYyBsZWdlbmQ6IHN0cmluZztcclxuXHJcbiAgLyoqIGluZm9VcmwqLyAgXHJcbiAgcHVibGljIGluZm9Vcmw6IHN0cmluZztcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcblxyXG4gIC8qKiBjb25uZWN0aW9uKi9cclxuICBwdWJsaWMgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcclxuICBcclxuICAvKiogcGFyYW1ldGVycyovICBcclxuICBwdWJsaWMgcGFyYW1ldGVyczogU2VydmljZVBhcmFtZXRlcltdO1xyXG59XHJcbiIsImltcG9ydCB7IFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2UubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8U2VydmljZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgYmFzZSBwYXRoICovXHJcbiAgcHVibGljIEFQSSA9ICcvYXBpJztcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgU0VSVklDRV9BUEkgPSB0aGlzLkFQSSArICcvc2VydmljZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihTZXJ2aWNlLCBcInNlcnZpY2VzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBzZXJ2aWNlKi9cclxuICByZW1vdmUoaXRlbTogU2VydmljZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UqL1xyXG4gIHNhdmUoaXRlbTogU2VydmljZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBsZXQgc2VydmljZUNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb247XHJcblxyXG4gICAgaWYgKGl0ZW0uY29ubmVjdGlvbiE9bnVsbCl7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uY29ubmVjdGlvbiA9IGl0ZW0uY29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcz0ge307XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5jb25uZWN0aW9uOyAgICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoc2VydmljZUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZj09Jycpe1xyXG4gICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdjb25uZWN0aW9uJyxzZXJ2aWNlQ29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICBcclxuXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgIFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2Nvbm5lY3Rpb24nLHNlcnZpY2VDb25uZWN0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgXHJcblxyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICB9IFxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5TRVJWSUNFX0FQSSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7U2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlLm1vZGVsJzsgXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIHBhcmFtZXRlciBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VQYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqLyAgXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHNlcnZpY2UqL1xyXG4gIHB1YmxpYyBzZXJ2aWNlOiBTZXJ2aWNlO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBTZXJ2aWNlUGFyYW1ldGVyIH0gZnJvbSAnLi9zZXJ2aWNlLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogU2VydmljZSBwYXJhbWV0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlUGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFNlcnZpY2VQYXJhbWV0ZXI+IHtcclxuICBcclxuICAvKiogQVBJIGJhc2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUEkgPSAnL2FwaSc7XHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFNFUlZJQ0VfUEFSQU1FVEVSX0FQSSA9IHRoaXMuQVBJICsgJy9zZXJ2aWNlLXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihTZXJ2aWNlUGFyYW1ldGVyLCBcInNlcnZpY2UtcGFyYW1ldGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBTZXJ2aWNlUGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHNhdmUoaXRlbTogU2VydmljZVBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoaXRlbS5zZXJ2aWNlICE9bnVsbCl7XHJcbiAgICAgICAgICBsZXQgc2VydmljZSA9ICBpdGVtLnNlcnZpY2U7XHJcbiAgICAgICAgICBkZWxldGUgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NlcnZpY2UnLHNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uc2VydmljZSA9IGl0ZW0uc2VydmljZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLlNFUlZJQ0VfUEFSQU1FVEVSX0FQSSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7U2VydmljZX0gZnJvbSAnLi4vc2VydmljZS9zZXJ2aWNlLm1vZGVsJztcclxuaW1wb3J0IHtDb25uZWN0aW9ufSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5fSBmcm9tICcuL2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZSA6IHN0cmluZztcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgdmlzaWJsZSovXHJcbiAgcHVibGljIHZpc2libGU6IEJvb2xlYW47XHJcblxyXG4gIC8qKiB0cmFuc3BhcmVuY3kqLyBcclxuICBwdWJsaWMgdHJhbnNwYXJlbmN5OiBOdW1iZXI7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHF1ZXJ5YWJsZSovICBcclxuICBwdWJsaWMgcXVlcnlhYmxlOiBCb29sZWFuO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBxdWVyeWFibGUqLyBcclxuICBwdWJsaWMgcXVlcnlBY3Q6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBxdWVyeSBsYXllciovXHJcbiAgcHVibGljIHF1ZXJ5TGF5OiBzdHJpbmc7XHJcblxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuXHJcbiAgLyoqIG9yZGVyKi8gIFxyXG4gIHB1YmxpYyBvcmRlcjogTnVtYmVyOyBcclxuICBcclxuICAvKiogbWluaW11bSBzY2FsZSovXHJcbiAgcHVibGljIG1pbmltdW1TY2FsZTogTnVtYmVyO1xyXG5cclxuICAvKiogbWF4aW11bSBzY2FsZSovXHJcbiAgcHVibGljIG1heGltdW1TY2FsZTogTnVtYmVyO1xyXG5cclxuICAvKiogbGF5ZXJzKi8gIFxyXG4gIHB1YmxpYyBsYXllcnM6IHN0cmluZztcclxuXHJcbiAgLyoqIHNlcnZpY2UqL1xyXG4gIHB1YmxpYyBzZXJ2aWNlIDogU2VydmljZTtcclxuICBcclxuICAvKiogY29ubmVjdGlvbiovXHJcbiAgcHVibGljIGNvbm5lY3Rpb246IENvbm5lY3Rpb247XHJcblxyXG4gIC8qKiBhdmFpbGFiaWxpdGllcyovXHJcbiAgcHVibGljIGF2YWlsYWJpbGl0aWVzIDogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHlbXTtcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgcXVlcnlhYmxlKi8gXHJcbiAgcHVibGljIHNlbGVjdGFibGU6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBzZWxlY3Rpb24gbGF5ZXIqL1xyXG4gIHB1YmxpYyBzZWxlY3Rpb25MYXllcjogc3RyaW5nO1xyXG5cclxuICAvKiogc2VsZWN0aW9uIHNlcnZpY2UqLyAgXHJcbiAgcHVibGljIHNlbGVjdGlvblNlcnZpY2U6IFNlcnZpY2U7XHJcblxyXG4gIC8qKiBsZWdlbmQgdGlwKi8gIFxyXG4gIHB1YmxpYyBsZWdlbmRUaXA6IHN0cmluZztcclxuICBcclxuICAvKiogbGVnZW5kIHVybCovXHJcbiAgcHVibGljIGxlZ2VuZFVybDogc3RyaW5nO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBlZGl0YWJsZSovXHJcbiAgcHVibGljIGVkaXRhYmxlOiBCb29sZWFuO1xyXG5cclxuICAvKiogbWV0YWRhdGEgVVJMKi9cclxuICBwdWJsaWMgbWV0YWRhdGFVcmw6IHN0cmluZztcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgdGhlbWFibGUqL1xyXG4gIHB1YmxpYyB0aGVtZWFibGU6IEJvb2xlYW47XHJcbiAgXHJcbiAgLyoqIGdlb21ldHJ5IHR5cGUqL1xyXG4gIHB1YmxpYyBnZW9tZXRyeVR5cGU6IHN0cmluZztcclxuICBcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FydG9ncmFwaHkgfSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDYXJ0b2dyYXBoeSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHk+IHtcclxuICBcclxuICAvKiogQVBJIGJhc2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUEkgPSAnL2FwaSc7XHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX0FQSSA9IHRoaXMuQVBJICsgJy9jYXJ0b2dyYXBoaWVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHksIFwiY2FydG9ncmFwaGllc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5Ki9cclxuICBzYXZlKGl0ZW06IENhcnRvZ3JhcGh5KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGxldCBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb247XHJcblxyXG4gICAgY29uc3QgY2FydG9ncmFwaHlTZXJ2aWNlID0gaXRlbS5zZXJ2aWNlO1xyXG4gICAgY29uc3QgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlID0gaXRlbS5zZWxlY3Rpb25TZXJ2aWNlO1xyXG4gICAgXHJcbiAgICAgIFxyXG4gICAgaWYgKGl0ZW0uc2VydmljZSE9bnVsbClcclxuICAgICAgaXRlbS5zZXJ2aWNlID0gaXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICBpZiAoaXRlbS5zZWxlY3Rpb25TZXJ2aWNlIT1udWxsKVxyXG4gICAgICBpdGVtLnNlbGVjdGlvblNlcnZpY2UgPSBpdGVtLnNlbGVjdGlvblNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZjsgIFxyXG4gICAgaWYgKGl0ZW0uY29ubmVjdGlvbiE9bnVsbCl7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uY29ubmVjdGlvbiA9IGl0ZW0uY29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3M9IHt9O1xyXG4gICAgICAgICAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgICAgICAgICAgY2FydG9ncmFwaHlDb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgICAgXHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5jb25uZWN0aW9uO1xyXG4gICAgICBkZWxldGUgaXRlbS5zZXJ2aWNlOyAgICAgICAgICAgIFxyXG4gICAgICBkZWxldGUgaXRlbS5zZWxlY3Rpb25TZXJ2aWNlO1xyXG4gICAgICBcclxuICAgICBpZiAoY2FydG9ncmFwaHlDb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY9PScnKXtcclxuICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignY29ubmVjdGlvbicsY2FydG9ncmFwaHlDb25uZWN0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgIFxyXG4gICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2VydmljZScsY2FydG9ncmFwaHlTZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzZWxlY3Rpb25TZXJ2aWNlJyxjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY29ubmVjdGlvbicsY2FydG9ncmFwaHlDb25uZWN0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzZXJ2aWNlJyxjYXJ0b2dyYXBoeVNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzZWxlY3Rpb25TZXJ2aWNlJyxjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgXHJcblxyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICB9IFxyXG4gICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG5cclxuICAgICAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMuQ0FSVE9HUkFQSFlfQVBJICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbmltcG9ydCB7Um9sZX0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuLyoqXHJcbiAqIENhcnRvZ3JhcGh5IGdyb3VwXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlHcm91cCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICAvKiogbWVtYmVycyovXHJcbiAgcHVibGljIG1lbWJlcnM6IENhcnRvZ3JhcGh5W107XHJcbiAgLyoqIHJvbGVzKi9cclxuICBwdWJsaWMgcm9sZXM6IFJvbGVbXTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FydG9ncmFwaHlHcm91cCB9IGZyb20gJy4vY2FydG9ncmFwaHktZ3JvdXAubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENhcnRvZ3JhcGh5R3JvdXAgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlHcm91cD4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgYmFzZSBwYXRoICovXHJcbiAgcHVibGljIEFQSSA9ICcvYXBpJztcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfR1JPVVBfQVBJID0gdGhpcy5BUEkgKyAnL2NhcnRvZ3JhcGh5LWdyb3Vwcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5R3JvdXAsIFwiY2FydG9ncmFwaHktZ3JvdXBzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBncm91cCovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5R3JvdXApIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSBncm91cCovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUdyb3VwKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLkNBUlRPR1JBUEhZX0dST1VQX0FQSSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4uL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHkgYXZhaWxhYmlsaXR5IG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIHRlcnJpdG9yeSovXHJcbiAgcHVibGljIHRlcnJpdG9yeTogVGVycml0b3J5O1xyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICBcclxuICAvKiogY2FydG9ncmFwaHkqL1xyXG4gIHB1YmxpYyBjYXJ0b2dyYXBoeTogQ2FydG9ncmFwaHk7XHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgYmFzZSBwYXRoICovXHJcbiAgcHVibGljIEFQSSA9ICcvYXBpJztcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfQVZBSUxBQklMSVRZX0FQSSA9IHRoaXMuQVBJICsgJy9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdGllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5LCBcImNhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0aWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxpdGVtLmNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLkNBUlRPR1JBUEhZX0FWQUlMQUJJTElUWV9BUEkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5R3JvdXB9IGZyb20gJy4vY2FydG9ncmFwaHktZ3JvdXAubW9kZWwnO1xyXG4vKipcclxuICogQmFja2dyb3VuZCBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEJhY2tncm91bmQgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogZGVzY3JpcHRpb24qL1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB3aGV0aGVyIGJhY2tncm91bmQgaXMgYWN0aXZlKi9cclxuICBwdWJsaWMgYWN0aXZlOiBCb29sZWFuO1xyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuXHJcbiAgLyoqIGNhcnRvZ3JhcGh5IGdyb3VwKi9cclxuICBwdWJsaWMgY2FydG9ncmFwaHlHcm91cDogQ2FydG9ncmFwaHlHcm91cDtcclxufVxyXG4iLCJpbXBvcnQgeyBCYWNrZ3JvdW5kIH0gZnJvbSAnLi9iYWNrZ3JvdW5kLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBCYWNrZ3JvdW5kIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBCYWNrZ3JvdW5kU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEJhY2tncm91bmQ+IHtcclxuICBcclxuICAvKiogQVBJIGJhc2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUEkgPSAnL2FwaSc7XHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEJBQ0tHUk9VTkRfQVBJID0gdGhpcy5BUEkgKyAnL2JhY2tncm91bmRzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQmFja2dyb3VuZCwgXCJiYWNrZ3JvdW5kc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgYmFja2dyb3VuZCovXHJcbiAgcmVtb3ZlKGl0ZW06IEJhY2tncm91bmQpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7ICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGJhY2tncm91bmQqL1xyXG4gIHNhdmUoaXRlbTogQmFja2dyb3VuZCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBsZXQgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAgPSBpdGVtLmNhcnRvZ3JhcGh5R3JvdXA7XHJcblxyXG4gICAgaWYgKGl0ZW0uY2FydG9ncmFwaHlHcm91cCE9bnVsbCl7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLmNhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uY2FydG9ncmFwaHlHcm91cCA9IGl0ZW0uY2FydG9ncmFwaHlHcm91cC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcz0ge307XHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5jYXJ0b2dyYXBoeUdyb3VwOyAgICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzLnNlbGYuaHJlZj09Jycpe1xyXG4gICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeUdyb3VwJyxiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICBcclxuXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgIFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5R3JvdXAnLGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgXHJcblxyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICB9IFxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5CQUNLR1JPVU5EX0FQSSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VHJlZU5vZGV9IGZyb20gJy4vdHJlZS1ub2RlLm1vZGVsJztcclxuaW1wb3J0IHtSb2xlfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnOyAgICBcclxuLyoqXHJcbiAqIFRyZWUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmVlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG5cclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIG5vZGVzICovXHJcbiAgcHVibGljIG5vZGVzOiBUcmVlTm9kZVtdO1xyXG4gIC8qKiBhdmFpbGFibGUgcm9sZXMgKi9cclxuICBwdWJsaWMgYXZhaWxhYmxlUm9sZXMgOiBSb2xlW107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRyZWUgfSBmcm9tICcuL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRyZWUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRyZWVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VHJlZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgYmFzZSBwYXRoICovXHJcbiAgcHVibGljIEFQSSA9ICcvYXBpJztcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVFJFRV9BUEkgPSB0aGlzLkFQSSArICcvdHJlZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUcmVlLCBcInRyZWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmVlKi9cclxuICByZW1vdmUoaXRlbTogVHJlZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRyZWUqL1xyXG4gIHNhdmUoaXRlbTogVHJlZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMuVFJFRV9BUEkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbmltcG9ydCB7VHJlZX0gZnJvbSAnLi90cmVlLm1vZGVsJztcclxuLyoqXHJcbiAqIFRyZWUgbm9kZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogdG9vbHRpcCovXHJcbiAgcHVibGljIHRvb2x0aXA6IHN0cmluZztcclxuICAvKiogb3JkZXIqL1xyXG4gIHB1YmxpYyBvcmRlbiA6IG51bWJlcjtcclxuICAvKiogd2hldGhlciB0cmVlIG5vZGUgaXMgYWN0aXZlKi9cclxuICBwdWJsaWMgYWN0aXZlOiBib29sZWFuO1xyXG4gIC8qKiBwYXJlbnQgdHJlZSBub2RlICovXHJcbiAgcHVibGljIHBhcmVudDogVHJlZU5vZGU7XHJcbiAgLyoqIGRpc3BsYXllZCBjYXJ0b2dyYXBoeSAqLyAgXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuICAvKiogdHJlZSAqLyAgXHJcbiAgcHVibGljIHRyZWU6IFRyZWU7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRyZWUgbm9kZSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRyZWVOb2RlPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSBiYXNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBJID0gJy9hcGknO1xyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUUkVFX05PREVfQVBJID0gdGhpcy5BUEkgKyAnL3RyZWUtbm9kZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUcmVlTm9kZSwgXCJ0cmVlLW5vZGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmVlIG5vZGUqL1xyXG4gIHJlbW92ZShpdGVtOiBUcmVlTm9kZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRyZWUgbm9kZSovXHJcbiAgc2F2ZShpdGVtOiBUcmVlTm9kZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgY29uc3QgaXRlbVRyZWUgPSBpdGVtLnRyZWU7XHJcbiAgICAgIGNvbnN0IGl0ZW1DYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgIGNvbnN0IGl0ZW1QYXJlbnQgPSBpdGVtLnBhcmVudDtcclxuICAgICAgICBcclxuICAgICAgZGVsZXRlIGl0ZW0udHJlZTtcclxuICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgIGRlbGV0ZSBpdGVtLnBhcmVudDtcclxuICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbVRyZWUgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0cmVlJyxpdGVtVHJlZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtQ2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsaXRlbUNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW1QYXJlbnQgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdwYXJlbnQnLGl0ZW1QYXJlbnQpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChpdGVtLnRyZWUgJiYgaXRlbS50cmVlLl9saW5rcyAmJiBpdGVtLnRyZWUuX2xpbmtzLnNlbGYpIHtcclxuICAgICAgICBpdGVtLnRyZWUgPSBpdGVtLnRyZWUuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAmJiBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcyAmJiBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmKSB7XHJcbiAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfSAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLlRSRUVfTk9ERV9BUEkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1RyZWV9IGZyb20gJy4uL3RyZWUvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Um9sZX0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUdyb3VwfSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25QYXJhbWV0ZXJ9IGZyb20gJy4vYXBwbGljYXRpb24tcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbkJhY2tncm91bmR9IGZyb20gJy4vYXBwbGljYXRpb24tYmFja2dyb3VuZC5tb2RlbCc7XHJcblxyXG4vL0ZJWE1FIGVuc3VyZSBhcHBsaWNhdGlvbiBjcmVhdGlvbiBpbiBhZG1pbiBhcHAgdXBvbiBpbml0aWFsaXphdGlvbiAoYXMgaXQgaXMgZG9uZSB3aXRoIFJvbGVzIGFuZCBkZWZhdWx0IFVzZXJzKVxyXG4vKiogVGVycml0b3JpYWwgYXBwbGljdGlvbiBuYW1lICovXHJcbmV4cG9ydCBjb25zdCBURVJSSVRPUklBTF9BUFBfTkFNRTpzdHJpbmcgID0gXCJBcGxpY2FjacODwrNuIFRlcnJpdG9yaWFsXCI7XHJcblxyXG4vKipcclxuICogQXBwbGljYXRpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHRpdGxlKi9cclxuICBwdWJsaWMgdGl0bGU6IHN0cmluZztcclxuICBcclxuICAvKiogdGhlbWUqL1xyXG4gIHB1YmxpYyB0aGVtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICBcclxuICAvKiogYXZhaWxhYmxlIHJvbGVzKi9cclxuICBwdWJsaWMgYXZhaWxhYmxlUm9sZXMgOiBSb2xlW107XHJcbiAgXHJcbiAgLyoqIHRyZWVzKi9cclxuICBwdWJsaWMgdHJlZXMgOiBUcmVlW107XHJcbiAgXHJcbiAgLyoqIHNjYWxlcyAoY29tbWEtc2VwYXJhdGVkIHZhbHVlcykqL1xyXG4gIHB1YmxpYyBzY2FsZXM6IHN0cmluZztcclxuICBcclxuICAvKiogcHJvamVjdGlvbnMoY29tbWEtc2VwYXJhdGVkIEVQU0cgY29kZXMpKi9cclxuICBwdWJsaWMgcHJvamVjdGlvbnM6IHN0cmluZztcclxuICBcclxuICAvKiogd2hldGhlciBhcHBsaWNhdGlvbiB0cmVlIHdpbGwgYXV0byByZWZyZXNoKi8gIFxyXG4gIHB1YmxpYyB0cmVlQXV0b1JlZnJlc2g6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBiYWNrZ3JvdW5kcyovXHJcbiAgcHVibGljIGJhY2tncm91bmRzOiBBcHBsaWNhdGlvbkJhY2tncm91bmRbXTtcclxuXHJcbiAgLyoqIHNpdHVhdGlvbiBtYXAqL1xyXG4gIHB1YmxpYyBzaXR1YXRpb25NYXA6IENhcnRvZ3JhcGh5R3JvdXA7ICAgIFxyXG4gIFxyXG4gIC8qKiBwYXJhbWV0ZXJzKi9cclxuICBwdWJsaWMgcGFyYW1ldGVyczogQXBwbGljYXRpb25QYXJhbWV0ZXJbXTtcclxufVxyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJy4vYXBwbGljYXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIEFwcGxpY2F0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxBcHBsaWNhdGlvbj4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgYmFzZSBwYXRoICovXHJcbiAgcHVibGljIEFQSSA9ICcvYXBpJztcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBQTElDQVRJT05fQVBJID0gdGhpcy5BUEkgKyAnL2FwcGxpY2F0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEFwcGxpY2F0aW9uLCBcImFwcGxpY2F0aW9uc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgYXBwbGljYXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBBcHBsaWNhdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFwcGxpY2F0aW9uKi9cclxuICBzYXZlKGl0ZW06IEFwcGxpY2F0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGxldCBhcHBsaWNhdGlvblNpdHVhdGlvbk1hcCA9IGl0ZW0uc2l0dWF0aW9uTWFwO1xyXG5cclxuICAgIGlmIChpdGVtLnNpdHVhdGlvbk1hcCE9bnVsbCl7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLnNpdHVhdGlvbk1hcC5fbGlua3MhPSAndW5kZWZpbmVkJykgeyBcclxuICAgICAgICAgICAgaXRlbS5zaXR1YXRpb25NYXAgPSBpdGVtLnNpdHVhdGlvbk1hcC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcz0ge307XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5zaXR1YXRpb25NYXA7ICAgICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChhcHBsaWNhdGlvblNpdHVhdGlvbk1hcC5fbGlua3Muc2VsZi5ocmVmPT0nJyl7XHJcbiAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3NpdHVhdGlvbk1hcCcsYXBwbGljYXRpb25TaXR1YXRpb25NYXApLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgXHJcbiAgICAgICAgICAgICBcclxuICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgIFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NpdHVhdGlvbk1hcCcsYXBwbGljYXRpb25TaXR1YXRpb25NYXApLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICBcclxuICAgICAgXHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgICAgICAgICAgIFxyXG4gICAgICAgfSBcclxuICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG5cclxuICAgICAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMuQVBQTElDQVRJT05fQVBJICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICAgIFxyXG4gICAgXHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7QmFja2dyb3VuZH0gZnJvbSAnLi4vY2FydG9ncmFwaHkvYmFja2dyb3VuZC5tb2RlbCc7XHJcbmltcG9ydCB7QXBwbGljYXRpb259IGZyb20gJy4vYXBwbGljYXRpb24ubW9kZWwnOyBcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWNhdGlvbiBiYWNrZ3JvdW5kIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25CYWNrZ3JvdW5kIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBvcmRlciovXHJcbiAgcHVibGljIG9yZGVyOiBOdW1iZXI7XHJcbiAgXHJcbiAgLyoqIGJhY2tncm91bmQqL1xyXG4gIHB1YmxpYyBiYWNrZ3JvdW5kOiBCYWNrZ3JvdW5kO1xyXG4gIFxyXG4gIC8qKiBhcHBsaWNhdGlvbiovXHJcbiAgcHVibGljIGFwcGxpY2F0aW9uOiBBcHBsaWNhdGlvbjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb25CYWNrZ3JvdW5kIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBBcHBsaWNhdGlvbiBiYWNrZ3JvdW5kIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25CYWNrZ3JvdW5kU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEFwcGxpY2F0aW9uQmFja2dyb3VuZD4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgYmFzZSBwYXRoICovXHJcbiAgcHVibGljIEFQSSA9ICcvYXBpJztcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBQTElDQVRJT05fQkFDS0dST1VORF9BUEkgPSB0aGlzLkFQSSArICcvYXBwbGljYXRpb24tYmFja2dyb3VuZHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihBcHBsaWNhdGlvbkJhY2tncm91bmQsIFwiYXBwbGljYXRpb24tYmFja2dyb3VuZHNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGFwcGxpY2F0aW9uIGJhY2tncm91bmQqL1xyXG4gIHJlbW92ZShpdGVtOiBBcHBsaWNhdGlvbkJhY2tncm91bmQpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhcHBsaWNhdGlvbiBiYWNrZ3JvdW5kKi9cclxuICBzYXZlKGl0ZW06IEFwcGxpY2F0aW9uQmFja2dyb3VuZCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5hcHBsaWNhdGlvbiAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2FwcGxpY2F0aW9uJyxpdGVtLmFwcGxpY2F0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS5iYWNrZ3JvdW5kICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignYmFja2dyb3VuZCcsaXRlbS5iYWNrZ3JvdW5kKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uYXBwbGljYXRpb24gPSBpdGVtLmFwcGxpY2F0aW9uLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0uYmFja2dyb3VuZCA9IGl0ZW0uYmFja2dyb3VuZC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLkFQUExJQ0FUSU9OX0JBQ0tHUk9VTkRfQVBJICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbn0gZnJvbSAnLi9hcHBsaWNhdGlvbi5tb2RlbCc7IFxyXG5cclxuLyoqXHJcbiAqIEFwcGxpY2F0aW9uIHBhcmFtZXRlciBtb2RlbCBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvblBhcmFtZXRlciBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICBcclxuICAvKiogdmFsdWUqLyAgICBcclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICBcclxuICAvKiogYXBwbGljYXRpb24qL1xyXG4gIHB1YmxpYyBhcHBsaWNhdGlvbjogQXBwbGljYXRpb247XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uUGFyYW1ldGVyIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIEFwcGxpY2F0aW9uIHBhcmFtZXRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEFwcGxpY2F0aW9uUGFyYW1ldGVyPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSBiYXNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBJID0gJy9hcGknO1xyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUFBMSUNBVElPTl9QQVJBTUVURVJfQVBJID0gdGhpcy5BUEkgKyAnL2FwcGxpY2F0aW9uLXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihBcHBsaWNhdGlvblBhcmFtZXRlciwgXCJhcHBsaWNhdGlvbi1wYXJhbWV0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBhcHBsaWNhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IEFwcGxpY2F0aW9uUGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYXBwbGljYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogQXBwbGljYXRpb25QYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0uYXBwbGljYXRpb24gIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdhcHBsaWNhdGlvbicsaXRlbS5hcHBsaWNhdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmFwcGxpY2F0aW9uID0gaXRlbS5hcHBsaWNhdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLkFQUExJQ0FUSU9OX1BBUkFNRVRFUl9BUEkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIExheWVyIG1vZGVsOiBjb25maWd1cmUgTGF5ZXIgZGF0YSBhbmQgZGlzcGxheWluZyBjb25maWd1cmF0aW9uICovIFxyXG5leHBvcnQgY2xhc3MgTGF5ZXIge1xyXG4gIC8vIERpc3BsYXkgZGF0YVxyXG4gIC8qKiBsYXllciB2aXNpYmlsaXR5Ki8gIFxyXG4gIHZpc2liaWxpdHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAvKiogVHJhbnNwYXJlbmN5IChUcmFuc3BhcmVudCkgMC0xIChPcGFxdWUpKi9cclxuICBvcGFjaXR5OiBudW1iZXIgPSAxLjA7XHJcblxyXG4gIC8vIENvbmZpZ3VyYXRpb24gZGF0YVxyXG4gIC8qKiB0aXRsZSovXHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBcclxuICAvKiogSWQgdG8gaW5kZXgqL1xyXG4gIGlkOiBhbnk7XHJcbiAgXHJcbiAgLyoqIFNlcnZpY2UgTmFtZSovXHJcbiAgc2VydmVyTmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogU2VydmljZSBhdHRyaWJ1dGlvbnMqL1xyXG4gIGF0dHJpYnV0aW9uczogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgLyoqIFJlcXVlc3QgZm9ybWF0IChpbWFnZS9qcGcsIC4uLikqL1xyXG4gIGZvcm1hdDogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBSZXF1ZXN0IHNlcnZpY2UgdmVyc2lvbiovXHJcbiAgdmVyc2lvbjpzdHJpbmc7XHJcblxyXG4gIC8qKiBTZXJ2aWNlIHVybCovXHJcbiAgdXJsOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBJcyBiYXNlIGxheWVyPyovXHJcbiAgaXNCYXNlTGF5ZXI6IGJvb2xlYW47XHJcblxyXG4gIC8qKiBSZXF1ZXN0IGxheWVyIG5hbWUqL1xyXG4gIG5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIElzIHRpbGVkPyovXHJcbiAgdGlsZWQ6IGJvb2xlYW47XHJcbiAgXHJcbiAgLyoqIERlc2NyaXB0aW9uKi9cclxuICBkZXNjOiBzdHJpbmcgPSBcIlwiO1xyXG4gIFxyXG4gIC8qKiAgVHJhbnNwYXJlbnQgcmVxdWVzdCBwYXJhbWV0ZXI/Ki9cclxuICB1cmxfdHJhbnNwYXJlbnQ6IHN0cmluZyA9IFwidHJ1ZVwiO1xyXG4gIFxyXG4gIC8qKiBSZXF1ZXN0IEJhY2tncm91bmQgcGFyYW1ldGVyIGNvbG9yIChIZXhhKSovXHJcbiAgdXJsX2JnY29sb3I6IHN0cmluZyA9IFwiMHgwMDAwMDBcIjtcclxuICBcclxuICAvKiogUmVxdWVzdCBFeGNlcHRpb24gVVJMKi9cclxuICB1cmxfZXhjZXB0aW9uOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIEV4dGVudCBmb3IgdGlsZWQgc2VydmljZXMqL1xyXG4gIGV4dGVudDogYW55ID0gbnVsbDtcclxuXHJcbiAgLyoqIFRpbGUgaGVpZ2h0IChpZiBub3QgZGVmaW5lZCwgdGhlIGRlZmF1bHQgbWFwIGlzIHRha2VuKSovXHJcbiAgdGlsZUhlaWdodD86bnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBUaWxlIHdpZHRoIChpZiBub3QgZGVmaW5lZCwgdGhlIGRlZmF1bHQgbWFwIGlzIHRha2VuKSovXHJcbiAgdGlsZVdpZHRoPzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIEVuYWJsZWQgZm9yIEdldEZlYXR1cmVJbmZvIHJlcXVlc3RzIChlbmFibGVkIHRvIHVzZSB0aGUgdmlld2VyIGZlYXR1cmVzIGluZm9ybWF0aW9uIHRvb2wpKi9cclxuICBxdWVyeWFibGU/OmJvb2xlYW4gPSBmYWxzZTtcclxuICBcclxuICAvKiogTWluaW11bSBzY2FsZSovXHJcbiAgbWluaW11bVNjYWxlPzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIE1heGltdW0gc2NhbGUqL1xyXG4gIG1heGltdW1TY2FsZT86bnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBMaXN0IG9mIGF2YWlsYWJsZSBDUlMqL1xyXG4gIHByb2plY3Rpb25zPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIEZlYXR1cmVzIGluZm9ybWF0aW9uIFVSTCovXHJcbiAgaW5mb1VybD86c3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBNZXRhZGF0YSBpbmZvcm1hdGlvbiBVUkwqL1xyXG4gIG1ldGFkYXRhVXJsPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIExlZ2VuZCBVUkwqL1xyXG4gIGxlZ2VuZFVybD86c3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBBcnJheSBvZiBPcHRpb25hbFBhcmFtZXRlciBvYmplY3QgdGhhdCBkZWZpbmVzIG90aGVyIG9wdGlvbmFsIHBhcmFtZXRlci12YWx1ZSBwYWlycyBmb3IgdGhlIHJlcXVlc3QgKFRJTUUgLi4uKSovXHJcbiAgb3B0aW9uYWxQYXJhbWV0ZXJzPzpBcnJheTxPcHRpb25hbFBhcmFtZXRlcj47XHJcbn1cclxuXHJcbi8qKiBPcHRpb25hbCBwYXJhbWV0ZXIgbW9kZWw6IGNvbmZpZ3VyZSBwYXJhbWV0ZXItdmFsdWUgcGFpciB0byBhZGQgdG8gdGhlIHJlcXVlc3QgbGF5ZXIgVVJMICovXHJcbmV4cG9ydCBjbGFzcyBPcHRpb25hbFBhcmFtZXRlciB7XHJcbiAgLyoqIGtleSova2V5OnN0cmluZztcclxuICAvKiogdmFsdWUqL3ZhbHVlOnN0cmluZztcclxufVxyXG5cclxuLyoqIExheWVyIGNvbmZpZ3VyYXRpb24gbW9kZWw6IG1vZGlmeSB0aGUgY29uZmlndXJhdGlvbiBvZiBhIGxheWVyIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgbWFwIChtYWtlIHZpc2libGUsIG1vdmUgdGhlIGxheWVyIC4uLikgKi9cclxuZXhwb3J0IGNsYXNzIExheWVyQ29uZmlndXJhdGlvbiB7XHJcbiAgLyoqIElkZW50aWZpZXIgdG8gaW5kZXgqL2lkOiBhbnk7XHJcbiAgLyoqIExheWVyIHZpc2liaWxpdHkqL3Zpc2liaWxpdHk6IGJvb2xlYW47XHJcbiAgLyoqIExheWVyIHRyYW5zcGFyZW5jeSAoVHJhbnNwYXJlbnQpIDAtMSAoT3BhcXVlKSovb3BhY2l0eTogbnVtYmVyO1xyXG4gIC8qKiBMYXllciBwb3NpdGlvbiovcG9zaXRpb246IG51bWJlcjtcclxufVxyXG5cclxuLyoqIExheWVyIGdyb3VwIG1vZGVsKi9cclxuZXhwb3J0IGNsYXNzIExheWVyR3JvdXAge1xyXG4gIC8qKiBpbml0aWFsbHkgYWN0aXZhdGVkIChhbGwgdmlzaWJsZSBsYXllcnMpKi9hY3RpdmU/OmJvb2xlYW47XHJcbiAgLyoqIGdyb3VwIG5hbWUqL25hbWU/OiBTdHJpbmc7XHJcbiAgLyoqIGdyb3VwIGlkKi9pZDogU3RyaW5nO1xyXG4gIC8qKiBhcnJheSBvZiBjaGlsZCBMYXllcnMqL2xheWVyczogQXJyYXk8TGF5ZXI+O1xyXG59XHJcblxyXG4vKiogTWFwIG9wdGlvbnMgY29uZmlndXJhdGlvbiBtb2RlbCovXHJcbmV4cG9ydCBjbGFzcyBNYXBPcHRpb25zQ29uZmlndXJhdGlvbiB7XHJcbiAgLyoqIHNjYWxlcyovc2NhbGVzPzogc3RyaW5nO1xyXG4gIC8qKiBwcm9qZWN0aW9ucyovcHJvamVjdGlvbnM/OiBzdHJpbmc7XHJcbiAgLyoqIG1pbmltdW0gc2NhbGUqL21pblNjYWxlPzpudW1iZXI7XHJcbiAgLyoqIG1heGltdW0gc2NhbGUqL21heFNjYWxlPzpudW1iZXI7XHJcbiAgLyoqIGV4dGVudCovZXh0ZW50Pzphbnk7XHJcbiAgLyoqIG1heGltdW0gZXh0ZW50Ki9tYXhFeHRlbnQ/OmFueTtcclxuICAvKiogdGlsZSB3aWR0aCovdGlsZVdpZHRoPzpudW1iZXI7XHJcbiAgLyoqIHRpbGUgaGVpZ2h0Ki90aWxlSGVpZ2h0PzpudW1iZXI7XHJcbiAgLyoqIHBhcmFtZXRlcnMqL3BhcmFtZXRlcnM/OiBBcnJheTxPcHRpb25hbFBhcmFtZXRlcj5cclxufVxyXG5cclxuLyoqIE1hcCBjb21wb25lbnQgc3RhdHVzIG1vZGVsKi9cclxuZXhwb3J0IGNsYXNzIE1hcENvbXBvbmVudFN0YXR1cyB7XHJcbiAgICAvKiogbG9hZGVkPyovbG9hZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuXHJcbi8qKiBNYXAgY29uZmlndXJhdGlvbiBtYW5hZ2VyIHNlcnZpY2UqL1xyXG5leHBvcnQgY2xhc3MgTWFwQ29uZmlndXJhdGlvbk1hbmFnZXJTZXJ2aWNlIHtcclxuICBwcml2YXRlIGxheWVyc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIGxheWVyczogQXJyYXk8TGF5ZXI+ID0gbnVsbDtcclxuXHJcbiAgcHJpdmF0ZSBiYXNlTGF5ZXJHcm91cHNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgcHJpdmF0ZSBiYXNlTGF5ZXJHcm91cHM6IEFycmF5PExheWVyR3JvdXA+ID0gbnVsbDtcclxuXHJcbiAgcHJpdmF0ZSBsYXllckNvbmZpZ3VyYXRpb25TdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcblxyXG4gIHByaXZhdGUgYWRkTGF5ZXJzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG4gIHByaXZhdGUgcmVtb3ZlTGF5ZXJzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG5cclxuICBwcml2YXRlIHNpdHVhdGlvbk1hcENvbmZpZ3VyYXRpb25TdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgcHJpdmF0ZSBtYXBPcHRpb25zQ29uZmlndXJhdGlvblN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgcHJpdmF0ZSBtYXBDb21wb25lbnRTdGF0dXNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciovXHJcbiAgY29uc3RydWN0b3IoKSB7IFxyXG4gICAvL1xyXG4gIH1cclxuICBcclxuICAvKiogbGF5ZXIgY291bnQgKi9cclxuICBjb3VudCA9IDA7XHJcblxyXG4gIC8qKiBjb25maWd1cmUgdGhlIG92ZXJsYXkgbGF5ZXJzIG9mIHRoZSBtYXAsIGJ5IHBhc3NpbmcgYXMgYSBwYXJhbWV0ZXIgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvZiB0eXBlIExheWVyIG9iamVjdHMgZGVmaW5pbmcgdGhlIGxheWVycyB0byBsb2FkLiovXHJcbiAgbG9hZExheWVyc0NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikge1xyXG4gICAgaWYgKHRoaXMubGF5ZXJzICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5jbGVhckxheWVycyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNldExheWVycyhjb25maWd1cmF0aW9uKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqY29uZmlndXJlIHRoZSBiYXNlIGxheWVycyBvZiB0aGUgbWFwIGJ5IHBhc3NpbmcgYXMgYSBwYXJhbWV0ZXIgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvZiB0eXBlIExheWVyR3JvdXAgZWFjaCBvZiB0aGVtIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgTGF5ZXIgb2JqZWN0cyBkZWZpbmluZyB0aGUgbGF5ZXJzIHRvIGxvYWQuKi9cclxuICBsb2FkQmFzZUxheWVyc0NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikge1xyXG4gICAgdGhpcy5zZXRCYXNlTGF5ZXJHcm91cHMoY29uZmlndXJhdGlvbik7XHJcbiAgfVxyXG5cclxuICAvKiogZ2V0IGJhc2UgbGF5ZXIgZ3JvdXBzKi9cclxuICBnZXRCYXNlTGF5ZXJHcm91cHMoKTogT2JzZXJ2YWJsZTxMYXllckdyb3VwW10+IHtcclxuICAgIHJldHVybiB0aGlzLmJhc2VMYXllckdyb3Vwc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogc2V0IGJhc2UgbGF5ZXIgZ3JvdXBzKi9cclxuICBzZXRCYXNlTGF5ZXJHcm91cHMoZ3JvdXBzOkFycmF5PExheWVyR3JvdXA+KSB7XHJcbiAgICB0aGlzLmJhc2VMYXllckdyb3VwcyA9IGdyb3VwcztcclxuICAgIHRoaXMucmVmcmVzaEJhc2VMYXllckdyb3VwcygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoQmFzZUxheWVyR3JvdXBzKCkge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5iYXNlTGF5ZXJHcm91cHNTdWJqZWN0Lm5leHQodGhpcy5iYXNlTGF5ZXJHcm91cHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGdldCBsYXllcnMqL1xyXG4gIGdldExheWVycygpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLmxheWVyc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIGFsbCBsYXllcnMgZnJvbSBtYXAqL1xyXG4gIGNsZWFyTGF5ZXJzKHJlZnJlc2g6Ym9vbGVhbikge1xyXG4gICAgd2hpbGUodGhpcy5sYXllcnMubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMubGF5ZXJzLnBvcCgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHJlZnJlc2gpIHtcclxuICAgICAgdGhpcy5yZWZyZXNoTGF5ZXJzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogc2V0IGxheWVycyovXHJcbiAgc2V0TGF5ZXJzKGxheWVyczpBcnJheTxMYXllcj4pIHtcclxuICAgIHRoaXMubGF5ZXJzID0gbGF5ZXJzO1xyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJzKCk7XHJcbiAgfVxyXG5cclxuICAvKiogYWRkIGdpdmVuIGxheWVyIHRvIG1hcCovXHJcbiAgYWRkTGF5ZXIobGF5ZXI6TGF5ZXIpIHtcclxuICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xyXG4gICAgdGhpcy5yZWZyZXNoQWRkTGF5ZXJzKGxheWVyKTtcclxuICB9XHJcblxyXG4gIC8qKiBhZGQgZ2l2ZW4gbGF5ZXIgdG8gbWFwIGF0IGdpdmVuIGluZGV4Ki9cclxuICBhZGRMYXllckF0KGxheWVyOkxheWVyLCBpbmRleDpudW1iZXIpIHtcclxuICAgIGlmIChpbmRleCA9PSAwKSB7XHJcbiAgICAgIHRoaXMubGF5ZXJzID0gW2xheWVyXS5jb25jYXQodGhpcy5sYXllcnMpO1xyXG4gICAgfSBlbHNlIGlmIChpbmRleCA+PSB0aGlzLmxheWVycy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxheWVycyA9IHRoaXMubGF5ZXJzLnNsaWNlKDAsIGluZGV4KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jb25jYXQoW2xheWVyXSlcclxuICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHRoaXMubGF5ZXJzLnNsaWNlKGluZGV4LCB0aGlzLmxheWVycy5sZW5ndGgpKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVmcmVzaEFkZExheWVycyhsYXllcik7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24obGF5ZXIuaWQsIG51bGwsIG51bGwsIGluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgZ2l2ZW4gbGF5ZXIgZnJvbSBtYXAqL1xyXG4gIHJlbW92ZUxheWVyKGxheWVyOkxheWVyKSB7XHJcbiAgICB2YXIgaW5kZXggPSB0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKTtcclxuICAgIHRoaXMucmVtb3ZlTGF5ZXJJbmRleChpbmRleCk7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIGxheWVyIHdpdGggZ2l2ZW4gaWQgZnJvbSBtYXAgKi9cclxuICByZW1vdmVMYXllcklkKGlkKSB7XHJcbiAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gdGhpcy5sYXllcnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLmxheWVyc1tpXS5pZCA9PSBpZCkge1xyXG4gICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5yZW1vdmVMYXllckluZGV4KGluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgbGF5ZXIgYXQgZ2l2ZW4gaW5kZXggZnJvbSBtYXAgKi9cclxuICByZW1vdmVMYXllckluZGV4KGluZGV4Om51bWJlcikge1xyXG4gICAgdmFyIGxheWVyID0gdGhpcy5sYXllcnNbaW5kZXhdO1xyXG4gICAgdGhpcy5sYXllcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIHRoaXMucmVmcmVzaFJlbW92ZUxheWVycyhsYXllcik7XHJcbiAgfVxyXG5cclxuICAvKiogcmVmcmVzaCBsYXllcnMgKi9cclxuICBwcml2YXRlIHJlZnJlc2hMYXllcnMoKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLmxheWVyc1N1YmplY3QubmV4dCh0aGlzLmxheWVycyk7XHJcbiAgfVxyXG5cclxuICAvKiogT2JzZXJ2YWJsZSBmb3IgbGF5ZXJzIGFkZGVkICovXHJcbiAgZ2V0TGF5ZXJzQWRkZWQoKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5hZGRMYXllcnNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoQWRkTGF5ZXJzKGxheWVyOkxheWVyKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLmFkZExheWVyc1N1YmplY3QubmV4dChbbGF5ZXJdKTtcclxuICB9XHJcblxyXG4gIGdldExheWVyc1JlbW92ZWQoKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5yZW1vdmVMYXllcnNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoUmVtb3ZlTGF5ZXJzKGxheWVyOkxheWVyKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLnJlbW92ZUxheWVyc1N1YmplY3QubmV4dChbbGF5ZXJdKTtcclxuICB9XHJcblxyXG4gIGdldExheWVyQ29uZmlndXJhdGlvbkxpc3RlbmVyKCk6IE9ic2VydmFibGU8TGF5ZXJDb25maWd1cmF0aW9uW10+IHtcclxuICAgIHJldHVybiB0aGlzLmxheWVyQ29uZmlndXJhdGlvblN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldExheWVySW5kZXhCeUlkKGlkOnN0cmluZyk6bnVtYmVye1xyXG4gICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IHRoaXMubGF5ZXJzLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5sYXllcnNbaV0uaWQgPT0gaWQpIHtcclxuICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBpbmRleDtcclxuICB9XHJcbiAgXHJcbiAgLyoqIG1vdmUgbGF5ZXIgd2l0aCBnaXZlbiBpZCB0byB0aGUgZ2l2ZW4gaW5kZXgqL1xyXG4gIG1vdmVMYXllcihpZCwgaW5kZXgpIHtcclxuICAgIHZhciBsYXllckluZGV4ID0gdGhpcy5nZXRMYXllckluZGV4QnlJZChpZCk7XHJcbiAgICBpZiAobGF5ZXJJbmRleCAhPSAtMSkge1xyXG4gICAgICB2YXIgbGF5ZXIgPSB0aGlzLmxheWVycy5zcGxpY2UobGF5ZXJJbmRleCwgMSk7XHJcbiAgICAgIHRoaXMubGF5ZXJzID0gXHJcbiAgICAgICAgdGhpcy5sYXllcnMuc2xpY2UoMCwgaW5kZXgpXHJcbiAgICAgICAgLmNvbmNhdChsYXllcilcclxuICAgICAgICAuY29uY2F0KHRoaXMubGF5ZXJzLnNsaWNlKGluZGV4LCB0aGlzLmxheWVycy5sZW5ndGgpKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihpZCwgbnVsbCwgbnVsbCwgaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGNoYW5nZSB2aXNpYmlsaXR5IG9mIGxheWVyIHdpdGggZ2l2ZW4gaWQgdG8gdGhlIGdpdmVuIHZhbHVlKi9cclxuICBjaGFuZ2VMYXllclZpc2liaWxpdHkoaWQsIHZpc2liaWxpdHkpIHtcclxuICAgIHRoaXMucmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihpZCwgbnVsbCwgdmlzaWJpbGl0eSwgbnVsbCk7XHJcbiAgfVxyXG5cclxuICAvKiogY2hhbmdlIG9wYWNpdHkgb2YgbGF5ZXIgd2l0aCBnaXZlbiBpZCB0byB0aGUgZ2l2ZW4gdmFsdWUqL1xyXG4gIGNoYW5nZUxheWVyT3BhY2l0eShpZCwgb3BhY2l0eSkge1xyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBvcGFjaXR5LCBudWxsLCBudWxsKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihpZCwgb3BhY2l0eSwgdmlzaWJpbGl0eSwgcG9zaXRpb24pIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHZhciBsYXllciA9IG5ldyBMYXllckNvbmZpZ3VyYXRpb24oKTtcclxuICAgIGxheWVyLmlkID0gaWQ7XHJcbiAgICBsYXllci5vcGFjaXR5ID0gb3BhY2l0eTtcclxuICAgIGxheWVyLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xyXG4gICAgbGF5ZXIucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgIHRoaXMubGF5ZXJDb25maWd1cmF0aW9uU3ViamVjdC5uZXh0KFtsYXllcl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvbkxpc3RlbmVyKCk6IE9ic2VydmFibGU8TGF5ZXJbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvblN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogY29uZmlndXJlIHRoZSBzaXR1YXRpb24gbWFwIG9mIHRoZSBtYXAgY29tcG9uZW50IGJ5IHBhc3NpbmcgYXMgYSBwYXJhbWV0ZXIgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvZiB0eXBlIExheWVyR3JvdXAsIGVhY2ggb2YgdGhlbSB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIExheWVyIG9iamVjdHMgZGVmaW5pbmcgdGhlIGxheWVycyB0byBsb2FkIGFzIHNpdHVhdGlvbiBtYXAuKi9cclxuICBsb2FkU2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvbihsYXllcnM6QXJyYXk8TGF5ZXI+KSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLnNpdHVhdGlvbk1hcENvbmZpZ3VyYXRpb25TdWJqZWN0Lm5leHQobGF5ZXJzKTtcclxuICB9XHJcblxyXG4gIGdldE1hcE9wdGlvbnNDb25maWd1cmF0aW9uTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxNYXBPcHRpb25zQ29uZmlndXJhdGlvbltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXBPcHRpb25zQ29uZmlndXJhdGlvblN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogbG9hZCBtYXAgb3B0aW9ucyBjb25maWd1cmF0aW9uICovXHJcbiAgbG9hZE1hcE9wdGlvbnNDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb246TWFwT3B0aW9uc0NvbmZpZ3VyYXRpb24pIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMubWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25TdWJqZWN0Lm5leHQoW2NvbmZpZ3VyYXRpb25dKTtcclxuICB9XHJcblxyXG4gIGdldE1hcENvbXBvbmVudFN0YXR1c0xpc3RlbmVyKCk6IE9ic2VydmFibGU8TWFwQ29tcG9uZW50U3RhdHVzW10+IHtcclxuICAgIHJldHVybiB0aGlzLm1hcENvbXBvbmVudFN0YXR1c1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzZXQgbWFwIGNvbXBvbmVudCBzdGF0dXMgKi9cclxuICBzZXRNYXBDb21wb25lbnRTdGF0dXMoc3RhdHVzOk1hcENvbXBvbmVudFN0YXR1cykge1xyXG4gICAgLy9Ob3RpZnkgdGhlIG1hcCBjb21wb25lbnQgc3RhdHVzXHJcbiAgICB0aGlzLm1hcENvbXBvbmVudFN0YXR1c1N1YmplY3QubmV4dChbc3RhdHVzXSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBAd2hhdEl0RG9lcyBDb25kaXRpb25hbGx5IGluY2x1ZGVzIGFuIEhUTUwgZWxlbWVudCBpZiBjdXJyZW50IHVzZXIgaGFzIGFueVxyXG4gKiBvZiB0aGUgYXV0aG9yaXRpZXMgcGFzc2VkIGFzIHRoZSBgZXhwcmVzc2lvbmAuXHJcbiAqXHJcbiAqIEBob3dUb1VzZVxyXG4gKiBgYGBcclxuICogICAgIDxzb21lLWVsZW1lbnQgKnNpdG11bkhhc0FueUF1dGhvcml0eT1cIidST0xFX0FETUlOJ1wiPi4uLjwvc29tZS1lbGVtZW50PlxyXG4gKlxyXG4gKiAgICAgPHNvbWUtZWxlbWVudCAqc2l0bXVuSGFzQW55QXV0aG9yaXR5PVwiWydST0xFX0FETUlOJywgJ1JPTEVfVVNFUiddXCI+Li4uPC9zb21lLWVsZW1lbnQ+XHJcbiAqIGBgYFxyXG4gKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1tzaXRtdW5IYXNBbnlBdXRob3JpdHldJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlIHtcclxuICAgIFxyXG4gICAgLyoqIGF1dGhvcml0aWVzIHRvIGNoZWNrICovXHJcbiAgICBwdWJsaWMgYXV0aG9yaXRpZXM6IHN0cmluZ1tdOyBcclxuICAgIFxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsLCBwcml2YXRlIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+LCBwcml2YXRlIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHRlcnJpdG9yeSB0byBjaGVjayBhdXRob3JpdGllcyovXHJcbiAgICBASW5wdXQoKSB0ZXJyaXRvcnk6IHN0cmluZztcclxuICAgIFxyXG4gICAgLyoqIFNldCB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyAqL1xyXG4gICAgQElucHV0KClcclxuICAgIHNldCBzaXRtdW5IYXNBbnlBdXRob3JpdHkodmFsdWU6IHN0cmluZ3xzdHJpbmdbXSkge1xyXG4gICAgICAgIHRoaXMuYXV0aG9yaXRpZXMgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gWyA8c3RyaW5nPiB2YWx1ZSBdIDogPHN0cmluZ1tdPiB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcclxuICAgICAgICAvLyBHZXQgbm90aWZpZWQgZWFjaCB0aW1lIGF1dGhlbnRpY2F0aW9uIHN0YXRlIGNoYW5nZXMuXHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuZ2V0QXV0aGVudGljYXRpb25TdGF0ZSgpLnN1YnNjcmliZSgoaWRlbnRpdHkpID0+IHRoaXMudXBkYXRlVmlldygpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHVwZGF0ZSB2aWV3ICovXHJcbiAgICBwcml2YXRlIHVwZGF0ZVZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMudGVycml0b3J5KXtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeSh0aGlzLmF1dGhvcml0aWVzLHRoaXMudGVycml0b3J5KS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHkodGhpcy5hdXRob3JpdGllcykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIEB3aGF0SXREb2VzIENvbmRpdGlvbmFsbHkgaW5jbHVkZXMgYW4gSFRNTCBlbGVtZW50IGlmIGN1cnJlbnQgdXNlciBoYXMgYW55XHJcbiAqIG9mIHRoZSBhdXRob3JpdGllcyBwYXNzZWQgYXMgdGhlIGBleHByZXNzaW9uYC5cclxuICpcclxuICogQGhvd1RvVXNlXHJcbiAqIGBgYFxyXG4gKiAgICAgPHNvbWUtZWxlbWVudCAqc2l0bXVuSGFzQW55QXV0aG9yaXR5PVwiJ1JPTEVfQURNSU4nXCI+Li4uPC9zb21lLWVsZW1lbnQ+XHJcbiAqXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCJbJ1JPTEVfQURNSU4nLCAnUk9MRV9VU0VSJ11cIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICogYGBgXHJcbiAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3NpdG11bkhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5XSdcclxufSlcclxuZXhwb3J0IGNsYXNzIEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlIHtcclxuXHJcbiAgICAvKiogYXV0aG9yaXRpZXMgdG8gY2hlY2sgKi9cclxuICAgIHB1YmxpYyBhdXRob3JpdGllczogc3RyaW5nW107IFxyXG5cclxuICAgIC8qKiB0ZXJyaXRvcnkgdG8gY2hlY2sgYXV0aG9yaXRpZXMqL1xyXG4gICAgcHVibGljIHRlcnJpdG9yeTogc3RyaW5nOyBcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWwsIHByaXZhdGUgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4sIHByaXZhdGUgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogU2V0IHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIG9uIHRlcnJpdG9yeSAqL1xyXG4gICAgQElucHV0KClcclxuICAgIHNldCBzaXRtdW5IYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeShvcHRzOiBhbnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hdXRob3JpdGllcyA9IHR5cGVvZiBvcHRzLmF1dGhvcml0aWVzID09PSAnc3RyaW5nJyA/IFsgPHN0cmluZz4gb3B0cy5hdXRob3JpdGllcyBdIDogPHN0cmluZ1tdPiBvcHRzLmF1dGhvcml0aWVzO1xyXG4gICAgICAgIHRoaXMudGVycml0b3J5ID0gb3B0cy50ZXJyaXRvcnk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7XHJcbiAgICAgICAgLy8gR2V0IG5vdGlmaWVkIGVhY2ggdGltZSBhdXRoZW50aWNhdGlvbiBzdGF0ZSBjaGFuZ2VzLlxyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmdldEF1dGhlbnRpY2F0aW9uU3RhdGUoKS5zdWJzY3JpYmUoKGlkZW50aXR5KSA9PiB0aGlzLnVwZGF0ZVZpZXcoKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiB1cGRhdGUgdmlldyAqL1xyXG4gICAgcHJpdmF0ZSB1cGRhdGVWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnRlcnJpdG9yeSl7XHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuaGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnkodGhpcy5hdXRob3JpdGllcyx0aGlzLnRlcnJpdG9yeSkudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuaGFzQW55QXV0aG9yaXR5KHRoaXMuYXV0aG9yaXRpZXMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50TW9kdWxlLCBIVFRQX0lOVEVSQ0VQVE9SUywgSHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG4vL2ltcG9ydCB7IEFuZ3VsYXJIYWxNb2R1bGUgfSBmcm9tICcuLi8uLi9saWIvYW5ndWxhci1oYWwnO1xyXG5cclxuaW1wb3J0IHtUZXJyaXRvcnlTZXJ2aWNlfSBmcm9tICcuL3RlcnJpdG9yeS90ZXJyaXRvcnkuc2VydmljZSc7XHJcbmltcG9ydCB7VGVycml0b3J5VHlwZVNlcnZpY2V9IGZyb20gJy4vdGVycml0b3J5L3RlcnJpdG9yeS10eXBlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJQb3NpdGlvblNlcnZpY2V9IGZyb20gJy4vdXNlci91c2VyLXBvc2l0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJDb25maWd1cmF0aW9uU2VydmljZX0gZnJvbSAnLi91c2VyL3VzZXItY29uZmlndXJhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtSb2xlU2VydmljZX0gZnJvbSAnLi9yb2xlL3JvbGUuc2VydmljZSc7XHJcbmltcG9ydCB7VXNlclNlcnZpY2V9IGZyb20gJy4vdXNlci91c2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0Nvbm5lY3Rpb25TZXJ2aWNlfSBmcm9tICcuL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2suc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1R5cGVTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay10eXBlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tHcm91cFNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLWdyb3VwLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tQYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza0F2YWlsYWJpbGl0eVNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLWF2YWlsYWJpbGl0eS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrVUlTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay11aS5zZXJ2aWNlJztcclxuaW1wb3J0IHtTZXJ2aWNlU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlL3NlcnZpY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7U2VydmljZVBhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vc2VydmljZS9zZXJ2aWNlLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeVNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHkuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlBdmFpbGFiaWxpdHlTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUdyb3VwU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5zZXJ2aWNlJztcclxuaW1wb3J0IHtCYWNrZ3JvdW5kU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyZWVTZXJ2aWNlfSBmcm9tICcuL3RyZWUvdHJlZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmVlTm9kZVNlcnZpY2V9IGZyb20gJy4vdHJlZS90cmVlLW5vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25TZXJ2aWNlfSBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25CYWNrZ3JvdW5kU2VydmljZX0gZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXBDb25maWd1cmF0aW9uTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL21hcC9tYXAtY29uZmlndXJhdGlvbi1tYW5hZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC9hdXRoLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL2F1dGgvcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoSW50ZXJjZXB0b3IgfSBmcm9tICcuL2F1dGgvYXV0aC5pbnRlcmNlcHRvcic7XHJcbmltcG9ydCB7IEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IgfSBmcm9tICcuL2F1dGgvYXV0aC1leHBpcmVkLmludGVyY2VwdG9yJztcclxuaW1wb3J0IHsgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlIH0gZnJvbSAnLi9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlIH0gZnJvbSAnLi9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LW9uLXRlcnJpdG9yeS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBMb2dpblNlcnZpY2UgfSBmcm9tICcuL2F1dGgvbG9naW4uc2VydmljZSc7XHJcbmltcG9ydCB7IEFjY291bnRTZXJ2aWNlIH0gZnJvbSAnLi9hY2NvdW50L2FjY291bnQuc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJQb3NpdGlvbn0gZnJvbSAnLi91c2VyL3VzZXItcG9zaXRpb24ubW9kZWwnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUh0dHBMb2FkZXJ9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2h0dHAtbG9hZGVyJztcclxuaW1wb3J0IHtUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZU1vZHVsZX0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcblxyXG4vKiogbG9hZCBpMThuIGFzc2V0cyovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2xhdGVMb2FkZXIoaHR0cDogSHR0cENsaWVudCkge1xyXG4gIHJldHVybiBuZXcgVHJhbnNsYXRlSHR0cExvYWRlcihodHRwLCAnLi9hc3NldHMvaTE4bi8nLCAnLmpzb24nKTtcclxufVxyXG5cclxuXHJcbi8qKiBTSVRNVU4gZnJvbnRlbmQgY29yZSBtb2R1bGUgKi9cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICAvKlJvdXRlck1vZHVsZSxcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBBbmd1bGFySGFsTW9kdWxlLCovXHJcbiAgICBUcmFuc2xhdGVNb2R1bGUuZm9yUm9vdCh7XHJcbiAgICAgIGxvYWRlcjoge1xyXG4gICAgICAgIHByb3ZpZGU6IFRyYW5zbGF0ZUxvYWRlcixcclxuICAgICAgICB1c2VGYWN0b3J5OiAoY3JlYXRlVHJhbnNsYXRlTG9hZGVyKSxcclxuICAgICAgICBkZXBzOiBbSHR0cENsaWVudF1cclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIEhhc0FueUF1dGhvcml0eURpcmVjdGl2ZSxcclxuICAgIEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUsXHJcbiAgICBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSxcclxuICAgIFRyYW5zbGF0ZU1vZHVsZVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFNpdG11bkZyb250ZW5kQ29yZU1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBUZXJyaXRvcnlTZXJ2aWNlLFxyXG4gICAgICAgIFRlcnJpdG9yeVR5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFJvbGVTZXJ2aWNlLFxyXG4gICAgICAgIEFjY291bnRTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhTZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJTZXJ2aWNlLFxyXG4gICAgICAgIENvbm5lY3Rpb25TZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tUeXBlU2VydmljZSxcclxuICAgICAgICBUYXNrVUlTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tHcm91cFNlcnZpY2UsXHJcbiAgICAgICAgVGFza1BhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgVGFza0F2YWlsYWJpbGl0eVNlcnZpY2UsXHJcbiAgICAgICAgU2VydmljZVNlcnZpY2UsXHJcbiAgICAgICAgU2VydmljZVBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5U2VydmljZSxcclxuICAgICAgICBCYWNrZ3JvdW5kU2VydmljZSxcclxuICAgICAgICBUcmVlU2VydmljZSxcclxuICAgICAgICBUcmVlTm9kZVNlcnZpY2UsXHJcbiAgICAgICAgQXBwbGljYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIEFwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBBcHBsaWNhdGlvbkJhY2tncm91bmRTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhJbnRlcmNlcHRvcixcclxuICAgICAgICBBdXRoRXhwaXJlZEludGVyY2VwdG9yLFxyXG4gICAgICAgIFByaW5jaXBhbCxcclxuICAgICAgICBVc2VyUG9zaXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJDb25maWd1cmF0aW9uU2VydmljZSxcclxuICAgICAgICBMb2dpblNlcnZpY2UsXHJcbiAgICAgICAgTWFwQ29uZmlndXJhdGlvbk1hbmFnZXJTZXJ2aWNlLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxyXG4gICAgICAgICAgdXNlQ2xhc3M6IEF1dGhJbnRlcmNlcHRvcixcclxuICAgICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgICwge1xyXG4gICAgICAgICAgcHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXHJcbiAgICAgICAgICB1c2VDbGFzczogQXV0aEV4cGlyZWRJbnRlcmNlcHRvcixcclxuICAgICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cENsaWVudE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0hhbFBhcmFtLCBSZXN0U2VydmljZX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge0V4dGVybmFsU2VydmljZX0gZnJvbSAnLi9leHRlcm5hbC5zZXJ2aWNlJztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5cclxuaW1wb3J0ICdyeGpzJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL2NvbmNhdCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9kZWZlcic7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9lbXB0eSc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9mcm9tJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL2Zyb21FdmVudCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9tZXJnZSc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9vZic7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS90aW1lcic7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvY29uY2F0TWFwJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9kbyc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvZXhwYW5kJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9maWx0ZXInO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL2ZpcnN0JztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9sZXQnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvbWVyZ2VNYXAnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3B1Ymxpc2hSZXBsYXknO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3JlZHVjZSc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3Ivc2hhcmUnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3N3aXRjaE1hcCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvdGFrZSc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvdGFrZVdoaWxlJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL3Rocm93JztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9jYXRjaCc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuXHJcbmV4cG9ydCB7RXh0ZXJuYWxTZXJ2aWNlfSBmcm9tICcuL2V4dGVybmFsLnNlcnZpY2UnO1xyXG5leHBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmV4cG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5leHBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5leHBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmV4cG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuZXhwb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb259IGZyb20gJy4vRXh0ZXJuYWxDb25maWd1cmF0aW9uJztcclxuZXhwb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlfSBmcm9tICcuL2V4dGVybmFsLWNvbmZpZ3VyYXRpb24uaGFuZGxlcic7XHJcbmV4cG9ydCB7SGFsT3B0aW9ucywgSGFsUGFyYW19IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuZXhwb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5cclxuXHJcbi8qKiBBbmd1bGFyIEhBTCBtb2R1bGUgKi9cclxuQE5nTW9kdWxlKHtcclxuICAgIGltcG9ydHM6IFtIdHRwQ2xpZW50TW9kdWxlXSxcclxuICAgIGRlY2xhcmF0aW9uczogW10sXHJcbiAgICBleHBvcnRzOiBbSHR0cENsaWVudE1vZHVsZV0sXHJcbiAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBFeHRlcm5hbFNlcnZpY2UsXHJcbiAgICAgICAgSHR0cENsaWVudCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb3ZpZGU6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgdXNlQ2xhc3M6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgZGVwczogW0V4dGVybmFsU2VydmljZV1cclxuICAgICAgICB9XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQW5ndWxhckhhbE1vZHVsZSB7XHJcbiAgICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuZ01vZHVsZTogQW5ndWxhckhhbE1vZHVsZSxcclxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgICAgICAgICBFeHRlcm5hbFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGU6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VDbGFzczogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcHM6IFtFeHRlcm5hbFNlcnZpY2VdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59Il19