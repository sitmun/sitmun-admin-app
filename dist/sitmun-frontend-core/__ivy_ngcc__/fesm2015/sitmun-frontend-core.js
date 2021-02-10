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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWNvcmUuanMiLCJzb3VyY2VzIjpbIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLWFycmF5LnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UtaGVscGVyLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvZXh0ZXJuYWwuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYWNjb3VudC9hY2NvdW50LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLmludGVyY2VwdG9yLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvcHJpbmNpcGFsLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLWV4cGlyZWQuaW50ZXJjZXB0b3IudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9sb2dpbi5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3VzZXIvdXNlci5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3VzZXIvdXNlci1wb3NpdGlvbi5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24uc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItY29uZmlndXJhdGlvbi5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItY29uZmlndXJhdGlvbi5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGVycml0b3J5L3RlcnJpdG9yeS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktdHlwZS5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LWdyb3VwLXR5cGUubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGVycml0b3J5L3RlcnJpdG9yeS1ncm91cC10eXBlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3JvbGUvcm9sZS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24uc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2subW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXR5cGUubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXR5cGUuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stZ3JvdXAubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXBhcmFtZXRlci5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stcGFyYW1ldGVyLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWF2YWlsYWJpbGl0eS5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stYXZhaWxhYmlsaXR5LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXVpLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3NlcnZpY2Uvc2VydmljZS5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9zZXJ2aWNlL3NlcnZpY2Uuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9zZXJ2aWNlL3NlcnZpY2UtcGFyYW1ldGVyLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3NlcnZpY2Uvc2VydmljZS1wYXJhbWV0ZXIuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5Lm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWZpbHRlci5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1maWx0ZXIuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1wYXJhbWV0ZXIubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktcGFyYW1ldGVyLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvYmFja2dyb3VuZC5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS1ub2RlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS1ub2RlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24ubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24uc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLWJhY2tncm91bmQuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24tcGFyYW1ldGVyLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY29kZWxpc3QvY29kZWxpc3QubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY29kZWxpc3QvY29kZWxpc3Quc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9tYXAvbWFwLWNvbmZpZ3VyYXRpb24tbWFuYWdlci5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvaGFzLWFueS1hdXRob3JpdHkuZGlyZWN0aXZlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvaGFzLWFueS1hdXRob3JpdHktb24tdGVycml0b3J5LmRpcmVjdGl2ZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9zaXRtdW4tZnJvbnRlbmQtY29yZS5tb2R1bGUudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9hbmd1bGFyLWhhbC5tb2R1bGUudHMiXSwibmFtZXMiOlsib2JzZXJ2YWJsZVRocm93RXJyb3IiLCJ1cmwucGFyc2UiLCJvYnNlcnZhYmxlT2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLEFBQUE7QUFBc0M7QUFBSTtBQUVqQjtBQUFlO0FBU3hDOzs7YUF1QjJCLENBQUM7QUF2QjVCO0FBQXNCO0FBQW9CO2NBeUJsQixDQUFDLGZBekI2QjtBQUVwRDtBQUFZLDZCQXFCYSxDQUFDO0FBQzVCO0FBSXdCLENBQUMsREFKYjtBQUNBO2dCQVNhLEVBQUUsbEJBVEgsMEJBQUEsQ0FBQztBQUN6QjtBQUNPO0FBQ0E7Z0JBU0ksQ0FBQyxFQUFLLG5CQVRFLDBCQUFLLENBQUM7U0FVakIsVEFUUjtDQVNZLENB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QUFvQixPQUFPLEVBQUUsZUFBZTtBQUM1QyxvQkFBb0IsUUFBUSxFQUFFLGVBQWU7QUFDN0Msb0JBQW9CLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQztBQUMzQyxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVMsQ0FBQztBQUNWLEtBQUs7QUFDTDs0Q0E1QkMsUUFBUSxTQUFDO0VBQ04sT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsa0JBQzNCLFlBQVksRUFBRSxFQUFFLGtCQUNoQixPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFDM0IsU0FBUyxFQUFFO09BQ1AsZUFBZTttQkFDZjtTQUFVO3FCQUNWO1NBQ0ksT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFFBQVEsRUFBRTtTQUFlO3lCQUN6QixJQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUM7V0FDMUIsa0JBQUMsY0FDVDs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQ0s7QUFBQztBQUFDO0FBQUk7QUFDRTtBQUVLO0FBQUk7QUFBQztBQUFJO0FBQ047QUFHcEI7QUFBSTtBQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7dGhyb3dFcnJvciBhcyBvYnNlcnZhYmxlVGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQge2NhdGNoRXJyb3IsIG1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmltcG9ydCB7QXJyYXlJbnRlcmZhY2V9IGZyb20gJy4vYXJyYXktaW50ZXJmYWNlJztcclxuaW1wb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5pbXBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogUkVTVCBhcnJheSBvZiByZXNvdXJjZSBpbXBsZW1lbnRhdGlvbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VBcnJheTxUIGV4dGVuZHMgUmVzb3VyY2U+IGltcGxlbWVudHMgQXJyYXlJbnRlcmZhY2U8VD4ge1xyXG4gICAgLyoqIHNvcnRpbmcgaW5mbyAqL1xyXG4gICAgcHVibGljIHNvcnRJbmZvOiBTb3J0W107XHJcbiAgICAvKiogcHJveHkgdXJsICovXHJcbiAgICBwdWJsaWMgcHJveHlVcmw6IHN0cmluZztcclxuICAgIC8qKiByb290IHVybCAqL1xyXG4gICAgcHVibGljIHJvb3RVcmw6IHN0cmluZztcclxuXHJcbiAgICAvKiogc2VsZiB1cmwgKi9cclxuICAgIHB1YmxpYyBzZWxmX3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIG5leHQgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgbmV4dF91cmk6IHN0cmluZztcclxuICAgIC8qKiBwcmV2aW91cyByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBwcmV2X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIGZpcnN0IHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIGZpcnN0X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIGxhc3QgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgbGFzdF91cmk6IHN0cmluZztcclxuXHJcbiAgICAvKiogZW1iZWRkZWQgYXJyYXkgbGlzdCAqL1xyXG4gICAgcHVibGljIF9lbWJlZGRlZDtcclxuXHJcbiAgICAvKiogdG90YWwgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgYXJyYXkgKi9cclxuICAgIHB1YmxpYyB0b3RhbEVsZW1lbnRzID0gMDtcclxuICAgIC8qKiB0b3RhbCBudW1iZXIgb2YgcGFnZXMgaW4gdGhlIHJlc3BvbnNlICovXHJcbiAgICBwdWJsaWMgdG90YWxQYWdlcyA9IDE7XHJcbiAgICBcclxuICAgIC8qKiBwYWdlIG51bWJlciBpbiB0aGUgcmVzcG9uc2UgKi9cclxuICAgIHB1YmxpYyBwYWdlTnVtYmVyID0gMTtcclxuICAgIFxyXG4gICAgLyoqIHBhZ2Ugc2l6ZSAqL1xyXG4gICAgcHVibGljIHBhZ2VTaXplOiBudW1iZXI7XHJcblxyXG4gICAgLyoqIGFycmF5IGNvbXBvbmVudHMgKi9cclxuICAgIHB1YmxpYyByZXN1bHQ6IFRbXSA9IFtdO1xyXG5cclxuICAgIC8qKiBwdXNoIGEgbmV3IHJlc291cmNlIHRvIHRoZSBhcnJheSAqL1xyXG4gICAgcHVzaCA9IChlbDogVCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVzdWx0LnB1c2goZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogbGVuZ3RoIG9mIHRoZSBhcnJheSAqL1xyXG4gICAgbGVuZ3RoID0gKCk6IG51bWJlciA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0Lmxlbmd0aDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIGxvYWQgYXJyYXkgZGF0YSBmcm9tIFJFU1QgcmVxdWVzdCAqL1xyXG4gICAgcHJpdmF0ZSBpbml0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzcG9uc2U6IGFueSwgc29ydEluZm86IFNvcnRbXSk6IFJlc291cmNlQXJyYXk8VD4gPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KHRoaXMuX2VtYmVkZGVkKTtcclxuICAgICAgICByZXN1bHQuc29ydEluZm8gPSBzb3J0SW5mbztcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBuZXh0IHBhZ2UgKi9cclxuICAgIG5leHQgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubmV4dF91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5uZXh0X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIG5leHQgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBwcmV2aW91cyBwYWdlICovXHJcbiAgICBwcmV2ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXZfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMucHJldl91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBwcmV2IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgZmlyc3QgcGFnZSAqL1xyXG4gICAgZmlyc3QgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuZmlyc3RfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gZmlyc3QgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBsYXN0IHBhZ2UgKi9cclxuICAgIGxhc3QgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdF91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5sYXN0X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIGxhc3QgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBwYWdlIHdpdGggZ2l2ZW4gcGFnZU51bWJlciovXHJcbiAgICBwYWdlID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgcGFnZU51bWJlcjogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgnez9wYWdlLHNpemUsc29ydH0nLCAnJyk7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgneyZzb3J0fScsICcnKTtcclxuICAgICAgICBsZXQgdXJsUGFyc2VkID0gdXJsLnBhcnNlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpKTtcclxuICAgICAgICBsZXQgcXVlcnk6IHN0cmluZyA9IFJlc291cmNlQXJyYXkucmVwbGFjZU9yQWRkKHVybFBhcnNlZC5xdWVyeSwgJ3NpemUnLCB0aGlzLnBhZ2VTaXplLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHF1ZXJ5ID0gUmVzb3VyY2VBcnJheS5yZXBsYWNlT3JBZGQocXVlcnksICdwYWdlJywgcGFnZU51bWJlci50b1N0cmluZygpKTtcclxuXHJcblxyXG4gICAgICAgIGxldCB1cmkgPSB1cmxQYXJzZWQucXVlcnkgP1xyXG4gICAgICAgICAgICBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5yZXBsYWNlKHVybFBhcnNlZC5xdWVyeSwgcXVlcnkpIDogUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkuY29uY2F0KHF1ZXJ5KTtcclxuICAgICAgICB1cmkgPSB0aGlzLmFkZFNvcnRJbmZvKHVyaSk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBTb3J0IGNvbGxlY3Rpb24gYmFzZWQgb24gZ2l2ZW4gc29ydCBhdHRyaWJ1dGUgKi9cclxuICAgIHNvcnRFbGVtZW50cyA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIC4uLnNvcnQ6IFNvcnRbXSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3s/cGFnZSxzaXplLHNvcnR9JywgJycpO1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3smc29ydH0nLCAnJyk7XHJcbiAgICAgICAgbGV0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLmNvbmNhdCgnPycsICdzaXplPScsIHRoaXMucGFnZVNpemUudG9TdHJpbmcoKSwgJyZwYWdlPScsIHRoaXMucGFnZU51bWJlci50b1N0cmluZygpKTtcclxuICAgICAgICB1cmkgPSB0aGlzLmFkZFNvcnRJbmZvKHVyaSk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHNvcnQpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIHBhZ2Ugd2l0aCBnaXZlbiBzaXplICovXHJcbiAgICBzaXplID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgc2l6ZTogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgbGV0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLmNvbmNhdCgnPycsICdzaXplPScsIHNpemUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdXJpID0gdGhpcy5hZGRTb3J0SW5mbyh1cmkpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogQWRkIHNvcnQgaW5mbyB0byBnaXZlbiBVUkkgKi9cclxuICAgIHByaXZhdGUgYWRkU29ydEluZm8odXJpOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5zb3J0SW5mbykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5zb3J0SW5mbykge1xyXG4gICAgICAgICAgICAgICAgdXJpID0gdXJpLmNvbmNhdCgnJnNvcnQ9JywgaXRlbS5wYXRoLCAnLCcsIGl0ZW0ub3JkZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEFkZCByZXBsYWNlIG9yIGFkZCBwYXJhbSB2YWx1ZSB0byBxdWVyeSBzdHJpbmcgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlcGxhY2VPckFkZChxdWVyeTogc3RyaW5nLCBmaWVsZDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAocXVlcnkpIHtcclxuICAgICAgICAgICAgbGV0IGlkeDogbnVtYmVyID0gcXVlcnkuaW5kZXhPZihmaWVsZCk7XHJcbiAgICAgICAgICAgIGxldCBpZHhOZXh0QW1wOiBudW1iZXIgPSBxdWVyeS5pbmRleE9mKCcmJywgaWR4KSA9PSAtMSA/IHF1ZXJ5LmluZGV4T2YoJy8nLCBpZHgpIDogcXVlcnkuaW5kZXhPZignJicsIGlkeCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VhY2hWYWx1ZSA9IHF1ZXJ5LnN1YnN0cmluZyhpZHgsIGlkeE5leHRBbXApO1xyXG4gICAgICAgICAgICAgICAgcXVlcnkgPSBxdWVyeS5yZXBsYWNlKHNlYWNoVmFsdWUsIGZpZWxkICsgJz0nICsgdmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcXVlcnkgPSBxdWVyeS5jb25jYXQoXCImXCIgKyBmaWVsZCArICc9JyArIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5ID0gXCI/XCIgKyBmaWVsZCArICc9JyArIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcXVlcnk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwSGVhZGVycywgSHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuaW1wb3J0IHtIYWxPcHRpb25zfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZCwgaXNQcmltaXRpdmV9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcclxuXHJcbi8qKiBSRVNUIEFQSSBhY2Nlc3MgaGVscGVyICovXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUhlbHBlciB7XHJcblxyXG4gICAgLyoqIEh0dHBIZWFkZXJzICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGhlYWRlcnM6IEh0dHBIZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcbiAgICAvKiogUHJveHkgVVJMICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBwcm94eV91cmk6IHN0cmluZyA9IG51bGw7XHJcbiAgICAvKiogUm9vdCBVUkwgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJvb3RfdXJpOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgLyoqIEh0dHBDbGllbnQgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGh0dHA6IEh0dHBDbGllbnQgPSBudWxsO1xyXG5cclxuICAgIC8qKiBnZXQgcmVxdWVzdCBoZWFkZXJzICovXHJcbiAgICAvKnB1YmxpYyBzdGF0aWMgZ2V0IGhlYWRlcnMoKTogSHR0cEhlYWRlcnMge1xyXG4gICAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZCh0aGlzLl9oZWFkZXJzKSlcclxuICAgICAgICAgIFJlc291cmNlSGVscGVyLl9oZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLl9oZWFkZXJzO1xyXG4gICAgfSovXHJcblxyXG4gICAgLyoqIHNldCByZXF1ZXN0IGhlYWRlcnMgKi9cclxuICAgIC8qcHVibGljIHN0YXRpYyBzZXQgaGVhZGVycyhoZWFkZXJzOiBIdHRwSGVhZGVycykge1xyXG4gICAgICBSZXNvdXJjZUhlbHBlci5faGVhZGVycyA9IGhlYWRlcnM7XHJcbiAgICB9Ki9cclxuXHJcbiAgICAvKiogZ2V0IHJlcXVlc3Qgb3B0aW9uIHBhcmFtcyAqL1xyXG4gICAgc3RhdGljIG9wdGlvblBhcmFtcyhwYXJhbXM6IEh0dHBQYXJhbXMsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogSHR0cFBhcmFtcyB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwYXJhbSBvZiBvcHRpb25zLnBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQocGFyYW0ua2V5LCBwYXJhbS52YWx1ZS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnc2l6ZScsIG9wdGlvbnMuc2l6ZS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc29ydCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBzIG9mIG9wdGlvbnMuc29ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzb3J0U3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydFN0cmluZyA9IHMucGF0aCA/IHNvcnRTdHJpbmcuY29uY2F0KHMucGF0aCkgOiBzb3J0U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRTdHJpbmcgPSBzLm9yZGVyID8gc29ydFN0cmluZy5jb25jYXQoJywnKS5jb25jYXQocy5vcmRlcikgOiBzb3J0U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3NvcnQnLCBzb3J0U3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhcmFtcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogcmVzb2x2ZSByZXNvdXJjZSByZWxhdGlvbnMgKi9cclxuICAgIHN0YXRpYyByZXNvbHZlUmVsYXRpb25zKHJlc291cmNlOiBSZXNvdXJjZSk6IE9iamVjdCB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBhbnkgPSB7fTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiByZXNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoUmVzb3VyY2VIZWxwZXIuY2xhc3NOYW1lKHJlc291cmNlW2tleV0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoKGNsYXNzTmFtZTogc3RyaW5nKSA9PiBjbGFzc05hbWUgPT0gJ1Jlc291cmNlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2Vba2V5XVsnX2xpbmtzJ10pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gcmVzb3VyY2Vba2V5XVsnX2xpbmtzJ11bJ3NlbGYnXVsnaHJlZiddO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJlc291cmNlW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFycmF5OiBhbnlbXSA9IHJlc291cmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZShlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKHRoaXMucmVzb2x2ZVJlbGF0aW9ucyhlbGVtZW50KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSByZXNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQgYXMgT2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjcmVhdGUgYW4gZW1wdHkgcmVzb3VyY2UgZnJvbSBlbWJlZGRlZCBkYXRhKi9cclxuICAgIHN0YXRpYyBjcmVhdGVFbXB0eVJlc3VsdDxUIGV4dGVuZHMgUmVzb3VyY2U+KF9lbWJlZGRlZDogc3RyaW5nKTogUmVzb3VyY2VBcnJheTxUPiB7XHJcbiAgICAgICAgbGV0IHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4gPSBuZXcgUmVzb3VyY2VBcnJheTxUPigpO1xyXG4gICAgICAgIHJlc291cmNlQXJyYXkuX2VtYmVkZGVkID0gX2VtYmVkZGVkO1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgY2xhc3MgbmFtZSovXHJcbiAgICBzdGF0aWMgZ2V0Q2xhc3NOYW1lKG9iajogYW55KTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLis/KVxcKC87XHJcbiAgICAgICAgdmFyIHJlc3VsdHMgPSAoZnVuY05hbWVSZWdleCkuZXhlYyhvYmouY29uc3RydWN0b3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgcmV0dXJuIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMSkgPyByZXN1bHRzWzFdIDogJyc7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGNsYXNzIG5hbWUgZnJvbSBhIHByb3RvdHlwZSBvYmplY3QqL1xyXG4gICAgc3RhdGljIGNsYXNzTmFtZShvYmpQcm90bzogYW55KTogc3RyaW5nW10ge1xyXG4gICAgICAgIGxldCBjbGFzc05hbWVzID0gW107XHJcbiAgICAgICAgbGV0IG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmpQcm90byk7XHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZTogc3RyaW5nO1xyXG5cclxuICAgICAgICB3aGlsZSAoKGNsYXNzTmFtZSA9IFJlc291cmNlSGVscGVyLmdldENsYXNzTmFtZShvYmopKSAhPT0gJ09iamVjdCcpIHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lcy5wdXNoKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNsYXNzTmFtZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGluc3RhbnRpYXRlIGEgUmVzb3VyY2VDb2xsZWN0aW9uIGZyb20gcmVzcG9uc2UgZW1iZWRkZWQgZGF0YSovXHJcbiAgICBzdGF0aWMgaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb248VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHBheWxvYWQ6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiwgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyLGVtYmVkZGVkTmFtZT86U3RyaW5nKTogUmVzb3VyY2VBcnJheTxUPiB7XHJcbiAgICAgICAgZm9yIChjb25zdCBlbWJlZGRlZENsYXNzTmFtZSBvZiBPYmplY3Qua2V5cyhwYXlsb2FkW3Jlc3VsdC5fZW1iZWRkZWRdKSkge1xyXG4gICAgICAgICAgICBpZighZW1iZWRkZWROYW1lIHx8IChlbWJlZGRlZE5hbWUgJiYgZW1iZWRkZWRDbGFzc05hbWU9PWVtYmVkZGVkTmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGVtYmVkZGVkOiBhbnkgPSBwYXlsb2FkW3Jlc3VsdC5fZW1iZWRkZWRdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBlbWJlZGRlZFtlbWJlZGRlZENsYXNzTmFtZV07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluc3RhbmNlOiBUID0gbmV3IHR5cGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXMuc2VhcmNoU3VidHlwZXMoYnVpbGRlciwgZW1iZWRkZWRDbGFzc05hbWUsIGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnN0YW50aWF0ZVJlc291cmNlKGluc3RhbmNlLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc3VsdC50b3RhbEVsZW1lbnRzID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLnRvdGFsRWxlbWVudHMgOiByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIHJlc3VsdC50b3RhbFBhZ2VzID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLnRvdGFsUGFnZXMgOiAxO1xyXG4gICAgICAgIHJlc3VsdC5wYWdlTnVtYmVyID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLm51bWJlciA6IDE7XHJcbiAgICAgICAgcmVzdWx0LnBhZ2VTaXplID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLnNpemUgOiAyMDtcclxuXHJcbiAgICAgICAgcmVzdWx0LnNlbGZfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3Muc2VsZiA/IHBheWxvYWQuX2xpbmtzLnNlbGYuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQubmV4dF91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5uZXh0ID8gcGF5bG9hZC5fbGlua3MubmV4dC5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5wcmV2X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLnByZXYgPyBwYXlsb2FkLl9saW5rcy5wcmV2LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVzdWx0LmZpcnN0X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLmZpcnN0ID8gcGF5bG9hZC5fbGlua3MuZmlyc3QuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQubGFzdF91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5sYXN0ID8gcGF5bG9hZC5fbGlua3MubGFzdC5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCBzdWJ0eXBlcyovXHJcbiAgICBzdGF0aWMgc2VhcmNoU3VidHlwZXM8VCBleHRlbmRzIFJlc291cmNlPihidWlsZGVyOiBTdWJUeXBlQnVpbGRlciwgZW1iZWRkZWRDbGFzc05hbWU6IHN0cmluZywgaW5zdGFuY2U6IFQpIHtcclxuICAgICAgICBpZiAoYnVpbGRlciAmJiBidWlsZGVyLnN1YnR5cGVzKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXlzID0gYnVpbGRlci5zdWJ0eXBlcy5rZXlzKCk7XHJcbiAgICAgICAgICAgIEFycmF5LmZyb20oa2V5cykuZm9yRWFjaCgoc3VidHlwZUtleTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZW1iZWRkZWRDbGFzc05hbWUudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKHN1YnR5cGVLZXkudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3VidHlwZTogeyBuZXcoKTogYW55IH0gPSBidWlsZGVyLnN1YnR5cGVzLmdldChzdWJ0eXBlS2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IG5ldyBzdWJ0eXBlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGluc3RhbnRpYXRlIGEgUmVzb3VyY2UgZnJvbSByZXNwb25zZSAqL1xyXG4gICAgc3RhdGljIGluc3RhbnRpYXRlUmVzb3VyY2U8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQsIHBheWxvYWQ6IE9iamVjdCk6IFQge1xyXG4gICAgICAgIGZvciAoY29uc3QgcCBpbiBwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETyBhcnJheSBpbml0XHJcbiAgICAgICAgICAgIC8qIGlmKGVudGl0eVtwXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgJiYgaXNOdWxsT3JVbmRlZmluZWQocGF5bG9hZFtwXSkpXHJcbiAgICAgICAgICAgICAgICAgZW50aXR5W3BdID0gW107XHJcbiAgICAgICAgICAgICBlbHNlKi9cclxuICAgICAgICAgICAgZW50aXR5W3BdID0gcGF5bG9hZFtwXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHByb3h5IFVSTCAqL1xyXG4gICAgc3RhdGljIHNldFByb3h5VXJpKHByb3h5X3VyaTogc3RyaW5nKSB7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpID0gcHJveHlfdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgUm9vdCBVUkkgKi9cclxuICAgIHN0YXRpYyBzZXRSb290VXJpKHJvb3RfdXJpOiBzdHJpbmcpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5yb290X3VyaSA9IHJvb3RfdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFVSTCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgJiYgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpICE9ICcnID9cclxuICAgICAgICAgICAgUmVzb3VyY2VIZWxwZXIuYWRkU2xhc2goUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpKSA6XHJcbiAgICAgICAgICAgIFJlc291cmNlSGVscGVyLmFkZFNsYXNoKFJlc291cmNlSGVscGVyLnJvb3RfdXJpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogYWRkIHNsYXNoIHRvIFVSSSAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYWRkU2xhc2godXJpOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCB1cmlQYXJzZWQgPSB1cmwucGFyc2UodXJpKTtcclxuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQodXJpUGFyc2VkLnNlYXJjaCkgJiYgdXJpICYmIHVyaVt1cmkubGVuZ3RoIC0gMV0gIT0gJy8nKVxyXG4gICAgICAgICAgICByZXR1cm4gdXJpICsgJy8nO1xyXG4gICAgICAgIHJldHVybiB1cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBmcm9tIFVSTCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRQcm94eSh1cmw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCFSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgfHwgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpID09ICcnKVxyXG4gICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5hZGRTbGFzaCh1cmwucmVwbGFjZShSZXNvdXJjZUhlbHBlci5yb290X3VyaSwgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBIdHRwQ2xpZW50Ki9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0SHR0cChodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuaHR0cCA9IGh0dHA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBIdHRwQ2xpZW50Ki9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SHR0cCgpOiBIdHRwQ2xpZW50IHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaHR0cDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJvb3QgVVJJKi9cclxuICAgIHN0YXRpYyBnZXRSb290VXJpKCkge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5yb290X3VyaTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHt0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yLCBvZiBhcyBvYnNlcnZhYmxlT2Z9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcblxyXG5pbXBvcnQge0h0dHBQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5pbXBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQge2lzTnVsbE9yVW5kZWZpbmVkfSBmcm9tICd1dGlsJztcclxuXHJcbmltcG9ydCB7SGFsT3B0aW9uc30gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogQWJzdHJhY3QgcmVzb3VyY2UgY2xhc3MqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZXNvdXJjZSB7XHJcblxyXG4gICAgLyoqIHByb3h5IFVSTCAqL1xyXG4gICAgcHVibGljIHByb3h5VXJsOiBzdHJpbmc7XHJcbiAgICAvKiogcm9vdCBVUkwgKi9cclxuICAgIHB1YmxpYyByb290VXJsOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIGxpbmtzICovXHJcbiAgICBwdWJsaWMgX2xpbmtzOiBhbnk7XHJcbiAgICAvKiogc3VidHlwZXMgKi9cclxuICAgIHB1YmxpYyBfc3VidHlwZXM6IE1hcDxzdHJpbmcsIGFueT47XHJcblxyXG4gICAgXHJcbiAgICAvKiogZ2V0IHN1YnR5cGVzICovICAgIFxyXG4gICAgcHVibGljIGdldCBzdWJ0eXBlcygpOiBNYXA8c3RyaW5nLCBhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3VidHlwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBzdWJ0eXBlcyAqL1xyXG4gICAgcHVibGljIHNldCBzdWJ0eXBlcyhfc3VidHlwZXM6IE1hcDxzdHJpbmcsIGFueT4pIHtcclxuICAgICAgICB0aGlzLl9zdWJ0eXBlcyA9IF9zdWJ0eXBlcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEdldCBjb2xsZWN0aW9uIG9mIHJlbGF0ZWQgcmVzb3VyY2VzICovXHJcbiAgICBwdWJsaWMgZ2V0UmVsYXRpb25BcnJheTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVsYXRpb246IHN0cmluZywgX2VtYmVkZGVkPzogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuXHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KGlzTnVsbE9yVW5kZWZpbmVkKF9lbWJlZGRlZCkgPyBcIl9lbWJlZGRlZFwiIDogX2VtYmVkZGVkKTtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uPFQ+KHR5cGUsIHJlc3BvbnNlLCByZXN1bHQsIGJ1aWxkZXIpKSxcclxuICAgICAgICAgICAgICAgIG1hcCgoYXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IGFycmF5LnJlc3VsdCksKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKFtdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEdldCByZWxhdGVkIHJlc291cmNlICovXHJcbiAgICBwdWJsaWMgZ2V0UmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlbGF0aW9uOiBzdHJpbmcsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChidWlsZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBlbWJlZGRlZENsYXNzTmFtZSBvZiBPYmplY3Qua2V5cyhkYXRhWydfbGlua3MnXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtYmVkZGVkQ2xhc3NOYW1lID09ICdzZWxmJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhyZWY6IHN0cmluZyA9IGRhdGEuX2xpbmtzW2VtYmVkZGVkQ2xhc3NOYW1lXS5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlkeDogbnVtYmVyID0gaHJlZi5sYXN0SW5kZXhPZignLycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlYWxDbGFzc05hbWUgPSBocmVmLnJlcGxhY2UoUmVzb3VyY2VIZWxwZXIuZ2V0Um9vdFVyaSgpLCBcIlwiKS5zdWJzdHJpbmcoMCwgaWR4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IFJlc291cmNlSGVscGVyLnNlYXJjaFN1YnR5cGVzKGJ1aWxkZXIsIHJlYWxDbGFzc05hbWUsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgZGF0YSk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQWRkcyB0aGUgZ2l2ZW4gcmVzb3VyY2UgdG8gdGhlIGJvdW5kIGNvbGxlY3Rpb24gYnkgdGhlIHJlbGF0aW9uICovXHJcbiAgICBwdWJsaWMgYWRkUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBvc3QoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCByZXNvdXJjZS5fbGlua3Muc2VsZi5ocmVmLCB7aGVhZGVyczogaGVhZGVyfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQmluZCB0aGUgZ2l2ZW4gcmVzb3VyY2UgdG8gdGhpcyByZXNvdXJjZSBieSB0aGUgZ2l2ZW4gcmVsYXRpb24qL1xyXG4gICAgcHVibGljIHVwZGF0ZVJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2U6IFQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ3RleHQvdXJpLWxpc3QnKTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wYXRjaChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYsIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBCaW5kIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSBnaXZlbiByZWxhdGlvbiovXHJcbiAgICBwdWJsaWMgc3Vic3RpdHV0ZVJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2U6IFQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ3RleHQvdXJpLWxpc3QnKTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wdXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCByZXNvdXJjZS5fbGlua3Muc2VsZi5ocmVmLCB7aGVhZGVyczogaGVhZGVyfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICAvKiogQmluZCB0aGUgZ2l2ZW4gcmVzb3VyY2UgdG8gdGhpcyByZXNvdXJjZSBieSB0aGUgZ2l2ZW4gcmVsYXRpb24qL1xyXG4gICAgcHVibGljIHN1YnN0aXR1dGVBbGxSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlczogUmVzb3VyY2VbXSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlcy5tYXAoKHJlc291cmNlKSA9PiByZXNvdXJjZS5fbGlua3Muc2VsZi5ocmVmKSwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvKiogVW5iaW5kIHRoZSByZXNvdXJjZSB3aXRoIHRoZSBnaXZlbiByZWxhdGlvbiBmcm9tIHRoaXMgcmVzb3VyY2UqL1xyXG4gICAgcHVibGljIGRlbGV0ZVJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2U6IFQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZS5fbGlua3MpKSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5rOiBzdHJpbmcgPSByZXNvdXJjZS5fbGlua3NbJ3NlbGYnXS5ocmVmO1xyXG4gICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSBsaW5rLmxhc3RJbmRleE9mKCcvJykgKyAxO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkeCA9PSAtMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuXHJcbiAgICAgICAgICAgIGxldCByZWxhdGlvbklkOiBzdHJpbmcgPSBsaW5rLnN1YnN0cmluZyhpZHgpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmRlbGV0ZShSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiArICcvJyArIHJlbGF0aW9uSWQpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBVbmJpbmQgdGhlIHJlc291cmNlIHdpdGggdGhlIGdpdmVuIHJlbGF0aW9uIGZyb20gdGhpcyByZXNvdXJjZSovXHJcbiAgICBwdWJsaWMgZGVsZXRlQWxsUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmRlbGV0ZShSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiApLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBVc2VyQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vdXNlci1jb25maWd1cmF0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgVXNlclBvc2l0aW9uIH0gZnJvbSAnLi91c2VyLXBvc2l0aW9uLm1vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBVc2VyIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVXNlciBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiB1c2VybmFtZSAqL1xyXG4gIHB1YmxpYyB1c2VybmFtZTogc3RyaW5nO1xyXG4gIC8qKiBwYXNzd29yZCAqL1xyXG4gIHB1YmxpYyBwYXNzd29yZDogc3RyaW5nO1xyXG4gIC8qKiBmaXJzdCBuYW1lICovXHJcbiAgcHVibGljIGZpcnN0TmFtZTogc3RyaW5nO1xyXG4gIC8qKiBsYXN0IG5hbWUgKi9cclxuICBwdWJsaWMgbGFzdE5hbWU6IHN0cmluZztcclxuICAvKiogd2hldGhlciB1c2VyIGlzIGJsb2NrZWQgKi9cclxuICBwdWJsaWMgYmxvY2tlZDogYm9vbGVhbjtcclxuICAvKiogd2hldGhlciB1c2VyIGlzIGFkbWluaXN0cmF0b3IgKi9cclxuICBwdWJsaWMgYWRtaW5pc3RyYXRvcjogYm9vbGVhbjtcclxuICAvKiogdXNlciBwb3NpdGlvbnMgKi9cclxuICBwdWJsaWMgcG9zaXRpb25zOiBVc2VyUG9zaXRpb25bXTtcclxuICAvKiogdXNlciBwZXJtaXNzaW9ucyAqL1xyXG4gIHB1YmxpYyBwZXJtaXNzaW9uczogVXNlckNvbmZpZ3VyYXRpb25bXTtcclxufVxyXG4iLCJpbXBvcnQge0h0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5pbXBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9FeHRlcm5hbENvbmZpZ3VyYXRpb24nO1xyXG5cclxuXHJcbi8qKiBFeHRlcm5hbFNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxTZXJ2aWNlIHtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoJ0V4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UnKSBwcml2YXRlIGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2U6IEV4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2UpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRQcm94eVVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFByb3h5VXJpKCkpO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFJvb3RVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRSb290VXJpKCkpO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldEh0dHAoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRIdHRwKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlciAqL1xyXG4gICAgcHVibGljIHVwZGF0ZUV4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2UoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTogRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZSkge1xyXG5cdHRoaXMuZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZSA9IGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2U7XHJcblxyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFByb3h5VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0Um9vdFVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0SHR0cChleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEh0dHAoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBFeHRlcm5hbENvbmZpZ3VyYXRpb24gKi9cclxuICAgIHB1YmxpYyBnZXRFeHRlcm5hbENvbmZpZ3VyYXRpb24oKTogRXh0ZXJuYWxDb25maWd1cmF0aW9uIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEV4dGVybmFsQ29uZmlndXJhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgZ2V0UHJveHlVcmkoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFByb3h5VXJpKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBSb290IFVSSSAqL1xyXG4gICAgcHVibGljIGdldFJvb3RVcmkoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IFVSTCAqL1xyXG4gICAgcHVibGljIGdldFVSTCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRVUkwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEh0dHBDbGllbnQgKi9cclxuICAgIHB1YmxpYyBnZXRIdHRwKCk6IEh0dHBDbGllbnQge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IHRocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0IHsgUmVzb3VyY2VIZWxwZXIgfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cFBhcmFtcywgSHR0cFJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBTb3J0IH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHsgUmVzb3VyY2VBcnJheSB9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQgeyBFeHRlcm5hbFNlcnZpY2UgfSBmcm9tICcuL2V4dGVybmFsLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBIYWxPcHRpb25zIH0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdWJUeXBlQnVpbGRlciB9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFJlc291cmNlU2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZVNlcnZpY2Uge1xyXG5cclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZXh0ZXJuYWxTZXJ2aWNlOiBFeHRlcm5hbFNlcnZpY2UpIHsgfVxyXG5cclxuXHJcbiAgICAvKiogZ2V0IFVSTCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldFVSTCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgYWxsIHJlc291cmNlcyBmcm9tIGEgYmFzZSBVUkkgb2YgYSBnaXZlbiB0eXBlICovXHJcbiAgICBwdWJsaWMgZ2V0QWxsPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZTogc3RyaW5nLCBfZW1iZWRkZWQ6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMsIHN1YlR5cGU/OiBTdWJUeXBlQnVpbGRlciwgZW1iZWRkZWROYW1lPzpTdHJpbmcpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJz9wcm9qZWN0aW9uPXZpZXcnKTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oX2VtYmVkZGVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzKHJlc3VsdCk7XHJcbiAgICAgICAgcmVzdWx0LnNvcnRJbmZvID0gb3B0aW9ucyA/IG9wdGlvbnMuc29ydCA6IHVuZGVmaW5lZDtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIHBhcmFtczogcGFyYW1zIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQsIHN1YlR5cGUsZW1iZWRkZWROYW1lKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGEgYmFzZSBVUkkgYW5kIGEgZ2l2ZW4gaWQgKi9cclxuICAgIHB1YmxpYyBnZXQ8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlOiBzdHJpbmcsIGlkOiBhbnkpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy8nLCBpZCwgJz9wcm9qZWN0aW9uPXZpZXcnKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChkYXRhID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGl0cyBzZWxmbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5U2VsZkxpbms8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkocmVzb3VyY2VMaW5rKSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKGRhdGEgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlcyBmcm9tIGEgZ2l2ZW4gYmFzZSBwYXRoLCBxdWVyeSBhbmQgb3B0aW9ucyAqL1xyXG4gICAgcHVibGljIHNlYXJjaDxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcXVlcnk6IHN0cmluZywgcmVzb3VyY2U6IHN0cmluZywgX2VtYmVkZGVkOiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvc2VhcmNoLycsIHF1ZXJ5KTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oX2VtYmVkZGVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtcyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCBhIHNpbmdsZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gYmFzZSBwYXRoLCBxdWVyeSBhbmQgb3B0aW9ucyAqL1xyXG4gICAgcHVibGljIHNlYXJjaFNpbmdsZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcXVlcnk6IHN0cmluZywgcmVzb3VyY2U6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy9zZWFyY2gvJywgcXVlcnkpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIHJlc3BvbnNlKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgY3VzdG9tIHF1ZXJ5IGFuZCBvcHRpb25zICovXHJcbiAgICBwdWJsaWMgY3VzdG9tUXVlcnk8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UgKyBxdWVyeSk7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZ2l2ZW4gYSByZWxhdGlvbiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2VMaW5rOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQocmVzb3VyY2VMaW5rLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoZGF0YSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgZGF0YSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZ2l2ZW4gYSByZWxhdGlvbiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlSZWxhdGlvbkFycmF5PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZUxpbms6IHN0cmluZywgX2VtYmVkZGVkOiBzdHJpbmcsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChyZXNvdXJjZUxpbmssIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0LCBidWlsZGVyKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNvdW50IHJlc291cmNlcyBnaXZlbiBhIHBhdGggKi9cclxuICAgIHB1YmxpYyBjb3VudChyZXNvdXJjZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy9zZWFyY2gvY291bnRBbGwnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdib2R5JyB9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHJlc3BvbnNlOiBSZXNwb25zZSkgPT4gTnVtYmVyKHJlc3BvbnNlLmJvZHkpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY3JlYXRlIHJlc291cmNlIGZyb20gc2VsZiBsaW5rIGFuZCBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgY3JlYXRlPFQgZXh0ZW5kcyBSZXNvdXJjZT4oc2VsZlJlc291cmNlOiBzdHJpbmcsIGVudGl0eTogVCkge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFVSTCgpICsgc2VsZlJlc291cmNlO1xyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKGVudGl0eSk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucG9zdCh1cmksIHBheWxvYWQsIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShlbnRpdHksIHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLCBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyB1cGRhdGU8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShlbnRpdHkuX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dCh1cmksIHBheWxvYWQsIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShlbnRpdHksIHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLCBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyB1cGRhdGVDb2xsZWN0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgcmVzb3VyY2VMaW5rOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShyZXNvdXJjZUxpbmspO1xyXG4gICAgICAgIC8vY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuICAgICAgICAvL3RoaXMuc2V0VXJsc1Jlc291cmNlKGVudGl0eSk7XHJcbiAgICAgICAgdmFyIGhlYWRlcnNSZXEgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzO1xyXG4gICAgICAgIGhlYWRlcnNSZXEuc2V0KFwiQ29udGVudC1UeXBlXCIsIFwidGV4dC91cmktbGlzdFwiKTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wdXQodXJpLCByZXNvdXJjZUFycmF5LCB7IGhlYWRlcnM6IGhlYWRlcnNSZXEsIG9ic2VydmU6ICdyZXNwb25zZScgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA1MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5OiBhbnkgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGJvZHkuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHBhdGNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgcGF0Y2g8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShlbnRpdHkuX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBhdGNoKHVyaSwgcGF5bG9hZCwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDw9IDIwNylcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKGVudGl0eSwgcmVzcG9uc2UuYm9keSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA1MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5OiBhbnkgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGJvZHkuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGRlbGV0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGRlbGV0ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCk6IE9ic2VydmFibGU8T2JqZWN0PiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkoZW50aXR5Ll9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzIH0pLnBpcGUoY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzTmV4dDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5uZXh0X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNQcmV2PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnByZXZfdXJpICE9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0ZpcnN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LmZpcnN0X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0xhc3Q8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubGFzdF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIG5leHQ8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5uZXh0KHR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBwcmV2PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucHJldih0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGZpcnN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgZmlyc3Q8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5maXJzdCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBsYXN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubGFzdCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHBhZ2Ugb2YgcmVzdWx0cyBnaXZlbiBhIHBhZ2UgbnVtYmVyKi9cclxuICAgIHB1YmxpYyBwYWdlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9LCBpZDogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucGFnZSh0eXBlLCBpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNvcnQgcmVzb3VyY2UgYXJyYXkgd2l0aCBhIGdpdmVuIHNvcnRpbmcgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc29ydEVsZW1lbnRzPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9LCAuLi5zb3J0OiBTb3J0W10pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5zb3J0RWxlbWVudHModHlwZSwgLi4uc29ydCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBzaXplKi9cclxuICAgIHB1YmxpYyBzaXplPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9LCBzaXplOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5zaXplKHR5cGUsIHNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgVVJMIGZyb20gYSBnaXZlbiBwYXRoKi9cclxuICAgIHB1YmxpYyBnZXRSZXNvdXJjZVVybChyZXNvdXJjZT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHVybCA9IFJlc291cmNlU2VydmljZS5nZXRVUkwoKTtcclxuICAgICAgICBpZiAoIXVybC5lbmRzV2l0aCgnLycpKSB7XHJcbiAgICAgICAgICAgIHVybCA9IHVybC5jb25jYXQoJy8nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc291cmNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmwuY29uY2F0KHJlc291cmNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVybDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHByb3h5IGFuZCByb290IHVybHMgb2YgZ2l2ZW4gcmVzb3VyY2UgYXJyYXkgKi9cclxuICAgIHByaXZhdGUgc2V0VXJsczxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPikge1xyXG4gICAgICAgIHJlc3VsdC5wcm94eVVybCA9IHRoaXMuZXh0ZXJuYWxTZXJ2aWNlLmdldFByb3h5VXJpKCk7XHJcbiAgICAgICAgcmVzdWx0LnJvb3RVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRSb290VXJpKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBwcm94eSBhbmQgcm9vdCB1cmxzIG9mIGdpdmVuIHJlc291cmNlICovXHJcbiAgICBwcml2YXRlIHNldFVybHNSZXNvdXJjZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc3VsdDogVCkge1xyXG4gICAgICAgIHJlc3VsdC5wcm94eVVybCA9IHRoaXMuZXh0ZXJuYWxTZXJ2aWNlLmdldFByb3h5VXJpKCk7XHJcbiAgICAgICAgcmVzdWx0LnJvb3RVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRSb290VXJpKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtvZiBhcyBvYnNlcnZhYmxlT2YsIHRocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge21hcCwgbWVyZ2VNYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZH0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG4vKiogSEFMIHBhcmFtIGRhdGEgbW9kZWwgKi9cclxuZXhwb3J0IHR5cGUgSGFsUGFyYW0gPSB7IGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9O1xyXG4vKiogSEFMIG9wdGlvbiBkYXRhIG1vZGVsICovXHJcbmV4cG9ydCB0eXBlIEhhbE9wdGlvbnMgPSB7IG5vdFBhZ2VkPzogYm9vbGVhbiwgc2l6ZT86IG51bWJlciwgc29ydD86IFNvcnRbXSwgcGFyYW1zPzogSGFsUGFyYW1bXSB9O1xyXG5cclxuLyoqIFJFU1QgQVBJIGFjY2VzcyBpbnRlcmZhY2UgKi9cclxuZXhwb3J0IGNsYXNzIFJlc3RTZXJ2aWNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ge1xyXG4gICAgLyoqIHJlc291cmNlIHR5cGUgKi9cclxuICAgIHByaXZhdGUgdHlwZTogYW55O1xyXG4gICAgLyoqIHJlc291cmNlIHBhdGggKi9cclxuICAgIHByaXZhdGUgcmVzb3VyY2U6IHN0cmluZztcclxuICAgIC8qKiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHVibGljIHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD47XHJcbiAgICAvKiogcmVzb3VyY2Ugc2VydmljZSAqL1xyXG4gICAgcHVibGljIHJlc291cmNlU2VydmljZTogUmVzb3VyY2VTZXJ2aWNlO1xyXG4gICAgLyoqIF9lbWJlZGRlZCBmaWVsZCBuYW1lICovXHJcbiAgICBwcml2YXRlIF9lbWJlZGRlZDogc3RyaW5nID0gJ19lbWJlZGRlZCc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiB7IG5ldygpOiBUIH0sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXHJcbiAgICAgICAgICAgICAgICBfZW1iZWRkZWQ/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2UgPSByZXNvdXJjZTtcclxuICAgICAgICB0aGlzLnJlc291cmNlU2VydmljZSA9IGluamVjdG9yLmdldChSZXNvdXJjZVNlcnZpY2UpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQoX2VtYmVkZGVkKSlcclxuICAgICAgICAgICAgdGhpcy5fZW1iZWRkZWQgPSBfZW1iZWRkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGVycm9yIGhhbmRsZXIgKi9cclxuICAgIHByb3RlY3RlZCBoYW5kbGVFcnJvcihlcnJvcjogYW55KTpPYnNlcnZhYmxlPG5ldmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIFJlc3RTZXJ2aWNlLmhhbmRsZUVycm9yKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZXJyb3IgaGFuZGxlciAqL1xyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBoYW5kbGVFcnJvcihlcnJvcjogYW55KTpPYnNlcnZhYmxlPG5ldmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IGFsbCByZXNvdXJjZXMgd2l0aCBvcHRpb25hbCBvcHRpb25zIGFuIHN1YlR5cGUgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgZ2V0QWxsKG9wdGlvbnM/OiBIYWxPcHRpb25zLCBzdWJUeXBlPzogU3ViVHlwZUJ1aWxkZXIsIGVtYmVkZGVkTmFtZT86U3RyaW5nKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QWxsKHRoaXMudHlwZSwgdGhpcy5yZXNvdXJjZSwgdGhpcy5fZW1iZWRkZWQsIG9wdGlvbnMsIHN1YlR5cGUsZW1iZWRkZWROYW1lKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBbGwob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gYSBnaXZlbiBpZCAqL1xyXG4gICAgcHVibGljIGdldChpZDogYW55KTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldCh0aGlzLnR5cGUsIHRoaXMucmVzb3VyY2UsIGlkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gc2VsZiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlTZWxmTGluayhzZWxmTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEJ5U2VsZkxpbmsodGhpcy50eXBlLCBzZWxmTGluayk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2gocXVlcnk6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5zZWFyY2godGhpcy50eXBlLCBxdWVyeSwgdGhpcy5yZXNvdXJjZSwgdGhpcy5fZW1iZWRkZWQsIG9wdGlvbnMpLnBpcGUoXHJcbiAgICAgICAgICAgIG1lcmdlTWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm5vdFBhZ2VkICYmICFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZUFycmF5LmZpcnN0X3VyaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm5vdFBhZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zaXplID0gcmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaChxdWVyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoU2luZ2xlKHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnNlYXJjaFNpbmdsZSh0aGlzLnR5cGUsIHF1ZXJ5LCB0aGlzLnJlc291cmNlLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlcyBmcm9tIGEgZ2l2ZW4gY3VzdG9tIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBjdXN0b21RdWVyeShxdWVyeTogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmN1c3RvbVF1ZXJ5KHRoaXMudHlwZSwgcXVlcnksIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXN0b21RdWVyeShxdWVyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uQXJyYXkocmVsYXRpb246IHN0cmluZywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QnlSZWxhdGlvbkFycmF5KHRoaXMudHlwZSwgcmVsYXRpb24sIHRoaXMuX2VtYmVkZGVkLCBidWlsZGVyKS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb24ocmVsYXRpb246IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRCeVJlbGF0aW9uKHRoaXMudHlwZSwgcmVsYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb3VudCByZXNvdXJjZXMgZ2l2ZW4gYSBwYXRoICovXHJcbiAgICBwdWJsaWMgY291bnQoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY291bnQodGhpcy5yZXNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSByZXNvdXJjZSBmcm9tIHNlbGYgbGluayBhbmQgZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGNyZWF0ZShlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY3JlYXRlKHRoaXMucmVzb3VyY2UsIGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHVwZGF0ZShlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UudXBkYXRlKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHBhdGNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgcGF0Y2goZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnBhdGNoKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGRlbGV0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGRlbGV0ZShlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5kZWxldGUoZW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyBvZiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHVibGljIHRvdGFsRWxlbWVudCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkgJiYgdGhpcy5yZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHMpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0ZpcnN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNGaXJzdCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzTmV4dCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuaGFzTmV4dCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBwcmV2aW91cyBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc1ByZXYoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc1ByZXYodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0xhc3QoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc0xhc3QodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbmV4dCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5uZXh0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBwcmV2KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnByZXYodGhpcy5yZXNvdXJjZUFycmF5LCB0aGlzLnR5cGUpLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGZpcnN0KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmZpcnN0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbGFzdCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5sYXN0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwYWdlIG9mIHJlc3VsdHMgZ2l2ZW4gYSBwYWdlIG51bWJlciovXHJcbiAgICBwdWJsaWMgcGFnZShwYWdlTnVtYmVyOiBudW1iZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wYWdlKHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlLCBwYWdlTnVtYmVyKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi91c2VyL3VzZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcblxyXG4vKiogQWNjb3VudCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQWNjb3VudFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBQ0NPVU5UX0FQSSA9ICdhY2NvdW50JztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlciwgXCJhY2NvdW50XCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKiBnZXQgbG9nZ2VkIGluIHVzZXIgYWNjb3VudCovXHJcbiAgZ2V0KCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQUNDT1VOVF9BUEkpKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFjY291bnQqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQUNDT1VOVF9BUEkpICwgaXRlbSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8qKiBjaGFuZ2UgbG9nZ2VkIGluIHVzZXIgYWNjb3VudCovICBcclxuICBjaGFuZ2VQYXNzd29yZChpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BQ0NPVU5UX0FQSStcIi9jaGFuZ2UtcGFzc3dvcmRcIikgLCBpdGVtKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcy1jb21wYXQnO1xyXG5pbXBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuLy9pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcbi8qKiBBdXRoZW50aWNhdGlvbiBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xyXG4gICAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFVVEhfQVBJID0gJ2F1dGhlbnRpY2F0ZSc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgICBwcml2YXRlIHJlc291cmNlU2VydmljZTogUmVzb3VyY2VTZXJ2aWNlXHJcbiAgICApIHt9XHJcbiAgICBcclxuICAgIC8qKiBnZXQgY3VycmVudCB1c2VyIGp3dCB0b2tlbiBmcm9tIHNlc3Npb24gc3RvcmFnZSovXHJcbiAgICBnZXRUb2tlbigpIHtcclxuICAgICAgICByZXR1cm4gIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9naW4gb3BlcmF0aW9uICovXHJcbiAgICBsb2dpbihjcmVkZW50aWFscyk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiBjcmVkZW50aWFscy51c2VybmFtZSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IGNyZWRlbnRpYWxzLnBhc3N3b3JkXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BVVRIX0FQSSksIGRhdGEsIHtvYnNlcnZlIDogJ3Jlc3BvbnNlJ30pLm1hcChhdXRoZW50aWNhdGVTdWNjZXNzLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhdXRoZW50aWNhdGVTdWNjZXNzKHJlc3ApIHtcclxuICAgICAgICAgICAgaWYgKHJlc3Aub2spIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGp3dCA9IHJlc3AuYm9keS5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnN0IGV4cGlyZXNBdCA9IG1vbWVudCgpLmFkZCggcmVzcC5oZWFkZXJzLmdldCgnVG9rZW4tVmFsaWRpdHknKSwnbWlsaXNlY29uZCcpO1xyXG4gICAgICAgICAgICAgICAgLy9zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdleHBpcmVzX2F0JywgSlNPTi5zdHJpbmdpZnkoZXhwaXJlc0F0LnZhbHVlT2YoKSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGp3dDtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogbG9naW4gb3BlcmF0aW9uIHdpdGggand0IHRva2VuICovXHJcbiAgICBsb2dpbldpdGhUb2tlbihqd3QpIHtcclxuICAgICAgICBpZiAoand0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoand0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJ2F1dGgtand0LXNlcnZpY2UgUHJvbWlzZSByZWplY3QnKTsgLy8gUHV0IGFwcHJvcHJpYXRlIGVycm9yIG1lc3NhZ2UgaGVyZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogc3RvcmUgand0IHRva2VuIGluIHNlc3Npb24gc3RvcmFnZSovXHJcbiAgICBzdG9yZUF1dGhlbnRpY2F0aW9uVG9rZW4oand0KSB7XHJcbiAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJywgand0KTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGxvZ2dlZCBpbiovXHJcbiAgICBwdWJsaWMgaXNMb2dnZWRJbigpIHtcclxuICAgICAgICAvL3JldHVybiBtb21lbnQoKS5pc0JlZm9yZSh0aGlzLmdldEV4cGlyYXRpb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW4oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGxvZ2dlZCBvdXQqL1xyXG4gICAgaXNMb2dnZWRPdXQoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzTG9nZ2VkSW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9nb3V0IG9wZXJhdGlvbiAqL1xyXG4gICAgbG9nb3V0KCk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgLy9sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicpO1xyXG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICAgICAgICAgIC8vc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnZXhwaXJlc19hdCcpO1xyXG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBcclxufVxyXG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3QsIEh0dHBIYW5kbGVyLCBIdHRwRXZlbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG4vKiogSW50ZXJjZXB0b3IgZm9yIGF1dGhlbnRpY2F0aW9uIHRva2VuIGluIEFQSSByZXF1ZXN0cyAqL1xyXG5leHBvcnQgY2xhc3MgQXV0aEludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICApIHtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHJlcXVlc3QgaGFuZGxlciAqL1xyXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xyXG4gICAgICAgIGlmICghcmVxdWVzdCB8fCAhcmVxdWVzdC51cmwgfHwgIShyZXF1ZXN0LnVybC5pbmNsdWRlcyhcImFwaVwiKSkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICAgICAgaWYgKCEhdG9rZW4pIHtcclxuICAgICAgICAgICAgcmVxdWVzdCA9IHJlcXVlc3QuY2xvbmUoe1xyXG4gICAgICAgICAgICAgICAgc2V0SGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRva2VuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxdWVzdCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBBY2NvdW50U2VydmljZSB9IGZyb20gJy4uL2FjY291bnQvYWNjb3VudC5zZXJ2aWNlJztcclxuXHJcbi8qKiBQcmluY2lwYWwgc2VydmljZSovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFByaW5jaXBhbCB7XHJcbiAgICBwcml2YXRlIHVzZXJJZGVudGl0eTogYW55O1xyXG4gICAgcHJpdmF0ZSBhdXRoZW50aWNhdGVkID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGF1dGhlbnRpY2F0aW9uU3RhdGUgPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIGFjY291bnQ6IEFjY291bnRTZXJ2aWNlXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqIGF1dGhlbnRpY2F0ZSB3aXRoIGdpdmVuIGlkZW50aXR5Ki9cclxuICAgIGF1dGhlbnRpY2F0ZShpZGVudGl0eSkge1xyXG4gICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gaWRlbnRpdHk7XHJcbiAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gaWRlbnRpdHkgIT09IG51bGw7XHJcbiAgICAgICAgdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLm5leHQodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyAqL1xyXG4gICAgaGFzQW55QXV0aG9yaXR5KGF1dGhvcml0aWVzOiBzdHJpbmdbXSk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5oYXNBbnlBdXRob3JpdHlEaXJlY3QoYXV0aG9yaXRpZXMpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgb24gdGhlIGdpdmVuIHRlcnJpdG9yeSAqL1xyXG4gICAgaGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnkoYXV0aG9yaXRpZXM6IHN0cmluZ1tdLHRlcnJpdG9yeTogc3RyaW5nICk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5oYXNBbnlBdXRob3JpdHlEaXJlY3RPblRlcnJpdG9yeShhdXRob3JpdGllcyx0ZXJyaXRvcnkpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgd2l0aG91dCByZXNvbHZpbmcgcHJvbWlzZXMqL1xyXG4gICAgaGFzQW55QXV0aG9yaXR5RGlyZWN0KGF1dGhvcml0aWVzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkIHx8ICF0aGlzLnVzZXJJZGVudGl0eSB8fCAhdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdXRob3JpdGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXMuaW5jbHVkZXMoYXV0aG9yaXRpZXNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyBvbiB0aGUgZ2l2ZW4gdGVycml0b3J5IHdpdGhvdXQgcmVzb2x2aW5nIHByb21pc2VzICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlEaXJlY3RPblRlcnJpdG9yeShhdXRob3JpdGllczogc3RyaW5nW10sdGVycml0b3J5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCB8fCAhdGhpcy51c2VySWRlbnRpdHkgfHwgIXRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXV0aG9yaXRpZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllc1BlclRlcnJpdG9yeVt0ZXJyaXRvcnldICYmIHRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0uaW5jbHVkZXMoYXV0aG9yaXRpZXNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgdGhlIGdpdmVuIGF1dGhvcml0eSAqL1xyXG4gICAgaGFzQXV0aG9yaXR5KGF1dGhvcml0eTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aXR5KCkudGhlbigoaWQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShpZC5hdXRob3JpdGllcyAmJiBpZC5hdXRob3JpdGllcy5pbmNsdWRlcyhhdXRob3JpdHkpKTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgdGhlIGdpdmVuIGF1dGhvcml0eSBvbiB0aGUgZ2l2ZW4gdGVycml0b3J5Ki9cclxuICAgIGhhc0F1dGhvcml0eU9uVGVycml0b3J5KGF1dGhvcml0eTogc3RyaW5nLHRlcnJpdG9yeTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aXR5KCkudGhlbigoaWQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShpZC5hdXRob3JpdGllc1BlclRlcnJpdG9yeSAmJiBpZC5hdXRob3JpdGllc1BlclRlcnJpdG9yeVt0ZXJyaXRvcnldICYmIGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0uaW5jbHVkZXMoYXV0aG9yaXR5KSk7XHJcbiAgICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgdXNlciBpZGVudGl0eSovXHJcbiAgICBpZGVudGl0eShmb3JjZT86IGJvb2xlYW4pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIGlmIChmb3JjZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJJZGVudGl0eSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNoZWNrIGFuZCBzZWUgaWYgd2UgaGF2ZSByZXRyaWV2ZWQgdGhlIHVzZXJJZGVudGl0eSBkYXRhIGZyb20gdGhlIHNlcnZlci5cclxuICAgICAgICAvLyBpZiB3ZSBoYXZlLCByZXVzZSBpdCBieSBpbW1lZGlhdGVseSByZXNvbHZpbmdcclxuICAgICAgICBpZiAodGhpcy51c2VySWRlbnRpdHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZXRyaWV2ZSB0aGUgdXNlcklkZW50aXR5IGRhdGEgZnJvbSB0aGUgc2VydmVyLCB1cGRhdGUgdGhlIGlkZW50aXR5IG9iamVjdCwgYW5kIHRoZW4gcmVzb2x2ZS5cclxuICAgICAgICByZXR1cm4gdGhpcy5hY2NvdW50LmdldCgpLnRvUHJvbWlzZSgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjY291bnQgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gYWNjb3VudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJJZGVudGl0eSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUubmV4dCh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJJZGVudGl0eTtcclxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5uZXh0KHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQgKi9cclxuICAgIGlzQXV0aGVudGljYXRlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBpZGVudGl0eSBpcyByZXNvbHZlZCAqL1xyXG4gICAgaXNJZGVudGl0eVJlc29sdmVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJJZGVudGl0eSAhPT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgY3VycmVudCB1c2VyIGF1dGhlbnRpY2F0aW9uIHN0YXRlICovXHJcbiAgICBnZXRBdXRoZW50aWNhdGlvblN0YXRlKCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdG9yLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3QsIEh0dHBIYW5kbGVyLCBIdHRwRXZlbnQsIEh0dHBFcnJvclJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKiogSW50ZXJjZXB0b3IgZm9yIGF1dGhlbnRpY2F0aW9uIGV4cGlyZWQgcmVzcG9uc2UgaW4gQVBJIHJlcXVlc3RzICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgICAgIFxyXG4gICAgICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLCBcclxuICAgICAgICBwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqIHJlcXVlc3QgaGFuZGxlciAqL1xyXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xyXG4gICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KS5kbygoZXZlbnQ6IEh0dHBFdmVudDxhbnk+KSA9PiB7fSwgKGVycjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBIdHRwRXJyb3JSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMSkgeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5sb2dvdXQoKS5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW5jaXBhbC5hdXRoZW50aWNhdGUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvJ10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKiogTG9naW4gc2VydmljZSovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIExvZ2luU2VydmljZSB7XHJcbiAgICBcclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmVyUHJvdmlkZXI6IEF1dGhTZXJ2aWNlLCBcclxuICAgICAgICBwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqTG9naW4gb3BlcmF0aW9uKi9cclxuICAgIGxvZ2luKGNyZWRlbnRpYWxzLCBjYWxsYmFjaz8pIHtcclxuICAgICAgICBjb25zdCBjYiA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZlclByb3ZpZGVyLmxvZ2luKGNyZWRlbnRpYWxzKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJpbmNpcGFsLmlkZW50aXR5KHRydWUpLnRoZW4oKGFjY291bnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBZnRlciB0aGUgbG9naW4gdGhlIGxhbmd1YWdlIHdpbGwgYmUgY2hhbmdlZCB0b1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBsYW5ndWFnZSBzZWxlY3RlZCBieSB0aGUgdXNlciBkdXJpbmcgaGlzIHJlZ2lzdHJhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoKTtcclxuICAgICAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqbG9naW4gd2l0aCBqd3QgdG9rZW4gKi9cclxuICAgIGxvZ2luV2l0aFRva2VuKGp3dCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dpbldpdGhUb2tlbihqd3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBsb2dvdXQgb3BlcmF0aW9uICovXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dvdXQoKS5zdWJzY3JpYmUoKTtcclxuICAgICAgIHRoaXMucHJpbmNpcGFsLmF1dGhlbnRpY2F0ZShudWxsKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL3VzZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogVXNlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFVTRVJfQVBJID0ndXNlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihVc2VyLCBcInVzZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB1c2VyKi9cclxuICByZW1vdmUoaXRlbTogVXNlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHVzZXIqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlVTRVJfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgICBcclxuICAvKiogY2hhbmdlIHBhc3N3b3JkIG8gZ2l2ZW4gdXNlciBpZCAqL1xyXG4gIGNoYW5nZVBhc3N3b3JkKGlkLGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlVTRVJfQVBJK1wiL1wiK2lkK1wiL2NoYW5nZS1wYXNzd29yZFwiKSAsIGl0ZW0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4uL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi91c2VyLm1vZGVsJztcclxuLyoqXHJcbiAqIFVzZXIgcG9zaXRpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBVc2VyUG9zaXRpb24gZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBlbWFpbCAqL1xyXG4gIHB1YmxpYyBlbWFpbDogc3RyaW5nO1xyXG4gIC8qKiBvcmdhbml6YXRpb24gbmFtZSovXHJcbiAgcHVibGljIG9yZ2FuaXphdGlvbjogc3RyaW5nO1xyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICAvKiogc3lzdGVtIGRhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBkYXRlZERhdGU6IGFueTtcclxuICAvKiogcG9zaXRpb24gdGVycml0b3J5Ki9cclxuICBwdWJsaWMgdGVycml0b3J5OiBUZXJyaXRvcnk7XHJcbiAgLyoqIHVzZXIqL1xyXG4gIHB1YmxpYyB1c2VyOiBVc2VyO1xyXG59XHJcbiIsImltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlclBvc2l0aW9uIH0gZnJvbSAnLi91c2VyLXBvc2l0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFVzZXIgcG9zaXRpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFVzZXJQb3NpdGlvblNlcnZpY2UgIGV4dGVuZHMgUmVzdFNlcnZpY2U8VXNlclBvc2l0aW9uPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBVU0VSX1BPU0lUSU9OX0FQSSA9ICd1c2VyLXBvc2l0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFVzZXJQb3NpdGlvbiwgXCJ1c2VyLXBvc2l0aW9uc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdXNlciBwb3NpdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IFVzZXJQb3NpdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHVzZXIgcG9zaXRpb24qL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtLnVzZXIgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd1c2VyJyxpdGVtLnVzZXIpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLnRlcnJpdG9yeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3RlcnJpdG9yeScsaXRlbS50ZXJyaXRvcnkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnRlcnJpdG9yeSA9IGl0ZW0udGVycml0b3J5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0udXNlciA9IGl0ZW0udXNlci5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlVTRVJfUE9TSVRJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFJvbGUgfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuLi90ZXJyaXRvcnkvdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vdXNlci5tb2RlbCc7XHJcblxyXG4vKipcclxuICogVXNlciBwZXJtaXNzaW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVXNlckNvbmZpZ3VyYXRpb24gZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIHJvbGUgKi8gIFxyXG4gIHB1YmxpYyByb2xlOiBSb2xlO1xyXG5cclxuICAvKiogcm9sZSBDaGlsZHJlbiAqLyAgXHJcbiAgcHVibGljIHJvbGVDaGlsZHJlbjogUm9sZTtcclxuICBcclxuICAvKiogdGVycml0b3J5ICovIFxyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICAvKiogdXNlciAqL1xyXG4gIHB1YmxpYyB1c2VyOiBVc2VyO1xyXG59XHJcbiIsImltcG9ydCB7IFJlc3RTZXJ2aWNlIH0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vdXNlci1jb25maWd1cmF0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFVzZXIgY29uZmlndXJhdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VXNlckNvbmZpZ3VyYXRpb24+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFVTRVJfQ09ORklHVVJBVElPTl9BUEkgPSAndXNlci1jb25maWd1cmF0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihVc2VyQ29uZmlndXJhdGlvbiwgXCJ1c2VyLWNvbmZpZ3VyYXRpb25zXCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgdXNlciBjb25maWd1cmF0aW9uKi9cclxuICByZW1vdmUoaXRlbTogVXNlckNvbmZpZ3VyYXRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqIHNhdmUgdXNlciBjb25maWd1cmF0aW9uKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MgIT0gbnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtLnVzZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd1c2VyJywgaXRlbS51c2VyKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuXHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLnRlcnJpdG9yeSAhPSBudWxsKSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3RlcnJpdG9yeScsIGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuXHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLnJvbGUgIT0gbnVsbCkge1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdyb2xlJywgaXRlbS5yb2xlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuXHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLnJvbGVDaGlsZHJlbiAhPSBudWxsKSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3JvbGVDaGlsZHJlbicsIGl0ZW0ucm9sZUNoaWxkcmVuKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuXHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnRlcnJpdG9yeSA9IGl0ZW0udGVycml0b3J5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0ucm9sZSA9IGl0ZW0ucm9sZSE9bnVsbD9pdGVtLnJvbGUuX2xpbmtzLnNlbGYuaHJlZjpudWxsO1xyXG4gICAgICBpdGVtLnVzZXIgPSBpdGVtLnVzZXIuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS5yb2xlQ2hpbGRyZW4gPSBpdGVtLnJvbGVDaGlsZHJlbiE9bnVsbD9pdGVtLnJvbGVDaGlsZHJlbi5fbGlua3Muc2VsZi5ocmVmOm51bGw7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVVNFUl9DT05GSUdVUkFUSU9OX0FQSSksIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnlHcm91cFR5cGUgfSBmcm9tICcuL3RlcnJpdG9yeS1ncm91cC10eXBlLm1vZGVsJztcclxuaW1wb3J0IHsgVGVycml0b3J5VHlwZSB9IGZyb20gJy4vdGVycml0b3J5LXR5cGUubW9kZWwnO1xyXG5cclxuLyoqXHJcbiAqIFRlcnJpdG9yeSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBjb2RlICovXHJcbiAgcHVibGljIGNvZGU6IHN0cmluZztcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGFkZHJlc3MqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbEF1dGhvcml0eUFkZHJlc3M6IHN0cmluZztcclxuICAvKiogYWRtaW4gKi9cclxuICBwdWJsaWMgdGVycml0b3JpYWxBdXRob3JpdHlOYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHdoZXRoZXIgdGVycml0b3J5IGlzIGJsb2NrZWQqL1xyXG4gIHB1YmxpYyBibG9ja2VkOiBib29sZWFuO1xyXG4gIC8qKiBjb21tZW50cyovXHJcbiAgcHVibGljIG5vdGU6IHN0cmluZztcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIGNvbnRhY3QgZW1haWwgKi8gIFxyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbEF1dGhvcml0eUVtYWlsOiBzdHJpbmc7XHJcbiAgLyoqIGV4dGVuc2lvbiAqL1xyXG4gIHB1YmxpYyBleHRlbnQ6IHN0cmluZztcclxuICAvKiogbG9nbyBpbWFnZSBVUkwgKi9cclxuICBwdWJsaWMgdGVycml0b3JpYWxBdXRob3JpdHlMb2dvOiBzdHJpbmc7XHJcbiAgLyoqIGNvbnRhY3Qgb3JnYW5pemF0aW9uIG5hbWUgKi9cclxuICAvLyBwdWJsaWMgb3JnYW5pemF0aW9uTmFtZTogc3RyaW5nO1xyXG4gIC8qKiBzY29wZSovXHJcbiAgcHVibGljIHNjb3BlOiBzdHJpbmc7XHJcbiAgLyoqIHR5cGUgKi8gIFxyXG4gIHB1YmxpYyB0eXBlOiBUZXJyaXRvcnlUeXBlO1xyXG4gIC8qKiBncm91cCB0eXBlICovXHJcbiAgcHVibGljIGdyb3VwVHlwZTogVGVycml0b3J5R3JvdXBUeXBlO1xyXG4gIC8qKiB0ZXJyaXRvcnkgbWVtYmVycyovXHJcbiAgcHVibGljIG1lbWJlcnM6IFRlcnJpdG9yeVtdO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuL3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgUmVzdFNlcnZpY2UgfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGVycml0b3J5IG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGVycml0b3J5PiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBURVJSSVRPUllfQVBJID0gJ3RlcnJpdG9yaWVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRlcnJpdG9yeSwgXCJ0ZXJyaXRvcmllc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRlcnJpdG9yeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKiogc2F2ZSB0ZXJyaXRvcnkqL1xyXG4gIHNhdmUoaXRlbTogVGVycml0b3J5KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuXHJcbiAgICBsZXQgdGVycml0b3J5R3JvdXBUeXBlOmFueSA9IHt9XHJcbiAgICB0ZXJyaXRvcnlHcm91cFR5cGUuX2xpbmtzID0ge307XHJcbiAgICB0ZXJyaXRvcnlHcm91cFR5cGUuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIHRlcnJpdG9yeUdyb3VwVHlwZS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuXHJcbiAgICBpZiAoaXRlbS5ncm91cFR5cGUgIT0gbnVsbCkge1xyXG4gICAgICB0ZXJyaXRvcnlHcm91cFR5cGUgPSBpdGVtLmdyb3VwVHlwZTtcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtLmdyb3VwVHlwZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLmdyb3VwVHlwZSA9IGl0ZW0uZ3JvdXBUeXBlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH0gXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzICE9IG51bGwpIHtcclxuICAgICAgLy91cGRhdGUgcmVsYXRpb25zXHJcbiAgICAgIGRlbGV0ZSBpdGVtLmdyb3VwVHlwZTtcclxuXHJcbiAgICAgIGlmICh0ZXJyaXRvcnlHcm91cFR5cGUuX2xpbmtzLnNlbGYuaHJlZiA9PSAnJykge1xyXG4gICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2dyb3VwVHlwZScsIHRlcnJpdG9yeUdyb3VwVHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignZ3JvdXBUeXBlJywgdGVycml0b3J5R3JvdXBUeXBlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpdGVtLnR5cGUgIT0gbnVsbClcclxuICAgICAgICBpdGVtLnR5cGUgPSBpdGVtLnR5cGUuX2xpbmtzLnNlbGYuaHJlZjtcclxuXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEVSUklUT1JZX0FQSSksIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuLyoqXHJcbiAqIFRlcnJpdG9yeSB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5VHlwZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAgLyoqIGlkICovXHJcbiAgIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4vdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeVR5cGUgfSBmcm9tICcuL3RlcnJpdG9yeS10eXBlLm1vZGVsJztcclxuXHJcbi8qKiBUZXJyaXRvcnlUeXBlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlUeXBlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRlcnJpdG9yeVR5cGU+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRFUlJJVE9SWVRZUEVfQVBJID0gJ3RlcnJpdG9yeS10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRlcnJpdG9yeVR5cGUsIFwidGVycml0b3J5LXR5cGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0ZXJyaXRvcnkgdHlwZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRlcnJpdG9yeVR5cGUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0ZXJyaXRvcnkgdHlwZSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEVSUklUT1JZVFlQRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuXHJcbi8qKlxyXG4gKiBUZXJyaXRvcnkgdHlwZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeUdyb3VwVHlwZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgeyBUZXJyaXRvcnlHcm91cFR5cGUgfSBmcm9tICcuL3RlcnJpdG9yeS1ncm91cC10eXBlLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeUdyb3VwVHlwZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUZXJyaXRvcnlHcm91cFR5cGU+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZR1JPVVBUWVBFX0FQSSA9ICd0ZXJyaXRvcnktZ3JvdXAtdHlwZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUZXJyaXRvcnlHcm91cFR5cGUsIFwidGVycml0b3J5LWdyb3VwLXR5cGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0ZXJyaXRvcnkqL1xyXG4gIHJlbW92ZShpdGVtOiBUZXJyaXRvcnlHcm91cFR5cGUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0ZXJyaXRvcnkqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRFUlJJVE9SWUdST1VQVFlQRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufSIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuLyoqXHJcbiAqIFJvbGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBSb2xlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBjb21tZW50cyovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFJvbGUgfSBmcm9tICcuL3JvbGUubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBSb2xlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBSb2xlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFJvbGU+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgUk9MRV9BUEkgPSAncm9sZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihSb2xlLCBcInJvbGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSByb2xlKi9cclxuICByZW1vdmUoaXRlbTogUm9sZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHJvbGUqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlJPTEVfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBDb25uZWN0aW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICAvKiogdXNlciovXHJcbiAgcHVibGljIHVzZXI6IHN0cmluZztcclxuICAvKiogcGFzc3dvcmQqL1xyXG4gIHB1YmxpYyBwYXNzd29yZDogc3RyaW5nO1xyXG4gIC8qKiBjb25uZWN0aW9uIHN0cmluZyovXHJcbiAgcHVibGljIGNvbm5lY3Rpb25TdHJpbmc6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJy4vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENvbm5lY3Rpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb25TZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q29ubmVjdGlvbj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAnY29ubmVjdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDb25uZWN0aW9uLCBcImNvbm5lY3Rpb25zXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjb25uZWN0aW9uKi9cclxuICByZW1vdmUoaXRlbTogQ29ubmVjdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNvbm5lY3Rpb24qL1xyXG4gIHNhdmUoaXRlbTogQ29ubmVjdGlvbik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ09OTkVDVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgdGVzdENvbm5lY3Rpb24oaXRlbTphbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0PXRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ09OTkVDVElPTl9BUEkpK1wiL3Rlc3RcIiAsIGl0ZW0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi4vY29ubmVjdGlvbi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgUm9sZSB9IGZyb20gJy4uL3JvbGUvcm9sZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tUeXBlIH0gZnJvbSAnLi90YXNrLXR5cGUubW9kZWwnO1xyXG5pbXBvcnQgeyBUYXNrR3JvdXAgfSBmcm9tICcuL3Rhc2stZ3JvdXAubW9kZWwnO1xyXG5pbXBvcnQgeyBUYXNrQXZhaWxhYmlsaXR5IH0gZnJvbSAnLi90YXNrLWF2YWlsYWJpbGl0eS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tQYXJhbWV0ZXIgfSBmcm9tICcuL3Rhc2stcGFyYW1ldGVyLm1vZGVsJztcclxuXHJcbi8vRklYTUUgZW5zdXJlIHRhc2sgY3JlYXRpb24gaW4gYWRtaW4gYXBwIHVwb24gaW5pdGlhbGl6YXRpb24gKGFzIGl0IGlzIGRvbmUgd2l0aCBSb2xlcyBhbmQgZGVmYXVsdCBVc2VycylcclxuLyoqIEdFT0FETUlOX3Rhc2sgaWQgKi9cclxuZXhwb3J0IGNvbnN0IEdFT0FETUlOX1RSRUVfVEFTS19JRDpzdHJpbmcgID0gXCJnZW9hZG1pblwiO1xyXG5cclxuaW1wb3J0IHsgVGFza1VJIH0gZnJvbSAnLi90YXNrLXVpLm1vZGVsJztcclxuLyoqIFRhc2sgbW9kZWwgKi9cclxuZXhwb3J0IGNsYXNzIFRhc2sgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUgKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIG9yZGVyKi9cclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjtcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIHRhc2sgZ3JvdXAqL1xyXG4gIHB1YmxpYyBncm91cDogVGFza0dyb3VwO1xyXG4gIC8qKiB0YXNrIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBUYXNrVHlwZTtcclxuICAvKiogdGFzayBVSSovXHJcbiAgcHVibGljIHVpOiBUYXNrVUk7XHJcbiAgLyoqIHBhcmFtZXRlcnMqL1xyXG4gIHB1YmxpYyBwYXJhbWV0ZXJzOiBUYXNrUGFyYW1ldGVyW107XHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xyXG4gIC8qKiByb2xlcyovXHJcbiAgcHVibGljIHJvbGVzOiBSb2xlW107XHJcbiAgLyoqIGF2YWlsYWJpbGl0aWVzKi9cclxuICBwdWJsaWMgYXZhaWxhYmlsaXRpZXM6IFRhc2tBdmFpbGFiaWxpdHlbXTtcclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi90YXNrLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFza1NlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrPiB7XHJcblxyXG4gICAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFza3MnO1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgICAgICBzdXBlcihUYXNrLCBcInRhc2tzXCIsIGluamVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogcmVtb3ZlIHRhc2sqL1xyXG4gICAgcmVtb3ZlKGl0ZW06IFRhc2spIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogc2F2ZSB0YXNrKi9cclxuICAgIHNhdmUoaXRlbTogVGFzayk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgICAgIGNvbnN0IHRhc2tUeXBlID0gaXRlbS50eXBlO1xyXG4gICAgICAgIGNvbnN0IHRhc2tHcm91cCA9IGl0ZW0uZ3JvdXA7XHJcbiAgICAgICAgbGV0IHRhc2tDb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uO1xyXG4gICAgICAgIGxldCB0YXNrVUkgPSBpdGVtLnVpO1xyXG4gICAgICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1R5cGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2tUeXBlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrVHlwZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrVHlwZT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRhc2tUeXBlLCBcInRhc2stdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgdHlwZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRhc2tUeXBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayB0eXBlKi9cclxuICBzYXZlKGl0ZW06IFRhc2tUeXBlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayBncm91cCBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRhc2tHcm91cCB9IGZyb20gJy4vdGFzay1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgZ3JvdXAgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrR3JvdXA+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gJ3Rhc2stZ3JvdXBzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza0dyb3VwLCBcInRhc2stZ3JvdXBzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0YXNrIGdyb3VwKi9cclxuICByZW1vdmUoaXRlbTogVGFza0dyb3VwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBncm91cCovXHJcbiAgc2F2ZShpdGVtOiBUYXNrR3JvdXApOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VGFza30gZnJvbSAnLi90YXNrLm1vZGVsJzsgIFxyXG4vKipcclxuICogVGFzayBwYXJhbWV0ZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrUGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBvcmRlciovICBcclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjtcclxuICBcclxuICAvKiogdGFzayovICBcclxuICBwdWJsaWMgdGFzazpUYXNrO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrUGFyYW1ldGVyIH0gZnJvbSAnLi90YXNrLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgVGFza1BhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrUGFyYW1ldGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUQVNLX1BBUkFNRVRFUl9BUEkgPSAndGFzay1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza1BhcmFtZXRlciwgXCJ0YXNrLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogVGFza1BhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IFRhc2tQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnRhc2sgPSBpdGVtLnRhc2suX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UQVNLX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3Rhc2subW9kZWwnO1xyXG4vKipcclxuICogVGFzayBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrQXZhaWxhYmlsaXR5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiB0ZXJyaXRvcnkqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICAvKiogdGFzayovXHJcbiAgcHVibGljIHRhc2s6IFRhc2s7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza0F2YWlsYWJpbGl0eSB9IGZyb20gJy4vdGFzay1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIGF2YWlsYWJpbGl0eSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIFRhc2tBdmFpbGFiaWxpdHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGFza0F2YWlsYWJpbGl0eT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEFTS19BVkFJTEFCSUxJVFlfQVBJID0gJ3Rhc2stYXZhaWxhYmlsaXRpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrQXZhaWxhYmlsaXR5LCBcInRhc2stYXZhaWxhYmlsaXRpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICByZW1vdmUoaXRlbTogVGFza0F2YWlsYWJpbGl0eSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICBzYXZlKGl0ZW06IFRhc2tBdmFpbGFiaWxpdHkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS50YXNrID0gaXRlbS50YXNrLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEFTS19BVkFJTEFCSUxJVFlfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBUYXNrIFVJIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1VJIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0b29sdGlwKi8gIFxyXG4gIHB1YmxpYyB0b29sdGlwOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogb3JkZXIqLyBcclxuICBwdWJsaWMgb3JkZXI6IG51bWJlcjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1VJIH0gZnJvbSAnLi90YXNrLXVpLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBVSSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFza1VJU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tVST4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay11aXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrVUksIFwidGFzay11aXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgVUkqL1xyXG4gIHJlbW92ZShpdGVtOiBUYXNrVUkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0YXNrIFVJKi9cclxuICBzYXZlKGl0ZW06IFRhc2tVSSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHsgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0Nvbm5lY3Rpb259IGZyb20gJy4uL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7U2VydmljZVBhcmFtZXRlcn0gZnJvbSAnLi9zZXJ2aWNlLXBhcmFtZXRlci5tb2RlbCc7XHJcbi8qKlxyXG4gKiBTZXJ2aWNlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2VydmljZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG5cclxuICAvKiogdXJsKi8gIFxyXG4gIHB1YmxpYyBzZXJ2aWNlVVJMOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBwcm9qZWN0aW9ucyovICBcclxuICBwdWJsaWMgc3VwcG9ydGVkU1JTOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGxlZ2VuZCovXHJcbiAgcHVibGljIGxlZ2VuZDogc3RyaW5nO1xyXG5cclxuICAvKiogaW5mb1VybCovICBcclxuICBwdWJsaWMgaW5mb1VybDogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuXHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xyXG4gIFxyXG4gIC8qKiBwYXJhbWV0ZXJzKi8gIFxyXG4gIHB1YmxpYyBwYXJhbWV0ZXJzOiBTZXJ2aWNlUGFyYW1ldGVyW107XHJcblxyXG4gIC8qKiB3aGV0aGVyIHNlcnZpY2UgaXMgYmxvY2tlZCovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0IHsgU2VydmljZSB9IGZyb20gJy4vc2VydmljZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8U2VydmljZT4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgU0VSVklDRV9BUEkgPSAnc2VydmljZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihTZXJ2aWNlLCBcInNlcnZpY2VzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBzZXJ2aWNlKi9cclxuICByZW1vdmUoaXRlbTogU2VydmljZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UqL1xyXG4gIHNhdmUoaXRlbTogU2VydmljZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBsZXQgc2VydmljZUNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb247XHJcblxyXG4gICAgaWYgKGl0ZW0uY29ubmVjdGlvbiE9bnVsbCl7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uY29ubmVjdGlvbiA9IGl0ZW0uY29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcz0ge307XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICAvKmRlbGV0ZSBpdGVtLmNvbm5lY3Rpb247ICAgICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChzZXJ2aWNlQ29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmPT0nJyl7XHJcbiAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2Nvbm5lY3Rpb24nLHNlcnZpY2VDb25uZWN0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgIFxyXG5cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY29ubmVjdGlvbicsc2VydmljZUNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICBcclxuXHJcbiAgICAgIFxyXG4gICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7ICAgICAgICAgICBcclxuICAgICAgIH0gKi9cclxuICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG5cclxuICAgICAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuU0VSVklDRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2UubW9kZWwnOyBcclxuLyoqXHJcbiAqIFNlcnZpY2UgcGFyYW1ldGVyIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2VydmljZVBhcmFtZXRlciBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiB2YWx1ZSovICBcclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICBcclxuICAvKiogc2VydmljZSovXHJcbiAgcHVibGljIHNlcnZpY2U6IFNlcnZpY2U7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFNlcnZpY2VQYXJhbWV0ZXIgfSBmcm9tICcuL3NlcnZpY2UtcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogU2VydmljZSBwYXJhbWV0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlUGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFNlcnZpY2VQYXJhbWV0ZXI+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFNFUlZJQ0VfUEFSQU1FVEVSX0FQSSA9ICdzZXJ2aWNlLXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihTZXJ2aWNlUGFyYW1ldGVyLCBcInNlcnZpY2UtcGFyYW1ldGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBTZXJ2aWNlUGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHNhdmUoaXRlbTogU2VydmljZVBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoaXRlbS5zZXJ2aWNlICE9bnVsbCl7XHJcbiAgICAgICAgICBsZXQgc2VydmljZSA9ICBpdGVtLnNlcnZpY2U7XHJcbiAgICAgICAgICBkZWxldGUgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NlcnZpY2UnLHNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uc2VydmljZSA9IGl0ZW0uc2VydmljZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlNFUlZJQ0VfUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1NlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2Uvc2VydmljZS5tb2RlbCc7XHJcbmltcG9ydCB7Q29ubmVjdGlvbn0gZnJvbSAnLi4vY29ubmVjdGlvbi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZSA6IHN0cmluZztcclxuXHJcbiAgLyoqIHNlcnZpY2UqL1xyXG4gIHB1YmxpYyBzZXJ2aWNlIDogU2VydmljZTtcclxuXHJcbiAgLyoqIG9yZGVyKi8gIFxyXG4gIHB1YmxpYyBvcmRlcjogTnVtYmVyOyBcclxuXHJcbiAgLyoqIGRlc2NyaXB0aW9uKi8gIFxyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogU3RyaW5nO1xyXG5cclxuICAvKiogc291cmNlKi8gIFxyXG4gIHB1YmxpYyBzb3VyY2U6IFN0cmluZztcclxuXHJcbiAgLyoqIHdoZXRoZXIgY2FydG9ncmFwaHkgaXMgYmxvY2tlZCovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47XHJcblxyXG4gIFxyXG5cclxuICAvKiogdHJhbnNwYXJlbmN5Ki8gXHJcbiAgcHVibGljIHRyYW5zcGFyZW5jeTogTnVtYmVyO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBxdWVyeWFibGUqLyAgXHJcbiAgcHVibGljIHF1ZXJ5YWJsZTogQm9vbGVhbjtcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgcXVlcnlhYmxlKi8gXHJcbiAgcHVibGljIHF1ZXJ5QWN0OiBCb29sZWFuO1xyXG5cclxuICAvKiogcXVlcnkgbGF5ZXIqL1xyXG4gIHB1YmxpYyBxdWVyeUxheTogc3RyaW5nO1xyXG5cclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcblxyXG4gIC8qKiBtaW5pbXVtIHNjYWxlKi9cclxuICBwdWJsaWMgbWluaW11bVNjYWxlOiBOdW1iZXI7XHJcblxyXG4gIC8qKiBtYXhpbXVtIHNjYWxlKi9cclxuICBwdWJsaWMgbWF4aW11bVNjYWxlOiBOdW1iZXI7XHJcblxyXG4gIC8qKiBsYXllcnMqLyAgXHJcbiAgcHVibGljIGxheWVyczogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBjb25uZWN0aW9uKi9cclxuICBwdWJsaWMgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcclxuXHJcbiAgLyoqIHF1ZXJ5YWJsZUZlYXR1cmVFbmFibGVkICovXHJcbiAgcHVibGljIHF1ZXJ5YWJsZUZlYXR1cmVFbmFibGVkOiBCb29sZWFuO1xyXG5cclxuICAgIC8qKiBxdWVyeWFibGVMYXllcnMgKi9cclxuICBwdWJsaWMgcXVlcnlhYmxlRmVhdHVyZUF2YWlsYWJsZTogQm9vbGVhbjtcclxuXHJcbiAgICAvKiogcXVlcnlhYmxlTGF5ZXJzICovXHJcbiAgcHVibGljIHF1ZXJ5YWJsZUxheWVyczogc3RyaW5nW107XHJcblxyXG4gIC8qKiBhdmFpbGFiaWxpdGllcyovXHJcbiAgcHVibGljIGF2YWlsYWJpbGl0aWVzIDogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHlbXTtcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgcXVlcnlhYmxlKi8gXHJcbiAgcHVibGljIHNlbGVjdGFibGVGZWF0dXJlRW5hYmxlZDogQm9vbGVhbjtcclxuXHJcbiAgLyoqIHNlbGVjdGlvbiBsYXllciovXHJcbiAgcHVibGljIHNlbGVjdGlvbkxheWVyOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBzZWxlY3Rpb24gc2VydmljZSovICBcclxuICBwdWJsaWMgc2VsZWN0aW9uU2VydmljZTogU2VydmljZTtcclxuXHJcbiAgLyoqIGxlZ2VuZCB0aXAqLyAgXHJcbiAgcHVibGljIGxlZ2VuZFR5cGU6IHN0cmluZztcclxuICBcclxuICAvKiogbGVnZW5kIHVybCovXHJcbiAgcHVibGljIGxlZ2VuZFVSTDogc3RyaW5nO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBlZGl0YWJsZSovXHJcbiAgcHVibGljIGVkaXRhYmxlOiBCb29sZWFuO1xyXG5cclxuICAvKiogbWV0YWRhdGEgVVJMKi9cclxuICBwdWJsaWMgbWV0YWRhdGFVUkw6IHN0cmluZztcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgdGhlbWFibGUqL1xyXG4gIHB1YmxpYyB0aGVtYXRpYzogQm9vbGVhbjtcclxuICBcclxuICAvKiogZ2VvbWV0cnkgdHlwZSovXHJcbiAgcHVibGljIGdlb21ldHJ5VHlwZTogc3RyaW5nO1xyXG4gIFxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFJlc3RTZXJ2aWNlIH0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi4vY29ubmVjdGlvbi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2Uvc2VydmljZS5tb2RlbCc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5PiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9BUEkgPSAnY2FydG9ncmFwaGllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeSwgXCJjYXJ0b2dyYXBoaWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IGNhcnRvZ3JhcGh5Q29ubmVjdGlvbjphbnk9e307XHJcbiAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuICAgICBcclxuICAgIGxldCBjYXJ0b2dyYXBoeVNlcnZpY2U6YW55PXt9O1xyXG4gICAgY2FydG9ncmFwaHlTZXJ2aWNlLl9saW5rcyA9IHt9O1xyXG4gICAgY2FydG9ncmFwaHlTZXJ2aWNlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcbiAgICBcclxuICAgIGxldCBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2U6YW55ID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UuX2xpbmtzID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuXHJcbiAgICBpZiAoaXRlbS5zZXJ2aWNlICE9IG51bGwpIHtcclxuICAgICAgY2FydG9ncmFwaHlTZXJ2aWNlPSAgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uc2VydmljZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLnNlbGVjdGlvblNlcnZpY2UgIT0gbnVsbCkge1xyXG4gICAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UgPSBpdGVtLnNlbGVjdGlvblNlcnZpY2VcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtLnNlbGVjdGlvblNlcnZpY2UuX2xpbmtzICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgaXRlbS5zZWxlY3Rpb25TZXJ2aWNlID0gaXRlbS5zZWxlY3Rpb25TZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5jb25uZWN0aW9uICE9IG51bGwpIHtcclxuICAgICAgY2FydG9ncmFwaHlDb25uZWN0aW9uPSAgaXRlbS5jb25uZWN0aW9uO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uY29ubmVjdGlvbi5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLmNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcblxyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uY29ubmVjdGlvbjtcclxuICAgICAgZGVsZXRlIGl0ZW0uc2VydmljZTtcclxuICAgICAgZGVsZXRlIGl0ZW0uc2VsZWN0aW9uU2VydmljZTtcclxuXHJcbiAgICAgIGlmIChjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZiA9PSAnJykge1xyXG4gICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3NwYXRpYWxTZWxlY3Rpb25Db25uZWN0aW9uJywgY2FydG9ncmFwaHlDb25uZWN0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NwYXRpYWxTZWxlY3Rpb25Db25uZWN0aW9uJywgY2FydG9ncmFwaHlDb25uZWN0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjYXJ0b2dyYXBoeVNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZiA9PSAnJykge1xyXG4gICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3NlcnZpY2UnLCBjYXJ0b2dyYXBoeVNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2VydmljZScsIGNhcnRvZ3JhcGh5U2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYgPT0gJycpIHtcclxuICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdzcGF0aWFsU2VsZWN0aW9uU2VydmljZScsIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzcGF0aWFsU2VsZWN0aW9uU2VydmljZScsIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9BUEkpLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbmltcG9ydCB7Um9sZX0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuLyoqXHJcbiAqIENhcnRvZ3JhcGh5IGdyb3VwXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlHcm91cCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIC8qKiBtZW1iZXJzKi9cclxuICBwdWJsaWMgbWVtYmVyczogQ2FydG9ncmFwaHlbXTtcclxuICAvKiogcm9sZXMqL1xyXG4gIHB1YmxpYyByb2xlczogUm9sZVtdO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeUdyb3VwIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENhcnRvZ3JhcGh5R3JvdXAgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlHcm91cD4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfR1JPVVBfQVBJID0nY2FydG9ncmFwaHktZ3JvdXBzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHlHcm91cCwgXCJjYXJ0b2dyYXBoeS1ncm91cHNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNhcnRvZ3JhcGh5IGdyb3VwKi9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlHcm91cCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5IGdyb3VwKi9cclxuICBzYXZlKGl0ZW06IENhcnRvZ3JhcGh5R3JvdXApOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FSVE9HUkFQSFlfR1JPVVBfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4uL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHkgYXZhaWxhYmlsaXR5IG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIHRlcnJpdG9yeSovXHJcbiAgcHVibGljIHRlcnJpdG9yeTogVGVycml0b3J5O1xyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICBcclxuICAvKiogY2FydG9ncmFwaHkqL1xyXG4gIHB1YmxpYyBjYXJ0b2dyYXBoeTogQ2FydG9ncmFwaHk7XHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5IG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlBdmFpbGFiaWxpdHk+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX0FWQUlMQUJJTElUWV9BUEkgPSAnY2FydG9ncmFwaHktYXZhaWxhYmlsaXRpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSwgXCJjYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdGllc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkgYXZhaWxhYmlsaXR5Ki9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsaXRlbS5jYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9BVkFJTEFCSUxJVFlfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeVR5cGUgfSBmcm9tICcuLi90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUubW9kZWwnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHkgYXZhaWxhYmlsaXR5IG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlGaWx0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiBcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIHJlcXVpcmVkICovXHJcbiAgcHVibGljIHJlcXVpcmVkOiBib29sZWFuO1xyXG5cclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuXHJcbiAgLyoqIFRlcnJpdG9yaWFsIGxldmVsLiAqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbExldmVsOiBUZXJyaXRvcnlUeXBlO1xyXG4gIFxyXG4gIC8qKiBjb2x1bW4gKi9cclxuICBwdWJsaWMgY29sdW1uOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB2YWx1ZXMqLyAgXHJcbiAgcHVibGljIHZhbHVlczogc3RyaW5nO1xyXG5cclxuICAvKiogdmFsdWUqLyAgXHJcbiAgcHVibGljIHZhbHVlVHlwZTogc3RyaW5nO1xyXG5cclxuICAvKiogY2FydG9ncmFwaHkqL1xyXG4gIHB1YmxpYyBjYXJ0b2dyYXBoeTogQ2FydG9ncmFwaHk7XHJcblxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeUZpbHRlciB9IGZyb20gJy4vY2FydG9ncmFwaHktZmlsdGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHlGaWx0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUZpbHRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeUZpbHRlcj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfRklMVEVSX0FQSSA9ICdjYXJ0b2dyYXBoeS1maWx0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHlGaWx0ZXIsIFwiY2FydG9ncmFwaHktZmlsdGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkgZmlsdGVyKi9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlGaWx0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlGaWx0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsaXRlbS5jYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIFxyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0ZJTFRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7IFxyXG4vKipcclxuICogU2VydmljZSBwYXJhbWV0ZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeVBhcmFtZXRlciBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiB2YWx1ZSovICBcclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICBcclxuICAvKiogb3JkZXIqLyAgXHJcbiAgcHVibGljIG9yZGVyOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBjYXJ0b2dyYXBoeSovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FydG9ncmFwaHlQYXJhbWV0ZXIgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlQYXJhbWV0ZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlQYXJhbWV0ZXI+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX1BBUkFNRVRFUl9BUEkgPSAnY2FydG9ncmFwaHktcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5UGFyYW1ldGVyLCBcImNhcnRvZ3JhcGh5LXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlQYXJhbWV0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeVBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgbGV0IGNhcnRvZ3JhcGh5ID0gIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgICAgICBkZWxldGUgaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FSVE9HUkFQSFlfUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5R3JvdXB9IGZyb20gJy4vY2FydG9ncmFwaHktZ3JvdXAubW9kZWwnO1xyXG4vKipcclxuICogQmFja2dyb3VuZCBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEJhY2tncm91bmQgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICBcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIGRlc2NyaXB0aW9uKi9cclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBcclxuICAvKiogd2hldGhlciBiYWNrZ3JvdW5kIGlzIGFjdGl2ZSovXHJcbiAgcHVibGljIGFjdGl2ZTogQm9vbGVhbjtcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcblxyXG4gIC8qKiBjYXJ0b2dyYXBoeSBncm91cCovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5R3JvdXA6IENhcnRvZ3JhcGh5R3JvdXA7XHJcbn1cclxuIiwiaW1wb3J0IHsgQmFja2dyb3VuZCB9IGZyb20gJy4vYmFja2dyb3VuZC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIEJhY2tncm91bmQgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEJhY2tncm91bmRTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QmFja2dyb3VuZD4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQkFDS0dST1VORF9BUEkgPSAnYmFja2dyb3VuZHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihCYWNrZ3JvdW5kLCBcImJhY2tncm91bmRzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBiYWNrZ3JvdW5kKi9cclxuICByZW1vdmUoaXRlbTogQmFja2dyb3VuZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTsgICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYmFja2dyb3VuZCovXHJcbiAgc2F2ZShpdGVtOiBCYWNrZ3JvdW5kKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGxldCBiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cCA9IGl0ZW0uY2FydG9ncmFwaHlHcm91cDtcclxuXHJcbiAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeUdyb3VwIT1udWxsKXtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW0uY2FydG9ncmFwaHlHcm91cC5fbGlua3MhPSAndW5kZWZpbmVkJykgeyBcclxuICAgICAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeUdyb3VwID0gaXRlbS5jYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzPSB7fTtcclxuICAgICAgICAgICAgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgICAgICAgICAgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzLnNlbGYuaHJlZj1cIlwiO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgLy91cGRhdGUgcmVsYXRpb25zXHJcbiAgICAgIGRlbGV0ZSBpdGVtLmNhcnRvZ3JhcGh5R3JvdXA7ICAgICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cC5fbGlua3Muc2VsZi5ocmVmPT0nJyl7XHJcbiAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5R3JvdXAnLGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgIFxyXG5cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY2FydG9ncmFwaHlHcm91cCcsYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXApLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICBcclxuXHJcbiAgICAgIFxyXG4gICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7ICAgICAgICAgICBcclxuICAgICAgIH0gXHJcbiAgICAgICBcclxuICAgICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuXHJcbiAgICAgICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkJBQ0tHUk9VTkRfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VHJlZU5vZGV9IGZyb20gJy4vdHJlZS1ub2RlLm1vZGVsJztcclxuaW1wb3J0IHtSb2xlfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnOyAgICBcclxuLyoqXHJcbiAqIFRyZWUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmVlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogbm9kZXMgKi9cclxuICBwdWJsaWMgbm9kZXM6IFRyZWVOb2RlW107XHJcbiAgLyoqIGF2YWlsYWJsZSByb2xlcyAqL1xyXG4gIHB1YmxpYyBhdmFpbGFibGVSb2xlcyA6IFJvbGVbXTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVHJlZSB9IGZyb20gJy4vdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRyZWUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRyZWVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VHJlZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUUkVFX0FQSSA9ICd0cmVlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRyZWUsIFwidHJlZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRyZWUqL1xyXG4gIHJlbW92ZShpdGVtOiBUcmVlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdHJlZSovXHJcbiAgc2F2ZShpdGVtOiBUcmVlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UUkVFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbmltcG9ydCB7VHJlZX0gZnJvbSAnLi90cmVlLm1vZGVsJztcclxuLyoqXHJcbiAqIFRyZWUgbm9kZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogdG9vbHRpcCovXHJcbiAgcHVibGljIHRvb2x0aXA6IHN0cmluZztcclxuICAvKiogb3JkZXIqL1xyXG4gIHB1YmxpYyBvcmRlciA6IG51bWJlcjtcclxuICAvKiogd2hldGhlciB0cmVlIG5vZGUgaXMgYWN0aXZlKi9cclxuICBwdWJsaWMgYWN0aXZlOiBib29sZWFuO1xyXG4gIC8qKiBwYXJlbnQgdHJlZSBub2RlICovXHJcbiAgcHVibGljIHJhZGlvOiBib29sZWFuO1xyXG4gIC8qKiBwYXJlbnQgdHJlZSBub2RlICovXHJcbiAgcHVibGljIHBhcmVudDogVHJlZU5vZGU7XHJcbiAgLyoqIGRpc3BsYXllZCBjYXJ0b2dyYXBoeSAqLyAgXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuICAvKiogdHJlZSAqLyAgXHJcbiAgcHVibGljIHRyZWU6IFRyZWU7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUcmVlIG5vZGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBUcmVlTm9kZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUcmVlTm9kZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUUkVFX05PREVfQVBJID0gJ3RyZWUtbm9kZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUcmVlTm9kZSwgXCJ0cmVlLW5vZGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmVlIG5vZGUqL1xyXG4gIHJlbW92ZShpdGVtOiBUcmVlTm9kZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRyZWUgbm9kZSovXHJcbiAgc2F2ZShpdGVtOiBUcmVlTm9kZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgY29uc3QgaXRlbVRyZWUgPSBpdGVtLnRyZWU7XHJcbiAgICAgIGNvbnN0IGl0ZW1DYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgIGNvbnN0IGl0ZW1QYXJlbnQgPSBpdGVtLnBhcmVudDtcclxuICAgICAgICBcclxuICAgICAgZGVsZXRlIGl0ZW0udHJlZTtcclxuICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgIGRlbGV0ZSBpdGVtLnBhcmVudDtcclxuICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbVRyZWUgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0cmVlJyxpdGVtVHJlZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtQ2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsaXRlbUNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW1QYXJlbnQgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdwYXJlbnQnLGl0ZW1QYXJlbnQpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChpdGVtLnRyZWUgJiYgaXRlbS50cmVlLl9saW5rcyAmJiBpdGVtLnRyZWUuX2xpbmtzLnNlbGYpIHtcclxuICAgICAgICBpdGVtLnRyZWUgPSBpdGVtLnRyZWUuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAmJiBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcyAmJiBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmKSB7XHJcbiAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfSAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRSRUVfTk9ERV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtUcmVlfSBmcm9tICcuLi90cmVlL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge1JvbGV9IGZyb20gJy4uL3JvbGUvcm9sZS5tb2RlbCc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlHcm91cH0gZnJvbSAnLi4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAubW9kZWwnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uUGFyYW1ldGVyfSBmcm9tICcuL2FwcGxpY2F0aW9uLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25CYWNrZ3JvdW5kfSBmcm9tICcuL2FwcGxpY2F0aW9uLWJhY2tncm91bmQubW9kZWwnO1xyXG5cclxuLy9GSVhNRSBlbnN1cmUgYXBwbGljYXRpb24gY3JlYXRpb24gaW4gYWRtaW4gYXBwIHVwb24gaW5pdGlhbGl6YXRpb24gKGFzIGl0IGlzIGRvbmUgd2l0aCBSb2xlcyBhbmQgZGVmYXVsdCBVc2VycylcclxuLyoqIFRlcnJpdG9yaWFsIGFwcGxpY3Rpb24gbmFtZSAqL1xyXG5leHBvcnQgY29uc3QgVEVSUklUT1JJQUxfQVBQX05BTUU6c3RyaW5nICA9IFwiQXBsaWNhY2nDg8KzbiBUZXJyaXRvcmlhbFwiO1xyXG5cclxuLyoqXHJcbiAqIEFwcGxpY2F0aW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb24gZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICBcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHRpdGxlKi9cclxuICBwdWJsaWMgdGl0bGU6IHN0cmluZztcclxuICBcclxuICAvKiogdGhlbWUqL1xyXG4gIHB1YmxpYyB0aGVtZTogc3RyaW5nO1xyXG5cclxuICAgIFxyXG4gIC8qKiB1cmxUZW1wbGF0ZSovXHJcbiAgcHVibGljIGpzcFRlbXBsYXRlOiBzdHJpbmc7XHJcbiAgXHJcbiAgXHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIFxyXG4gIC8qKiBhdmFpbGFibGUgcm9sZXMqL1xyXG4gIHB1YmxpYyBhdmFpbGFibGVSb2xlcyA6IFJvbGVbXTtcclxuICBcclxuICAvKiogdHJlZXMqL1xyXG4gIHB1YmxpYyB0cmVlcyA6IFRyZWVbXTtcclxuICBcclxuICAvKiogc2NhbGVzIChjb21tYS1zZXBhcmF0ZWQgdmFsdWVzKSovXHJcbiAgcHVibGljIHNjYWxlczogc3RyaW5nW107XHJcbiAgXHJcbiAgLyoqIHByb2plY3Rpb25zKGNvbW1hLXNlcGFyYXRlZCBFUFNHIGNvZGVzKSovXHJcbiAgcHVibGljIHNyczogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB3aGV0aGVyIGFwcGxpY2F0aW9uIHRyZWUgd2lsbCBhdXRvIHJlZnJlc2gqLyAgXHJcbiAgcHVibGljIHRyZWVBdXRvUmVmcmVzaDogQm9vbGVhbjtcclxuXHJcbiAgLyoqIGJhY2tncm91bmRzKi9cclxuICBwdWJsaWMgYmFja2dyb3VuZHM6IEFwcGxpY2F0aW9uQmFja2dyb3VuZFtdO1xyXG5cclxuICAvKiogc2l0dWF0aW9uIG1hcCovXHJcbiAgcHVibGljIHNpdHVhdGlvbk1hcDogQ2FydG9ncmFwaHlHcm91cDsgICAgXHJcbiAgXHJcbiAgLyoqIHBhcmFtZXRlcnMqL1xyXG4gIHB1YmxpYyBwYXJhbWV0ZXJzOiBBcHBsaWNhdGlvblBhcmFtZXRlcltdO1xyXG59XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeUdyb3VwIH0gZnJvbSAnLi4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAubW9kZWwnO1xyXG5cclxuLyoqIEFwcGxpY2F0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxBcHBsaWNhdGlvbj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBQTElDQVRJT05fQVBJID0gJ2FwcGxpY2F0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEFwcGxpY2F0aW9uLCBcImFwcGxpY2F0aW9uc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgYXBwbGljYXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBBcHBsaWNhdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFwcGxpY2F0aW9uKi9cclxuICBzYXZlKGl0ZW06IEFwcGxpY2F0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuXHJcbiAgICBsZXQgYXBwbGljYXRpb25TaXR1YXRpb25NYXA6YW55ID0ge307XHJcbiAgICBhcHBsaWNhdGlvblNpdHVhdGlvbk1hcC5fbGlua3M9IHt9O1xyXG4gICAgYXBwbGljYXRpb25TaXR1YXRpb25NYXAuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICBcclxuICAgIGlmIChpdGVtLnNpdHVhdGlvbk1hcCE9bnVsbCl7XHJcbiAgICAgICAgYXBwbGljYXRpb25TaXR1YXRpb25NYXA9aXRlbS5zaXR1YXRpb25NYXA7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLnNpdHVhdGlvbk1hcC5fbGlua3MhPSAndW5kZWZpbmVkJykgeyBcclxuICAgICAgICAgICAgaXRlbS5zaXR1YXRpb25NYXAgPSBpdGVtLnNpdHVhdGlvbk1hcC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gICAgICAgXHJcbiAgICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uc2l0dWF0aW9uTWFwOyAgICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoYXBwbGljYXRpb25TaXR1YXRpb25NYXAuX2xpbmtzLnNlbGYuaHJlZj09Jycpe1xyXG4gICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdzaXR1YXRpb25NYXAnLGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgIFxyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzaXR1YXRpb25NYXAnLGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgXHJcbiAgICAgIFxyXG4gICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7ICAgICAgICAgICBcclxuICAgICAgIH0gXHJcbiAgICAgICBcclxuICAgICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuXHJcbiAgICAgICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFQUExJQ0FUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gICAgXHJcbiAgICBcclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtCYWNrZ3JvdW5kfSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLm1vZGVsJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbn0gZnJvbSAnLi9hcHBsaWNhdGlvbi5tb2RlbCc7IFxyXG5cclxuLyoqXHJcbiAqIEFwcGxpY2F0aW9uIGJhY2tncm91bmQgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbkJhY2tncm91bmQgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG9yZGVyKi9cclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjtcclxuICBcclxuICAvKiogYmFja2dyb3VuZCovXHJcbiAgcHVibGljIGJhY2tncm91bmQ6IEJhY2tncm91bmQ7XHJcbiAgXHJcbiAgLyoqIGFwcGxpY2F0aW9uKi9cclxuICBwdWJsaWMgYXBwbGljYXRpb246IEFwcGxpY2F0aW9uO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbkJhY2tncm91bmQgfSBmcm9tICcuL2FwcGxpY2F0aW9uLWJhY2tncm91bmQubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBBcHBsaWNhdGlvbiBiYWNrZ3JvdW5kIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25CYWNrZ3JvdW5kU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEFwcGxpY2F0aW9uQmFja2dyb3VuZD4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBQTElDQVRJT05fQkFDS0dST1VORF9BUEkgPSdhcHBsaWNhdGlvbi1iYWNrZ3JvdW5kcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEFwcGxpY2F0aW9uQmFja2dyb3VuZCwgXCJhcHBsaWNhdGlvbi1iYWNrZ3JvdW5kc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgYXBwbGljYXRpb24gYmFja2dyb3VuZCovXHJcbiAgcmVtb3ZlKGl0ZW06IEFwcGxpY2F0aW9uQmFja2dyb3VuZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFwcGxpY2F0aW9uIGJhY2tncm91bmQqL1xyXG4gIHNhdmUoaXRlbTogQXBwbGljYXRpb25CYWNrZ3JvdW5kKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtLmFwcGxpY2F0aW9uICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignYXBwbGljYXRpb24nLGl0ZW0uYXBwbGljYXRpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLmJhY2tncm91bmQgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdiYWNrZ3JvdW5kJyxpdGVtLmJhY2tncm91bmQpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5hcHBsaWNhdGlvbiA9IGl0ZW0uYXBwbGljYXRpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS5iYWNrZ3JvdW5kID0gaXRlbS5iYWNrZ3JvdW5kLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQVBQTElDQVRJT05fQkFDS0dST1VORF9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbn0gZnJvbSAnLi9hcHBsaWNhdGlvbi5tb2RlbCc7IFxyXG5cclxuLyoqXHJcbiAqIEFwcGxpY2F0aW9uIHBhcmFtZXRlciBtb2RlbCBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvblBhcmFtZXRlciBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICBcclxuICAvKiogdmFsdWUqLyAgICBcclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICBcclxuICAvKiogYXBwbGljYXRpb24qL1xyXG4gIHB1YmxpYyBhcHBsaWNhdGlvbjogQXBwbGljYXRpb247XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uUGFyYW1ldGVyIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBBcHBsaWNhdGlvbiBwYXJhbWV0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvblBhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxBcHBsaWNhdGlvblBhcmFtZXRlcj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBQTElDQVRJT05fUEFSQU1FVEVSX0FQSSA9ICdhcHBsaWNhdGlvbi1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQXBwbGljYXRpb25QYXJhbWV0ZXIsIFwiYXBwbGljYXRpb24tcGFyYW1ldGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgYXBwbGljYXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBBcHBsaWNhdGlvblBhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFwcGxpY2F0aW9uKi9cclxuICBzYXZlKGl0ZW06IEFwcGxpY2F0aW9uUGFyYW1ldGVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtLmFwcGxpY2F0aW9uICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignYXBwbGljYXRpb24nLGl0ZW0uYXBwbGljYXRpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5hcHBsaWNhdGlvbiA9IGl0ZW0uYXBwbGljYXRpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BUFBMSUNBVElPTl9QQVJBTUVURVJfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBDb25uZWN0aW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29kZUxpc3QgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBjb2RlTGlzdE5hbWU6IHN0cmluZztcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgLyoqIHVzZXIqL1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ29kZUxpc3QgfSBmcm9tICcuL2NvZGVsaXN0Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ29ubmVjdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29kZUxpc3RTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q29kZUxpc3Q+IHtcclxuICBcclxuIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT0RFTElTVF9BUEkgPSAnY29kZWxpc3QtdmFsdWVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ29kZUxpc3QsIFwiY29kZWxpc3QtdmFsdWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjb25uZWN0aW9uKi9cclxuICByZW1vdmUoaXRlbTogQ29kZUxpc3QpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjb25uZWN0aW9uKi9cclxuICBzYXZlKGl0ZW06IENvZGVMaXN0KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT0RFTElTVF9BUEkgKSwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBMYXllciBtb2RlbDogY29uZmlndXJlIExheWVyIGRhdGEgYW5kIGRpc3BsYXlpbmcgY29uZmlndXJhdGlvbiAqLyBcclxuZXhwb3J0IGNsYXNzIExheWVyIHtcclxuICAvLyBEaXNwbGF5IGRhdGFcclxuICAvKiogbGF5ZXIgdmlzaWJpbGl0eSovICBcclxuICB2aXNpYmlsaXR5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgLyoqIFRyYW5zcGFyZW5jeSAoVHJhbnNwYXJlbnQpIDAtMSAoT3BhcXVlKSovXHJcbiAgb3BhY2l0eTogbnVtYmVyID0gMS4wO1xyXG5cclxuICAvLyBDb25maWd1cmF0aW9uIGRhdGFcclxuICAvKiogdGl0bGUqL1xyXG4gIHRpdGxlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIElkIHRvIGluZGV4Ki9cclxuICBpZDogYW55O1xyXG4gIFxyXG4gIC8qKiBTZXJ2aWNlIE5hbWUqL1xyXG4gIHNlcnZlck5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIFNlcnZpY2UgYXR0cmlidXRpb25zKi9cclxuICBhdHRyaWJ1dGlvbnM6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gIC8qKiBSZXF1ZXN0IGZvcm1hdCAoaW1hZ2UvanBnLCAuLi4pKi9cclxuICBmb3JtYXQ6IHN0cmluZztcclxuICBcclxuICAvKiogUmVxdWVzdCBzZXJ2aWNlIHZlcnNpb24qL1xyXG4gIHZlcnNpb246c3RyaW5nO1xyXG5cclxuICAvKiogU2VydmljZSB1cmwqL1xyXG4gIHVybDogc3RyaW5nO1xyXG5cclxuICAvKiogSXMgYmFzZSBsYXllcj8qL1xyXG4gIGlzQmFzZUxheWVyOiBib29sZWFuO1xyXG5cclxuICAvKiogUmVxdWVzdCBsYXllciBuYW1lKi9cclxuICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBJcyB0aWxlZD8qL1xyXG4gIHRpbGVkOiBib29sZWFuO1xyXG4gIFxyXG4gIC8qKiBEZXNjcmlwdGlvbiovXHJcbiAgZGVzYzogc3RyaW5nID0gXCJcIjtcclxuICBcclxuICAvKiogIFRyYW5zcGFyZW50IHJlcXVlc3QgcGFyYW1ldGVyPyovXHJcbiAgdXJsX3RyYW5zcGFyZW50OiBzdHJpbmcgPSBcInRydWVcIjtcclxuICBcclxuICAvKiogUmVxdWVzdCBCYWNrZ3JvdW5kIHBhcmFtZXRlciBjb2xvciAoSGV4YSkqL1xyXG4gIHVybF9iZ2NvbG9yOiBzdHJpbmcgPSBcIjB4MDAwMDAwXCI7XHJcbiAgXHJcbiAgLyoqIFJlcXVlc3QgRXhjZXB0aW9uIFVSTCovXHJcbiAgdXJsX2V4Y2VwdGlvbjogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBFeHRlbnQgZm9yIHRpbGVkIHNlcnZpY2VzKi9cclxuICBleHRlbnQ6IGFueSA9IG51bGw7XHJcblxyXG4gIC8qKiBUaWxlIGhlaWdodCAoaWYgbm90IGRlZmluZWQsIHRoZSBkZWZhdWx0IG1hcCBpcyB0YWtlbikqL1xyXG4gIHRpbGVIZWlnaHQ/Om51bWJlcjtcclxuICBcclxuICAvKiogVGlsZSB3aWR0aCAoaWYgbm90IGRlZmluZWQsIHRoZSBkZWZhdWx0IG1hcCBpcyB0YWtlbikqL1xyXG4gIHRpbGVXaWR0aD86bnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBFbmFibGVkIGZvciBHZXRGZWF0dXJlSW5mbyByZXF1ZXN0cyAoZW5hYmxlZCB0byB1c2UgdGhlIHZpZXdlciBmZWF0dXJlcyBpbmZvcm1hdGlvbiB0b29sKSovXHJcbiAgcXVlcnlhYmxlPzpib29sZWFuID0gZmFsc2U7XHJcbiAgXHJcbiAgLyoqIE1pbmltdW0gc2NhbGUqL1xyXG4gIG1pbmltdW1TY2FsZT86bnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBNYXhpbXVtIHNjYWxlKi9cclxuICBtYXhpbXVtU2NhbGU/Om51bWJlcjtcclxuICBcclxuICAvKiogTGlzdCBvZiBhdmFpbGFibGUgQ1JTKi9cclxuICBwcm9qZWN0aW9ucz86c3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBGZWF0dXJlcyBpbmZvcm1hdGlvbiBVUkwqL1xyXG4gIGluZm9Vcmw/OnN0cmluZztcclxuICBcclxuICAvKiogTWV0YWRhdGEgaW5mb3JtYXRpb24gVVJMKi9cclxuICBtZXRhZGF0YVVybD86c3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBMZWdlbmQgVVJMKi9cclxuICBsZWdlbmRVcmw/OnN0cmluZztcclxuICBcclxuICAvKiogQXJyYXkgb2YgT3B0aW9uYWxQYXJhbWV0ZXIgb2JqZWN0IHRoYXQgZGVmaW5lcyBvdGhlciBvcHRpb25hbCBwYXJhbWV0ZXItdmFsdWUgcGFpcnMgZm9yIHRoZSByZXF1ZXN0IChUSU1FIC4uLikqL1xyXG4gIG9wdGlvbmFsUGFyYW1ldGVycz86QXJyYXk8T3B0aW9uYWxQYXJhbWV0ZXI+O1xyXG59XHJcblxyXG4vKiogT3B0aW9uYWwgcGFyYW1ldGVyIG1vZGVsOiBjb25maWd1cmUgcGFyYW1ldGVyLXZhbHVlIHBhaXIgdG8gYWRkIHRvIHRoZSByZXF1ZXN0IGxheWVyIFVSTCAqL1xyXG5leHBvcnQgY2xhc3MgT3B0aW9uYWxQYXJhbWV0ZXIge1xyXG4gIC8qKiBrZXkqL2tleTpzdHJpbmc7XHJcbiAgLyoqIHZhbHVlKi92YWx1ZTpzdHJpbmc7XHJcbn1cclxuXHJcbi8qKiBMYXllciBjb25maWd1cmF0aW9uIG1vZGVsOiBtb2RpZnkgdGhlIGNvbmZpZ3VyYXRpb24gb2YgYSBsYXllciB3aGVuIGludGVyYWN0aW5nIHdpdGggdGhlIG1hcCAobWFrZSB2aXNpYmxlLCBtb3ZlIHRoZSBsYXllciAuLi4pICovXHJcbmV4cG9ydCBjbGFzcyBMYXllckNvbmZpZ3VyYXRpb24ge1xyXG4gIC8qKiBJZGVudGlmaWVyIHRvIGluZGV4Ki9pZDogYW55O1xyXG4gIC8qKiBMYXllciB2aXNpYmlsaXR5Ki92aXNpYmlsaXR5OiBib29sZWFuO1xyXG4gIC8qKiBMYXllciB0cmFuc3BhcmVuY3kgKFRyYW5zcGFyZW50KSAwLTEgKE9wYXF1ZSkqL29wYWNpdHk6IG51bWJlcjtcclxuICAvKiogTGF5ZXIgcG9zaXRpb24qL3Bvc2l0aW9uOiBudW1iZXI7XHJcbn1cclxuXHJcbi8qKiBMYXllciBncm91cCBtb2RlbCovXHJcbmV4cG9ydCBjbGFzcyBMYXllckdyb3VwIHtcclxuICAvKiogaW5pdGlhbGx5IGFjdGl2YXRlZCAoYWxsIHZpc2libGUgbGF5ZXJzKSovYWN0aXZlPzpib29sZWFuO1xyXG4gIC8qKiBncm91cCBuYW1lKi9uYW1lPzogU3RyaW5nO1xyXG4gIC8qKiBncm91cCBpZCovaWQ6IFN0cmluZztcclxuICAvKiogYXJyYXkgb2YgY2hpbGQgTGF5ZXJzKi9sYXllcnM6IEFycmF5PExheWVyPjtcclxufVxyXG5cclxuLyoqIE1hcCBvcHRpb25zIGNvbmZpZ3VyYXRpb24gbW9kZWwqL1xyXG5leHBvcnQgY2xhc3MgTWFwT3B0aW9uc0NvbmZpZ3VyYXRpb24ge1xyXG4gIC8qKiBzY2FsZXMqL3NjYWxlcz86IHN0cmluZztcclxuICAvKiogcHJvamVjdGlvbnMqL3Byb2plY3Rpb25zPzogc3RyaW5nO1xyXG4gIC8qKiBtaW5pbXVtIHNjYWxlKi9taW5TY2FsZT86bnVtYmVyO1xyXG4gIC8qKiBtYXhpbXVtIHNjYWxlKi9tYXhTY2FsZT86bnVtYmVyO1xyXG4gIC8qKiBleHRlbnQqL2V4dGVudD86YW55O1xyXG4gIC8qKiBtYXhpbXVtIGV4dGVudCovbWF4RXh0ZW50Pzphbnk7XHJcbiAgLyoqIHRpbGUgd2lkdGgqL3RpbGVXaWR0aD86bnVtYmVyO1xyXG4gIC8qKiB0aWxlIGhlaWdodCovdGlsZUhlaWdodD86bnVtYmVyO1xyXG4gIC8qKiBwYXJhbWV0ZXJzKi9wYXJhbWV0ZXJzPzogQXJyYXk8T3B0aW9uYWxQYXJhbWV0ZXI+XHJcbn1cclxuXHJcbi8qKiBNYXAgY29tcG9uZW50IHN0YXR1cyBtb2RlbCovXHJcbmV4cG9ydCBjbGFzcyBNYXBDb21wb25lbnRTdGF0dXMge1xyXG4gICAgLyoqIGxvYWRlZD8qL2xvYWRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcblxyXG4vKiogTWFwIGNvbmZpZ3VyYXRpb24gbWFuYWdlciBzZXJ2aWNlKi9cclxuZXhwb3J0IGNsYXNzIE1hcENvbmZpZ3VyYXRpb25NYW5hZ2VyU2VydmljZSB7XHJcbiAgcHJpdmF0ZSBsYXllcnNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgcHJpdmF0ZSBsYXllcnM6IEFycmF5PExheWVyPiA9IG51bGw7XHJcblxyXG4gIHByaXZhdGUgYmFzZUxheWVyR3JvdXBzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG4gIHByaXZhdGUgYmFzZUxheWVyR3JvdXBzOiBBcnJheTxMYXllckdyb3VwPiA9IG51bGw7XHJcblxyXG4gIHByaXZhdGUgbGF5ZXJDb25maWd1cmF0aW9uU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG5cclxuICBwcml2YXRlIGFkZExheWVyc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIHJlbW92ZUxheWVyc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgcHJpdmF0ZSBzaXR1YXRpb25NYXBDb25maWd1cmF0aW9uU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG4gIHByaXZhdGUgbWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25TdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcblxyXG4gIHByaXZhdGUgbWFwQ29tcG9uZW50U3RhdHVzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IqL1xyXG4gIGNvbnN0cnVjdG9yKCkgeyBcclxuICAgLy9cclxuICB9XHJcbiAgXHJcbiAgLyoqIGxheWVyIGNvdW50ICovXHJcbiAgY291bnQgPSAwO1xyXG5cclxuICAvKiogY29uZmlndXJlIHRoZSBvdmVybGF5IGxheWVycyBvZiB0aGUgbWFwLCBieSBwYXNzaW5nIGFzIGEgcGFyYW1ldGVyIGFuIGFycmF5IG9mIG9iamVjdHMgb2YgdHlwZSBMYXllciBvYmplY3RzIGRlZmluaW5nIHRoZSBsYXllcnMgdG8gbG9hZC4qL1xyXG4gIGxvYWRMYXllcnNDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHtcclxuICAgIGlmICh0aGlzLmxheWVycyAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMuY2xlYXJMYXllcnMoZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zZXRMYXllcnMoY29uZmlndXJhdGlvbik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKmNvbmZpZ3VyZSB0aGUgYmFzZSBsYXllcnMgb2YgdGhlIG1hcCBieSBwYXNzaW5nIGFzIGEgcGFyYW1ldGVyIGFuIGFycmF5IG9mIG9iamVjdHMgb2YgdHlwZSBMYXllckdyb3VwIGVhY2ggb2YgdGhlbSB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIExheWVyIG9iamVjdHMgZGVmaW5pbmcgdGhlIGxheWVycyB0byBsb2FkLiovXHJcbiAgbG9hZEJhc2VMYXllcnNDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHtcclxuICAgIHRoaXMuc2V0QmFzZUxheWVyR3JvdXBzKGNvbmZpZ3VyYXRpb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqIGdldCBiYXNlIGxheWVyIGdyb3VwcyovXHJcbiAgZ2V0QmFzZUxheWVyR3JvdXBzKCk6IE9ic2VydmFibGU8TGF5ZXJHcm91cFtdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5iYXNlTGF5ZXJHcm91cHNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHNldCBiYXNlIGxheWVyIGdyb3VwcyovXHJcbiAgc2V0QmFzZUxheWVyR3JvdXBzKGdyb3VwczpBcnJheTxMYXllckdyb3VwPikge1xyXG4gICAgdGhpcy5iYXNlTGF5ZXJHcm91cHMgPSBncm91cHM7XHJcbiAgICB0aGlzLnJlZnJlc2hCYXNlTGF5ZXJHcm91cHMoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVmcmVzaEJhc2VMYXllckdyb3VwcygpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMuYmFzZUxheWVyR3JvdXBzU3ViamVjdC5uZXh0KHRoaXMuYmFzZUxheWVyR3JvdXBzKTtcclxuICB9XHJcblxyXG4gIC8qKiBnZXQgbGF5ZXJzKi9cclxuICBnZXRMYXllcnMoKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5sYXllcnNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBhbGwgbGF5ZXJzIGZyb20gbWFwKi9cclxuICBjbGVhckxheWVycyhyZWZyZXNoOmJvb2xlYW4pIHtcclxuICAgIHdoaWxlKHRoaXMubGF5ZXJzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmxheWVycy5wb3AoKTtcclxuICAgIH1cclxuICAgIGlmIChyZWZyZXNoKSB7XHJcbiAgICAgIHRoaXMucmVmcmVzaExheWVycygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqIHNldCBsYXllcnMqL1xyXG4gIHNldExheWVycyhsYXllcnM6QXJyYXk8TGF5ZXI+KSB7XHJcbiAgICB0aGlzLmxheWVycyA9IGxheWVycztcclxuICAgIHRoaXMucmVmcmVzaExheWVycygpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGFkZCBnaXZlbiBsYXllciB0byBtYXAqL1xyXG4gIGFkZExheWVyKGxheWVyOkxheWVyKSB7XHJcbiAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcclxuICAgIHRoaXMucmVmcmVzaEFkZExheWVycyhsYXllcik7XHJcbiAgfVxyXG5cclxuICAvKiogYWRkIGdpdmVuIGxheWVyIHRvIG1hcCBhdCBnaXZlbiBpbmRleCovXHJcbiAgYWRkTGF5ZXJBdChsYXllcjpMYXllciwgaW5kZXg6bnVtYmVyKSB7XHJcbiAgICBpZiAoaW5kZXggPT0gMCkge1xyXG4gICAgICB0aGlzLmxheWVycyA9IFtsYXllcl0uY29uY2F0KHRoaXMubGF5ZXJzKTtcclxuICAgIH0gZWxzZSBpZiAoaW5kZXggPj0gdGhpcy5sYXllcnMubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5sYXllcnMgPSB0aGlzLmxheWVycy5zbGljZSgwLCBpbmRleClcclxuICAgICAgICAgICAgICAgICAgICAuY29uY2F0KFtsYXllcl0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNvbmNhdCh0aGlzLmxheWVycy5zbGljZShpbmRleCwgdGhpcy5sYXllcnMubGVuZ3RoKSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlZnJlc2hBZGRMYXllcnMobGF5ZXIpO1xyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGxheWVyLmlkLCBudWxsLCBudWxsLCBpbmRleCk7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIGdpdmVuIGxheWVyIGZyb20gbWFwKi9cclxuICByZW1vdmVMYXllcihsYXllcjpMYXllcikge1xyXG4gICAgdmFyIGluZGV4ID0gdGhpcy5sYXllcnMuaW5kZXhPZihsYXllcik7XHJcbiAgICB0aGlzLnJlbW92ZUxheWVySW5kZXgoaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBsYXllciB3aXRoIGdpdmVuIGlkIGZyb20gbWFwICovXHJcbiAgcmVtb3ZlTGF5ZXJJZChpZCkge1xyXG4gICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IHRoaXMubGF5ZXJzLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5sYXllcnNbaV0uaWQgPT0gaWQpIHtcclxuICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMucmVtb3ZlTGF5ZXJJbmRleChpbmRleCk7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIGxheWVyIGF0IGdpdmVuIGluZGV4IGZyb20gbWFwICovXHJcbiAgcmVtb3ZlTGF5ZXJJbmRleChpbmRleDpudW1iZXIpIHtcclxuICAgIHZhciBsYXllciA9IHRoaXMubGF5ZXJzW2luZGV4XTtcclxuICAgIHRoaXMubGF5ZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB0aGlzLnJlZnJlc2hSZW1vdmVMYXllcnMobGF5ZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlZnJlc2ggbGF5ZXJzICovXHJcbiAgcHJpdmF0ZSByZWZyZXNoTGF5ZXJzKCkge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5sYXllcnNTdWJqZWN0Lm5leHQodGhpcy5sYXllcnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqIE9ic2VydmFibGUgZm9yIGxheWVycyBhZGRlZCAqL1xyXG4gIGdldExheWVyc0FkZGVkKCk6IE9ic2VydmFibGU8TGF5ZXJbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuYWRkTGF5ZXJzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVmcmVzaEFkZExheWVycyhsYXllcjpMYXllcikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5hZGRMYXllcnNTdWJqZWN0Lm5leHQoW2xheWVyXSk7XHJcbiAgfVxyXG5cclxuICBnZXRMYXllcnNSZW1vdmVkKCk6IE9ic2VydmFibGU8TGF5ZXJbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMucmVtb3ZlTGF5ZXJzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVmcmVzaFJlbW92ZUxheWVycyhsYXllcjpMYXllcikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5yZW1vdmVMYXllcnNTdWJqZWN0Lm5leHQoW2xheWVyXSk7XHJcbiAgfVxyXG5cclxuICBnZXRMYXllckNvbmZpZ3VyYXRpb25MaXN0ZW5lcigpOiBPYnNlcnZhYmxlPExheWVyQ29uZmlndXJhdGlvbltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5sYXllckNvbmZpZ3VyYXRpb25TdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRMYXllckluZGV4QnlJZChpZDpzdHJpbmcpOm51bWJlcntcclxuICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSB0aGlzLmxheWVycy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcclxuICAgICAgaWYgKHRoaXMubGF5ZXJzW2ldLmlkID09IGlkKSB7XHJcbiAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5kZXg7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBtb3ZlIGxheWVyIHdpdGggZ2l2ZW4gaWQgdG8gdGhlIGdpdmVuIGluZGV4Ki9cclxuICBtb3ZlTGF5ZXIoaWQsIGluZGV4KSB7XHJcbiAgICB2YXIgbGF5ZXJJbmRleCA9IHRoaXMuZ2V0TGF5ZXJJbmRleEJ5SWQoaWQpO1xyXG4gICAgaWYgKGxheWVySW5kZXggIT0gLTEpIHtcclxuICAgICAgdmFyIGxheWVyID0gdGhpcy5sYXllcnMuc3BsaWNlKGxheWVySW5kZXgsIDEpO1xyXG4gICAgICB0aGlzLmxheWVycyA9IFxyXG4gICAgICAgIHRoaXMubGF5ZXJzLnNsaWNlKDAsIGluZGV4KVxyXG4gICAgICAgIC5jb25jYXQobGF5ZXIpXHJcbiAgICAgICAgLmNvbmNhdCh0aGlzLmxheWVycy5zbGljZShpbmRleCwgdGhpcy5sYXllcnMubGVuZ3RoKSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24oaWQsIG51bGwsIG51bGwsIGluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKiBjaGFuZ2UgdmlzaWJpbGl0eSBvZiBsYXllciB3aXRoIGdpdmVuIGlkIHRvIHRoZSBnaXZlbiB2YWx1ZSovXHJcbiAgY2hhbmdlTGF5ZXJWaXNpYmlsaXR5KGlkLCB2aXNpYmlsaXR5KSB7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24oaWQsIG51bGwsIHZpc2liaWxpdHksIG51bGwpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGNoYW5nZSBvcGFjaXR5IG9mIGxheWVyIHdpdGggZ2l2ZW4gaWQgdG8gdGhlIGdpdmVuIHZhbHVlKi9cclxuICBjaGFuZ2VMYXllck9wYWNpdHkoaWQsIG9wYWNpdHkpIHtcclxuICAgIHRoaXMucmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihpZCwgb3BhY2l0eSwgbnVsbCwgbnVsbCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24oaWQsIG9wYWNpdHksIHZpc2liaWxpdHksIHBvc2l0aW9uKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB2YXIgbGF5ZXIgPSBuZXcgTGF5ZXJDb25maWd1cmF0aW9uKCk7XHJcbiAgICBsYXllci5pZCA9IGlkO1xyXG4gICAgbGF5ZXIub3BhY2l0eSA9IG9wYWNpdHk7XHJcbiAgICBsYXllci52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcclxuICAgIGxheWVyLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICB0aGlzLmxheWVyQ29uZmlndXJhdGlvblN1YmplY3QubmV4dChbbGF5ZXJdKTtcclxuICB9XHJcblxyXG4gIGdldFNpdHVhdGlvbk1hcENvbmZpZ3VyYXRpb25MaXN0ZW5lcigpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLnNpdHVhdGlvbk1hcENvbmZpZ3VyYXRpb25TdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGNvbmZpZ3VyZSB0aGUgc2l0dWF0aW9uIG1hcCBvZiB0aGUgbWFwIGNvbXBvbmVudCBieSBwYXNzaW5nIGFzIGEgcGFyYW1ldGVyIGFuIGFycmF5IG9mIG9iamVjdHMgb2YgdHlwZSBMYXllckdyb3VwLCBlYWNoIG9mIHRoZW0gd2l0aCB0aGUgY29ycmVzcG9uZGluZyBMYXllciBvYmplY3RzIGRlZmluaW5nIHRoZSBsYXllcnMgdG8gbG9hZCBhcyBzaXR1YXRpb24gbWFwLiovXHJcbiAgbG9hZFNpdHVhdGlvbk1hcENvbmZpZ3VyYXRpb24obGF5ZXJzOkFycmF5PExheWVyPikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5zaXR1YXRpb25NYXBDb25maWd1cmF0aW9uU3ViamVjdC5uZXh0KGxheWVycyk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXBPcHRpb25zQ29uZmlndXJhdGlvbkxpc3RlbmVyKCk6IE9ic2VydmFibGU8TWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25bXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25TdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGxvYWQgbWFwIG9wdGlvbnMgY29uZmlndXJhdGlvbiAqL1xyXG4gIGxvYWRNYXBPcHRpb25zQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uOk1hcE9wdGlvbnNDb25maWd1cmF0aW9uKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLm1hcE9wdGlvbnNDb25maWd1cmF0aW9uU3ViamVjdC5uZXh0KFtjb25maWd1cmF0aW9uXSk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXBDb21wb25lbnRTdGF0dXNMaXN0ZW5lcigpOiBPYnNlcnZhYmxlPE1hcENvbXBvbmVudFN0YXR1c1tdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXBDb21wb25lbnRTdGF0dXNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuICBcclxuICAvKiogc2V0IG1hcCBjb21wb25lbnQgc3RhdHVzICovXHJcbiAgc2V0TWFwQ29tcG9uZW50U3RhdHVzKHN0YXR1czpNYXBDb21wb25lbnRTdGF0dXMpIHtcclxuICAgIC8vTm90aWZ5IHRoZSBtYXAgY29tcG9uZW50IHN0YXR1c1xyXG4gICAgdGhpcy5tYXBDb21wb25lbnRTdGF0dXNTdWJqZWN0Lm5leHQoW3N0YXR1c10pO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKipcclxuICogQHdoYXRJdERvZXMgQ29uZGl0aW9uYWxseSBpbmNsdWRlcyBhbiBIVE1MIGVsZW1lbnQgaWYgY3VycmVudCB1c2VyIGhhcyBhbnlcclxuICogb2YgdGhlIGF1dGhvcml0aWVzIHBhc3NlZCBhcyB0aGUgYGV4cHJlc3Npb25gLlxyXG4gKlxyXG4gKiBAaG93VG9Vc2VcclxuICogYGBgXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCInUk9MRV9BRE1JTidcIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICpcclxuICogICAgIDxzb21lLWVsZW1lbnQgKnNpdG11bkhhc0FueUF1dGhvcml0eT1cIlsnUk9MRV9BRE1JTicsICdST0xFX1VTRVInXVwiPi4uLjwvc29tZS1lbGVtZW50PlxyXG4gKiBgYGBcclxuICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbc2l0bXVuSGFzQW55QXV0aG9yaXR5XSdcclxufSlcclxuZXhwb3J0IGNsYXNzIEhhc0FueUF1dGhvcml0eURpcmVjdGl2ZSB7XHJcbiAgICBcclxuICAgIC8qKiBhdXRob3JpdGllcyB0byBjaGVjayAqL1xyXG4gICAgcHVibGljIGF1dGhvcml0aWVzOiBzdHJpbmdbXTsgXHJcbiAgICBcclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmluY2lwYWw6IFByaW5jaXBhbCwgcHJpdmF0ZSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PiwgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiB0ZXJyaXRvcnkgdG8gY2hlY2sgYXV0aG9yaXRpZXMqL1xyXG4gICAgQElucHV0KCkgdGVycml0b3J5OiBzdHJpbmc7XHJcbiAgICBcclxuICAgIC8qKiBTZXQgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgKi9cclxuICAgIEBJbnB1dCgpXHJcbiAgICBzZXQgc2l0bXVuSGFzQW55QXV0aG9yaXR5KHZhbHVlOiBzdHJpbmd8c3RyaW5nW10pIHtcclxuICAgICAgICB0aGlzLmF1dGhvcml0aWVzID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IFsgPHN0cmluZz4gdmFsdWUgXSA6IDxzdHJpbmdbXT4gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7XHJcbiAgICAgICAgLy8gR2V0IG5vdGlmaWVkIGVhY2ggdGltZSBhdXRoZW50aWNhdGlvbiBzdGF0ZSBjaGFuZ2VzLlxyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmdldEF1dGhlbnRpY2F0aW9uU3RhdGUoKS5zdWJzY3JpYmUoKGlkZW50aXR5KSA9PiB0aGlzLnVwZGF0ZVZpZXcoKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiB1cGRhdGUgdmlldyAqL1xyXG4gICAgcHJpdmF0ZSB1cGRhdGVWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnRlcnJpdG9yeSl7XHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuaGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnkodGhpcy5hdXRob3JpdGllcyx0aGlzLnRlcnJpdG9yeSkudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuaGFzQW55QXV0aG9yaXR5KHRoaXMuYXV0aG9yaXRpZXMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBAd2hhdEl0RG9lcyBDb25kaXRpb25hbGx5IGluY2x1ZGVzIGFuIEhUTUwgZWxlbWVudCBpZiBjdXJyZW50IHVzZXIgaGFzIGFueVxyXG4gKiBvZiB0aGUgYXV0aG9yaXRpZXMgcGFzc2VkIGFzIHRoZSBgZXhwcmVzc2lvbmAuXHJcbiAqXHJcbiAqIEBob3dUb1VzZVxyXG4gKiBgYGBcclxuICogICAgIDxzb21lLWVsZW1lbnQgKnNpdG11bkhhc0FueUF1dGhvcml0eT1cIidST0xFX0FETUlOJ1wiPi4uLjwvc29tZS1lbGVtZW50PlxyXG4gKlxyXG4gKiAgICAgPHNvbWUtZWxlbWVudCAqc2l0bXVuSGFzQW55QXV0aG9yaXR5PVwiWydST0xFX0FETUlOJywgJ1JPTEVfVVNFUiddXCI+Li4uPC9zb21lLWVsZW1lbnQ+XHJcbiAqIGBgYFxyXG4gKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1tzaXRtdW5IYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeV0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSB7XHJcblxyXG4gICAgLyoqIGF1dGhvcml0aWVzIHRvIGNoZWNrICovXHJcbiAgICBwdWJsaWMgYXV0aG9yaXRpZXM6IHN0cmluZ1tdOyBcclxuXHJcbiAgICAvKiogdGVycml0b3J5IHRvIGNoZWNrIGF1dGhvcml0aWVzKi9cclxuICAgIHB1YmxpYyB0ZXJyaXRvcnk6IHN0cmluZzsgXHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsLCBwcml2YXRlIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+LCBwcml2YXRlIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIFNldCB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyBvbiB0ZXJyaXRvcnkgKi9cclxuICAgIEBJbnB1dCgpXHJcbiAgICBzZXQgc2l0bXVuSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnkob3B0czogYW55KSB7XHJcblxyXG4gICAgICAgIHRoaXMuYXV0aG9yaXRpZXMgPSB0eXBlb2Ygb3B0cy5hdXRob3JpdGllcyA9PT0gJ3N0cmluZycgPyBbIDxzdHJpbmc+IG9wdHMuYXV0aG9yaXRpZXMgXSA6IDxzdHJpbmdbXT4gb3B0cy5hdXRob3JpdGllcztcclxuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IG9wdHMudGVycml0b3J5O1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlldygpO1xyXG4gICAgICAgIC8vIEdldCBub3RpZmllZCBlYWNoIHRpbWUgYXV0aGVudGljYXRpb24gc3RhdGUgY2hhbmdlcy5cclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5nZXRBdXRoZW50aWNhdGlvblN0YXRlKCkuc3Vic2NyaWJlKChpZGVudGl0eSkgPT4gdGhpcy51cGRhdGVWaWV3KCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogdXBkYXRlIHZpZXcgKi9cclxuICAgIHByaXZhdGUgdXBkYXRlVmlldygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy50ZXJyaXRvcnkpe1xyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5KHRoaXMuYXV0aG9yaXRpZXMsdGhpcy50ZXJyaXRvcnkpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmhhc0FueUF1dGhvcml0eSh0aGlzLmF1dGhvcml0aWVzKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7SHR0cENsaWVudE1vZHVsZSwgSFRUUF9JTlRFUkNFUFRPUlMsIEh0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuLy9pbXBvcnQgeyBBbmd1bGFySGFsTW9kdWxlIH0gZnJvbSAnLi4vLi4vbGliL2FuZ3VsYXItaGFsJztcclxuaW1wb3J0IHtDb2RlTGlzdFNlcnZpY2V9IGZyb20gJy4vY29kZWxpc3QvY29kZWxpc3Quc2VydmljZSc7XHJcbmltcG9ydCB7VGVycml0b3J5U2VydmljZX0gZnJvbSAnLi90ZXJyaXRvcnkvdGVycml0b3J5LnNlcnZpY2UnO1xyXG5pbXBvcnQge1RlcnJpdG9yeVR5cGVTZXJ2aWNlfSBmcm9tICcuL3RlcnJpdG9yeS90ZXJyaXRvcnktdHlwZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUZXJyaXRvcnlHcm91cFR5cGVTZXJ2aWNlfSBmcm9tICcuL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtVc2VyUG9zaXRpb25TZXJ2aWNlfSBmcm9tICcuL3VzZXIvdXNlci1wb3NpdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtVc2VyQ29uZmlndXJhdGlvblNlcnZpY2V9IGZyb20gJy4vdXNlci91c2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7Um9sZVNlcnZpY2V9IGZyb20gJy4vcm9sZS9yb2xlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJTZXJ2aWNlfSBmcm9tICcuL3VzZXIvdXNlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtDb25uZWN0aW9uU2VydmljZX0gZnJvbSAnLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24uc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1NlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tUeXBlU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stdHlwZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrR3JvdXBTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay1ncm91cC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrUGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tBdmFpbGFiaWxpdHlTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay1hdmFpbGFiaWxpdHkuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1VJU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stdWkuc2VydmljZSc7XHJcbmltcG9ydCB7U2VydmljZVNlcnZpY2V9IGZyb20gJy4vc2VydmljZS9zZXJ2aWNlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1NlcnZpY2VQYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2Uvc2VydmljZS1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5U2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlGaWx0ZXJTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWZpbHRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUdyb3VwU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeVBhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0JhY2tncm91bmRTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2JhY2tncm91bmQuc2VydmljZSc7XHJcbmltcG9ydCB7VHJlZVNlcnZpY2V9IGZyb20gJy4vdHJlZS90cmVlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyZWVOb2RlU2VydmljZX0gZnJvbSAnLi90cmVlL3RyZWUtbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvblNlcnZpY2V9IGZyb20gJy4vYXBwbGljYXRpb24vYXBwbGljYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25QYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbkJhY2tncm91bmRTZXJ2aWNlfSBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLWJhY2tncm91bmQuc2VydmljZSc7XHJcbmltcG9ydCB7IE1hcENvbmZpZ3VyYXRpb25NYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vbWFwL21hcC1jb25maWd1cmF0aW9uLW1hbmFnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vYXV0aC9wcmluY2lwYWwuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhJbnRlcmNlcHRvciB9IGZyb20gJy4vYXV0aC9hdXRoLmludGVyY2VwdG9yJztcclxuaW1wb3J0IHsgQXV0aEV4cGlyZWRJbnRlcmNlcHRvciB9IGZyb20gJy4vYXV0aC9hdXRoLWV4cGlyZWQuaW50ZXJjZXB0b3InO1xyXG5pbXBvcnQgeyBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUgfSBmcm9tICcuL2F1dGgvaGFzLWFueS1hdXRob3JpdHkuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUgfSBmcm9tICcuL2F1dGgvaGFzLWFueS1hdXRob3JpdHktb24tdGVycml0b3J5LmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IExvZ2luU2VydmljZSB9IGZyb20gJy4vYXV0aC9sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWNjb3VudFNlcnZpY2UgfSBmcm9tICcuL2FjY291bnQvYWNjb3VudC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmFuc2xhdGVIdHRwTG9hZGVyfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9odHRwLWxvYWRlcic7XHJcbmltcG9ydCB7VHJhbnNsYXRlTG9hZGVyLCBUcmFuc2xhdGVNb2R1bGV9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5cclxuLyoqIGxvYWQgaTE4biBhc3NldHMqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNsYXRlTG9hZGVyKGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICByZXR1cm4gbmV3IFRyYW5zbGF0ZUh0dHBMb2FkZXIoaHR0cCwgJy4vYXNzZXRzL2kxOG4vJywgJy5qc29uJyk7XHJcbn1cclxuXHJcblxyXG4vKiogU0lUTVVOIGZyb250ZW5kIGNvcmUgbW9kdWxlICovXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgLypSb3V0ZXJNb2R1bGUsXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgQW5ndWxhckhhbE1vZHVsZSwqL1xyXG4gICAgVHJhbnNsYXRlTW9kdWxlLmZvclJvb3Qoe1xyXG4gICAgICBsb2FkZXI6IHtcclxuICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXHJcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXHJcbiAgICAgICAgZGVwczogW0h0dHBDbGllbnRdXHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUsXHJcbiAgICBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEhhc0FueUF1dGhvcml0eURpcmVjdGl2ZSxcclxuICAgIEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlLFxyXG4gICAgVHJhbnNsYXRlTW9kdWxlXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlIHtcclxuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBTaXRtdW5Gcm9udGVuZENvcmVNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIENvZGVMaXN0U2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlTZXJ2aWNlLFxyXG4gICAgICAgIFRlcnJpdG9yeVR5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFRlcnJpdG9yeUdyb3VwVHlwZVNlcnZpY2UsXHJcbiAgICAgICAgUm9sZVNlcnZpY2UsXHJcbiAgICAgICAgQWNjb3VudFNlcnZpY2UsXHJcbiAgICAgICAgQXV0aFNlcnZpY2UsXHJcbiAgICAgICAgVXNlclNlcnZpY2UsXHJcbiAgICAgICAgQ29ubmVjdGlvblNlcnZpY2UsXHJcbiAgICAgICAgVGFza1NlcnZpY2UsXHJcbiAgICAgICAgVGFza1R5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tVSVNlcnZpY2UsXHJcbiAgICAgICAgVGFza0dyb3VwU2VydmljZSxcclxuICAgICAgICBUYXNrUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBUYXNrQXZhaWxhYmlsaXR5U2VydmljZSxcclxuICAgICAgICBTZXJ2aWNlU2VydmljZSxcclxuICAgICAgICBTZXJ2aWNlUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeVNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlHcm91cFNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHlTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5UGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeUZpbHRlclNlcnZpY2UsXHJcbiAgICAgICAgQmFja2dyb3VuZFNlcnZpY2UsXHJcbiAgICAgICAgVHJlZVNlcnZpY2UsXHJcbiAgICAgICAgVHJlZU5vZGVTZXJ2aWNlLFxyXG4gICAgICAgIEFwcGxpY2F0aW9uU2VydmljZSxcclxuICAgICAgICBBcHBsaWNhdGlvblBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQXBwbGljYXRpb25CYWNrZ3JvdW5kU2VydmljZSxcclxuICAgICAgICBBdXRoSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgQXV0aEV4cGlyZWRJbnRlcmNlcHRvcixcclxuICAgICAgICBQcmluY2lwYWwsXHJcbiAgICAgICAgVXNlclBvc2l0aW9uU2VydmljZSxcclxuICAgICAgICBVc2VyQ29uZmlndXJhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgTG9naW5TZXJ2aWNlLFxyXG4gICAgICAgIE1hcENvbmZpZ3VyYXRpb25NYW5hZ2VyU2VydmljZSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SUyxcclxuICAgICAgICAgIHVzZUNsYXNzOiBBdXRoSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICAsIHtcclxuICAgICAgICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxyXG4gICAgICAgICAgdXNlQ2xhc3M6IEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbiIsImltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtIYWxQYXJhbSwgUmVzdFNlcnZpY2V9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtFeHRlcm5hbFNlcnZpY2V9IGZyb20gJy4vZXh0ZXJuYWwuc2VydmljZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2V9IGZyb20gJy4vZXh0ZXJuYWwtY29uZmlndXJhdGlvbi5oYW5kbGVyJztcclxuXHJcbmltcG9ydCAncnhqcyc7XHJcblxyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcblxyXG5leHBvcnQge0V4dGVybmFsU2VydmljZX0gZnJvbSAnLi9leHRlcm5hbC5zZXJ2aWNlJztcclxuZXhwb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5leHBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuZXhwb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuZXhwb3J0IHtTb3J0fSBmcm9tICcuL3NvcnQnO1xyXG5leHBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmV4cG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9ufSBmcm9tICcuL0V4dGVybmFsQ29uZmlndXJhdGlvbic7XHJcbmV4cG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5leHBvcnQge0hhbE9wdGlvbnMsIEhhbFBhcmFtfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmV4cG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuXHJcblxyXG4vKiogQW5ndWxhciBIQUwgbW9kdWxlICovXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbSHR0cENsaWVudE1vZHVsZV0sXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxyXG4gICAgZXhwb3J0czogW0h0dHBDbGllbnRNb2R1bGVdLFxyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgRXh0ZXJuYWxTZXJ2aWNlLFxyXG4gICAgICAgIEh0dHBDbGllbnQsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcm92aWRlOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIHVzZUNsYXNzOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIGRlcHM6IFtFeHRlcm5hbFNlcnZpY2VdXHJcbiAgICAgICAgfV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJIYWxNb2R1bGUge1xyXG4gICAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmdNb2R1bGU6IEFuZ3VsYXJIYWxNb2R1bGUsXHJcbiAgICAgICAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgICAgICAgICAgRXh0ZXJuYWxTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgSHR0cENsaWVudCxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlQ2xhc3M6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICBkZXBzOiBbRXh0ZXJuYWxTZXJ2aWNlXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSJdfQ==