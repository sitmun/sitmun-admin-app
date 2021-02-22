import { throwError, of, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { parse } from 'url';
import { HttpHeaders, HttpParams, HttpClient, HttpErrorResponse, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { isNullOrUndefined, isPrimitive } from 'util';
import { Injectable, Inject, Injector, Directive, Input, TemplateRef, ViewContainerRef, NgModule, defineInjectable, inject, INJECTOR } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { Router } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

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
     * @param {?=} embeddedName
     * @return {?}
     */
    static instantiateResourceCollection(type, payload, result, builder, embeddedName) {
        for (const embeddedClassName of Object.keys(payload[result._embedded])) {
            if (!embeddedName || (embeddedName && embeddedClassName == embeddedName)) {
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
     * @param {?=} embeddedName
     * @return {?}
     */
    getAll(type, resource, _embedded, options, subType, embeddedName) {
        /** @type {?} */
        const uri = this.getResourceUrl(resource).concat('?projection=view');
        /** @type {?} */
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        /** @type {?} */
        const result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        result.sortInfo = options ? options.sort : undefined;
        /** @type {?} */
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result, subType, embeddedName)), catchError(error => throwError(error)));
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
        const uri = this.getResourceUrl(resource).concat('/', id, '?projection=view');
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
     * update resource from a given entity data
     * @template T
     * @param {?} resourceArray
     * @param {?} resourceLink
     * @return {?}
     */
    updateCollection(resourceArray, resourceLink) {
        /** @type {?} */
        const uri = ResourceHelper.getProxy(resourceLink);
        /** @type {?} */
        var headersReq = ResourceHelper.headers;
        headersReq.set("Content-Type", "text/uri-list");
        /** @type {?} */
        let observable = ResourceHelper.getHttp().put(uri, resourceArray, { headers: headersReq, observe: 'response' });
        return observable.pipe(map((response) => {
            if (response.status >= 200 && response.status <= 207)
                return "";
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
     * @param {?=} embeddedName
     * @return {?}
     */
    getAll(options, subType, embeddedName) {
        return this.resourceService.getAll(this.type, this.resource, this._embedded, options, subType, embeddedName).pipe(mergeMap((resourceArray) => {
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
         * API resource path
         */
        this.ACCOUNT_API = 'account';
    }
    /**
     * get logged in user account
     * @return {?}
     */
    get() {
        /** @type {?} */
        let result;
        result = this.http.get(this.resourceService.getResourceUrl(this.ACCOUNT_API));
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
        result = this.http.post(this.resourceService.getResourceUrl(this.ACCOUNT_API), item);
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
        result = this.http.post(this.resourceService.getResourceUrl(this.ACCOUNT_API + "/change-password"), item);
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
     * @param {?} resourceService
     */
    constructor(http, resourceService) {
        this.http = http;
        this.resourceService = resourceService;
        /**
         * API resource path
         */
        this.AUTH_API = 'authenticate';
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
        return this.http.post(this.resourceService.getResourceUrl(this.AUTH_API), data, { observe: 'response' }).map(authenticateSuccess.bind(this));
        /**
         * @param {?} resp
         * @return {?}
         */
        function authenticateSuccess(resp) {
            if (resp.ok) {
                /** @type {?} */
                const jwt = resp.body.id_token;
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
AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(ɵngcc0.ɵɵinject(ɵngcc1.HttpClient), ɵngcc0.ɵɵinject(ResourceService)); };
AuthService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac });
/** @nocollapse */
AuthService.ctorParameters = () => [
    { type: HttpClient },
    { type: ResourceService }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AuthService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc1.HttpClient }, { type: ResourceService }]; }, null); })();

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
         * API resource path
         */
        this.USER_API = 'users';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.USER_API), item);
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
        result = this.http.post(this.resourceService.getResourceUrl(this.USER_API + "/" + id + "/change-password"), item);
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
         * API resource path
         */
        this.USER_POSITION_API = 'user-positions';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.USER_POSITION_API), item);
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
         * API resource path
         */
        this.USER_CONFIGURATION_API = 'user-configurations';
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
            if (item.roleChildren != null) {
                item.substituteRelation('roleChildren', item.roleChildren).subscribe(result => {
                }, error => console.error(error));
            }
        }
        else {
            item.territory = item.territory._links.self.href;
            item.role = item.role != null ? item.role._links.self.href : null;
            item.user = item.user._links.self.href;
            item.roleChildren = item.roleChildren != null ? item.roleChildren._links.self.href : null;
            result = this.http.post(this.resourceService.getResourceUrl(this.USER_CONFIGURATION_API), item);
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
         * API resource path
         */
        this.TERRITORY_API = 'territories';
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
        /** @type {?} */
        let territoryGroupType = {};
        territoryGroupType._links = {};
        territoryGroupType._links.self = {};
        territoryGroupType._links.self.href = "";
        if (item.groupType != null) {
            territoryGroupType = item.groupType;
            if (typeof item.groupType._links != 'undefined') {
                item.groupType = item.groupType._links.self.href;
            }
        }
        if (item._links != null) {
            //update relations
            delete item.groupType;
            if (territoryGroupType._links.self.href == '') {
                item.deleteRelation('groupType', territoryGroupType).subscribe(result => {
                }, error => console.error(error));
            }
            else {
                item.substituteRelation('groupType', territoryGroupType).subscribe(result => {
                }, error => console.error(error));
            }
            if (item.type != null)
                item.type = item.type._links.self.href;
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORY_API), item);
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
         * API resource path
         */
        this.TERRITORYTYPE_API = 'territory-types';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORYTYPE_API), item);
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
 * Territory type model
 */
class TerritoryGroupType extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class TerritoryGroupTypeService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(TerritoryGroupType, "territory-group-types", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.TERRITORYGROUPTYPE_API = 'territory-group-types';
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
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORYGROUPTYPE_API), item);
        }
        return result;
    }
}
TerritoryGroupTypeService.ɵfac = function TerritoryGroupTypeService_Factory(t) { return new (t || TerritoryGroupTypeService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
TerritoryGroupTypeService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: TerritoryGroupTypeService, factory: TerritoryGroupTypeService.ɵfac, providedIn: 'root' });
/** @nocollapse */
TerritoryGroupTypeService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ TerritoryGroupTypeService.ngInjectableDef = defineInjectable({ factory: function TerritoryGroupTypeService_Factory() { return new TerritoryGroupTypeService(inject(INJECTOR), inject(HttpClient)); }, token: TerritoryGroupTypeService, providedIn: "root" });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(TerritoryGroupTypeService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
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
         * API resource path
         */
        this.ROLE_API = 'roles';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.ROLE_API), item);
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
         * API resource path
         */
        this.CONNECTION_API = 'connections';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
        }
        return result;
    }
    /**
     * @param {?} item
     * @return {?}
     */
    testConnection(item) {
        /** @type {?} */
        let result;
        result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API) + "/test", item);
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
         * API resource path
         */
        this.CONNECTION_API = 'tasks';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
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
         * API resource path
         */
        this.CONNECTION_API = 'task-types';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
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
         * API resource path
         */
        this.CONNECTION_API = 'task-groups';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
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
         * API resource path
         */
        this.TASK_PARAMETER_API = 'task-parameters';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.TASK_PARAMETER_API), item);
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
         * API resource path
         */
        this.TASK_AVAILABILITY_API = 'task-availabilities';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.TASK_AVAILABILITY_API), item);
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
         * API resource path
         */
        this.CONNECTION_API = 'task-uis';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
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
         * API resource path
         */
        this.SERVICE_API = 'services';
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
            /*delete item.connection;
                  
                  if (serviceConnection._links.self.href==''){
                     item.deleteRelation('connection',serviceConnection).subscribe(result => {
            
                      
                         }, error => console.error(error));
                      
                  } else {
                      item.substituteRelation('connection',serviceConnection).subscribe(result => {
                     
            
                  
                        }, error => console.error(error));
                   } */
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.SERVICE_API), item);
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
         * API resource path
         */
        this.SERVICE_PARAMETER_API = 'service-parameters';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.SERVICE_PARAMETER_API), item);
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
         * API resource path
         */
        this.CARTOGRAPHY_API = 'cartographies';
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
        let cartographyConnection = {};
        cartographyConnection._links = {};
        cartographyConnection._links.self = {};
        cartographyConnection._links.self.href = "";
        /** @type {?} */
        let cartographyService = {};
        cartographyService._links = {};
        cartographyService._links.self = {};
        cartographyService._links.self.href = "";
        /** @type {?} */
        let cartographySelectionService = {};
        cartographySelectionService._links = {};
        cartographySelectionService._links.self = {};
        cartographySelectionService._links.self.href = "";
        if (item.service != null) {
            cartographyService = item.service;
            if (typeof item.service._links != 'undefined') {
                item.service = item.service._links.self.href;
            }
        }
        if (item.selectionService != null) {
            cartographySelectionService = item.selectionService;
            if (typeof item.selectionService._links != 'undefined') {
                item.selectionService = item.selectionService._links.self.href;
            }
        }
        if (item.connection != null) {
            cartographyConnection = item.connection;
            if (typeof item.connection._links != 'undefined') {
                item.connection = item.connection._links.self.href;
            }
        }
        if (item._links != null) {
            //update relations
            delete item.connection;
            delete item.service;
            delete item.selectionService;
            if (cartographyConnection._links.self.href == '') {
                item.deleteRelation('spatialSelectionConnection', cartographyConnection).subscribe(result => {
                }, error => console.error(error));
            }
            else {
                item.substituteRelation('spatialSelectionConnection', cartographyConnection).subscribe(result => {
                }, error => console.error(error));
            }
            if (cartographyService._links.self.href == '') {
                item.deleteRelation('service', cartographyService).subscribe(result => {
                }, error => console.error(error));
            }
            else {
                item.substituteRelation('service', cartographyService).subscribe(result => {
                }, error => console.error(error));
            }
            if (cartographySelectionService._links.self.href == '') {
                item.deleteRelation('spatialSelectionService', cartographySelectionService).subscribe(result => {
                }, error => console.error(error));
            }
            else {
                item.substituteRelation('spatialSelectionService', cartographySelectionService).subscribe(result => {
                }, error => console.error(error));
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_API), item);
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
         * API resource path
         */
        this.CARTOGRAPHY_GROUP_API = 'cartography-groups';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_GROUP_API), item);
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
         * API resource path
         */
        this.CARTOGRAPHY_AVAILABILITY_API = 'cartography-availabilities';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_AVAILABILITY_API), item);
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
 * Cartography availability model
 */
class CartographyFilter extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * CartographyFilter manager service
 */
class CartographyFilterService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(CartographyFilter, "cartography-filters", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.CARTOGRAPHY_FILTER_API = 'cartography-filters';
    }
    /**
     * remove cartography filter
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
        }
        else {
            item.cartography = item.cartography._links.self.href;
            if (item.territorialLevel != null) {
                item.territorialLevel = item.territorialLevel._links.self.href;
            }
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_FILTER_API), item);
        }
        return result;
    }
}
CartographyFilterService.ɵfac = function CartographyFilterService_Factory(t) { return new (t || CartographyFilterService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
CartographyFilterService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: CartographyFilterService, factory: CartographyFilterService.ɵfac });
/** @nocollapse */
CartographyFilterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(CartographyFilterService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.Injector }, { type: ɵngcc1.HttpClient }]; }, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service parameter model
 */
class CartographyParameter extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service parameter manager service
 */
class CartographyParameterService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(CartographyParameter, "cartography-parameters", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.CARTOGRAPHY_PARAMETER_API = 'cartography-parameters';
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
            if (item.cartography != null) {
                /** @type {?} */
                let cartography = item.cartography;
                delete item.cartography;
                item.substituteRelation('cartography', cartography).subscribe(result => {
                }, error => console.error(error));
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            item.cartography = item.cartography._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_PARAMETER_API), item);
        }
        return result;
    }
}
CartographyParameterService.ɵfac = function CartographyParameterService_Factory(t) { return new (t || CartographyParameterService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
CartographyParameterService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: CartographyParameterService, factory: CartographyParameterService.ɵfac });
/** @nocollapse */
CartographyParameterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(CartographyParameterService, [{
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
         * API resource path
         */
        this.BACKGROUND_API = 'backgrounds';
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
        let backgroundCartographyGroup = {};
        backgroundCartographyGroup._links = {};
        backgroundCartographyGroup._links.self = {};
        backgroundCartographyGroup._links.self.href = "";
        item.cartographyGroup;
        if (item.cartographyGroup != null) {
            backgroundCartographyGroup = item.cartographyGroup;
            if (typeof item.cartographyGroup._links != 'undefined') {
                item.cartographyGroup = item.cartographyGroup._links.self.href;
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
            result = this.http.post(this.resourceService.getResourceUrl(this.BACKGROUND_API), item);
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
         * API resource path
         */
        this.TREE_API = 'trees';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.TREE_API), item);
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
         * API resource path
         */
        this.TREE_NODE_API = 'tree-nodes';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.TREE_NODE_API), item);
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
         * API resource path
         */
        this.APPLICATION_API = 'applications';
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
        let applicationSituationMap = {};
        applicationSituationMap._links = {};
        applicationSituationMap._links.self = {};
        applicationSituationMap._links.self.href = "";
        if (item.situationMap != null) {
            applicationSituationMap = item.situationMap;
            if (typeof item.situationMap._links != 'undefined') {
                item.situationMap = item.situationMap._links.self.href;
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
            result = this.http.post(this.resourceService.getResourceUrl(this.APPLICATION_API), item);
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
         * API resource path
         */
        this.APPLICATION_BACKGROUND_API = 'application-backgrounds';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.APPLICATION_BACKGROUND_API), item);
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
         * API resource path
         */
        this.APPLICATION_PARAMETER_API = 'application-parameters';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.APPLICATION_PARAMETER_API), item);
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
 * Connection model
 */
class CodeList extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Connection manager service
 */
class CodeListService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(CodeList, "codelist-values", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.CODELIST_API = 'codelist-values';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.CODELIST_API), item);
        }
        return result;
    }
}
CodeListService.ɵfac = function CodeListService_Factory(t) { return new (t || CodeListService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
CodeListService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: CodeListService, factory: CodeListService.ɵfac });
/** @nocollapse */
CodeListService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(CodeListService, [{
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
                CodeListService,
                TerritoryService,
                TerritoryTypeService,
                TerritoryGroupTypeService,
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
                CartographyParameterService,
                CartographyFilterService,
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
                    HasAnyAuthorityOnTerritoryDirective,
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

export { AccountService, AuthService, AuthInterceptor, AuthExpiredInterceptor, LoginService, Principal, User, UserService, UserPosition, UserPositionService, UserConfiguration, UserConfigurationService, Territory, TerritoryService, TerritoryType, TerritoryTypeService, TerritoryGroupType, TerritoryGroupTypeService, Role, RoleService, Connection, ConnectionService, GEOADMIN_TREE_TASK_ID, Task, TaskService, TaskType, TaskTypeService, TaskGroup, TaskGroupService, TaskParameter, TaskParameterService, TaskAvailability, TaskAvailabilityService, TaskUI, TaskUIService, Service, ServiceService, ServiceParameter, ServiceParameterService, Cartography, CartographyService, CartographyGroup, CartographyGroupService, CartographyAvailability, CartographyAvailabilityService, CartographyFilter, CartographyFilterService, CartographyParameter, CartographyParameterService, Background, BackgroundService, Tree, TreeService, TreeNode, TreeNodeService, TERRITORIAL_APP_NAME, Application, ApplicationService, ApplicationBackground, ApplicationBackgroundService, ApplicationParameter, ApplicationParameterService, CodeList, CodeListService, Layer, OptionalParameter, LayerConfiguration, LayerGroup, MapOptionsConfiguration, MapComponentStatus, MapConfigurationManagerService, createTranslateLoader, SitmunFrontendCoreModule, ExternalService, RestService, Resource, ResourceArray, ResourceHelper, AngularHalModule, ResourceService as ɵa, HasAnyAuthorityOnTerritoryDirective as ɵc, HasAnyAuthorityDirective as ɵb };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWNvcmUuanMiLCJzb3VyY2VzIjpbIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLWFycmF5LnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UtaGVscGVyLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvZXh0ZXJuYWwuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYWNjb3VudC9hY2NvdW50LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLmludGVyY2VwdG9yLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvcHJpbmNpcGFsLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLWV4cGlyZWQuaW50ZXJjZXB0b3IudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9sb2dpbi5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3VzZXIvdXNlci5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3VzZXIvdXNlci1wb3NpdGlvbi5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24uc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItY29uZmlndXJhdGlvbi5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItY29uZmlndXJhdGlvbi5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGVycml0b3J5L3RlcnJpdG9yeS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktdHlwZS5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LWdyb3VwLXR5cGUubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGVycml0b3J5L3RlcnJpdG9yeS1ncm91cC10eXBlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3JvbGUvcm9sZS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24uc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2subW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXR5cGUubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXR5cGUuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stZ3JvdXAubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXBhcmFtZXRlci5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stcGFyYW1ldGVyLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWF2YWlsYWJpbGl0eS5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stYXZhaWxhYmlsaXR5LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXVpLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3NlcnZpY2Uvc2VydmljZS5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9zZXJ2aWNlL3NlcnZpY2Uuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9zZXJ2aWNlL3NlcnZpY2UtcGFyYW1ldGVyLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3NlcnZpY2Uvc2VydmljZS1wYXJhbWV0ZXIuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5Lm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWZpbHRlci5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1maWx0ZXIuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1wYXJhbWV0ZXIubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktcGFyYW1ldGVyLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvYmFja2dyb3VuZC5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS1ub2RlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS1ub2RlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24ubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24uc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLWJhY2tncm91bmQuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24tcGFyYW1ldGVyLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY29kZWxpc3QvY29kZWxpc3QubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY29kZWxpc3QvY29kZWxpc3Quc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9tYXAvbWFwLWNvbmZpZ3VyYXRpb24tbWFuYWdlci5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvaGFzLWFueS1hdXRob3JpdHkuZGlyZWN0aXZlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvaGFzLWFueS1hdXRob3JpdHktb24tdGVycml0b3J5LmRpcmVjdGl2ZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9zaXRtdW4tZnJvbnRlbmQtY29yZS5tb2R1bGUudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9hbmd1bGFyLWhhbC5tb2R1bGUudHMiXSwibmFtZXMiOlsib2JzZXJ2YWJsZVRocm93RXJyb3IiLCJ1cmwucGFyc2UiLCJvYnNlcnZhYmxlT2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLEFBQUE7QUFBc0M7QUFBSTtBQUVqQjtBQUFlO0FBU3hDOzs7YUF1QjJCLENBQUM7QUF2QjVCO0FBQXNCO0FBQW9CO2NBeUJsQixDQUFDLGZBekI2QjtBQUVwRDtBQUFZLDZCQXFCYSxDQUFDO0FBQzVCO0FBSXdCLENBQUMsREFKYjtBQUNBO2dCQVNhLEVBQUUsbEJBVEgsMEJBQUEsQ0FBQztBQUN6QjtBQUNPO0FBQ0E7Z0JBU0ksQ0FBQyxFQUFLLG5CQVRFLDBCQUFLLENBQUM7U0FVakIsVEFUUjtDQVNZLENB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QUNUOzs7Ozs7Ozs7Ozs7Ozs7OzswQkFDSztBQUFDO0FBQUM7QUFBSTtBQUNFO0FBRUs7QUFBSTtBQUFDO0FBQUk7QUFDTjtBQUdwQjtBQUFJO0FBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHt0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7Y2F0Y2hFcnJvciwgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtBcnJheUludGVyZmFjZX0gZnJvbSAnLi9hcnJheS1pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBSRVNUIGFycmF5IG9mIHJlc291cmNlIGltcGxlbWVudGF0aW9uICovXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUFycmF5PFQgZXh0ZW5kcyBSZXNvdXJjZT4gaW1wbGVtZW50cyBBcnJheUludGVyZmFjZTxUPiB7XHJcbiAgICAvKiogc29ydGluZyBpbmZvICovXHJcbiAgICBwdWJsaWMgc29ydEluZm86IFNvcnRbXTtcclxuICAgIC8qKiBwcm94eSB1cmwgKi9cclxuICAgIHB1YmxpYyBwcm94eVVybDogc3RyaW5nO1xyXG4gICAgLyoqIHJvb3QgdXJsICovXHJcbiAgICBwdWJsaWMgcm9vdFVybDogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBzZWxmIHVybCAqL1xyXG4gICAgcHVibGljIHNlbGZfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogbmV4dCByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBuZXh0X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIHByZXZpb3VzIHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIHByZXZfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogZmlyc3QgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgZmlyc3RfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogbGFzdCByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBsYXN0X3VyaTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBlbWJlZGRlZCBhcnJheSBsaXN0ICovXHJcbiAgICBwdWJsaWMgX2VtYmVkZGVkO1xyXG5cclxuICAgIC8qKiB0b3RhbCBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBhcnJheSAqL1xyXG4gICAgcHVibGljIHRvdGFsRWxlbWVudHMgPSAwO1xyXG4gICAgLyoqIHRvdGFsIG51bWJlciBvZiBwYWdlcyBpbiB0aGUgcmVzcG9uc2UgKi9cclxuICAgIHB1YmxpYyB0b3RhbFBhZ2VzID0gMTtcclxuICAgIFxyXG4gICAgLyoqIHBhZ2UgbnVtYmVyIGluIHRoZSByZXNwb25zZSAqL1xyXG4gICAgcHVibGljIHBhZ2VOdW1iZXIgPSAxO1xyXG4gICAgXHJcbiAgICAvKiogcGFnZSBzaXplICovXHJcbiAgICBwdWJsaWMgcGFnZVNpemU6IG51bWJlcjtcclxuXHJcbiAgICAvKiogYXJyYXkgY29tcG9uZW50cyAqL1xyXG4gICAgcHVibGljIHJlc3VsdDogVFtdID0gW107XHJcblxyXG4gICAgLyoqIHB1c2ggYSBuZXcgcmVzb3VyY2UgdG8gdGhlIGFycmF5ICovXHJcbiAgICBwdXNoID0gKGVsOiBUKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZXN1bHQucHVzaChlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBsZW5ndGggb2YgdGhlIGFycmF5ICovXHJcbiAgICBsZW5ndGggPSAoKTogbnVtYmVyID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHQubGVuZ3RoO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogbG9hZCBhcnJheSBkYXRhIGZyb20gUkVTVCByZXF1ZXN0ICovXHJcbiAgICBwcml2YXRlIGluaXQgPSAodHlwZTogeyBuZXcoKTogVCB9LCByZXNwb25zZTogYW55LCBzb3J0SW5mbzogU29ydFtdKTogUmVzb3VyY2VBcnJheTxUPiA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4odGhpcy5fZW1iZWRkZWQpO1xyXG4gICAgICAgIHJlc3VsdC5zb3J0SW5mbyA9IHNvcnRJbmZvO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIG5leHQgcGFnZSAqL1xyXG4gICAgbmV4dCA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5uZXh0X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLm5leHRfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gbmV4dCBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIHByZXZpb3VzIHBhZ2UgKi9cclxuICAgIHByZXYgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJldl91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5wcmV2X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHByZXYgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBmaXJzdCBwYWdlICovXHJcbiAgICBmaXJzdCA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5maXJzdF91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5maXJzdF91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBmaXJzdCBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIGxhc3QgcGFnZSAqL1xyXG4gICAgbGFzdCA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5sYXN0X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLmxhc3RfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gbGFzdCBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIHBhZ2Ugd2l0aCBnaXZlbiBwYWdlTnVtYmVyKi9cclxuICAgIHBhZ2UgPSAodHlwZTogeyBuZXcoKTogVCB9LCBwYWdlTnVtYmVyOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7P3BhZ2Usc2l6ZSxzb3J0fScsICcnKTtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7JnNvcnR9JywgJycpO1xyXG4gICAgICAgIGxldCB1cmxQYXJzZWQgPSB1cmwucGFyc2UoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkpO1xyXG4gICAgICAgIGxldCBxdWVyeTogc3RyaW5nID0gUmVzb3VyY2VBcnJheS5yZXBsYWNlT3JBZGQodXJsUGFyc2VkLnF1ZXJ5LCAnc2l6ZScsIHRoaXMucGFnZVNpemUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgcXVlcnkgPSBSZXNvdXJjZUFycmF5LnJlcGxhY2VPckFkZChxdWVyeSwgJ3BhZ2UnLCBwYWdlTnVtYmVyLnRvU3RyaW5nKCkpO1xyXG5cclxuXHJcbiAgICAgICAgbGV0IHVyaSA9IHVybFBhcnNlZC5xdWVyeSA/XHJcbiAgICAgICAgICAgIFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLnJlcGxhY2UodXJsUGFyc2VkLnF1ZXJ5LCBxdWVyeSkgOiBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5jb25jYXQocXVlcnkpO1xyXG4gICAgICAgIHVyaSA9IHRoaXMuYWRkU29ydEluZm8odXJpKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIFNvcnQgY29sbGVjdGlvbiBiYXNlZCBvbiBnaXZlbiBzb3J0IGF0dHJpYnV0ZSAqL1xyXG4gICAgc29ydEVsZW1lbnRzID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgLi4uc29ydDogU29ydFtdKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgnez9wYWdlLHNpemUsc29ydH0nLCAnJyk7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgneyZzb3J0fScsICcnKTtcclxuICAgICAgICBsZXQgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkuY29uY2F0KCc/JywgJ3NpemU9JywgdGhpcy5wYWdlU2l6ZS50b1N0cmluZygpLCAnJnBhZ2U9JywgdGhpcy5wYWdlTnVtYmVyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHVyaSA9IHRoaXMuYWRkU29ydEluZm8odXJpKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgc29ydCkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgcGFnZSB3aXRoIGdpdmVuIHNpemUgKi9cclxuICAgIHNpemUgPSAodHlwZTogeyBuZXcoKTogVCB9LCBzaXplOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBsZXQgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkuY29uY2F0KCc/JywgJ3NpemU9Jywgc2l6ZS50b1N0cmluZygpKTtcclxuICAgICAgICB1cmkgPSB0aGlzLmFkZFNvcnRJbmZvKHVyaSk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBBZGQgc29ydCBpbmZvIHRvIGdpdmVuIFVSSSAqL1xyXG4gICAgcHJpdmF0ZSBhZGRTb3J0SW5mbyh1cmk6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLnNvcnRJbmZvKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLnNvcnRJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICB1cmkgPSB1cmkuY29uY2F0KCcmc29ydD0nLCBpdGVtLnBhdGgsICcsJywgaXRlbS5vcmRlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVyaTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQWRkIHJlcGxhY2Ugb3IgYWRkIHBhcmFtIHZhbHVlIHRvIHF1ZXJ5IHN0cmluZyAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVwbGFjZU9yQWRkKHF1ZXJ5OiBzdHJpbmcsIGZpZWxkOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChxdWVyeSkge1xyXG4gICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSBxdWVyeS5pbmRleE9mKGZpZWxkKTtcclxuICAgICAgICAgICAgbGV0IGlkeE5leHRBbXA6IG51bWJlciA9IHF1ZXJ5LmluZGV4T2YoJyYnLCBpZHgpID09IC0xID8gcXVlcnkuaW5kZXhPZignLycsIGlkeCkgOiBxdWVyeS5pbmRleE9mKCcmJywgaWR4KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWFjaFZhbHVlID0gcXVlcnkuc3Vic3RyaW5nKGlkeCwgaWR4TmV4dEFtcCk7XHJcbiAgICAgICAgICAgICAgICBxdWVyeSA9IHF1ZXJ5LnJlcGxhY2Uoc2VhY2hWYWx1ZSwgZmllbGQgKyAnPScgKyB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBxdWVyeSA9IHF1ZXJ5LmNvbmNhdChcIiZcIiArIGZpZWxkICsgJz0nICsgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcXVlcnkgPSBcIj9cIiArIGZpZWxkICsgJz0nICsgdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBxdWVyeTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0h0dHBDbGllbnQsIEh0dHBIZWFkZXJzLCBIdHRwUGFyYW1zfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQge0hhbE9wdGlvbnN9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5pbXBvcnQge2lzTnVsbE9yVW5kZWZpbmVkLCBpc1ByaW1pdGl2ZX0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xyXG5cclxuLyoqIFJFU1QgQVBJIGFjY2VzcyBoZWxwZXIgKi9cclxuZXhwb3J0IGNsYXNzIFJlc291cmNlSGVscGVyIHtcclxuXHJcbiAgICAvKiogSHR0cEhlYWRlcnMgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaGVhZGVyczogSHR0cEhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuICAgIC8qKiBQcm94eSBVUkwgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHByb3h5X3VyaTogc3RyaW5nID0gbnVsbDtcclxuICAgIC8qKiBSb290IFVSTCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcm9vdF91cmk6IHN0cmluZyA9IG51bGw7XHJcbiAgICAvKiogSHR0cENsaWVudCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaHR0cDogSHR0cENsaWVudCA9IG51bGw7XHJcblxyXG4gICAgLyoqIGdldCByZXF1ZXN0IGhlYWRlcnMgKi9cclxuICAgIC8qcHVibGljIHN0YXRpYyBnZXQgaGVhZGVycygpOiBIdHRwSGVhZGVycyB7XHJcbiAgICAgICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2hlYWRlcnMpKVxyXG4gICAgICAgICAgUmVzb3VyY2VIZWxwZXIuX2hlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuX2hlYWRlcnM7XHJcbiAgICB9Ki9cclxuXHJcbiAgICAvKiogc2V0IHJlcXVlc3QgaGVhZGVycyAqL1xyXG4gICAgLypwdWJsaWMgc3RhdGljIHNldCBoZWFkZXJzKGhlYWRlcnM6IEh0dHBIZWFkZXJzKSB7XHJcbiAgICAgIFJlc291cmNlSGVscGVyLl9oZWFkZXJzID0gaGVhZGVycztcclxuICAgIH0qL1xyXG5cclxuICAgIC8qKiBnZXQgcmVxdWVzdCBvcHRpb24gcGFyYW1zICovXHJcbiAgICBzdGF0aWMgb3B0aW9uUGFyYW1zKHBhcmFtczogSHR0cFBhcmFtcywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBIdHRwUGFyYW1zIHtcclxuICAgICAgICBpZiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHBhcmFtIG9mIG9wdGlvbnMucGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZChwYXJhbS5rZXksIHBhcmFtLnZhbHVlLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zaXplKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdzaXplJywgb3B0aW9ucy5zaXplLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zb3J0KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHMgb2Ygb3B0aW9ucy5zb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNvcnRTdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICBzb3J0U3RyaW5nID0gcy5wYXRoID8gc29ydFN0cmluZy5jb25jYXQocy5wYXRoKSA6IHNvcnRTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydFN0cmluZyA9IHMub3JkZXIgPyBzb3J0U3RyaW5nLmNvbmNhdCgnLCcpLmNvbmNhdChzLm9yZGVyKSA6IHNvcnRTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnc29ydCcsIHNvcnRTdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiByZXNvbHZlIHJlc291cmNlIHJlbGF0aW9ucyAqL1xyXG4gICAgc3RhdGljIHJlc29sdmVSZWxhdGlvbnMocmVzb3VyY2U6IFJlc291cmNlKTogT2JqZWN0IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IGFueSA9IHt9O1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHJlc291cmNlKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2Vba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChSZXNvdXJjZUhlbHBlci5jbGFzc05hbWUocmVzb3VyY2Vba2V5XSlcclxuICAgICAgICAgICAgICAgICAgICAuZmluZCgoY2xhc3NOYW1lOiBzdHJpbmcpID0+IGNsYXNzTmFtZSA9PSAnUmVzb3VyY2UnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZVtrZXldWydfbGlua3MnXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSByZXNvdXJjZVtrZXldWydfbGlua3MnXVsnc2VsZiddWydocmVmJ107XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmVzb3VyY2Vba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXJyYXk6IGFueVtdID0gcmVzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0ucHVzaChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldLnB1c2godGhpcy5yZXNvbHZlUmVsYXRpb25zKGVsZW1lbnQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHJlc291cmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCBhcyBPYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSBhbiBlbXB0eSByZXNvdXJjZSBmcm9tIGVtYmVkZGVkIGRhdGEqL1xyXG4gICAgc3RhdGljIGNyZWF0ZUVtcHR5UmVzdWx0PFQgZXh0ZW5kcyBSZXNvdXJjZT4oX2VtYmVkZGVkOiBzdHJpbmcpOiBSZXNvdXJjZUFycmF5PFQ+IHtcclxuICAgICAgICBsZXQgcmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiA9IG5ldyBSZXNvdXJjZUFycmF5PFQ+KCk7XHJcbiAgICAgICAgcmVzb3VyY2VBcnJheS5fZW1iZWRkZWQgPSBfZW1iZWRkZWQ7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBjbGFzcyBuYW1lKi9cclxuICAgIHN0YXRpYyBnZXRDbGFzc05hbWUob2JqOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBmdW5jTmFtZVJlZ2V4ID0gL2Z1bmN0aW9uICguKz8pXFwoLztcclxuICAgICAgICB2YXIgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKG9iai5jb25zdHJ1Y3Rvci50b1N0cmluZygpKTtcclxuICAgICAgICByZXR1cm4gKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiAxKSA/IHJlc3VsdHNbMV0gOiAnJztcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgY2xhc3MgbmFtZSBmcm9tIGEgcHJvdG90eXBlIG9iamVjdCovXHJcbiAgICBzdGF0aWMgY2xhc3NOYW1lKG9ialByb3RvOiBhbnkpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZXMgPSBbXTtcclxuICAgICAgICBsZXQgb2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9ialByb3RvKTtcclxuICAgICAgICBsZXQgY2xhc3NOYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIHdoaWxlICgoY2xhc3NOYW1lID0gUmVzb3VyY2VIZWxwZXIuZ2V0Q2xhc3NOYW1lKG9iaikpICE9PSAnT2JqZWN0Jykge1xyXG4gICAgICAgICAgICBjbGFzc05hbWVzLnB1c2goY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgb2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2xhc3NOYW1lcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogaW5zdGFudGlhdGUgYSBSZXNvdXJjZUNvbGxlY3Rpb24gZnJvbSByZXNwb25zZSBlbWJlZGRlZCBkYXRhKi9cclxuICAgIHN0YXRpYyBpbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcGF5bG9hZDogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+LCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIsZW1iZWRkZWROYW1lPzpTdHJpbmcpOiBSZXNvdXJjZUFycmF5PFQ+IHtcclxuICAgICAgICBmb3IgKGNvbnN0IGVtYmVkZGVkQ2xhc3NOYW1lIG9mIE9iamVjdC5rZXlzKHBheWxvYWRbcmVzdWx0Ll9lbWJlZGRlZF0pKSB7XHJcbiAgICAgICAgICAgIGlmKCFlbWJlZGRlZE5hbWUgfHwgKGVtYmVkZGVkTmFtZSAmJiBlbWJlZGRlZENsYXNzTmFtZT09ZW1iZWRkZWROYW1lKSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZW1iZWRkZWQ6IGFueSA9IHBheWxvYWRbcmVzdWx0Ll9lbWJlZGRlZF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IGVtYmVkZGVkW2VtYmVkZGVkQ2xhc3NOYW1lXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5zdGFuY2U6IFQgPSBuZXcgdHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0gdGhpcy5zZWFyY2hTdWJ0eXBlcyhidWlsZGVyLCBlbWJlZGRlZENsYXNzTmFtZSwgaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc3RhbnRpYXRlUmVzb3VyY2UoaW5zdGFuY2UsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdWx0LnRvdGFsRWxlbWVudHMgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2UudG90YWxFbGVtZW50cyA6IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgcmVzdWx0LnRvdGFsUGFnZXMgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2UudG90YWxQYWdlcyA6IDE7XHJcbiAgICAgICAgcmVzdWx0LnBhZ2VOdW1iZXIgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2UubnVtYmVyIDogMTtcclxuICAgICAgICByZXN1bHQucGFnZVNpemUgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2Uuc2l6ZSA6IDIwO1xyXG5cclxuICAgICAgICByZXN1bHQuc2VsZl91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5zZWxmID8gcGF5bG9hZC5fbGlua3Muc2VsZi5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5uZXh0X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLm5leHQgPyBwYXlsb2FkLl9saW5rcy5uZXh0LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVzdWx0LnByZXZfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3MucHJldiA/IHBheWxvYWQuX2xpbmtzLnByZXYuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQuZmlyc3RfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3MuZmlyc3QgPyBwYXlsb2FkLl9saW5rcy5maXJzdC5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5sYXN0X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLmxhc3QgPyBwYXlsb2FkLl9saW5rcy5sYXN0LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHN1YnR5cGVzKi9cclxuICAgIHN0YXRpYyBzZWFyY2hTdWJ0eXBlczxUIGV4dGVuZHMgUmVzb3VyY2U+KGJ1aWxkZXI6IFN1YlR5cGVCdWlsZGVyLCBlbWJlZGRlZENsYXNzTmFtZTogc3RyaW5nLCBpbnN0YW5jZTogVCkge1xyXG4gICAgICAgIGlmIChidWlsZGVyICYmIGJ1aWxkZXIuc3VidHlwZXMpIHtcclxuICAgICAgICAgICAgbGV0IGtleXMgPSBidWlsZGVyLnN1YnR5cGVzLmtleXMoKTtcclxuICAgICAgICAgICAgQXJyYXkuZnJvbShrZXlzKS5mb3JFYWNoKChzdWJ0eXBlS2V5OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbWJlZGRlZENsYXNzTmFtZS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoc3VidHlwZUtleS50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdWJ0eXBlOiB7IG5ldygpOiBhbnkgfSA9IGJ1aWxkZXIuc3VidHlwZXMuZ2V0KHN1YnR5cGVLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0gbmV3IHN1YnR5cGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogaW5zdGFudGlhdGUgYSBSZXNvdXJjZSBmcm9tIHJlc3BvbnNlICovXHJcbiAgICBzdGF0aWMgaW5zdGFudGlhdGVSZXNvdXJjZTxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCwgcGF5bG9hZDogT2JqZWN0KTogVCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBwIGluIHBheWxvYWQpIHtcclxuICAgICAgICAgICAgLy9UT0RPIGFycmF5IGluaXRcclxuICAgICAgICAgICAgLyogaWYoZW50aXR5W3BdLmNvbnN0cnVjdG9yID09PSBBcnJheSAmJiBpc051bGxPclVuZGVmaW5lZChwYXlsb2FkW3BdKSlcclxuICAgICAgICAgICAgICAgICBlbnRpdHlbcF0gPSBbXTtcclxuICAgICAgICAgICAgIGVsc2UqL1xyXG4gICAgICAgICAgICBlbnRpdHlbcF0gPSBwYXlsb2FkW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgcHJveHkgVVJMICovXHJcbiAgICBzdGF0aWMgc2V0UHJveHlVcmkocHJveHlfdXJpOiBzdHJpbmcpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgPSBwcm94eV91cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBSb290IFVSSSAqL1xyXG4gICAgc3RhdGljIHNldFJvb3RVcmkocm9vdF91cmk6IHN0cmluZykge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnJvb3RfdXJpID0gcm9vdF91cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBVUkwgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLnByb3h5X3VyaSAmJiBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgIT0gJycgP1xyXG4gICAgICAgICAgICBSZXNvdXJjZUhlbHBlci5hZGRTbGFzaChSZXNvdXJjZUhlbHBlci5wcm94eV91cmkpIDpcclxuICAgICAgICAgICAgUmVzb3VyY2VIZWxwZXIuYWRkU2xhc2goUmVzb3VyY2VIZWxwZXIucm9vdF91cmkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBhZGQgc2xhc2ggdG8gVVJJICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhZGRTbGFzaCh1cmk6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHVyaVBhcnNlZCA9IHVybC5wYXJzZSh1cmkpO1xyXG4gICAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZCh1cmlQYXJzZWQuc2VhcmNoKSAmJiB1cmkgJiYgdXJpW3VyaS5sZW5ndGggLSAxXSAhPSAnLycpXHJcbiAgICAgICAgICAgIHJldHVybiB1cmkgKyAnLyc7XHJcbiAgICAgICAgcmV0dXJuIHVyaTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHByb3h5IGZyb20gVVJMICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFByb3h5KHVybDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIVJlc291cmNlSGVscGVyLnByb3h5X3VyaSB8fCBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgPT0gJycpXHJcbiAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmFkZFNsYXNoKHVybC5yZXBsYWNlKFJlc291cmNlSGVscGVyLnJvb3RfdXJpLCBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IEh0dHBDbGllbnQqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXRIdHRwKGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5odHRwID0gaHR0cDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEh0dHBDbGllbnQqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRIdHRwKCk6IEh0dHBDbGllbnQge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5odHRwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcm9vdCBVUkkqL1xyXG4gICAgc3RhdGljIGdldFJvb3RVcmkoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLnJvb3RfdXJpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5pbXBvcnQge3Rocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3IsIG9mIGFzIG9ic2VydmFibGVPZn0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuXHJcbmltcG9ydCB7SHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWR9IGZyb20gJ3V0aWwnO1xyXG5cclxuaW1wb3J0IHtIYWxPcHRpb25zfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBBYnN0cmFjdCByZXNvdXJjZSBjbGFzcyovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlc291cmNlIHtcclxuXHJcbiAgICAvKiogcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgcHJveHlVcmw6IHN0cmluZztcclxuICAgIC8qKiByb290IFVSTCAqL1xyXG4gICAgcHVibGljIHJvb3RVcmw6IHN0cmluZztcclxuXHJcbiAgICAvKiogbGlua3MgKi9cclxuICAgIHB1YmxpYyBfbGlua3M6IGFueTtcclxuICAgIC8qKiBzdWJ0eXBlcyAqL1xyXG4gICAgcHVibGljIF9zdWJ0eXBlczogTWFwPHN0cmluZywgYW55PjtcclxuXHJcbiAgICBcclxuICAgIC8qKiBnZXQgc3VidHlwZXMgKi8gICAgXHJcbiAgICBwdWJsaWMgZ2V0IHN1YnR5cGVzKCk6IE1hcDxzdHJpbmcsIGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJ0eXBlcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHN1YnR5cGVzICovXHJcbiAgICBwdWJsaWMgc2V0IHN1YnR5cGVzKF9zdWJ0eXBlczogTWFwPHN0cmluZywgYW55Pikge1xyXG4gICAgICAgIHRoaXMuX3N1YnR5cGVzID0gX3N1YnR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKiogR2V0IGNvbGxlY3Rpb24gb2YgcmVsYXRlZCByZXNvdXJjZXMgKi9cclxuICAgIHB1YmxpYyBnZXRSZWxhdGlvbkFycmF5PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZWxhdGlvbjogc3RyaW5nLCBfZW1iZWRkZWQ/OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oaXNOdWxsT3JVbmRlZmluZWQoX2VtYmVkZGVkKSA/IFwiX2VtYmVkZGVkXCIgOiBfZW1iZWRkZWQpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb248VD4odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCwgYnVpbGRlcikpLFxyXG4gICAgICAgICAgICAgICAgbWFwKChhcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4gYXJyYXkucmVzdWx0KSwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YoW10pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogR2V0IHJlbGF0ZWQgcmVzb3VyY2UgKi9cclxuICAgIHB1YmxpYyBnZXRSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVsYXRpb246IHN0cmluZywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ1aWxkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGVtYmVkZGVkQ2xhc3NOYW1lIG9mIE9iamVjdC5rZXlzKGRhdGFbJ19saW5rcyddKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1iZWRkZWRDbGFzc05hbWUgPT0gJ3NlbGYnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaHJlZjogc3RyaW5nID0gZGF0YS5fbGlua3NbZW1iZWRkZWRDbGFzc05hbWVdLmhyZWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSBocmVmLmxhc3RJbmRleE9mKCcvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhbENsYXNzTmFtZSA9IGhyZWYucmVwbGFjZShSZXNvdXJjZUhlbHBlci5nZXRSb290VXJpKCksIFwiXCIpLnN1YnN0cmluZygwLCBpZHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gUmVzb3VyY2VIZWxwZXIuc2VhcmNoU3VidHlwZXMoYnVpbGRlciwgcmVhbENsYXNzTmFtZSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBBZGRzIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGUgYm91bmQgY29sbGVjdGlvbiBieSB0aGUgcmVsYXRpb24gKi9cclxuICAgIHB1YmxpYyBhZGRSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucG9zdChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYsIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBCaW5kIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSBnaXZlbiByZWxhdGlvbiovXHJcbiAgICBwdWJsaWMgdXBkYXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBhdGNoKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEJpbmQgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoaXMgcmVzb3VyY2UgYnkgdGhlIGdpdmVuIHJlbGF0aW9uKi9cclxuICAgIHB1YmxpYyBzdWJzdGl0dXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYsIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIC8qKiBCaW5kIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSBnaXZlbiByZWxhdGlvbiovXHJcbiAgICBwdWJsaWMgc3Vic3RpdHV0ZUFsbFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2VzOiBSZXNvdXJjZVtdKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2VzLm1hcCgocmVzb3VyY2UpID0+IHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYpLCB7aGVhZGVyczogaGVhZGVyfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8qKiBVbmJpbmQgdGhlIHJlc291cmNlIHdpdGggdGhlIGdpdmVuIHJlbGF0aW9uIGZyb20gdGhpcyByZXNvdXJjZSovXHJcbiAgICBwdWJsaWMgZGVsZXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlLl9saW5rcykpIHtcclxuICAgICAgICAgICAgbGV0IGxpbms6IHN0cmluZyA9IHJlc291cmNlLl9saW5rc1snc2VsZiddLmhyZWY7XHJcbiAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IGxpbmsubGFzdEluZGV4T2YoJy8nKSArIDE7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWR4ID09IC0xKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlbGF0aW9uSWQ6IHN0cmluZyA9IGxpbmsuc3Vic3RyaW5nKGlkeCk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmICsgJy8nICsgcmVsYXRpb25JZCksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIFVuYmluZCB0aGUgcmVzb3VyY2Ugd2l0aCB0aGUgZ2l2ZW4gcmVsYXRpb24gZnJvbSB0aGlzIHJlc291cmNlKi9cclxuICAgIHB1YmxpYyBkZWxldGVBbGxSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmICksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFVzZXJDb25maWd1cmF0aW9uIH0gZnJvbSAnLi91c2VyLWNvbmZpZ3VyYXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBVc2VyUG9zaXRpb24gfSBmcm9tICcuL3VzZXItcG9zaXRpb24ubW9kZWwnO1xyXG5cclxuLyoqXHJcbiAqIFVzZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBVc2VyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIHVzZXJuYW1lICovXHJcbiAgcHVibGljIHVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHBhc3N3b3JkICovXHJcbiAgcHVibGljIHBhc3N3b3JkOiBzdHJpbmc7XHJcbiAgLyoqIGZpcnN0IG5hbWUgKi9cclxuICBwdWJsaWMgZmlyc3ROYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGxhc3QgbmFtZSAqL1xyXG4gIHB1YmxpYyBsYXN0TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB3aGV0aGVyIHVzZXIgaXMgYmxvY2tlZCAqL1xyXG4gIHB1YmxpYyBibG9ja2VkOiBib29sZWFuO1xyXG4gIC8qKiB3aGV0aGVyIHVzZXIgaXMgYWRtaW5pc3RyYXRvciAqL1xyXG4gIHB1YmxpYyBhZG1pbmlzdHJhdG9yOiBib29sZWFuO1xyXG4gIC8qKiB1c2VyIHBvc2l0aW9ucyAqL1xyXG4gIHB1YmxpYyBwb3NpdGlvbnM6IFVzZXJQb3NpdGlvbltdO1xyXG4gIC8qKiB1c2VyIHBlcm1pc3Npb25zICovXHJcbiAgcHVibGljIHBlcm1pc3Npb25zOiBVc2VyQ29uZmlndXJhdGlvbltdO1xyXG59XHJcbiIsImltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlfSBmcm9tICcuL2V4dGVybmFsLWNvbmZpZ3VyYXRpb24uaGFuZGxlcic7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9ufSBmcm9tICcuL0V4dGVybmFsQ29uZmlndXJhdGlvbic7XHJcblxyXG5cclxuLyoqIEV4dGVybmFsU2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBFeHRlcm5hbFNlcnZpY2Uge1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoQEluamVjdCgnRXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZScpIHByaXZhdGUgZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTogRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZSkge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFByb3h5VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0Um9vdFVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0SHR0cChleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEh0dHAoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSBFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVyICovXHJcbiAgICBwdWJsaWMgdXBkYXRlRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlOiBFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlKSB7XHJcblx0dGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlID0gZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTtcclxuXHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0UHJveHlVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRQcm94eVVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRSb290VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Um9vdFVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRIdHRwKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0SHR0cCgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEV4dGVybmFsQ29uZmlndXJhdGlvbiAqL1xyXG4gICAgcHVibGljIGdldEV4dGVybmFsQ29uZmlndXJhdGlvbigpOiBFeHRlcm5hbENvbmZpZ3VyYXRpb24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0RXh0ZXJuYWxDb25maWd1cmF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBVUkwgKi9cclxuICAgIHB1YmxpYyBnZXRQcm94eVVyaSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IFJvb3QgVVJJICovXHJcbiAgICBwdWJsaWMgZ2V0Um9vdFVyaSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgVVJMICovXHJcbiAgICBwdWJsaWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldFVSTCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgSHR0cENsaWVudCAqL1xyXG4gICAgcHVibGljIGdldEh0dHAoKTogSHR0cENsaWVudCB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHsgdGhyb3dFcnJvciBhcyBvYnNlcnZhYmxlVGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgY2F0Y2hFcnJvciwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUhlbHBlciB9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwUGFyYW1zLCBIdHRwUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFNvcnQgfSBmcm9tICcuL3NvcnQnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUFycmF5IH0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7IEV4dGVybmFsU2VydmljZSB9IGZyb20gJy4vZXh0ZXJuYWwuc2VydmljZSc7XHJcbmltcG9ydCB7IEhhbE9wdGlvbnMgfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFN1YlR5cGVCdWlsZGVyIH0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogUmVzb3VyY2VTZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJlc291cmNlU2VydmljZSB7XHJcblxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBleHRlcm5hbFNlcnZpY2U6IEV4dGVybmFsU2VydmljZSkgeyB9XHJcblxyXG5cclxuICAgIC8qKiBnZXQgVVJMICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRVUkwoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0VVJMKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBhbGwgcmVzb3VyY2VzIGZyb20gYSBiYXNlIFVSSSBvZiBhIGdpdmVuIHR5cGUgKi9cclxuICAgIHB1YmxpYyBnZXRBbGw8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucywgc3ViVHlwZT86IFN1YlR5cGVCdWlsZGVyLCBlbWJlZGRlZE5hbWU/OlN0cmluZyk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UpLmNvbmNhdCgnP3Byb2plY3Rpb249dmlldycpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICByZXN1bHQuc29ydEluZm8gPSBvcHRpb25zID8gb3B0aW9ucy5zb3J0IDogdW5kZWZpbmVkO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCwgc3ViVHlwZSxlbWJlZGRlZE5hbWUpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gYSBiYXNlIFVSSSBhbmQgYSBnaXZlbiBpZCAqL1xyXG4gICAgcHVibGljIGdldDxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2U6IHN0cmluZywgaWQ6IGFueSk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UpLmNvbmNhdCgnLycsIGlkLCAnP3Byb2plY3Rpb249dmlldycpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKGRhdGEgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gaXRzIHNlbGZsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlTZWxmTGluazxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2VMaW5rOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eShyZXNvdXJjZUxpbmspLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoZGF0YSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgZGF0YSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggcmVzb3VyY2VzIGZyb20gYSBnaXZlbiBiYXNlIHBhdGgsIHF1ZXJ5IGFuZCBvcHRpb25zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCBxdWVyeTogc3RyaW5nLCByZXNvdXJjZTogc3RyaW5nLCBfZW1iZWRkZWQ6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy9zZWFyY2gvJywgcXVlcnkpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIHBhcmFtczogcGFyYW1zIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIGEgc2luZ2xlIHJlc291cmNlIGZyb20gYSBnaXZlbiBiYXNlIHBhdGgsIHF1ZXJ5IGFuZCBvcHRpb25zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoU2luZ2xlPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCBxdWVyeTogc3RyaW5nLCByZXNvdXJjZTogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UpLmNvbmNhdCgnL3NlYXJjaC8nLCBxdWVyeSk7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtcyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgcmVzcG9uc2UpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlcyBmcm9tIGEgZ2l2ZW4gYmFzZSBwYXRoLCBjdXN0b20gcXVlcnkgYW5kIG9wdGlvbnMgKi9cclxuICAgIHB1YmxpYyBjdXN0b21RdWVyeTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcXVlcnk6IHN0cmluZywgcmVzb3VyY2U6IHN0cmluZywgX2VtYmVkZGVkOiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSArIHF1ZXJ5KTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oX2VtYmVkZGVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtcyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZUxpbms6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChyZXNvdXJjZUxpbmssIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChkYXRhID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uQXJyYXk8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlTGluazogc3RyaW5nLCBfZW1iZWRkZWQ6IHN0cmluZywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oX2VtYmVkZGVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHJlc291cmNlTGluaywgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQsIGJ1aWxkZXIpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY291bnQgcmVzb3VyY2VzIGdpdmVuIGEgcGF0aCAqL1xyXG4gICAgcHVibGljIGNvdW50KHJlc291cmNlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UpLmNvbmNhdCgnL3NlYXJjaC9jb3VudEFsbCcpO1xyXG5cclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ2JvZHknIH0pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcCgocmVzcG9uc2U6IFJlc3BvbnNlKSA9PiBOdW1iZXIocmVzcG9uc2UuYm9keSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjcmVhdGUgcmVzb3VyY2UgZnJvbSBzZWxmIGxpbmsgYW5kIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBjcmVhdGU8VCBleHRlbmRzIFJlc291cmNlPihzZWxmUmVzb3VyY2U6IHN0cmluZywgZW50aXR5OiBUKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0VVJMKCkgKyBzZWxmUmVzb3VyY2U7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UoZW50aXR5KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wb3N0KHVyaSwgcGF5bG9hZCwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDw9IDIwNylcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKGVudGl0eSwgcmVzcG9uc2UuYm9keSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA1MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5OiBhbnkgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGJvZHkuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHVwZGF0ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCkge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KGVudGl0eS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gUmVzb3VyY2VIZWxwZXIucmVzb2x2ZVJlbGF0aW9ucyhlbnRpdHkpO1xyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKGVudGl0eSk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KHVyaSwgcGF5bG9hZCwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDw9IDIwNylcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKGVudGl0eSwgcmVzcG9uc2UuYm9keSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA1MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5OiBhbnkgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGJvZHkuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHVwZGF0ZUNvbGxlY3Rpb248VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCByZXNvdXJjZUxpbms6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KHJlc291cmNlTGluayk7XHJcbiAgICAgICAgLy9jb25zdCBwYXlsb2FkID0gUmVzb3VyY2VIZWxwZXIucmVzb2x2ZVJlbGF0aW9ucyhlbnRpdHkpO1xyXG4gICAgICAgIC8vdGhpcy5zZXRVcmxzUmVzb3VyY2UoZW50aXR5KTtcclxuICAgICAgICB2YXIgaGVhZGVyc1JlcSA9IFJlc291cmNlSGVscGVyLmhlYWRlcnM7XHJcbiAgICAgICAgaGVhZGVyc1JlcS5zZXQoXCJDb250ZW50LVR5cGVcIiwgXCJ0ZXh0L3VyaS1saXN0XCIpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dCh1cmksIHJlc291cmNlQXJyYXksIHsgaGVhZGVyczogaGVhZGVyc1JlcSwgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvZHk6IGFueSA9IHJlc3BvbnNlLmJvZHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoYm9keS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSwgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogcGF0Y2ggcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBwYXRjaDxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCkge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KGVudGl0eS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gUmVzb3VyY2VIZWxwZXIucmVzb2x2ZVJlbGF0aW9ucyhlbnRpdHkpO1xyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKGVudGl0eSk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucGF0Y2godXJpLCBwYXlsb2FkLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZScgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UoZW50aXR5LCByZXNwb25zZS5ib2R5KTtcclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvZHk6IGFueSA9IHJlc3BvbnNlLmJvZHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoYm9keS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSwgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZGVsZXRlIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgZGVsZXRlPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxPYmplY3Q+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShlbnRpdHkuX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5kZWxldGUodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMgfSkucGlwZShjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIG5leHQgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNOZXh0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5Lm5leHRfdXJpICE9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBwcmV2aW91cyBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc1ByZXY8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucHJldl91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIGZpcnN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzRmlyc3Q8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuZmlyc3RfdXJpICE9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzTGFzdDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5sYXN0X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbmV4dDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5Lm5leHQodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwcmV2aW91cyBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIHByZXY8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5wcmV2KHR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBmaXJzdDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LmZpcnN0KHR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGxhc3Q8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5sYXN0KHR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcGFnZSBvZiByZXN1bHRzIGdpdmVuIGEgcGFnZSBudW1iZXIqL1xyXG4gICAgcHVibGljIHBhZ2U8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0sIGlkOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5wYWdlKHR5cGUsIGlkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc29ydCByZXNvdXJjZSBhcnJheSB3aXRoIGEgZ2l2ZW4gc29ydGluZyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBzb3J0RWxlbWVudHM8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0sIC4uLnNvcnQ6IFNvcnRbXSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnNvcnRFbGVtZW50cyh0eXBlLCAuLi5zb3J0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHNpemUqL1xyXG4gICAgcHVibGljIHNpemU8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0sIHNpemU6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnNpemUodHlwZSwgc2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBVUkwgZnJvbSBhIGdpdmVuIHBhdGgqL1xyXG4gICAgcHVibGljIGdldFJlc291cmNlVXJsKHJlc291cmNlPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgdXJsID0gUmVzb3VyY2VTZXJ2aWNlLmdldFVSTCgpO1xyXG4gICAgICAgIGlmICghdXJsLmVuZHNXaXRoKCcvJykpIHtcclxuICAgICAgICAgICAgdXJsID0gdXJsLmNvbmNhdCgnLycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVybC5jb25jYXQocmVzb3VyY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgcHJveHkgYW5kIHJvb3QgdXJscyBvZiBnaXZlbiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHJpdmF0ZSBzZXRVcmxzPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+KSB7XHJcbiAgICAgICAgcmVzdWx0LnByb3h5VXJsID0gdGhpcy5leHRlcm5hbFNlcnZpY2UuZ2V0UHJveHlVcmkoKTtcclxuICAgICAgICByZXN1bHQucm9vdFVybCA9IHRoaXMuZXh0ZXJuYWxTZXJ2aWNlLmdldFJvb3RVcmkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHByb3h5IGFuZCByb290IHVybHMgb2YgZ2l2ZW4gcmVzb3VyY2UgKi9cclxuICAgIHByaXZhdGUgc2V0VXJsc1Jlc291cmNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzdWx0OiBUKSB7XHJcbiAgICAgICAgcmVzdWx0LnByb3h5VXJsID0gdGhpcy5leHRlcm5hbFNlcnZpY2UuZ2V0UHJveHlVcmkoKTtcclxuICAgICAgICByZXN1bHQucm9vdFVybCA9IHRoaXMuZXh0ZXJuYWxTZXJ2aWNlLmdldFJvb3RVcmkoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge29mIGFzIG9ic2VydmFibGVPZiwgdGhyb3dFcnJvciBhcyBvYnNlcnZhYmxlVGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7bWFwLCBtZXJnZU1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuaW1wb3J0IHtTb3J0fSBmcm9tICcuL3NvcnQnO1xyXG5pbXBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5pbXBvcnQge2lzTnVsbE9yVW5kZWZpbmVkfSBmcm9tICd1dGlsJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtJbmplY3Rvcn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuXHJcbi8qKiBIQUwgcGFyYW0gZGF0YSBtb2RlbCAqL1xyXG5leHBvcnQgdHlwZSBIYWxQYXJhbSA9IHsga2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH07XHJcbi8qKiBIQUwgb3B0aW9uIGRhdGEgbW9kZWwgKi9cclxuZXhwb3J0IHR5cGUgSGFsT3B0aW9ucyA9IHsgbm90UGFnZWQ/OiBib29sZWFuLCBzaXplPzogbnVtYmVyLCBzb3J0PzogU29ydFtdLCBwYXJhbXM/OiBIYWxQYXJhbVtdIH07XHJcblxyXG4vKiogUkVTVCBBUEkgYWNjZXNzIGludGVyZmFjZSAqL1xyXG5leHBvcnQgY2xhc3MgUmVzdFNlcnZpY2U8VCBleHRlbmRzIFJlc291cmNlPiB7XHJcbiAgICAvKiogcmVzb3VyY2UgdHlwZSAqL1xyXG4gICAgcHJpdmF0ZSB0eXBlOiBhbnk7XHJcbiAgICAvKiogcmVzb3VyY2UgcGF0aCAqL1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZTogc3RyaW5nO1xyXG4gICAgLyoqIHJlc291cmNlIGFycmF5ICovXHJcbiAgICBwdWJsaWMgcmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPjtcclxuICAgIC8qKiByZXNvdXJjZSBzZXJ2aWNlICovXHJcbiAgICBwdWJsaWMgcmVzb3VyY2VTZXJ2aWNlOiBSZXNvdXJjZVNlcnZpY2U7XHJcbiAgICAvKiogX2VtYmVkZGVkIGZpZWxkIG5hbWUgKi9cclxuICAgIHByaXZhdGUgX2VtYmVkZGVkOiBzdHJpbmcgPSAnX2VtYmVkZGVkJztcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHR5cGU6IHsgbmV3KCk6IFQgfSxcclxuICAgICAgICAgICAgICAgIHJlc291cmNlOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvcixcclxuICAgICAgICAgICAgICAgIF9lbWJlZGRlZD86IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZSA9IHJlc291cmNlO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VTZXJ2aWNlID0gaW5qZWN0b3IuZ2V0KFJlc291cmNlU2VydmljZSk7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChfZW1iZWRkZWQpKVxyXG4gICAgICAgICAgICB0aGlzLl9lbWJlZGRlZCA9IF9lbWJlZGRlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZXJyb3IgaGFuZGxlciAqL1xyXG4gICAgcHJvdGVjdGVkIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpOk9ic2VydmFibGU8bmV2ZXI+IHtcclxuICAgICAgICByZXR1cm4gUmVzdFNlcnZpY2UuaGFuZGxlRXJyb3IoZXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBlcnJvciBoYW5kbGVyICovXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpOk9ic2VydmFibGU8bmV2ZXI+IHtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgYWxsIHJlc291cmNlcyB3aXRoIG9wdGlvbmFsIG9wdGlvbnMgYW4gc3ViVHlwZSBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBnZXRBbGwob3B0aW9ucz86IEhhbE9wdGlvbnMsIHN1YlR5cGU/OiBTdWJUeXBlQnVpbGRlciwgZW1iZWRkZWROYW1lPzpTdHJpbmcpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRBbGwodGhpcy50eXBlLCB0aGlzLnJlc291cmNlLCB0aGlzLl9lbWJlZGRlZCwgb3B0aW9ucywgc3ViVHlwZSxlbWJlZGRlZE5hbWUpLnBpcGUoXHJcbiAgICAgICAgICAgIG1lcmdlTWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm5vdFBhZ2VkICYmICFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZUFycmF5LmZpcnN0X3VyaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm5vdFBhZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zaXplID0gcmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEFsbChvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKHJlc291cmNlQXJyYXkucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGlkICovXHJcbiAgICBwdWJsaWMgZ2V0KGlkOiBhbnkpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0KHRoaXMudHlwZSwgdGhpcy5yZXNvdXJjZSwgaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZnJvbSBzZWxmIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVNlbGZMaW5rKHNlbGZMaW5rOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QnlTZWxmTGluayh0aGlzLnR5cGUsIHNlbGZMaW5rKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlcyBmcm9tIGEgZ2l2ZW4gcXVlcnkgc3RyaW5nIGFuZCBvcHRpb25hbCBvcHRpb25zIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIHNlYXJjaChxdWVyeTogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnNlYXJjaCh0aGlzLnR5cGUsIHF1ZXJ5LCB0aGlzLnJlc291cmNlLCB0aGlzLl9lbWJlZGRlZCwgb3B0aW9ucykucGlwZShcclxuICAgICAgICAgICAgbWVyZ2VNYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm90UGFnZWQgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlQXJyYXkuZmlyc3RfdXJpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubm90UGFnZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNpemUgPSByZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoKHF1ZXJ5LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKHJlc291cmNlQXJyYXkucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggcmVzb3VyY2UgZnJvbSBhIGdpdmVuIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2hTaW5nbGUocXVlcnk6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2Uuc2VhcmNoU2luZ2xlKHRoaXMudHlwZSwgcXVlcnksIHRoaXMucmVzb3VyY2UsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggcmVzb3VyY2VzIGZyb20gYSBnaXZlbiBjdXN0b20gcXVlcnkgc3RyaW5nIGFuZCBvcHRpb25hbCBvcHRpb25zIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIGN1c3RvbVF1ZXJ5KHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY3VzdG9tUXVlcnkodGhpcy50eXBlLCBxdWVyeSwgdGhpcy5yZXNvdXJjZSwgdGhpcy5fZW1iZWRkZWQsIG9wdGlvbnMpLnBpcGUoXHJcbiAgICAgICAgICAgIG1lcmdlTWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm5vdFBhZ2VkICYmICFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZUFycmF5LmZpcnN0X3VyaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm5vdFBhZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zaXplID0gcmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1c3RvbVF1ZXJ5KHF1ZXJ5LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKHJlc291cmNlQXJyYXkucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb25BcnJheShyZWxhdGlvbjogc3RyaW5nLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRCeVJlbGF0aW9uQXJyYXkodGhpcy50eXBlLCByZWxhdGlvbiwgdGhpcy5fZW1iZWRkZWQsIGJ1aWxkZXIpLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZ2l2ZW4gYSByZWxhdGlvbiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlSZWxhdGlvbihyZWxhdGlvbjogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEJ5UmVsYXRpb24odGhpcy50eXBlLCByZWxhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNvdW50IHJlc291cmNlcyBnaXZlbiBhIHBhdGggKi9cclxuICAgIHB1YmxpYyBjb3VudCgpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5jb3VudCh0aGlzLnJlc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY3JlYXRlIHJlc291cmNlIGZyb20gc2VsZiBsaW5rIGFuZCBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgY3JlYXRlKGVudGl0eTogVCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5jcmVhdGUodGhpcy5yZXNvdXJjZSwgZW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogdXBkYXRlIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgdXBkYXRlKGVudGl0eTogVCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS51cGRhdGUoZW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogcGF0Y2ggcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBwYXRjaChlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UucGF0Y2goZW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZGVsZXRlIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgZGVsZXRlKGVudGl0eTogVCk6IE9ic2VydmFibGU8T2JqZWN0PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmRlbGV0ZShlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgdG90YWwgbnVtYmVyIG9mIGVsZW1lbnRzIG9mIHJlc291cmNlIGFycmF5ICovXHJcbiAgICBwdWJsaWMgdG90YWxFbGVtZW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSAmJiB0aGlzLnJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzO1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIGZpcnN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzRmlyc3QoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc0ZpcnN0KHRoaXMucmVzb3VyY2VBcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIG5leHQgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNOZXh0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNOZXh0KHRoaXMucmVzb3VyY2VBcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzUHJldigpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuaGFzUHJldih0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzTGFzdCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuaGFzTGFzdCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IG5leHQgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBuZXh0KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLm5leHQodGhpcy5yZXNvdXJjZUFycmF5LCB0aGlzLnR5cGUpLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwcmV2aW91cyBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIHByZXYoKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UucHJldih0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlc291cmNlQXJyYXkgZm91bmQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGZpcnN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgZmlyc3QoKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZmlyc3QodGhpcy5yZXNvdXJjZUFycmF5LCB0aGlzLnR5cGUpXHJcbiAgICAgICAgICAgICAgICAucGlwZShcclxuICAgICAgICAgICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlc291cmNlQXJyYXkgZm91bmQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBsYXN0KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmxhc3QodGhpcy5yZXNvdXJjZUFycmF5LCB0aGlzLnR5cGUpXHJcbiAgICAgICAgICAgICAgICAucGlwZShcclxuICAgICAgICAgICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlc291cmNlQXJyYXkgZm91bmQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHBhZ2Ugb2YgcmVzdWx0cyBnaXZlbiBhIHBhZ2UgbnVtYmVyKi9cclxuICAgIHB1YmxpYyBwYWdlKHBhZ2VOdW1iZXI6IG51bWJlcik6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnBhZ2UodGhpcy5yZXNvdXJjZUFycmF5LCB0aGlzLnR5cGUsIHBhZ2VOdW1iZXIpLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL3VzZXIvdXNlci5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuXHJcbi8qKiBBY2NvdW50IG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBY2NvdW50U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXI+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFDQ09VTlRfQVBJID0gJ2FjY291bnQnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihVc2VyLCBcImFjY291bnRcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGdldCBsb2dnZWQgaW4gdXNlciBhY2NvdW50Ki9cclxuICBnZXQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BQ0NPVU5UX0FQSSkpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYWNjb3VudCovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BQ0NPVU5UX0FQSSkgLCBpdGVtKTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqIGNoYW5nZSBsb2dnZWQgaW4gdXNlciBhY2NvdW50Ki8gIFxyXG4gIGNoYW5nZVBhc3N3b3JkKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFDQ09VTlRfQVBJK1wiL2NoYW5nZS1wYXNzd29yZFwiKSAsIGl0ZW0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlfSBmcm9tICdyeGpzLWNvbXBhdCc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnNlcnZpY2UnO1xyXG4vL2ltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5cclxuLyoqIEF1dGhlbnRpY2F0aW9uIHNlcnZpY2UqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XHJcbiAgICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQVVUSF9BUEkgPSAnYXV0aGVudGljYXRlJztcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICAgIHByaXZhdGUgcmVzb3VyY2VTZXJ2aWNlOiBSZXNvdXJjZVNlcnZpY2VcclxuICAgICkge31cclxuICAgIFxyXG4gICAgLyoqIGdldCBjdXJyZW50IHVzZXIgand0IHRva2VuIGZyb20gc2Vzc2lvbiBzdG9yYWdlKi9cclxuICAgIGdldFRva2VuKCkge1xyXG4gICAgICAgIHJldHVybiAgc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBsb2dpbiBvcGVyYXRpb24gKi9cclxuICAgIGxvZ2luKGNyZWRlbnRpYWxzKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IGNyZWRlbnRpYWxzLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogY3JlZGVudGlhbHMucGFzc3dvcmRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFVVEhfQVBJKSwgZGF0YSwge29ic2VydmUgOiAncmVzcG9uc2UnfSkubWFwKGF1dGhlbnRpY2F0ZVN1Y2Nlc3MuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhlbnRpY2F0ZVN1Y2Nlc3MocmVzcCkge1xyXG4gICAgICAgICAgICBpZiAocmVzcC5vaykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgand0ID0gcmVzcC5ib2R5LmlkX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZUF1dGhlbnRpY2F0aW9uVG9rZW4oand0KTtcclxuICAgICAgICAgICAgICAgIC8vY29uc3QgZXhwaXJlc0F0ID0gbW9tZW50KCkuYWRkKCByZXNwLmhlYWRlcnMuZ2V0KCdUb2tlbi1WYWxpZGl0eScpLCdtaWxpc2Vjb25kJyk7XHJcbiAgICAgICAgICAgICAgICAvL3Nlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2V4cGlyZXNfYXQnLCBKU09OLnN0cmluZ2lmeShleHBpcmVzQXQudmFsdWVPZigpKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gand0O1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBsb2dpbiBvcGVyYXRpb24gd2l0aCBqd3QgdG9rZW4gKi9cclxuICAgIGxvZ2luV2l0aFRva2VuKGp3dCkge1xyXG4gICAgICAgIGlmIChqd3QpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZUF1dGhlbnRpY2F0aW9uVG9rZW4oand0KTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShqd3QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnYXV0aC1qd3Qtc2VydmljZSBQcm9taXNlIHJlamVjdCcpOyAvLyBQdXQgYXBwcm9wcmlhdGUgZXJyb3IgbWVzc2FnZSBoZXJlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzdG9yZSBqd3QgdG9rZW4gaW4gc2Vzc2lvbiBzdG9yYWdlKi9cclxuICAgIHN0b3JlQXV0aGVudGljYXRpb25Ub2tlbihqd3QpIHtcclxuICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nLCBqd3QpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaXMgbG9nZ2VkIGluKi9cclxuICAgIHB1YmxpYyBpc0xvZ2dlZEluKCkge1xyXG4gICAgICAgIC8vcmV0dXJuIG1vbWVudCgpLmlzQmVmb3JlKHRoaXMuZ2V0RXhwaXJhdGlvbigpKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUb2tlbigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaXMgbG9nZ2VkIG91dCovXHJcbiAgICBpc0xvZ2dlZE91dCgpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMuaXNMb2dnZWRJbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBsb2dvdXQgb3BlcmF0aW9uICovXHJcbiAgICBsb2dvdXQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICAvL2xvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgICAgICAgICAgLy9zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdleHBpcmVzX2F0Jyk7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIFxyXG59XHJcbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgSHR0cEludGVyY2VwdG9yLCBIdHRwUmVxdWVzdCwgSHR0cEhhbmRsZXIsIEh0dHBFdmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbi8qKiBJbnRlcmNlcHRvciBmb3IgYXV0aGVudGljYXRpb24gdG9rZW4gaW4gQVBJIHJlcXVlc3RzICovXHJcbmV4cG9ydCBjbGFzcyBBdXRoSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICkge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogcmVxdWVzdCBoYW5kbGVyICovXHJcbiAgICBpbnRlcmNlcHQocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XHJcbiAgICAgICAgaWYgKCFyZXF1ZXN0IHx8ICFyZXF1ZXN0LnVybCB8fCAhKHJlcXVlc3QudXJsLmluY2x1ZGVzKFwiYXBpXCIpKSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcXVlc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgICAgICBpZiAoISF0b2tlbikge1xyXG4gICAgICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XHJcbiAgICAgICAgICAgICAgICBzZXRIZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEFjY291bnRTZXJ2aWNlIH0gZnJvbSAnLi4vYWNjb3VudC9hY2NvdW50LnNlcnZpY2UnO1xyXG5cclxuLyoqIFByaW5jaXBhbCBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUHJpbmNpcGFsIHtcclxuICAgIHByaXZhdGUgdXNlcklkZW50aXR5OiBhbnk7XHJcbiAgICBwcml2YXRlIGF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgYXV0aGVudGljYXRpb25TdGF0ZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgYWNjb3VudDogQWNjb3VudFNlcnZpY2VcclxuICAgICkge31cclxuXHJcbiAgICAvKiogYXV0aGVudGljYXRlIHdpdGggZ2l2ZW4gaWRlbnRpdHkqL1xyXG4gICAgYXV0aGVudGljYXRlKGlkZW50aXR5KSB7XHJcbiAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBpZGVudGl0eTtcclxuICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBpZGVudGl0eSAhPT0gbnVsbDtcclxuICAgICAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUubmV4dCh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHkoYXV0aG9yaXRpZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhc0FueUF1dGhvcml0eURpcmVjdChhdXRob3JpdGllcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyBvbiB0aGUgZ2l2ZW4gdGVycml0b3J5ICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeShhdXRob3JpdGllczogc3RyaW5nW10sdGVycml0b3J5OiBzdHJpbmcgKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhc0FueUF1dGhvcml0eURpcmVjdE9uVGVycml0b3J5KGF1dGhvcml0aWVzLHRlcnJpdG9yeSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyB3aXRob3V0IHJlc29sdmluZyBwcm9taXNlcyovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlEaXJlY3QoYXV0aG9yaXRpZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMudXNlcklkZW50aXR5IHx8ICF0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF1dGhvcml0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcy5pbmNsdWRlcyhhdXRob3JpdGllc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkgd2l0aG91dCByZXNvbHZpbmcgcHJvbWlzZXMgKi9cclxuICAgIGhhc0FueUF1dGhvcml0eURpcmVjdE9uVGVycml0b3J5KGF1dGhvcml0aWVzOiBzdHJpbmdbXSx0ZXJyaXRvcnk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkIHx8ICF0aGlzLnVzZXJJZGVudGl0eSB8fCAhdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdXRob3JpdGllcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0gJiYgdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XS5pbmNsdWRlcyhhdXRob3JpdGllc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyB0aGUgZ2l2ZW4gYXV0aG9yaXR5ICovXHJcbiAgICBoYXNBdXRob3JpdHkoYXV0aG9yaXR5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKS50aGVuKChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkLmF1dGhvcml0aWVzICYmIGlkLmF1dGhvcml0aWVzLmluY2x1ZGVzKGF1dGhvcml0eSkpO1xyXG4gICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyB0aGUgZ2l2ZW4gYXV0aG9yaXR5IG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkqL1xyXG4gICAgaGFzQXV0aG9yaXR5T25UZXJyaXRvcnkoYXV0aG9yaXR5OiBzdHJpbmcsdGVycml0b3J5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKS50aGVuKChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5ICYmIGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0gJiYgaWQuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XS5pbmNsdWRlcyhhdXRob3JpdHkpKTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB1c2VyIGlkZW50aXR5Ki9cclxuICAgIGlkZW50aXR5KGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgaWYgKGZvcmNlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2hlY2sgYW5kIHNlZSBpZiB3ZSBoYXZlIHJldHJpZXZlZCB0aGUgdXNlcklkZW50aXR5IGRhdGEgZnJvbSB0aGUgc2VydmVyLlxyXG4gICAgICAgIC8vIGlmIHdlIGhhdmUsIHJldXNlIGl0IGJ5IGltbWVkaWF0ZWx5IHJlc29sdmluZ1xyXG4gICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJldHJpZXZlIHRoZSB1c2VySWRlbnRpdHkgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIsIHVwZGF0ZSB0aGUgaWRlbnRpdHkgb2JqZWN0LCBhbmQgdGhlbiByZXNvbHZlLlxyXG4gICAgICAgIHJldHVybiB0aGlzLmFjY291bnQuZ2V0KCkudG9Qcm9taXNlKCkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYWNjb3VudCA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBhY2NvdW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5uZXh0KHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcklkZW50aXR5O1xyXG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLm5leHQodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaXMgYXV0aGVudGljYXRlZCAqL1xyXG4gICAgaXNBdXRoZW50aWNhdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlkZW50aXR5IGlzIHJlc29sdmVkICovXHJcbiAgICBpc0lkZW50aXR5UmVzb2x2ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlcklkZW50aXR5ICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBjdXJyZW50IHVzZXIgYXV0aGVudGljYXRpb24gc3RhdGUgKi9cclxuICAgIGdldEF1dGhlbnRpY2F0aW9uU3RhdGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0b3IsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cEludGVyY2VwdG9yLCBIdHRwUmVxdWVzdCwgSHR0cEhhbmRsZXIsIEh0dHBFdmVudCwgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuXHJcbi8qKiBJbnRlcmNlcHRvciBmb3IgYXV0aGVudGljYXRpb24gZXhwaXJlZCByZXNwb25zZSBpbiBBUEkgcmVxdWVzdHMgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aEV4cGlyZWRJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLCAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UsIFxyXG4gICAgICAgIHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWxcclxuICAgICkge31cclxuXHJcbiAgICAvKiogcmVxdWVzdCBoYW5kbGVyICovXHJcbiAgICBpbnRlcmNlcHQocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcXVlc3QpLmRvKChldmVudDogSHR0cEV2ZW50PGFueT4pID0+IHt9LCAoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLmxvZ291dCgpLnN1YnNjcmliZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbmNpcGFsLmF1dGhlbnRpY2F0ZShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy8nXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuXHJcbi8qKiBMb2dpbiBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTG9naW5TZXJ2aWNlIHtcclxuICAgIFxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIGF1dGhTZXJ2ZXJQcm92aWRlcjogQXV0aFNlcnZpY2UsIFxyXG4gICAgICAgIHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWxcclxuICAgICkge31cclxuXHJcbiAgICAvKipMb2dpbiBvcGVyYXRpb24qL1xyXG4gICAgbG9naW4oY3JlZGVudGlhbHMsIGNhbGxiYWNrPykge1xyXG4gICAgICAgIGNvbnN0IGNiID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hdXRoU2VydmVyUHJvdmlkZXIubG9naW4oY3JlZGVudGlhbHMpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmluY2lwYWwuaWRlbnRpdHkodHJ1ZSkudGhlbigoYWNjb3VudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEFmdGVyIHRoZSBsb2dpbiB0aGUgbGFuZ3VhZ2Ugd2lsbCBiZSBjaGFuZ2VkIHRvXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGxhbmd1YWdlIHNlbGVjdGVkIGJ5IHRoZSB1c2VyIGR1cmluZyBoaXMgcmVnaXN0cmF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYigpO1xyXG4gICAgICAgICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ291dCgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipsb2dpbiB3aXRoIGp3dCB0b2tlbiAqL1xyXG4gICAgbG9naW5XaXRoVG9rZW4oand0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aFNlcnZlclByb3ZpZGVyLmxvZ2luV2l0aFRva2VuKGp3dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGxvZ291dCBvcGVyYXRpb24gKi9cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgIHRoaXMuYXV0aFNlcnZlclByb3ZpZGVyLmxvZ291dCgpLnN1YnNjcmliZSgpO1xyXG4gICAgICAgdGhpcy5wcmluY2lwYWwuYXV0aGVudGljYXRlKG51bGwpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vdXNlci5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBVc2VyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXI+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVVNFUl9BUEkgPSd1c2Vycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFVzZXIsIFwidXNlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHVzZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBVc2VyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdXNlciovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVVNFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICAgIFxyXG4gIC8qKiBjaGFuZ2UgcGFzc3dvcmQgbyBnaXZlbiB1c2VyIGlkICovXHJcbiAgY2hhbmdlUGFzc3dvcmQoaWQsaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVVNFUl9BUEkrXCIvXCIraWQrXCIvY2hhbmdlLXBhc3N3b3JkXCIpICwgaXRlbSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL3VzZXIubW9kZWwnO1xyXG4vKipcclxuICogVXNlciBwb3NpdGlvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVzZXJQb3NpdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGVtYWlsICovXHJcbiAgcHVibGljIGVtYWlsOiBzdHJpbmc7XHJcbiAgLyoqIG9yZ2FuaXphdGlvbiBuYW1lKi9cclxuICBwdWJsaWMgb3JnYW5pemF0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIC8qKiBzeXN0ZW0gZGF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGRhdGVkRGF0ZTogYW55O1xyXG4gIC8qKiBwb3NpdGlvbiB0ZXJyaXRvcnkqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICAvKiogdXNlciovXHJcbiAgcHVibGljIHVzZXI6IFVzZXI7XHJcbn1cclxuIiwiaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyUG9zaXRpb24gfSBmcm9tICcuL3VzZXItcG9zaXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogVXNlciBwb3NpdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVXNlclBvc2l0aW9uU2VydmljZSAgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyUG9zaXRpb24+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFVTRVJfUE9TSVRJT05fQVBJID0gJ3VzZXItcG9zaXRpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlclBvc2l0aW9uLCBcInVzZXItcG9zaXRpb25zXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB1c2VyIHBvc2l0aW9uKi9cclxuICByZW1vdmUoaXRlbTogVXNlclBvc2l0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdXNlciBwb3NpdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udXNlciAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3VzZXInLGl0ZW0udXNlcikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS51c2VyID0gaXRlbS51c2VyLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVVNFUl9QT1NJVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgUm9sZSB9IGZyb20gJy4uL3JvbGUvcm9sZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4uL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi91c2VyLm1vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBVc2VyIHBlcm1pc3Npb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBVc2VyQ29uZmlndXJhdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogcm9sZSAqLyAgXHJcbiAgcHVibGljIHJvbGU6IFJvbGU7XHJcblxyXG4gIC8qKiByb2xlIENoaWxkcmVuICovICBcclxuICBwdWJsaWMgcm9sZUNoaWxkcmVuOiBSb2xlO1xyXG4gIFxyXG4gIC8qKiB0ZXJyaXRvcnkgKi8gXHJcbiAgcHVibGljIHRlcnJpdG9yeTogVGVycml0b3J5O1xyXG4gIC8qKiB1c2VyICovXHJcbiAgcHVibGljIHVzZXI6IFVzZXI7XHJcbn1cclxuIiwiaW1wb3J0IHsgUmVzdFNlcnZpY2UgfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJDb25maWd1cmF0aW9uIH0gZnJvbSAnLi91c2VyLWNvbmZpZ3VyYXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogVXNlciBjb25maWd1cmF0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyQ29uZmlndXJhdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyQ29uZmlndXJhdGlvbj4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVVNFUl9DT05GSUdVUkFUSU9OX0FQSSA9ICd1c2VyLWNvbmZpZ3VyYXRpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFVzZXJDb25maWd1cmF0aW9uLCBcInVzZXItY29uZmlndXJhdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSB1c2VyIGNvbmZpZ3VyYXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBVc2VyQ29uZmlndXJhdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKiogc2F2ZSB1c2VyIGNvbmZpZ3VyYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udXNlciAhPSBudWxsKSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3VzZXInLCBpdGVtLnVzZXIpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG5cclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9IG51bGwpIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JywgaXRlbS50ZXJyaXRvcnkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG5cclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0ucm9sZSAhPSBudWxsKSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3JvbGUnLCBpdGVtLnJvbGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG5cclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0ucm9sZUNoaWxkcmVuICE9IG51bGwpIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigncm9sZUNoaWxkcmVuJywgaXRlbS5yb2xlQ2hpbGRyZW4pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG5cclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS5yb2xlID0gaXRlbS5yb2xlIT1udWxsP2l0ZW0ucm9sZS5fbGlua3Muc2VsZi5ocmVmOm51bGw7XHJcbiAgICAgIGl0ZW0udXNlciA9IGl0ZW0udXNlci5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnJvbGVDaGlsZHJlbiA9IGl0ZW0ucm9sZUNoaWxkcmVuIT1udWxsP2l0ZW0ucm9sZUNoaWxkcmVuLl9saW5rcy5zZWxmLmhyZWY6bnVsbDtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX0NPTkZJR1VSQVRJT05fQVBJKSwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeUdyb3VwVHlwZSB9IGZyb20gJy4vdGVycml0b3J5LWdyb3VwLXR5cGUubW9kZWwnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnlUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktdHlwZS5tb2RlbCc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIGNvZGUgKi9cclxuICBwdWJsaWMgY29kZTogc3RyaW5nO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogYWRkcmVzcyovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5QWRkcmVzczogc3RyaW5nO1xyXG4gIC8qKiBhZG1pbiAqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbEF1dGhvcml0eU5hbWU6IHN0cmluZztcclxuICAvKiogd2hldGhlciB0ZXJyaXRvcnkgaXMgYmxvY2tlZCovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47XHJcbiAgLyoqIGNvbW1lbnRzKi9cclxuICBwdWJsaWMgbm90ZTogc3RyaW5nO1xyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICAvKiogY29udGFjdCBlbWFpbCAqLyAgXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5RW1haWw6IHN0cmluZztcclxuICAvKiogZXh0ZW5zaW9uICovXHJcbiAgcHVibGljIGV4dGVudDogc3RyaW5nO1xyXG4gIC8qKiBsb2dvIGltYWdlIFVSTCAqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbEF1dGhvcml0eUxvZ286IHN0cmluZztcclxuICAvKiogY29udGFjdCBvcmdhbml6YXRpb24gbmFtZSAqL1xyXG4gIC8vIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHNjb3BlKi9cclxuICBwdWJsaWMgc2NvcGU6IHN0cmluZztcclxuICAvKiogdHlwZSAqLyAgXHJcbiAgcHVibGljIHR5cGU6IFRlcnJpdG9yeVR5cGU7XHJcbiAgLyoqIGdyb3VwIHR5cGUgKi9cclxuICBwdWJsaWMgZ3JvdXBUeXBlOiBUZXJyaXRvcnlHcm91cFR5cGU7XHJcbiAgLyoqIHRlcnJpdG9yeSBtZW1iZXJzKi9cclxuICBwdWJsaWMgbWVtYmVyczogVGVycml0b3J5W107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4vdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBSZXN0U2VydmljZSB9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUZXJyaXRvcnkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUZXJyaXRvcnk+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRFUlJJVE9SWV9BUEkgPSAndGVycml0b3JpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGVycml0b3J5LCBcInRlcnJpdG9yaWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgdGVycml0b3J5Ki9cclxuICByZW1vdmUoaXRlbTogVGVycml0b3J5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSovXHJcbiAgc2F2ZShpdGVtOiBUZXJyaXRvcnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG5cclxuICAgIGxldCB0ZXJyaXRvcnlHcm91cFR5cGU6YW55ID0ge31cclxuICAgIHRlcnJpdG9yeUdyb3VwVHlwZS5fbGlua3MgPSB7fTtcclxuICAgIHRlcnJpdG9yeUdyb3VwVHlwZS5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgdGVycml0b3J5R3JvdXBUeXBlLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG5cclxuICAgIGlmIChpdGVtLmdyb3VwVHlwZSAhPSBudWxsKSB7XHJcbiAgICAgIHRlcnJpdG9yeUdyb3VwVHlwZSA9IGl0ZW0uZ3JvdXBUeXBlO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uZ3JvdXBUeXBlLl9saW5rcyAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGl0ZW0uZ3JvdXBUeXBlID0gaXRlbS5ncm91cFR5cGUuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfSBcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MgIT0gbnVsbCkge1xyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uZ3JvdXBUeXBlO1xyXG5cclxuICAgICAgaWYgKHRlcnJpdG9yeUdyb3VwVHlwZS5fbGlua3Muc2VsZi5ocmVmID09ICcnKSB7XHJcbiAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignZ3JvdXBUeXBlJywgdGVycml0b3J5R3JvdXBUeXBlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdncm91cFR5cGUnLCB0ZXJyaXRvcnlHcm91cFR5cGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGl0ZW0udHlwZSAhPSBudWxsKVxyXG4gICAgICAgIGl0ZW0udHlwZSA9IGl0ZW0udHlwZS5fbGlua3Muc2VsZi5ocmVmO1xyXG5cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllfQVBJKSwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IHR5cGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlUeXBlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAvKiogaWQgKi9cclxuICAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5VHlwZSB9IGZyb20gJy4vdGVycml0b3J5LXR5cGUubW9kZWwnO1xyXG5cclxuLyoqIFRlcnJpdG9yeVR5cGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeVR5cGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGVycml0b3J5VHlwZT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZVFlQRV9BUEkgPSAndGVycml0b3J5LXR5cGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGVycml0b3J5VHlwZSwgXCJ0ZXJyaXRvcnktdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSB0eXBlKi9cclxuICByZW1vdmUoaXRlbTogVGVycml0b3J5VHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSB0eXBlKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllUWVBFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuLyoqXHJcbiAqIFRlcnJpdG9yeSB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5R3JvdXBUeXBlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IFRlcnJpdG9yeUdyb3VwVHlwZSB9IGZyb20gJy4vdGVycml0b3J5LWdyb3VwLXR5cGUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5R3JvdXBUeXBlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRlcnJpdG9yeUdyb3VwVHlwZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBURVJSSVRPUllHUk9VUFRZUEVfQVBJID0gJ3RlcnJpdG9yeS1ncm91cC10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRlcnJpdG9yeUdyb3VwVHlwZSwgXCJ0ZXJyaXRvcnktZ3JvdXAtdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRlcnJpdG9yeUdyb3VwVHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEVSUklUT1JZR1JPVVBUWVBFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59IiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogUm9sZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJvbGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGNvbW1lbnRzKi9cclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgUm9sZSB9IGZyb20gJy4vcm9sZS5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFJvbGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJvbGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Um9sZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBST0xFX0FQSSA9ICdyb2xlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFJvbGUsIFwicm9sZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHJvbGUqL1xyXG4gIHJlbW92ZShpdGVtOiBSb2xlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgcm9sZSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuUk9MRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIENvbm5lY3Rpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgdXNlcjogc3RyaW5nO1xyXG4gIC8qKiBwYXNzd29yZCovXHJcbiAgcHVibGljIHBhc3N3b3JkOiBzdHJpbmc7XHJcbiAgLyoqIGNvbm5lY3Rpb24gc3RyaW5nKi9cclxuICBwdWJsaWMgY29ubmVjdGlvblN0cmluZzogc3RyaW5nO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ29ubmVjdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDb25uZWN0aW9uPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICdjb25uZWN0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvbm5lY3Rpb24sIFwiY29ubmVjdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNvbm5lY3Rpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBDb25uZWN0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY29ubmVjdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBDb25uZWN0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICB0ZXN0Q29ubmVjdGlvbihpdGVtOmFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQ9dGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkrXCIvdGVzdFwiICwgaXRlbSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuXHJcbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBSb2xlIH0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tHcm91cCB9IGZyb20gJy4vdGFzay1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tBdmFpbGFiaWxpdHkgfSBmcm9tICcuL3Rhc2stYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuaW1wb3J0IHsgVGFza1BhcmFtZXRlciB9IGZyb20gJy4vdGFzay1wYXJhbWV0ZXIubW9kZWwnO1xyXG5cclxuLy9GSVhNRSBlbnN1cmUgdGFzayBjcmVhdGlvbiBpbiBhZG1pbiBhcHAgdXBvbiBpbml0aWFsaXphdGlvbiAoYXMgaXQgaXMgZG9uZSB3aXRoIFJvbGVzIGFuZCBkZWZhdWx0IFVzZXJzKVxyXG4vKiogR0VPQURNSU5fdGFzayBpZCAqL1xyXG5leHBvcnQgY29uc3QgR0VPQURNSU5fVFJFRV9UQVNLX0lEOnN0cmluZyAgPSBcImdlb2FkbWluXCI7XHJcblxyXG5pbXBvcnQgeyBUYXNrVUkgfSBmcm9tICcuL3Rhc2stdWkubW9kZWwnO1xyXG4vKiogVGFzayBtb2RlbCAqL1xyXG5leHBvcnQgY2xhc3MgVGFzayBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSAqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogb3JkZXIqL1xyXG4gIHB1YmxpYyBvcmRlcjogTnVtYmVyO1xyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICAvKiogdGFzayBncm91cCovXHJcbiAgcHVibGljIGdyb3VwOiBUYXNrR3JvdXA7XHJcbiAgLyoqIHRhc2sgdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IFRhc2tUeXBlO1xyXG4gIC8qKiB0YXNrIFVJKi9cclxuICBwdWJsaWMgdWk6IFRhc2tVSTtcclxuICAvKiogcGFyYW1ldGVycyovXHJcbiAgcHVibGljIHBhcmFtZXRlcnM6IFRhc2tQYXJhbWV0ZXJbXTtcclxuICAvKiogY29ubmVjdGlvbiovXHJcbiAgcHVibGljIGNvbm5lY3Rpb246IENvbm5lY3Rpb247XHJcbiAgLyoqIHJvbGVzKi9cclxuICBwdWJsaWMgcm9sZXM6IFJvbGVbXTtcclxuICAvKiogYXZhaWxhYmlsaXRpZXMqL1xyXG4gIHB1YmxpYyBhdmFpbGFiaWxpdGllczogVGFza0F2YWlsYWJpbGl0eVtdO1xyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3Rhc2subW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2s+IHtcclxuXHJcbiAgICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICAgIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICd0YXNrcyc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgICAgIHN1cGVyKFRhc2ssIFwidGFza3NcIiwgaW5qZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiByZW1vdmUgdGFzayovXHJcbiAgICByZW1vdmUoaXRlbTogVGFzaykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBzYXZlIHRhc2sqL1xyXG4gICAgc2F2ZShpdGVtOiBUYXNrKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICAgICAgY29uc3QgdGFza1R5cGUgPSBpdGVtLnR5cGU7XHJcbiAgICAgICAgY29uc3QgdGFza0dyb3VwID0gaXRlbS5ncm91cDtcclxuICAgICAgICBsZXQgdGFza0Nvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb247XHJcbiAgICAgICAgbGV0IHRhc2tVSSA9IGl0ZW0udWk7XHJcbiAgICAgICAgaWYgKGl0ZW0uX2xpbmtzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ09OTkVDVElPTl9BUEkpLCBpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBUYXNrIHR5cGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrVHlwZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovICBcclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrVHlwZSB9IGZyb20gJy4vdGFzay10eXBlLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFza1R5cGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tUeXBlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tUeXBlPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICd0YXNrLXR5cGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza1R5cGUsIFwidGFzay10eXBlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGFzayB0eXBlKi9cclxuICByZW1vdmUoaXRlbTogVGFza1R5cGUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0YXNrIHR5cGUqL1xyXG4gIHNhdmUoaXRlbTogVGFza1R5cGUpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBUYXNrIGdyb3VwIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza0dyb3VwIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza0dyb3VwIH0gZnJvbSAnLi90YXNrLWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBncm91cCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFza0dyb3VwU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tHcm91cD4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay1ncm91cHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrR3JvdXAsIFwidGFzay1ncm91cHNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgZ3JvdXAqL1xyXG4gIHJlbW92ZShpdGVtOiBUYXNrR3JvdXApIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0YXNrIGdyb3VwKi9cclxuICBzYXZlKGl0ZW06IFRhc2tHcm91cCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ09OTkVDVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtUYXNrfSBmcm9tICcuL3Rhc2subW9kZWwnOyAgXHJcbi8qKlxyXG4gKiBUYXNrIHBhcmFtZXRlciBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRhc2tQYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiB2YWx1ZSovXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIG9yZGVyKi8gIFxyXG4gIHB1YmxpYyBvcmRlcjogTnVtYmVyO1xyXG4gIFxyXG4gIC8qKiB0YXNrKi8gIFxyXG4gIHB1YmxpYyB0YXNrOlRhc2s7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRhc2tQYXJhbWV0ZXIgfSBmcm9tICcuL3Rhc2stcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBwYXJhbWV0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBUYXNrUGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tQYXJhbWV0ZXI+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRBU0tfUEFSQU1FVEVSX0FQSSA9ICd0YXNrLXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrUGFyYW1ldGVyLCBcInRhc2stcGFyYW1ldGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGFzayBwYXJhbWV0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBUYXNrUGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBwYXJhbWV0ZXIqL1xyXG4gIHNhdmUoaXRlbTogVGFza1BhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS50YXNrICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGFzaycsaXRlbS50YXNrKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGFzayA9IGl0ZW0udGFzay5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRBU0tfUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuLi90ZXJyaXRvcnkvdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgVGFzayB9IGZyb20gJy4vdGFzay5tb2RlbCc7XHJcbi8qKlxyXG4gKiBUYXNrIGF2YWlsYWJpbGl0eSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRhc2tBdmFpbGFiaWxpdHkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIHRlcnJpdG9yeSovXHJcbiAgcHVibGljIHRlcnJpdG9yeTogVGVycml0b3J5O1xyXG4gIC8qKiB0YXNrKi9cclxuICBwdWJsaWMgdGFzazogVGFzaztcclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrQXZhaWxhYmlsaXR5IH0gZnJvbSAnLi90YXNrLWF2YWlsYWJpbGl0eS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgYXZhaWxhYmlsaXR5IG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgVGFza0F2YWlsYWJpbGl0eVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrQXZhaWxhYmlsaXR5PiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUQVNLX0FWQUlMQUJJTElUWV9BUEkgPSAndGFzay1hdmFpbGFiaWxpdGllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRhc2tBdmFpbGFiaWxpdHksIFwidGFzay1hdmFpbGFiaWxpdGllc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGFzayBhdmFpbGFiaWxpdHkqL1xyXG4gIHJlbW92ZShpdGVtOiBUYXNrQXZhaWxhYmlsaXR5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBhdmFpbGFiaWxpdHkqL1xyXG4gIHNhdmUoaXRlbTogVGFza0F2YWlsYWJpbGl0eSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS50YXNrICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGFzaycsaXRlbS50YXNrKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnRhc2sgPSBpdGVtLnRhc2suX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UQVNLX0FWQUlMQUJJTElUWV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIFRhc2sgVUkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrVUkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHRvb2x0aXAqLyAgXHJcbiAgcHVibGljIHRvb2x0aXA6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiBvcmRlciovIFxyXG4gIHB1YmxpYyBvcmRlcjogbnVtYmVyO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrVUkgfSBmcm9tICcuL3Rhc2stdWkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIFVJIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrVUlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGFza1VJPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICd0YXNrLXVpcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRhc2tVSSwgXCJ0YXNrLXVpc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGFzayBVSSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRhc2tVSSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgVUkqL1xyXG4gIHNhdmUoaXRlbTogVGFza1VJKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkgeyAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7Q29ubmVjdGlvbn0gZnJvbSAnLi4vY29ubmVjdGlvbi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHtTZXJ2aWNlUGFyYW1ldGVyfSBmcm9tICcuL3NlcnZpY2UtcGFyYW1ldGVyLm1vZGVsJztcclxuLyoqXHJcbiAqIFNlcnZpY2UgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB1cmwqLyAgXHJcbiAgcHVibGljIHNlcnZpY2VVUkw6IHN0cmluZztcclxuXHJcbiAgLyoqIHByb2plY3Rpb25zKi8gIFxyXG4gIHB1YmxpYyBzdXBwb3J0ZWRTUlM6IHN0cmluZztcclxuICBcclxuICAvKiogbGVnZW5kKi9cclxuICBwdWJsaWMgbGVnZW5kOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBpbmZvVXJsKi8gIFxyXG4gIHB1YmxpYyBpbmZvVXJsOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG5cclxuICAvKiogY29ubmVjdGlvbiovXHJcbiAgcHVibGljIGNvbm5lY3Rpb246IENvbm5lY3Rpb247XHJcbiAgXHJcbiAgLyoqIHBhcmFtZXRlcnMqLyAgXHJcbiAgcHVibGljIHBhcmFtZXRlcnM6IFNlcnZpY2VQYXJhbWV0ZXJbXTtcclxuXHJcbiAgLyoqIHdoZXRoZXIgc2VydmljZSBpcyBibG9ja2VkKi9cclxuICBwdWJsaWMgYmxvY2tlZDogYm9vbGVhbjtcclxufVxyXG4iLCJpbXBvcnQgeyBTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogU2VydmljZSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgU2VydmljZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxTZXJ2aWNlPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBTRVJWSUNFX0FQSSA9ICdzZXJ2aWNlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFNlcnZpY2UsIFwic2VydmljZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHNlcnZpY2UqL1xyXG4gIHJlbW92ZShpdGVtOiBTZXJ2aWNlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgc2VydmljZSovXHJcbiAgc2F2ZShpdGVtOiBTZXJ2aWNlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGxldCBzZXJ2aWNlQ29ubmVjdGlvbiA9IGl0ZW0uY29ubmVjdGlvbjtcclxuXHJcbiAgICBpZiAoaXRlbS5jb25uZWN0aW9uIT1udWxsKXtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW0uY29ubmVjdGlvbi5fbGlua3MhPSAndW5kZWZpbmVkJykgeyBcclxuICAgICAgICAgICAgaXRlbS5jb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2VydmljZUNvbm5lY3Rpb24uX2xpbmtzPSB7fTtcclxuICAgICAgICAgICAgc2VydmljZUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgICAgICAgICAgc2VydmljZUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZj1cIlwiO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgLy91cGRhdGUgcmVsYXRpb25zXHJcbiAgICAgIC8qZGVsZXRlIGl0ZW0uY29ubmVjdGlvbjsgICAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY9PScnKXtcclxuICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignY29ubmVjdGlvbicsc2VydmljZUNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgXHJcblxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjb25uZWN0aW9uJyxzZXJ2aWNlQ29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgIFxyXG5cclxuICAgICAgXHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgICAgICAgICAgIFxyXG4gICAgICAgfSAqL1xyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5TRVJWSUNFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1NlcnZpY2V9IGZyb20gJy4vc2VydmljZS5tb2RlbCc7IFxyXG4vKipcclxuICogU2VydmljZSBwYXJhbWV0ZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlUGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gICAgXHJcbiAgLyoqIHZhbHVlKi8gIFxyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBzZXJ2aWNlKi9cclxuICBwdWJsaWMgc2VydmljZTogU2VydmljZTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgU2VydmljZVBhcmFtZXRlciB9IGZyb20gJy4vc2VydmljZS1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBTZXJ2aWNlIHBhcmFtZXRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VQYXJhbWV0ZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8U2VydmljZVBhcmFtZXRlcj4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgU0VSVklDRV9QQVJBTUVURVJfQVBJID0gJ3NlcnZpY2UtcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFNlcnZpY2VQYXJhbWV0ZXIsIFwic2VydmljZS1wYXJhbWV0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgcmVtb3ZlKGl0ZW06IFNlcnZpY2VQYXJhbWV0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgc2F2ZShpdGVtOiBTZXJ2aWNlUGFyYW1ldGVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChpdGVtLnNlcnZpY2UgIT1udWxsKXtcclxuICAgICAgICAgIGxldCBzZXJ2aWNlID0gIGl0ZW0uc2VydmljZTtcclxuICAgICAgICAgIGRlbGV0ZSBpdGVtLnNlcnZpY2U7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2VydmljZScsc2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5zZXJ2aWNlID0gaXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuU0VSVklDRV9QQVJBTUVURVJfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7U2VydmljZX0gZnJvbSAnLi4vc2VydmljZS9zZXJ2aWNlLm1vZGVsJztcclxuaW1wb3J0IHtDb25uZWN0aW9ufSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5fSBmcm9tICcuL2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlIDogc3RyaW5nO1xyXG5cclxuICAvKiogc2VydmljZSovXHJcbiAgcHVibGljIHNlcnZpY2UgOiBTZXJ2aWNlO1xyXG5cclxuICAvKiogb3JkZXIqLyAgXHJcbiAgcHVibGljIG9yZGVyOiBOdW1iZXI7IFxyXG5cclxuICAvKiogZGVzY3JpcHRpb24qLyAgXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBTdHJpbmc7XHJcblxyXG4gIC8qKiBzb3VyY2UqLyAgXHJcbiAgcHVibGljIHNvdXJjZTogU3RyaW5nO1xyXG5cclxuICAvKiogd2hldGhlciBjYXJ0b2dyYXBoeSBpcyBibG9ja2VkKi9cclxuICBwdWJsaWMgYmxvY2tlZDogYm9vbGVhbjsgIFxyXG5cclxuICAvKiogYXBwbHkgZmlsdGVyIHRvIGdldCBtYXAqL1xyXG4gIHB1YmxpYyBhcHBseUZpbHRlclRvR2V0TWFwOiBTdHJpbmc7ICBcclxuXHJcbiAgLyoqIGFwcGx5IGZpbHRlciB0byBnZXQgZmVhdHVyZSBpbmZvcm1hdGlvbiovXHJcbiAgcHVibGljIGFwcGx5RmlsdGVyVG9HZXRGZWF0dXJlSW5mbzogYm9vbGVhbjsgIFxyXG5cclxuICAvKiogYXBwbHkgZmlsdGVyIHRvIHNwYXRpYWwgc2VsZWN0aW9uKi9cclxuICBwdWJsaWMgYXBwbHlGaWx0ZXJUb1NwYXRpYWxTZWxlY3Rpb246IGJvb2xlYW47ICBcclxuXHJcbiAgLyoqIHNlbGVjdGFibGUgbGF5ZXJzKi9cclxuICBwdWJsaWMgc2VsZWN0YWJsZUxheWVyczogc3RyaW5nW107XHJcblxyXG4gIC8qKiB0cmFuc3BhcmVuY3kqLyBcclxuICBwdWJsaWMgdHJhbnNwYXJlbmN5OiBOdW1iZXI7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHF1ZXJ5YWJsZSovICBcclxuICBwdWJsaWMgcXVlcnlhYmxlOiBCb29sZWFuO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBxdWVyeWFibGUqLyBcclxuICBwdWJsaWMgcXVlcnlBY3Q6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBxdWVyeSBsYXllciovXHJcbiAgcHVibGljIHF1ZXJ5TGF5OiBzdHJpbmc7XHJcblxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuXHJcbiAgLyoqIG1pbmltdW0gc2NhbGUqL1xyXG4gIHB1YmxpYyBtaW5pbXVtU2NhbGU6IE51bWJlcjtcclxuXHJcbiAgLyoqIG1heGltdW0gc2NhbGUqL1xyXG4gIHB1YmxpYyBtYXhpbXVtU2NhbGU6IE51bWJlcjtcclxuXHJcbiAgLyoqIGxheWVycyovICBcclxuICBwdWJsaWMgbGF5ZXJzOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xyXG5cclxuICAvKiogcXVlcnlhYmxlRmVhdHVyZUVuYWJsZWQgKi9cclxuICBwdWJsaWMgcXVlcnlhYmxlRmVhdHVyZUVuYWJsZWQ6IEJvb2xlYW47XHJcblxyXG4gICAgLyoqIHF1ZXJ5YWJsZUxheWVycyAqL1xyXG4gIHB1YmxpYyBxdWVyeWFibGVGZWF0dXJlQXZhaWxhYmxlOiBCb29sZWFuO1xyXG5cclxuICAgIC8qKiBxdWVyeWFibGVMYXllcnMgKi9cclxuICBwdWJsaWMgcXVlcnlhYmxlTGF5ZXJzOiBzdHJpbmdbXTtcclxuXHJcbiAgLyoqIGF2YWlsYWJpbGl0aWVzKi9cclxuICBwdWJsaWMgYXZhaWxhYmlsaXRpZXMgOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVtdO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBxdWVyeWFibGUqLyBcclxuICBwdWJsaWMgc2VsZWN0YWJsZUZlYXR1cmVFbmFibGVkOiBCb29sZWFuO1xyXG5cclxuICAvKiogc2VsZWN0aW9uIGxheWVyKi9cclxuICBwdWJsaWMgc2VsZWN0aW9uTGF5ZXI6IHN0cmluZztcclxuXHJcbiAgLyoqIHNlbGVjdGlvbiBzZXJ2aWNlKi8gIFxyXG4gIHB1YmxpYyBzZWxlY3Rpb25TZXJ2aWNlOiBTZXJ2aWNlO1xyXG5cclxuICAvKiogbGVnZW5kIHRpcCovICBcclxuICBwdWJsaWMgbGVnZW5kVHlwZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBsZWdlbmQgdXJsKi9cclxuICBwdWJsaWMgbGVnZW5kVVJMOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIGVkaXRhYmxlKi9cclxuICBwdWJsaWMgZWRpdGFibGU6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBtZXRhZGF0YSBVUkwqL1xyXG4gIHB1YmxpYyBtZXRhZGF0YVVSTDogc3RyaW5nO1xyXG5cclxuICAvKiogbWV0YWRhdGEgVVJMKi9cclxuICBwdWJsaWMgZGF0YXNldFVSTDogc3RyaW5nO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyB0aGVtYWJsZSovXHJcbiAgcHVibGljIHRoZW1hdGljOiBCb29sZWFuO1xyXG4gIFxyXG4gIC8qKiBnZW9tZXRyeSB0eXBlKi9cclxuICBwdWJsaWMgZ2VvbWV0cnlUeXBlOiBzdHJpbmc7XHJcbiAgXHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgUmVzdFNlcnZpY2UgfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZS9zZXJ2aWNlLm1vZGVsJztcclxuXHJcbi8qKiBDYXJ0b2dyYXBoeSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHk+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX0FQSSA9ICdjYXJ0b2dyYXBoaWVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5LCBcImNhcnRvZ3JhcGhpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5Ki9cclxuICBzYXZlKGl0ZW06IENhcnRvZ3JhcGh5KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuXHJcbiAgICBsZXQgY2FydG9ncmFwaHlDb25uZWN0aW9uOmFueT17fTtcclxuICAgIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3MgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgY2FydG9ncmFwaHlDb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG4gICAgIFxyXG4gICAgbGV0IGNhcnRvZ3JhcGh5U2VydmljZTphbnk9e307XHJcbiAgICBjYXJ0b2dyYXBoeVNlcnZpY2UuX2xpbmtzID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlcnZpY2UuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5U2VydmljZS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuICAgIFxyXG4gICAgbGV0IGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZTphbnkgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZS5fbGlua3MgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZS5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG5cclxuICAgIGlmIChpdGVtLnNlcnZpY2UgIT0gbnVsbCkge1xyXG4gICAgICBjYXJ0b2dyYXBoeVNlcnZpY2U9ICBpdGVtLnNlcnZpY2U7XHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5zZXJ2aWNlLl9saW5rcyAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGl0ZW0uc2VydmljZSA9IGl0ZW0uc2VydmljZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uc2VsZWN0aW9uU2VydmljZSAhPSBudWxsKSB7XHJcbiAgICAgIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZSA9IGl0ZW0uc2VsZWN0aW9uU2VydmljZVxyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uc2VsZWN0aW9uU2VydmljZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLnNlbGVjdGlvblNlcnZpY2UgPSBpdGVtLnNlbGVjdGlvblNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLmNvbm5lY3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb249ICBpdGVtLmNvbm5lY3Rpb247XHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5jb25uZWN0aW9uLl9saW5rcyAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGl0ZW0uY29ubmVjdGlvbiA9IGl0ZW0uY29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzICE9IG51bGwpIHtcclxuXHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5jb25uZWN0aW9uO1xyXG4gICAgICBkZWxldGUgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICBkZWxldGUgaXRlbS5zZWxlY3Rpb25TZXJ2aWNlO1xyXG5cclxuICAgICAgaWYgKGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmID09ICcnKSB7XHJcbiAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignc3BhdGlhbFNlbGVjdGlvbkNvbm5lY3Rpb24nLCBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc3BhdGlhbFNlbGVjdGlvbkNvbm5lY3Rpb24nLCBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGNhcnRvZ3JhcGh5U2VydmljZS5fbGlua3Muc2VsZi5ocmVmID09ICcnKSB7XHJcbiAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignc2VydmljZScsIGNhcnRvZ3JhcGh5U2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzZXJ2aWNlJywgY2FydG9ncmFwaHlTZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZiA9PSAnJykge1xyXG4gICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3NwYXRpYWxTZWxlY3Rpb25TZXJ2aWNlJywgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NwYXRpYWxTZWxlY3Rpb25TZXJ2aWNlJywgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0FQSSksIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHtSb2xlfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHkgZ3JvdXBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUdyb3VwIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgLyoqIG1lbWJlcnMqL1xyXG4gIHB1YmxpYyBtZW1iZXJzOiBDYXJ0b2dyYXBoeVtdO1xyXG4gIC8qKiByb2xlcyovXHJcbiAgcHVibGljIHJvbGVzOiBSb2xlW107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5R3JvdXAgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHlHcm91cCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlHcm91cFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeUdyb3VwPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9HUk9VUF9BUEkgPSdjYXJ0b2dyYXBoeS1ncm91cHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeUdyb3VwLCBcImNhcnRvZ3JhcGh5LWdyb3Vwc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkgZ3JvdXAqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUdyb3VwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY2FydG9ncmFwaHkgZ3JvdXAqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlHcm91cCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9HUk9VUF9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogdGVycml0b3J5Ki9cclxuICBwdWJsaWMgdGVycml0b3J5OiBUZXJyaXRvcnk7XHJcbiAgXHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIFxyXG4gIC8qKiBjYXJ0b2dyYXBoeSovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSB9IGZyb20gJy4vY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfQVZBSUxBQklMSVRZX0FQSSA9ICdjYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdGllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5LCBcImNhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0aWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxpdGVtLmNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0FWQUlMQUJJTElUWV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5VHlwZSB9IGZyb20gJy4uL3RlcnJpdG9yeS90ZXJyaXRvcnktdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUZpbHRlciBleHRlbmRzIFJlc291cmNlIHtcclxuIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogcmVxdWlyZWQgKi9cclxuICBwdWJsaWMgcmVxdWlyZWQ6IGJvb2xlYW47XHJcblxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG5cclxuICAvKiogVGVycml0b3JpYWwgbGV2ZWwuICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsTGV2ZWw6IFRlcnJpdG9yeVR5cGU7XHJcbiAgXHJcbiAgLyoqIGNvbHVtbiAqL1xyXG4gIHB1YmxpYyBjb2x1bW46IHN0cmluZztcclxuXHJcbiAgLyoqIHZhbHVlcyovICBcclxuICBwdWJsaWMgdmFsdWVzOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB2YWx1ZSovICBcclxuICBwdWJsaWMgdmFsdWVUeXBlOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBjYXJ0b2dyYXBoeSovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5RmlsdGVyIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1maWx0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDYXJ0b2dyYXBoeUZpbHRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5RmlsdGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5RmlsdGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9GSUxURVJfQVBJID0gJ2NhcnRvZ3JhcGh5LWZpbHRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeUZpbHRlciwgXCJjYXJ0b2dyYXBoeS1maWx0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBmaWx0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUZpbHRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUZpbHRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxpdGVtLmNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgXHJcbiAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGlmIChpdGVtLnRlcnJpdG9yaWFsTGV2ZWwgIT0gbnVsbCl7XHJcbiAgICAgICAgaXRlbS50ZXJyaXRvcmlhbExldmVsPWl0ZW0udGVycml0b3JpYWxMZXZlbC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FSVE9HUkFQSFlfRklMVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJzsgXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIHBhcmFtZXRlciBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5UGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gICAgXHJcbiAgLyoqIHZhbHVlKi8gIFxyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBvcmRlciovICBcclxuICBwdWJsaWMgb3JkZXI6IHN0cmluZztcclxuXHJcbiAgLyoqIGNhcnRvZ3JhcGh5Ki9cclxuICBwdWJsaWMgY2FydG9ncmFwaHk6IENhcnRvZ3JhcGh5O1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeVBhcmFtZXRlciB9IGZyb20gJy4vY2FydG9ncmFwaHktcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogU2VydmljZSBwYXJhbWV0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeVBhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeVBhcmFtZXRlcj4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfUEFSQU1FVEVSX0FQSSA9ICdjYXJ0b2dyYXBoeS1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHlQYXJhbWV0ZXIsIFwiY2FydG9ncmFwaHktcGFyYW1ldGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeVBhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IENhcnRvZ3JhcGh5UGFyYW1ldGVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChpdGVtLmNhcnRvZ3JhcGh5ICE9bnVsbCl7XHJcbiAgICAgICAgICBsZXQgY2FydG9ncmFwaHkgPSAgaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgICAgIGRlbGV0ZSBpdGVtLmNhcnRvZ3JhcGh5O1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxjYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9QQVJBTUVURVJfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlHcm91cH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbCc7XHJcbi8qKlxyXG4gKiBCYWNrZ3JvdW5kIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQmFja2dyb3VuZCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogZGVzY3JpcHRpb24qL1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB3aGV0aGVyIGJhY2tncm91bmQgaXMgYWN0aXZlKi9cclxuICBwdWJsaWMgYWN0aXZlOiBCb29sZWFuO1xyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuXHJcbiAgLyoqIGNhcnRvZ3JhcGh5IGdyb3VwKi9cclxuICBwdWJsaWMgY2FydG9ncmFwaHlHcm91cDogQ2FydG9ncmFwaHlHcm91cDtcclxufVxyXG4iLCJpbXBvcnQgeyBCYWNrZ3JvdW5kIH0gZnJvbSAnLi9iYWNrZ3JvdW5kLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQmFja2dyb3VuZCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQmFja2dyb3VuZFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxCYWNrZ3JvdW5kPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBCQUNLR1JPVU5EX0FQSSA9ICdiYWNrZ3JvdW5kcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEJhY2tncm91bmQsIFwiYmFja2dyb3VuZHNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGJhY2tncm91bmQqL1xyXG4gIHJlbW92ZShpdGVtOiBCYWNrZ3JvdW5kKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpOyAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBiYWNrZ3JvdW5kKi9cclxuICBzYXZlKGl0ZW06IEJhY2tncm91bmQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgbGV0IGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwOmFueSA9IHt9ICAgICAgICAgXHJcbiAgICBcclxuICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcz0ge307XHJcbiAgICBiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cC5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzLnNlbGYuaHJlZj1cIlwiO1xyXG4gICAgaXRlbS5jYXJ0b2dyYXBoeUdyb3VwO1xyXG5cclxuICAgIGlmIChpdGVtLmNhcnRvZ3JhcGh5R3JvdXAhPW51bGwpe1xyXG4gICAgICBiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cCA9IGl0ZW0uY2FydG9ncmFwaHlHcm91cDtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW0uY2FydG9ncmFwaHlHcm91cC5fbGlua3MhPSAndW5kZWZpbmVkJykgeyBcclxuICAgICAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeUdyb3VwID0gaXRlbS5jYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgICAgfSAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5jYXJ0b2dyYXBoeUdyb3VwOyAgICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzLnNlbGYuaHJlZj09Jycpe1xyXG4gICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeUdyb3VwJyxiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICBcclxuXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgIFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5R3JvdXAnLGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgXHJcblxyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICB9IFxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5CQUNLR1JPVU5EX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1RyZWVOb2RlfSBmcm9tICcuL3RyZWUtbm9kZS5tb2RlbCc7XHJcbmltcG9ydCB7Um9sZX0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJzsgICAgXHJcbi8qKlxyXG4gKiBUcmVlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJlZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIG5vZGVzICovXHJcbiAgcHVibGljIG5vZGVzOiBUcmVlTm9kZVtdO1xyXG4gIC8qKiBhdmFpbGFibGUgcm9sZXMgKi9cclxuICBwdWJsaWMgYXZhaWxhYmxlUm9sZXMgOiBSb2xlW107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRyZWUgfSBmcm9tICcuL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUcmVlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUcmVlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRyZWU+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVFJFRV9BUEkgPSAndHJlZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUcmVlLCBcInRyZWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmVlKi9cclxuICByZW1vdmUoaXRlbTogVHJlZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRyZWUqL1xyXG4gIHNhdmUoaXRlbTogVHJlZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVFJFRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeX0gZnJvbSAnLi4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHkubW9kZWwnO1xyXG5pbXBvcnQge1RyZWV9IGZyb20gJy4vdHJlZS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBUcmVlIG5vZGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmVlTm9kZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHRvb2x0aXAqL1xyXG4gIHB1YmxpYyB0b29sdGlwOiBzdHJpbmc7XHJcbiAgLyoqIG9yZGVyKi9cclxuICBwdWJsaWMgb3JkZXIgOiBudW1iZXI7XHJcbiAgLyoqIHdoZXRoZXIgdHJlZSBub2RlIGlzIGFjdGl2ZSovXHJcbiAgcHVibGljIGFjdGl2ZTogYm9vbGVhbjtcclxuICAvKiogcGFyZW50IHRyZWUgbm9kZSAqL1xyXG4gIHB1YmxpYyByYWRpbzogYm9vbGVhbjtcclxuICAvKiogcGFyZW50IHRyZWUgbm9kZSAqL1xyXG4gIHB1YmxpYyBwYXJlbnQ6IFRyZWVOb2RlO1xyXG4gIC8qKiBkaXNwbGF5ZWQgY2FydG9ncmFwaHkgKi8gIFxyXG4gIHB1YmxpYyBjYXJ0b2dyYXBoeTogQ2FydG9ncmFwaHk7XHJcbiAgLyoqIHRyZWUgKi8gIFxyXG4gIHB1YmxpYyB0cmVlOiBUcmVlO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUcmVlTm9kZSB9IGZyb20gJy4vdHJlZS1ub2RlLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVHJlZSBub2RlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgVHJlZU5vZGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VHJlZU5vZGU+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVFJFRV9OT0RFX0FQSSA9ICd0cmVlLW5vZGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVHJlZU5vZGUsIFwidHJlZS1ub2Rlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdHJlZSBub2RlKi9cclxuICByZW1vdmUoaXRlbTogVHJlZU5vZGUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0cmVlIG5vZGUqL1xyXG4gIHNhdmUoaXRlbTogVHJlZU5vZGUpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIGNvbnN0IGl0ZW1UcmVlID0gaXRlbS50cmVlO1xyXG4gICAgICBjb25zdCBpdGVtQ2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5O1xyXG4gICAgICBjb25zdCBpdGVtUGFyZW50ID0gaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgXHJcbiAgICAgIGRlbGV0ZSBpdGVtLnRyZWU7XHJcbiAgICAgIGRlbGV0ZSBpdGVtLmNhcnRvZ3JhcGh5O1xyXG4gICAgICBkZWxldGUgaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW1UcmVlICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndHJlZScsaXRlbVRyZWUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbUNhcnRvZ3JhcGh5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY2FydG9ncmFwaHknLGl0ZW1DYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtUGFyZW50ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigncGFyZW50JyxpdGVtUGFyZW50KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaXRlbS50cmVlICYmIGl0ZW0udHJlZS5fbGlua3MgJiYgaXRlbS50cmVlLl9saW5rcy5zZWxmKSB7XHJcbiAgICAgICAgaXRlbS50cmVlID0gaXRlbS50cmVlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgJiYgaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3MgJiYgaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZikge1xyXG4gICAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH0gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UUkVFX05PREVfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VHJlZX0gZnJvbSAnLi4vdHJlZS90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtSb2xlfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5R3JvdXB9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvblBhcmFtZXRlcn0gZnJvbSAnLi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uQmFja2dyb3VuZH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsJztcclxuXHJcbi8vRklYTUUgZW5zdXJlIGFwcGxpY2F0aW9uIGNyZWF0aW9uIGluIGFkbWluIGFwcCB1cG9uIGluaXRpYWxpemF0aW9uIChhcyBpdCBpcyBkb25lIHdpdGggUm9sZXMgYW5kIGRlZmF1bHQgVXNlcnMpXHJcbi8qKiBUZXJyaXRvcmlhbCBhcHBsaWN0aW9uIG5hbWUgKi9cclxuZXhwb3J0IGNvbnN0IFRFUlJJVE9SSUFMX0FQUF9OQU1FOnN0cmluZyAgPSBcIkFwbGljYWNpw4PCs24gVGVycml0b3JpYWxcIjtcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWNhdGlvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0aXRsZSovXHJcbiAgcHVibGljIHRpdGxlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHRoZW1lKi9cclxuICBwdWJsaWMgdGhlbWU6IHN0cmluZztcclxuXHJcbiAgICBcclxuICAvKiogdXJsVGVtcGxhdGUqL1xyXG4gIHB1YmxpYyBqc3BUZW1wbGF0ZTogc3RyaW5nO1xyXG4gIFxyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICBcclxuICAvKiogYXZhaWxhYmxlIHJvbGVzKi9cclxuICBwdWJsaWMgYXZhaWxhYmxlUm9sZXMgOiBSb2xlW107XHJcbiAgXHJcbiAgLyoqIHRyZWVzKi9cclxuICBwdWJsaWMgdHJlZXMgOiBUcmVlW107XHJcbiAgXHJcbiAgLyoqIHNjYWxlcyAoY29tbWEtc2VwYXJhdGVkIHZhbHVlcykqL1xyXG4gIHB1YmxpYyBzY2FsZXM6IHN0cmluZ1tdO1xyXG4gIFxyXG4gIC8qKiBwcm9qZWN0aW9ucyhjb21tYS1zZXBhcmF0ZWQgRVBTRyBjb2RlcykqL1xyXG4gIHB1YmxpYyBzcnM6IHN0cmluZztcclxuICBcclxuICAvKiogd2hldGhlciBhcHBsaWNhdGlvbiB0cmVlIHdpbGwgYXV0byByZWZyZXNoKi8gIFxyXG4gIHB1YmxpYyB0cmVlQXV0b1JlZnJlc2g6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBiYWNrZ3JvdW5kcyovXHJcbiAgcHVibGljIGJhY2tncm91bmRzOiBBcHBsaWNhdGlvbkJhY2tncm91bmRbXTtcclxuXHJcbiAgLyoqIHNpdHVhdGlvbiBtYXAqL1xyXG4gIHB1YmxpYyBzaXR1YXRpb25NYXA6IENhcnRvZ3JhcGh5R3JvdXA7ICAgIFxyXG4gIFxyXG4gIC8qKiBwYXJhbWV0ZXJzKi9cclxuICBwdWJsaWMgcGFyYW1ldGVyczogQXBwbGljYXRpb25QYXJhbWV0ZXJbXTtcclxufVxyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJy4vYXBwbGljYXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHlHcm91cCB9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuXHJcbi8qKiBBcHBsaWNhdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25TZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QXBwbGljYXRpb24+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFQUExJQ0FUSU9OX0FQSSA9ICdhcHBsaWNhdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihBcHBsaWNhdGlvbiwgXCJhcHBsaWNhdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGFwcGxpY2F0aW9uKi9cclxuICByZW1vdmUoaXRlbTogQXBwbGljYXRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhcHBsaWNhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBBcHBsaWNhdGlvbik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwOmFueSA9IHt9O1xyXG4gICAgYXBwbGljYXRpb25TaXR1YXRpb25NYXAuX2xpbmtzPSB7fTtcclxuICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmID0ge307XHJcbiAgICBhcHBsaWNhdGlvblNpdHVhdGlvbk1hcC5fbGlua3Muc2VsZi5ocmVmPVwiXCI7XHJcbiAgICAgXHJcbiAgICBpZiAoaXRlbS5zaXR1YXRpb25NYXAhPW51bGwpe1xyXG4gICAgICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwPWl0ZW0uc2l0dWF0aW9uTWFwO1xyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbS5zaXR1YXRpb25NYXAuX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uc2l0dWF0aW9uTWFwID0gaXRlbS5zaXR1YXRpb25NYXAuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgICB9ICAgICAgIFxyXG4gICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgLy91cGRhdGUgcmVsYXRpb25zXHJcbiAgICAgIGRlbGV0ZSBpdGVtLnNpdHVhdGlvbk1hcDsgICAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmLmhyZWY9PScnKXtcclxuICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignc2l0dWF0aW9uTWFwJyxhcHBsaWNhdGlvblNpdHVhdGlvbk1hcCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICBcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2l0dWF0aW9uTWFwJyxhcHBsaWNhdGlvblNpdHVhdGlvbk1hcCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgIFxyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICB9IFxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BUFBMSUNBVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICAgIFxyXG4gICAgXHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7QmFja2dyb3VuZH0gZnJvbSAnLi4vY2FydG9ncmFwaHkvYmFja2dyb3VuZC5tb2RlbCc7XHJcbmltcG9ydCB7QXBwbGljYXRpb259IGZyb20gJy4vYXBwbGljYXRpb24ubW9kZWwnOyBcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWNhdGlvbiBiYWNrZ3JvdW5kIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25CYWNrZ3JvdW5kIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBvcmRlciovXHJcbiAgcHVibGljIG9yZGVyOiBOdW1iZXI7XHJcbiAgXHJcbiAgLyoqIGJhY2tncm91bmQqL1xyXG4gIHB1YmxpYyBiYWNrZ3JvdW5kOiBCYWNrZ3JvdW5kO1xyXG4gIFxyXG4gIC8qKiBhcHBsaWNhdGlvbiovXHJcbiAgcHVibGljIGFwcGxpY2F0aW9uOiBBcHBsaWNhdGlvbjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb25CYWNrZ3JvdW5kIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQXBwbGljYXRpb24gYmFja2dyb3VuZCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uQmFja2dyb3VuZFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxBcHBsaWNhdGlvbkJhY2tncm91bmQ+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFQUExJQ0FUSU9OX0JBQ0tHUk9VTkRfQVBJID0nYXBwbGljYXRpb24tYmFja2dyb3VuZHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihBcHBsaWNhdGlvbkJhY2tncm91bmQsIFwiYXBwbGljYXRpb24tYmFja2dyb3VuZHNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGFwcGxpY2F0aW9uIGJhY2tncm91bmQqL1xyXG4gIHJlbW92ZShpdGVtOiBBcHBsaWNhdGlvbkJhY2tncm91bmQpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhcHBsaWNhdGlvbiBiYWNrZ3JvdW5kKi9cclxuICBzYXZlKGl0ZW06IEFwcGxpY2F0aW9uQmFja2dyb3VuZCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5hcHBsaWNhdGlvbiAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2FwcGxpY2F0aW9uJyxpdGVtLmFwcGxpY2F0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS5iYWNrZ3JvdW5kICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignYmFja2dyb3VuZCcsaXRlbS5iYWNrZ3JvdW5kKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uYXBwbGljYXRpb24gPSBpdGVtLmFwcGxpY2F0aW9uLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0uYmFja2dyb3VuZCA9IGl0ZW0uYmFja2dyb3VuZC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFQUExJQ0FUSU9OX0JBQ0tHUk9VTkRfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb259IGZyb20gJy4vYXBwbGljYXRpb24ubW9kZWwnOyBcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWNhdGlvbiBwYXJhbWV0ZXIgbW9kZWwgXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25QYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHZhbHVlKi8gICAgXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGFwcGxpY2F0aW9uKi9cclxuICBwdWJsaWMgYXBwbGljYXRpb246IEFwcGxpY2F0aW9uO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvblBhcmFtZXRlciB9IGZyb20gJy4vYXBwbGljYXRpb24tcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQXBwbGljYXRpb24gcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25QYXJhbWV0ZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QXBwbGljYXRpb25QYXJhbWV0ZXI+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFQUExJQ0FUSU9OX1BBUkFNRVRFUl9BUEkgPSAnYXBwbGljYXRpb24tcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEFwcGxpY2F0aW9uUGFyYW1ldGVyLCBcImFwcGxpY2F0aW9uLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGFwcGxpY2F0aW9uKi9cclxuICByZW1vdmUoaXRlbTogQXBwbGljYXRpb25QYXJhbWV0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhcHBsaWNhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBBcHBsaWNhdGlvblBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5hcHBsaWNhdGlvbiAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2FwcGxpY2F0aW9uJyxpdGVtLmFwcGxpY2F0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uYXBwbGljYXRpb24gPSBpdGVtLmFwcGxpY2F0aW9uLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQVBQTElDQVRJT05fUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogQ29ubmVjdGlvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvZGVMaXN0IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgY29kZUxpc3ROYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IENvZGVMaXN0IH0gZnJvbSAnLi9jb2RlbGlzdC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENvbm5lY3Rpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENvZGVMaXN0U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENvZGVMaXN0PiB7XHJcbiAgXHJcbiBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09ERUxJU1RfQVBJID0gJ2NvZGVsaXN0LXZhbHVlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvZGVMaXN0LCBcImNvZGVsaXN0LXZhbHVlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY29ubmVjdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IENvZGVMaXN0KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY29ubmVjdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBDb2RlTGlzdCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ09ERUxJU1RfQVBJICksIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogTGF5ZXIgbW9kZWw6IGNvbmZpZ3VyZSBMYXllciBkYXRhIGFuZCBkaXNwbGF5aW5nIGNvbmZpZ3VyYXRpb24gKi8gXHJcbmV4cG9ydCBjbGFzcyBMYXllciB7XHJcbiAgLy8gRGlzcGxheSBkYXRhXHJcbiAgLyoqIGxheWVyIHZpc2liaWxpdHkqLyAgXHJcbiAgdmlzaWJpbGl0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIC8qKiBUcmFuc3BhcmVuY3kgKFRyYW5zcGFyZW50KSAwLTEgKE9wYXF1ZSkqL1xyXG4gIG9wYWNpdHk6IG51bWJlciA9IDEuMDtcclxuXHJcbiAgLy8gQ29uZmlndXJhdGlvbiBkYXRhXHJcbiAgLyoqIHRpdGxlKi9cclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBJZCB0byBpbmRleCovXHJcbiAgaWQ6IGFueTtcclxuICBcclxuICAvKiogU2VydmljZSBOYW1lKi9cclxuICBzZXJ2ZXJOYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBTZXJ2aWNlIGF0dHJpYnV0aW9ucyovXHJcbiAgYXR0cmlidXRpb25zOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAvKiogUmVxdWVzdCBmb3JtYXQgKGltYWdlL2pwZywgLi4uKSovXHJcbiAgZm9ybWF0OiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIFJlcXVlc3Qgc2VydmljZSB2ZXJzaW9uKi9cclxuICB2ZXJzaW9uOnN0cmluZztcclxuXHJcbiAgLyoqIFNlcnZpY2UgdXJsKi9cclxuICB1cmw6IHN0cmluZztcclxuXHJcbiAgLyoqIElzIGJhc2UgbGF5ZXI/Ki9cclxuICBpc0Jhc2VMYXllcjogYm9vbGVhbjtcclxuXHJcbiAgLyoqIFJlcXVlc3QgbGF5ZXIgbmFtZSovXHJcbiAgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogSXMgdGlsZWQ/Ki9cclxuICB0aWxlZDogYm9vbGVhbjtcclxuICBcclxuICAvKiogRGVzY3JpcHRpb24qL1xyXG4gIGRlc2M6IHN0cmluZyA9IFwiXCI7XHJcbiAgXHJcbiAgLyoqICBUcmFuc3BhcmVudCByZXF1ZXN0IHBhcmFtZXRlcj8qL1xyXG4gIHVybF90cmFuc3BhcmVudDogc3RyaW5nID0gXCJ0cnVlXCI7XHJcbiAgXHJcbiAgLyoqIFJlcXVlc3QgQmFja2dyb3VuZCBwYXJhbWV0ZXIgY29sb3IgKEhleGEpKi9cclxuICB1cmxfYmdjb2xvcjogc3RyaW5nID0gXCIweDAwMDAwMFwiO1xyXG4gIFxyXG4gIC8qKiBSZXF1ZXN0IEV4Y2VwdGlvbiBVUkwqL1xyXG4gIHVybF9leGNlcHRpb246IHN0cmluZztcclxuICBcclxuICAvKiogRXh0ZW50IGZvciB0aWxlZCBzZXJ2aWNlcyovXHJcbiAgZXh0ZW50OiBhbnkgPSBudWxsO1xyXG5cclxuICAvKiogVGlsZSBoZWlnaHQgKGlmIG5vdCBkZWZpbmVkLCB0aGUgZGVmYXVsdCBtYXAgaXMgdGFrZW4pKi9cclxuICB0aWxlSGVpZ2h0PzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIFRpbGUgd2lkdGggKGlmIG5vdCBkZWZpbmVkLCB0aGUgZGVmYXVsdCBtYXAgaXMgdGFrZW4pKi9cclxuICB0aWxlV2lkdGg/Om51bWJlcjtcclxuICBcclxuICAvKiogRW5hYmxlZCBmb3IgR2V0RmVhdHVyZUluZm8gcmVxdWVzdHMgKGVuYWJsZWQgdG8gdXNlIHRoZSB2aWV3ZXIgZmVhdHVyZXMgaW5mb3JtYXRpb24gdG9vbCkqL1xyXG4gIHF1ZXJ5YWJsZT86Ym9vbGVhbiA9IGZhbHNlO1xyXG4gIFxyXG4gIC8qKiBNaW5pbXVtIHNjYWxlKi9cclxuICBtaW5pbXVtU2NhbGU/Om51bWJlcjtcclxuICBcclxuICAvKiogTWF4aW11bSBzY2FsZSovXHJcbiAgbWF4aW11bVNjYWxlPzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIExpc3Qgb2YgYXZhaWxhYmxlIENSUyovXHJcbiAgcHJvamVjdGlvbnM/OnN0cmluZztcclxuICBcclxuICAvKiogRmVhdHVyZXMgaW5mb3JtYXRpb24gVVJMKi9cclxuICBpbmZvVXJsPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIE1ldGFkYXRhIGluZm9ybWF0aW9uIFVSTCovXHJcbiAgbWV0YWRhdGFVcmw/OnN0cmluZztcclxuICBcclxuICAvKiogTGVnZW5kIFVSTCovXHJcbiAgbGVnZW5kVXJsPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIEFycmF5IG9mIE9wdGlvbmFsUGFyYW1ldGVyIG9iamVjdCB0aGF0IGRlZmluZXMgb3RoZXIgb3B0aW9uYWwgcGFyYW1ldGVyLXZhbHVlIHBhaXJzIGZvciB0aGUgcmVxdWVzdCAoVElNRSAuLi4pKi9cclxuICBvcHRpb25hbFBhcmFtZXRlcnM/OkFycmF5PE9wdGlvbmFsUGFyYW1ldGVyPjtcclxufVxyXG5cclxuLyoqIE9wdGlvbmFsIHBhcmFtZXRlciBtb2RlbDogY29uZmlndXJlIHBhcmFtZXRlci12YWx1ZSBwYWlyIHRvIGFkZCB0byB0aGUgcmVxdWVzdCBsYXllciBVUkwgKi9cclxuZXhwb3J0IGNsYXNzIE9wdGlvbmFsUGFyYW1ldGVyIHtcclxuICAvKioga2V5Ki9rZXk6c3RyaW5nO1xyXG4gIC8qKiB2YWx1ZSovdmFsdWU6c3RyaW5nO1xyXG59XHJcblxyXG4vKiogTGF5ZXIgY29uZmlndXJhdGlvbiBtb2RlbDogbW9kaWZ5IHRoZSBjb25maWd1cmF0aW9uIG9mIGEgbGF5ZXIgd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBtYXAgKG1ha2UgdmlzaWJsZSwgbW92ZSB0aGUgbGF5ZXIgLi4uKSAqL1xyXG5leHBvcnQgY2xhc3MgTGF5ZXJDb25maWd1cmF0aW9uIHtcclxuICAvKiogSWRlbnRpZmllciB0byBpbmRleCovaWQ6IGFueTtcclxuICAvKiogTGF5ZXIgdmlzaWJpbGl0eSovdmlzaWJpbGl0eTogYm9vbGVhbjtcclxuICAvKiogTGF5ZXIgdHJhbnNwYXJlbmN5IChUcmFuc3BhcmVudCkgMC0xIChPcGFxdWUpKi9vcGFjaXR5OiBudW1iZXI7XHJcbiAgLyoqIExheWVyIHBvc2l0aW9uKi9wb3NpdGlvbjogbnVtYmVyO1xyXG59XHJcblxyXG4vKiogTGF5ZXIgZ3JvdXAgbW9kZWwqL1xyXG5leHBvcnQgY2xhc3MgTGF5ZXJHcm91cCB7XHJcbiAgLyoqIGluaXRpYWxseSBhY3RpdmF0ZWQgKGFsbCB2aXNpYmxlIGxheWVycykqL2FjdGl2ZT86Ym9vbGVhbjtcclxuICAvKiogZ3JvdXAgbmFtZSovbmFtZT86IFN0cmluZztcclxuICAvKiogZ3JvdXAgaWQqL2lkOiBTdHJpbmc7XHJcbiAgLyoqIGFycmF5IG9mIGNoaWxkIExheWVycyovbGF5ZXJzOiBBcnJheTxMYXllcj47XHJcbn1cclxuXHJcbi8qKiBNYXAgb3B0aW9ucyBjb25maWd1cmF0aW9uIG1vZGVsKi9cclxuZXhwb3J0IGNsYXNzIE1hcE9wdGlvbnNDb25maWd1cmF0aW9uIHtcclxuICAvKiogc2NhbGVzKi9zY2FsZXM/OiBzdHJpbmc7XHJcbiAgLyoqIHByb2plY3Rpb25zKi9wcm9qZWN0aW9ucz86IHN0cmluZztcclxuICAvKiogbWluaW11bSBzY2FsZSovbWluU2NhbGU/Om51bWJlcjtcclxuICAvKiogbWF4aW11bSBzY2FsZSovbWF4U2NhbGU/Om51bWJlcjtcclxuICAvKiogZXh0ZW50Ki9leHRlbnQ/OmFueTtcclxuICAvKiogbWF4aW11bSBleHRlbnQqL21heEV4dGVudD86YW55O1xyXG4gIC8qKiB0aWxlIHdpZHRoKi90aWxlV2lkdGg/Om51bWJlcjtcclxuICAvKiogdGlsZSBoZWlnaHQqL3RpbGVIZWlnaHQ/Om51bWJlcjtcclxuICAvKiogcGFyYW1ldGVycyovcGFyYW1ldGVycz86IEFycmF5PE9wdGlvbmFsUGFyYW1ldGVyPlxyXG59XHJcblxyXG4vKiogTWFwIGNvbXBvbmVudCBzdGF0dXMgbW9kZWwqL1xyXG5leHBvcnQgY2xhc3MgTWFwQ29tcG9uZW50U3RhdHVzIHtcclxuICAgIC8qKiBsb2FkZWQ/Ki9sb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5cclxuLyoqIE1hcCBjb25maWd1cmF0aW9uIG1hbmFnZXIgc2VydmljZSovXHJcbmV4cG9ydCBjbGFzcyBNYXBDb25maWd1cmF0aW9uTWFuYWdlclNlcnZpY2Uge1xyXG4gIHByaXZhdGUgbGF5ZXJzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG4gIHByaXZhdGUgbGF5ZXJzOiBBcnJheTxMYXllcj4gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGJhc2VMYXllckdyb3Vwc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIGJhc2VMYXllckdyb3VwczogQXJyYXk8TGF5ZXJHcm91cD4gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGxheWVyQ29uZmlndXJhdGlvblN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgcHJpdmF0ZSBhZGRMYXllcnNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgcHJpdmF0ZSByZW1vdmVMYXllcnNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcblxyXG4gIHByaXZhdGUgc2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvblN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIG1hcE9wdGlvbnNDb25maWd1cmF0aW9uU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG5cclxuICBwcml2YXRlIG1hcENvbXBvbmVudFN0YXR1c1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICBjb25zdHJ1Y3RvcigpIHsgXHJcbiAgIC8vXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBsYXllciBjb3VudCAqL1xyXG4gIGNvdW50ID0gMDtcclxuXHJcbiAgLyoqIGNvbmZpZ3VyZSB0aGUgb3ZlcmxheSBsYXllcnMgb2YgdGhlIG1hcCwgYnkgcGFzc2luZyBhcyBhIHBhcmFtZXRlciBhbiBhcnJheSBvZiBvYmplY3RzIG9mIHR5cGUgTGF5ZXIgb2JqZWN0cyBkZWZpbmluZyB0aGUgbGF5ZXJzIHRvIGxvYWQuKi9cclxuICBsb2FkTGF5ZXJzQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7XHJcbiAgICBpZiAodGhpcy5sYXllcnMgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmNsZWFyTGF5ZXJzKGZhbHNlKTtcclxuICAgIH1cclxuICAgIHRoaXMuc2V0TGF5ZXJzKGNvbmZpZ3VyYXRpb24pO1xyXG4gIH1cclxuICBcclxuICAvKipjb25maWd1cmUgdGhlIGJhc2UgbGF5ZXJzIG9mIHRoZSBtYXAgYnkgcGFzc2luZyBhcyBhIHBhcmFtZXRlciBhbiBhcnJheSBvZiBvYmplY3RzIG9mIHR5cGUgTGF5ZXJHcm91cCBlYWNoIG9mIHRoZW0gd2l0aCB0aGUgY29ycmVzcG9uZGluZyBMYXllciBvYmplY3RzIGRlZmluaW5nIHRoZSBsYXllcnMgdG8gbG9hZC4qL1xyXG4gIGxvYWRCYXNlTGF5ZXJzQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7XHJcbiAgICB0aGlzLnNldEJhc2VMYXllckdyb3Vwcyhjb25maWd1cmF0aW9uKTtcclxuICB9XHJcblxyXG4gIC8qKiBnZXQgYmFzZSBsYXllciBncm91cHMqL1xyXG4gIGdldEJhc2VMYXllckdyb3VwcygpOiBPYnNlcnZhYmxlPExheWVyR3JvdXBbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuYmFzZUxheWVyR3JvdXBzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBzZXQgYmFzZSBsYXllciBncm91cHMqL1xyXG4gIHNldEJhc2VMYXllckdyb3Vwcyhncm91cHM6QXJyYXk8TGF5ZXJHcm91cD4pIHtcclxuICAgIHRoaXMuYmFzZUxheWVyR3JvdXBzID0gZ3JvdXBzO1xyXG4gICAgdGhpcy5yZWZyZXNoQmFzZUxheWVyR3JvdXBzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hCYXNlTGF5ZXJHcm91cHMoKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLmJhc2VMYXllckdyb3Vwc1N1YmplY3QubmV4dCh0aGlzLmJhc2VMYXllckdyb3Vwcyk7XHJcbiAgfVxyXG5cclxuICAvKiogZ2V0IGxheWVycyovXHJcbiAgZ2V0TGF5ZXJzKCk6IE9ic2VydmFibGU8TGF5ZXJbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgYWxsIGxheWVycyBmcm9tIG1hcCovXHJcbiAgY2xlYXJMYXllcnMocmVmcmVzaDpib29sZWFuKSB7XHJcbiAgICB3aGlsZSh0aGlzLmxheWVycy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5sYXllcnMucG9wKCk7XHJcbiAgICB9XHJcbiAgICBpZiAocmVmcmVzaCkge1xyXG4gICAgICB0aGlzLnJlZnJlc2hMYXllcnMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBzZXQgbGF5ZXJzKi9cclxuICBzZXRMYXllcnMobGF5ZXJzOkFycmF5PExheWVyPikge1xyXG4gICAgdGhpcy5sYXllcnMgPSBsYXllcnM7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllcnMoKTtcclxuICB9XHJcblxyXG4gIC8qKiBhZGQgZ2l2ZW4gbGF5ZXIgdG8gbWFwKi9cclxuICBhZGRMYXllcihsYXllcjpMYXllcikge1xyXG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XHJcbiAgICB0aGlzLnJlZnJlc2hBZGRMYXllcnMobGF5ZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGFkZCBnaXZlbiBsYXllciB0byBtYXAgYXQgZ2l2ZW4gaW5kZXgqL1xyXG4gIGFkZExheWVyQXQobGF5ZXI6TGF5ZXIsIGluZGV4Om51bWJlcikge1xyXG4gICAgaWYgKGluZGV4ID09IDApIHtcclxuICAgICAgdGhpcy5sYXllcnMgPSBbbGF5ZXJdLmNvbmNhdCh0aGlzLmxheWVycyk7XHJcbiAgICB9IGVsc2UgaWYgKGluZGV4ID49IHRoaXMubGF5ZXJzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubGF5ZXJzID0gdGhpcy5sYXllcnMuc2xpY2UoMCwgaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChbbGF5ZXJdKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5sYXllcnMuc2xpY2UoaW5kZXgsIHRoaXMubGF5ZXJzLmxlbmd0aCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZWZyZXNoQWRkTGF5ZXJzKGxheWVyKTtcclxuICAgIHRoaXMucmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihsYXllci5pZCwgbnVsbCwgbnVsbCwgaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBnaXZlbiBsYXllciBmcm9tIG1hcCovXHJcbiAgcmVtb3ZlTGF5ZXIobGF5ZXI6TGF5ZXIpIHtcclxuICAgIHZhciBpbmRleCA9IHRoaXMubGF5ZXJzLmluZGV4T2YobGF5ZXIpO1xyXG4gICAgdGhpcy5yZW1vdmVMYXllckluZGV4KGluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgbGF5ZXIgd2l0aCBnaXZlbiBpZCBmcm9tIG1hcCAqL1xyXG4gIHJlbW92ZUxheWVySWQoaWQpIHtcclxuICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSB0aGlzLmxheWVycy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcclxuICAgICAgaWYgKHRoaXMubGF5ZXJzW2ldLmlkID09IGlkKSB7XHJcbiAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlbW92ZUxheWVySW5kZXgoaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBsYXllciBhdCBnaXZlbiBpbmRleCBmcm9tIG1hcCAqL1xyXG4gIHJlbW92ZUxheWVySW5kZXgoaW5kZXg6bnVtYmVyKSB7XHJcbiAgICB2YXIgbGF5ZXIgPSB0aGlzLmxheWVyc1tpbmRleF07XHJcbiAgICB0aGlzLmxheWVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgdGhpcy5yZWZyZXNoUmVtb3ZlTGF5ZXJzKGxheWVyKTtcclxuICB9XHJcblxyXG4gIC8qKiByZWZyZXNoIGxheWVycyAqL1xyXG4gIHByaXZhdGUgcmVmcmVzaExheWVycygpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMubGF5ZXJzU3ViamVjdC5uZXh0KHRoaXMubGF5ZXJzKTtcclxuICB9XHJcblxyXG4gIC8qKiBPYnNlcnZhYmxlIGZvciBsYXllcnMgYWRkZWQgKi9cclxuICBnZXRMYXllcnNBZGRlZCgpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLmFkZExheWVyc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hBZGRMYXllcnMobGF5ZXI6TGF5ZXIpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMuYWRkTGF5ZXJzU3ViamVjdC5uZXh0KFtsYXllcl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGF5ZXJzUmVtb3ZlZCgpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLnJlbW92ZUxheWVyc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hSZW1vdmVMYXllcnMobGF5ZXI6TGF5ZXIpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMucmVtb3ZlTGF5ZXJzU3ViamVjdC5uZXh0KFtsYXllcl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGF5ZXJDb25maWd1cmF0aW9uTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxMYXllckNvbmZpZ3VyYXRpb25bXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJDb25maWd1cmF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0TGF5ZXJJbmRleEJ5SWQoaWQ6c3RyaW5nKTpudW1iZXJ7XHJcbiAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gdGhpcy5sYXllcnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLmxheWVyc1tpXS5pZCA9PSBpZCkge1xyXG4gICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGluZGV4O1xyXG4gIH1cclxuICBcclxuICAvKiogbW92ZSBsYXllciB3aXRoIGdpdmVuIGlkIHRvIHRoZSBnaXZlbiBpbmRleCovXHJcbiAgbW92ZUxheWVyKGlkLCBpbmRleCkge1xyXG4gICAgdmFyIGxheWVySW5kZXggPSB0aGlzLmdldExheWVySW5kZXhCeUlkKGlkKTtcclxuICAgIGlmIChsYXllckluZGV4ICE9IC0xKSB7XHJcbiAgICAgIHZhciBsYXllciA9IHRoaXMubGF5ZXJzLnNwbGljZShsYXllckluZGV4LCAxKTtcclxuICAgICAgdGhpcy5sYXllcnMgPSBcclxuICAgICAgICB0aGlzLmxheWVycy5zbGljZSgwLCBpbmRleClcclxuICAgICAgICAuY29uY2F0KGxheWVyKVxyXG4gICAgICAgIC5jb25jYXQodGhpcy5sYXllcnMuc2xpY2UoaW5kZXgsIHRoaXMubGF5ZXJzLmxlbmd0aCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBudWxsLCBudWxsLCBpbmRleCk7XHJcbiAgfVxyXG5cclxuICAvKiogY2hhbmdlIHZpc2liaWxpdHkgb2YgbGF5ZXIgd2l0aCBnaXZlbiBpZCB0byB0aGUgZ2l2ZW4gdmFsdWUqL1xyXG4gIGNoYW5nZUxheWVyVmlzaWJpbGl0eShpZCwgdmlzaWJpbGl0eSkge1xyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBudWxsLCB2aXNpYmlsaXR5LCBudWxsKTtcclxuICB9XHJcblxyXG4gIC8qKiBjaGFuZ2Ugb3BhY2l0eSBvZiBsYXllciB3aXRoIGdpdmVuIGlkIHRvIHRoZSBnaXZlbiB2YWx1ZSovXHJcbiAgY2hhbmdlTGF5ZXJPcGFjaXR5KGlkLCBvcGFjaXR5KSB7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24oaWQsIG9wYWNpdHksIG51bGwsIG51bGwpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBvcGFjaXR5LCB2aXNpYmlsaXR5LCBwb3NpdGlvbikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdmFyIGxheWVyID0gbmV3IExheWVyQ29uZmlndXJhdGlvbigpO1xyXG4gICAgbGF5ZXIuaWQgPSBpZDtcclxuICAgIGxheWVyLm9wYWNpdHkgPSBvcGFjaXR5O1xyXG4gICAgbGF5ZXIudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XHJcbiAgICBsYXllci5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgdGhpcy5sYXllckNvbmZpZ3VyYXRpb25TdWJqZWN0Lm5leHQoW2xheWVyXSk7XHJcbiAgfVxyXG5cclxuICBnZXRTaXR1YXRpb25NYXBDb25maWd1cmF0aW9uTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5zaXR1YXRpb25NYXBDb25maWd1cmF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBjb25maWd1cmUgdGhlIHNpdHVhdGlvbiBtYXAgb2YgdGhlIG1hcCBjb21wb25lbnQgYnkgcGFzc2luZyBhcyBhIHBhcmFtZXRlciBhbiBhcnJheSBvZiBvYmplY3RzIG9mIHR5cGUgTGF5ZXJHcm91cCwgZWFjaCBvZiB0aGVtIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgTGF5ZXIgb2JqZWN0cyBkZWZpbmluZyB0aGUgbGF5ZXJzIHRvIGxvYWQgYXMgc2l0dWF0aW9uIG1hcC4qL1xyXG4gIGxvYWRTaXR1YXRpb25NYXBDb25maWd1cmF0aW9uKGxheWVyczpBcnJheTxMYXllcj4pIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMuc2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvblN1YmplY3QubmV4dChsYXllcnMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25MaXN0ZW5lcigpOiBPYnNlcnZhYmxlPE1hcE9wdGlvbnNDb25maWd1cmF0aW9uW10+IHtcclxuICAgIHJldHVybiB0aGlzLm1hcE9wdGlvbnNDb25maWd1cmF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBsb2FkIG1hcCBvcHRpb25zIGNvbmZpZ3VyYXRpb24gKi9cclxuICBsb2FkTWFwT3B0aW9uc0NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbjpNYXBPcHRpb25zQ29uZmlndXJhdGlvbikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5tYXBPcHRpb25zQ29uZmlndXJhdGlvblN1YmplY3QubmV4dChbY29uZmlndXJhdGlvbl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFwQ29tcG9uZW50U3RhdHVzTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxNYXBDb21wb25lbnRTdGF0dXNbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubWFwQ29tcG9uZW50U3RhdHVzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNldCBtYXAgY29tcG9uZW50IHN0YXR1cyAqL1xyXG4gIHNldE1hcENvbXBvbmVudFN0YXR1cyhzdGF0dXM6TWFwQ29tcG9uZW50U3RhdHVzKSB7XHJcbiAgICAvL05vdGlmeSB0aGUgbWFwIGNvbXBvbmVudCBzdGF0dXNcclxuICAgIHRoaXMubWFwQ29tcG9uZW50U3RhdHVzU3ViamVjdC5uZXh0KFtzdGF0dXNdKTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIEB3aGF0SXREb2VzIENvbmRpdGlvbmFsbHkgaW5jbHVkZXMgYW4gSFRNTCBlbGVtZW50IGlmIGN1cnJlbnQgdXNlciBoYXMgYW55XHJcbiAqIG9mIHRoZSBhdXRob3JpdGllcyBwYXNzZWQgYXMgdGhlIGBleHByZXNzaW9uYC5cclxuICpcclxuICogQGhvd1RvVXNlXHJcbiAqIGBgYFxyXG4gKiAgICAgPHNvbWUtZWxlbWVudCAqc2l0bXVuSGFzQW55QXV0aG9yaXR5PVwiJ1JPTEVfQURNSU4nXCI+Li4uPC9zb21lLWVsZW1lbnQ+XHJcbiAqXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCJbJ1JPTEVfQURNSU4nLCAnUk9MRV9VU0VSJ11cIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICogYGBgXHJcbiAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3NpdG11bkhhc0FueUF1dGhvcml0eV0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUge1xyXG4gICAgXHJcbiAgICAvKiogYXV0aG9yaXRpZXMgdG8gY2hlY2sgKi9cclxuICAgIHB1YmxpYyBhdXRob3JpdGllczogc3RyaW5nW107IFxyXG4gICAgXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWwsIHByaXZhdGUgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4sIHByaXZhdGUgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogdGVycml0b3J5IHRvIGNoZWNrIGF1dGhvcml0aWVzKi9cclxuICAgIEBJbnB1dCgpIHRlcnJpdG9yeTogc3RyaW5nO1xyXG4gICAgXHJcbiAgICAvKiogU2V0IHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzICovXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0IHNpdG11bkhhc0FueUF1dGhvcml0eSh2YWx1ZTogc3RyaW5nfHN0cmluZ1tdKSB7XHJcbiAgICAgICAgdGhpcy5hdXRob3JpdGllcyA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBbIDxzdHJpbmc+IHZhbHVlIF0gOiA8c3RyaW5nW10+IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlldygpO1xyXG4gICAgICAgIC8vIEdldCBub3RpZmllZCBlYWNoIHRpbWUgYXV0aGVudGljYXRpb24gc3RhdGUgY2hhbmdlcy5cclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5nZXRBdXRoZW50aWNhdGlvblN0YXRlKCkuc3Vic2NyaWJlKChpZGVudGl0eSkgPT4gdGhpcy51cGRhdGVWaWV3KCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogdXBkYXRlIHZpZXcgKi9cclxuICAgIHByaXZhdGUgdXBkYXRlVmlldygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy50ZXJyaXRvcnkpe1xyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5KHRoaXMuYXV0aG9yaXRpZXMsdGhpcy50ZXJyaXRvcnkpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmhhc0FueUF1dGhvcml0eSh0aGlzLmF1dGhvcml0aWVzKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKipcclxuICogQHdoYXRJdERvZXMgQ29uZGl0aW9uYWxseSBpbmNsdWRlcyBhbiBIVE1MIGVsZW1lbnQgaWYgY3VycmVudCB1c2VyIGhhcyBhbnlcclxuICogb2YgdGhlIGF1dGhvcml0aWVzIHBhc3NlZCBhcyB0aGUgYGV4cHJlc3Npb25gLlxyXG4gKlxyXG4gKiBAaG93VG9Vc2VcclxuICogYGBgXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCInUk9MRV9BRE1JTidcIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICpcclxuICogICAgIDxzb21lLWVsZW1lbnQgKnNpdG11bkhhc0FueUF1dGhvcml0eT1cIlsnUk9MRV9BRE1JTicsICdST0xFX1VTRVInXVwiPi4uLjwvc29tZS1lbGVtZW50PlxyXG4gKiBgYGBcclxuICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbc2l0bXVuSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnldJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUge1xyXG5cclxuICAgIC8qKiBhdXRob3JpdGllcyB0byBjaGVjayAqL1xyXG4gICAgcHVibGljIGF1dGhvcml0aWVzOiBzdHJpbmdbXTsgXHJcblxyXG4gICAgLyoqIHRlcnJpdG9yeSB0byBjaGVjayBhdXRob3JpdGllcyovXHJcbiAgICBwdWJsaWMgdGVycml0b3J5OiBzdHJpbmc7IFxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmluY2lwYWw6IFByaW5jaXBhbCwgcHJpdmF0ZSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PiwgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBTZXQgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgb24gdGVycml0b3J5ICovXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0IHNpdG11bkhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5KG9wdHM6IGFueSkge1xyXG5cclxuICAgICAgICB0aGlzLmF1dGhvcml0aWVzID0gdHlwZW9mIG9wdHMuYXV0aG9yaXRpZXMgPT09ICdzdHJpbmcnID8gWyA8c3RyaW5nPiBvcHRzLmF1dGhvcml0aWVzIF0gOiA8c3RyaW5nW10+IG9wdHMuYXV0aG9yaXRpZXM7XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBvcHRzLnRlcnJpdG9yeTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcclxuICAgICAgICAvLyBHZXQgbm90aWZpZWQgZWFjaCB0aW1lIGF1dGhlbnRpY2F0aW9uIHN0YXRlIGNoYW5nZXMuXHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuZ2V0QXV0aGVudGljYXRpb25TdGF0ZSgpLnN1YnNjcmliZSgoaWRlbnRpdHkpID0+IHRoaXMudXBkYXRlVmlldygpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHVwZGF0ZSB2aWV3ICovXHJcbiAgICBwcml2YXRlIHVwZGF0ZVZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMudGVycml0b3J5KXtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeSh0aGlzLmF1dGhvcml0aWVzLHRoaXMudGVycml0b3J5KS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHkodGhpcy5hdXRob3JpdGllcykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge0h0dHBDbGllbnRNb2R1bGUsIEhUVFBfSU5URVJDRVBUT1JTLCBIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbi8vaW1wb3J0IHsgQW5ndWxhckhhbE1vZHVsZSB9IGZyb20gJy4uLy4uL2xpYi9hbmd1bGFyLWhhbCc7XHJcbmltcG9ydCB7Q29kZUxpc3RTZXJ2aWNlfSBmcm9tICcuL2NvZGVsaXN0L2NvZGVsaXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1RlcnJpdG9yeVNlcnZpY2V9IGZyb20gJy4vdGVycml0b3J5L3RlcnJpdG9yeS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUZXJyaXRvcnlUeXBlU2VydmljZX0gZnJvbSAnLi90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUuc2VydmljZSc7XHJcbmltcG9ydCB7VGVycml0b3J5R3JvdXBUeXBlU2VydmljZX0gZnJvbSAnLi90ZXJyaXRvcnkvdGVycml0b3J5LWdyb3VwLXR5cGUuc2VydmljZSc7XHJcbmltcG9ydCB7VXNlclBvc2l0aW9uU2VydmljZX0gZnJvbSAnLi91c2VyL3VzZXItcG9zaXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7VXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlfSBmcm9tICcuL3VzZXIvdXNlci1jb25maWd1cmF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge1JvbGVTZXJ2aWNlfSBmcm9tICcuL3JvbGUvcm9sZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtVc2VyU2VydmljZX0gZnJvbSAnLi91c2VyL3VzZXIuc2VydmljZSc7XHJcbmltcG9ydCB7Q29ubmVjdGlvblNlcnZpY2V9IGZyb20gJy4vY29ubmVjdGlvbi9jb25uZWN0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrVHlwZVNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLXR5cGUuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza0dyb3VwU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stZ3JvdXAuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1BhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrQXZhaWxhYmlsaXR5U2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stYXZhaWxhYmlsaXR5LnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tVSVNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLXVpLnNlcnZpY2UnO1xyXG5pbXBvcnQge1NlcnZpY2VTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2Uvc2VydmljZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtTZXJ2aWNlUGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlL3NlcnZpY2UtcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5U2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5LnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5RmlsdGVyU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1maWx0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlHcm91cFNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlQYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtCYWNrZ3JvdW5kU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyZWVTZXJ2aWNlfSBmcm9tICcuL3RyZWUvdHJlZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmVlTm9kZVNlcnZpY2V9IGZyb20gJy4vdHJlZS90cmVlLW5vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25TZXJ2aWNlfSBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25CYWNrZ3JvdW5kU2VydmljZX0gZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXBDb25maWd1cmF0aW9uTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL21hcC9tYXAtY29uZmlndXJhdGlvbi1tYW5hZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC9hdXRoLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL2F1dGgvcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoSW50ZXJjZXB0b3IgfSBmcm9tICcuL2F1dGgvYXV0aC5pbnRlcmNlcHRvcic7XHJcbmltcG9ydCB7IEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IgfSBmcm9tICcuL2F1dGgvYXV0aC1leHBpcmVkLmludGVyY2VwdG9yJztcclxuaW1wb3J0IHsgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlIH0gZnJvbSAnLi9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlIH0gZnJvbSAnLi9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LW9uLXRlcnJpdG9yeS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBMb2dpblNlcnZpY2UgfSBmcm9tICcuL2F1dGgvbG9naW4uc2VydmljZSc7XHJcbmltcG9ydCB7IEFjY291bnRTZXJ2aWNlIH0gZnJvbSAnLi9hY2NvdW50L2FjY291bnQuc2VydmljZSc7XHJcbmltcG9ydCB7VHJhbnNsYXRlSHR0cExvYWRlcn0gZnJvbSAnQG5neC10cmFuc2xhdGUvaHR0cC1sb2FkZXInO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUxvYWRlciwgVHJhbnNsYXRlTW9kdWxlfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuXHJcbi8qKiBsb2FkIGkxOG4gYXNzZXRzKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zbGF0ZUxvYWRlcihodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgcmV0dXJuIG5ldyBUcmFuc2xhdGVIdHRwTG9hZGVyKGh0dHAsICcuL2Fzc2V0cy9pMThuLycsICcuanNvbicpO1xyXG59XHJcblxyXG5cclxuLyoqIFNJVE1VTiBmcm9udGVuZCBjb3JlIG1vZHVsZSAqL1xyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIC8qUm91dGVyTW9kdWxlLFxyXG4gICAgSHR0cENsaWVudE1vZHVsZSxcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIEFuZ3VsYXJIYWxNb2R1bGUsKi9cclxuICAgIFRyYW5zbGF0ZU1vZHVsZS5mb3JSb290KHtcclxuICAgICAgbG9hZGVyOiB7XHJcbiAgICAgICAgcHJvdmlkZTogVHJhbnNsYXRlTG9hZGVyLFxyXG4gICAgICAgIHVzZUZhY3Rvcnk6IChjcmVhdGVUcmFuc2xhdGVMb2FkZXIpLFxyXG4gICAgICAgIGRlcHM6IFtIdHRwQ2xpZW50XVxyXG4gICAgICB9XHJcbiAgICB9KSxcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlLFxyXG4gICAgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUsXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUsXHJcbiAgICBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSxcclxuICAgIFRyYW5zbGF0ZU1vZHVsZVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFNpdG11bkZyb250ZW5kQ29yZU1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBDb2RlTGlzdFNlcnZpY2UsXHJcbiAgICAgICAgVGVycml0b3J5U2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlUeXBlU2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlHcm91cFR5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFJvbGVTZXJ2aWNlLFxyXG4gICAgICAgIEFjY291bnRTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhTZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJTZXJ2aWNlLFxyXG4gICAgICAgIENvbm5lY3Rpb25TZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tUeXBlU2VydmljZSxcclxuICAgICAgICBUYXNrVUlTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tHcm91cFNlcnZpY2UsXHJcbiAgICAgICAgVGFza1BhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgVGFza0F2YWlsYWJpbGl0eVNlcnZpY2UsXHJcbiAgICAgICAgU2VydmljZVNlcnZpY2UsXHJcbiAgICAgICAgU2VydmljZVBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5U2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeVBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlGaWx0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIEJhY2tncm91bmRTZXJ2aWNlLFxyXG4gICAgICAgIFRyZWVTZXJ2aWNlLFxyXG4gICAgICAgIFRyZWVOb2RlU2VydmljZSxcclxuICAgICAgICBBcHBsaWNhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgQXBwbGljYXRpb25QYXJhbWV0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIEFwcGxpY2F0aW9uQmFja2dyb3VuZFNlcnZpY2UsXHJcbiAgICAgICAgQXV0aEludGVyY2VwdG9yLFxyXG4gICAgICAgIEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgUHJpbmNpcGFsLFxyXG4gICAgICAgIFVzZXJQb3NpdGlvblNlcnZpY2UsXHJcbiAgICAgICAgVXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIExvZ2luU2VydmljZSxcclxuICAgICAgICBNYXBDb25maWd1cmF0aW9uTWFuYWdlclNlcnZpY2UsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXHJcbiAgICAgICAgICB1c2VDbGFzczogQXV0aEludGVyY2VwdG9yLFxyXG4gICAgICAgICAgbXVsdGk6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgLCB7XHJcbiAgICAgICAgICBwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SUyxcclxuICAgICAgICAgIHVzZUNsYXNzOiBBdXRoRXhwaXJlZEludGVyY2VwdG9yLFxyXG4gICAgICAgICAgbXVsdGk6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG4iLCJpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7SGFsUGFyYW0sIFJlc3RTZXJ2aWNlfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7RXh0ZXJuYWxTZXJ2aWNlfSBmcm9tICcuL2V4dGVybmFsLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlfSBmcm9tICcuL2V4dGVybmFsLWNvbmZpZ3VyYXRpb24uaGFuZGxlcic7XHJcblxyXG5pbXBvcnQgJ3J4anMnO1xyXG5cclxuaW1wb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5cclxuZXhwb3J0IHtFeHRlcm5hbFNlcnZpY2V9IGZyb20gJy4vZXh0ZXJuYWwuc2VydmljZSc7XHJcbmV4cG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuZXhwb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmV4cG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmV4cG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuZXhwb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5leHBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9FeHRlcm5hbENvbmZpZ3VyYXRpb24nO1xyXG5leHBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2V9IGZyb20gJy4vZXh0ZXJuYWwtY29uZmlndXJhdGlvbi5oYW5kbGVyJztcclxuZXhwb3J0IHtIYWxPcHRpb25zLCBIYWxQYXJhbX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5leHBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcblxyXG5cclxuLyoqIEFuZ3VsYXIgSEFMIG1vZHVsZSAqL1xyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogW0h0dHBDbGllbnRNb2R1bGVdLFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXSxcclxuICAgIGV4cG9ydHM6IFtIdHRwQ2xpZW50TW9kdWxlXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIEV4dGVybmFsU2VydmljZSxcclxuICAgICAgICBIdHRwQ2xpZW50LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHJvdmlkZTogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICB1c2VDbGFzczogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICBkZXBzOiBbRXh0ZXJuYWxTZXJ2aWNlXVxyXG4gICAgICAgIH1dXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFySGFsTW9kdWxlIHtcclxuICAgIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5nTW9kdWxlOiBBbmd1bGFySGFsTW9kdWxlLFxyXG4gICAgICAgICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICAgICAgICAgIEV4dGVybmFsU2VydmljZSxcclxuICAgICAgICAgICAgICAgIEh0dHBDbGllbnQsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZTogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZUNsYXNzOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwczogW0V4dGVybmFsU2VydmljZV1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0iXX0=