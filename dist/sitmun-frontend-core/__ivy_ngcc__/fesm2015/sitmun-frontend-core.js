import { throwError, of, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { parse } from 'url';
import { HttpHeaders, HttpParams, HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
        if (!request || !request.url || !(request.url.includes("/api/"))) {
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
            /** @type {?} */
            const intercept = request.url.indexOf("/api/") != -1;
            //tractem request
            if (intercept) {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        this.authService.logout().subscribe();
                        this.principal.authenticate(null);
                        this.router.navigate(['/']);
                    }
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
class DashboardService {
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
        this.DASHBOARD_API = 'dashboard/info';
        this.DASHBOARD_EMBEDDED = 'dashboard';
    }
    /**
     * get all kpi
     * @return {?}
     */
    getAll() {
        return this.http.get(this.resourceService.getResourceUrl(this.DASHBOARD_API)).map(response => response[this.DASHBOARD_EMBEDDED]);
    }
}
DashboardService.ɵfac = function DashboardService_Factory(t) { return new (t || DashboardService)(ɵngcc0.ɵɵinject(ɵngcc1.HttpClient), ɵngcc0.ɵɵinject(ResourceService)); };
DashboardService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: DashboardService, factory: DashboardService.ɵfac, providedIn: 'root' });
/** @nocollapse */
DashboardService.ctorParameters = () => [
    { type: HttpClient },
    { type: ResourceService }
];
/** @nocollapse */ DashboardService.ngInjectableDef = defineInjectable({ factory: function DashboardService_Factory() { return new DashboardService(inject(HttpClient), inject(ResourceService)); }, token: DashboardService, providedIn: "root" });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(DashboardService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: ɵngcc1.HttpClient }, { type: ResourceService }]; }, null); })();

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
        if (item._links != null) {
            if (!item.service) {
                /** @type {?} */
                let service = {};
                service._links = {};
                service._links.self = {};
                service._links.self.href = "";
                item.deleteRelation('service', service).subscribe(result => {
                }, error => console.error(error));
            }
            else {
                item.service._links.self.href = item.service._links.self.href.split("{")[0];
                item.substituteRelation('service', item.service).subscribe(result => {
                }, error => console.error(error));
                item.service = item.service._links.self.href;
            }
            if (!item.cartography) {
                /** @type {?} */
                let cartography = {};
                cartography._links = {};
                cartography._links.self = {};
                cartography._links.self.href = "";
                item.deleteRelation('cartography', cartography).subscribe(result => {
                }, error => console.error(error));
            }
            else {
                item.cartography._links.self.href = item.cartography._links.self.href.split("{")[0];
                item.substituteRelation('cartography', item.cartography).subscribe(result => {
                }, error => console.error(error));
                item.cartography = item.cartography._links.self.href;
            }
            if (!item.connection) {
                /** @type {?} */
                let connection = {};
                connection._links = {};
                connection._links.self = {};
                connection._links.self.href = "";
                item.deleteRelation('connection', connection).subscribe(result => {
                }, error => console.error(error));
            }
            else {
                item.connection._links.self.href = item.connection._links.self.href.split("{")[0];
                item.substituteRelation('connection', item.connection).subscribe(result => {
                }, error => console.error(error));
                item.connection = item.connection._links.self.href;
            }
            if (!item.ui) ;
            else {
                item.ui._links.self.href = item.ui._links.self.href.split("{")[0];
                item.substituteRelation('ui', item.ui).subscribe(result => {
                }, error => console.error(error));
                item.ui = item.ui._links.self.href;
            }
            if (!item.group) ;
            else {
                item.group._links.self.href = item.group._links.self.href.split("{")[0];
                item.substituteRelation('group', item.group).subscribe(result => {
                }, error => console.error(error));
                item.group = item.group._links.self.href;
            }
            if (!item.type) ;
            else {
                item.type._links.self.href = item.type._links.self.href.split("{")[0];
                item.substituteRelation('type', item.type).subscribe(result => {
                }, error => console.error(error));
                item.type = item.type._links.self.href;
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            if (item.cartography) {
                item.cartography = item.cartography._links.self.href;
            }
            if (item.connection) {
                item.connection = item.connection._links.self.href;
            }
            if (item.service) {
                item.service = item.service._links.self.href;
            }
            if (item.ui) {
                item.ui = item.ui._links.self.href;
            }
            if (item.group) {
                item.group = item.group._links.self.href;
            }
            if (item.type) {
                item.type = item.type._links.self.href;
            }
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
 * Task model
 */
class Translation extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class TranslationService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Translation, "translations", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.TRANSLATION_API = 'translations';
    }
    /**
     * remove translation
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save translation
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        /** @type {?} */
        let language = {};
        language._links = {};
        language._links.self = {};
        language._links.self.href = "";
        if (item.language != null) {
            language = item.language;
            if (typeof item.language._links != 'undefined') {
                item.language = item.language._links.self.href;
            }
        }
        if (item._links != null) {
            delete item.language;
            // if (language._links.self.href == '') {
            //   item.deleteRelation('language', language).subscribe(result => {
            //   }, error => console.error(error));
            // } else {
            //   item.substituteRelation('language', language).subscribe(result => {
            //   }, error => console.error(error));
            // }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.TRANSLATION_API), item);
        }
        return result;
    }
}
TranslationService.ɵfac = function TranslationService_Factory(t) { return new (t || TranslationService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
TranslationService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: TranslationService, factory: TranslationService.ɵfac, providedIn: 'root' });
/** @nocollapse */
TranslationService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ TranslationService.ngInjectableDef = defineInjectable({ factory: function TranslationService_Factory() { return new TranslationService(inject(INJECTOR), inject(HttpClient)); }, token: TranslationService, providedIn: "root" });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(TranslationService, [{
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
 * Task model
 */
class Language extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class LanguageService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Language, "languages", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.LANGUAGES_API = 'languages';
    }
    /**
     * remove translation
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save translation
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
            result = this.http.post(this.resourceService.getResourceUrl(this.LANGUAGES_API), item);
        }
        return result;
    }
}
LanguageService.ɵfac = function LanguageService_Factory(t) { return new (t || LanguageService)(ɵngcc0.ɵɵinject(ɵngcc0.Injector), ɵngcc0.ɵɵinject(ɵngcc1.HttpClient)); };
LanguageService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: LanguageService, factory: LanguageService.ɵfac, providedIn: 'root' });
/** @nocollapse */
LanguageService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ LanguageService.ngInjectableDef = defineInjectable({ factory: function LanguageService_Factory() { return new LanguageService(inject(INJECTOR), inject(HttpClient)); }, token: LanguageService, providedIn: "root" });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(LanguageService, [{
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
            // if (cartographyConnection._links.self.href == '' && cartographyConnection) {
            //   item.deleteRelation('spatialSelectionConnection', cartographyConnection).subscribe(result => {
            //   }, error => console.error(error));
            // } else {
            //   item.substituteRelation('spatialSelectionConnection', cartographyConnection).subscribe(result => {
            //   }, error => console.error(error));
            // }
            if (cartographyService._links.self.href == '') {
                item.deleteRelation('service', cartographyService).subscribe(result => {
                }, error => console.error(error));
            }
            else {
                item.substituteRelation('service', cartographyService).subscribe(result => {
                }, error => console.error(error));
            }
            if (cartographySelectionService._links.self.href == '' && cartographySelectionService) {
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
            if (item.territorialLevel != null && item.territorialLevel != undefined) {
                item.substituteRelation('territorialLevel', item.territorialLevel).subscribe(result => {
                }, error => console.error(error));
            }
        }
        else {
            item.cartography = item.cartography._links.self.href;
            item.territorialLevel = item.territorialLevel._links.self.href;
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
            else {
                /** @type {?} */
                let treeNodeParent = {};
                treeNodeParent._links = {};
                treeNodeParent._links.self = {};
                treeNodeParent._links.self.href = "";
                item.deleteRelation('parent', treeNodeParent).subscribe(result => {
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
                TranslationService,
                LanguageService,
                DashboardService,
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

export { AccountService, AuthService, AuthInterceptor, AuthExpiredInterceptor, LoginService, Principal, DashboardService, User, UserService, UserPosition, UserPositionService, UserConfiguration, UserConfigurationService, Territory, TerritoryService, TerritoryType, TerritoryTypeService, TerritoryGroupType, TerritoryGroupTypeService, Role, RoleService, Connection, ConnectionService, GEOADMIN_TREE_TASK_ID, Task, TaskService, TaskType, TaskTypeService, TaskGroup, TaskGroupService, TaskParameter, TaskParameterService, TaskAvailability, TaskAvailabilityService, TaskUI, TaskUIService, TranslationService, Translation, Language, LanguageService, Service, ServiceService, ServiceParameter, ServiceParameterService, Cartography, CartographyService, CartographyGroup, CartographyGroupService, CartographyAvailability, CartographyAvailabilityService, CartographyFilter, CartographyFilterService, CartographyParameter, CartographyParameterService, Background, BackgroundService, Tree, TreeService, TreeNode, TreeNodeService, TERRITORIAL_APP_NAME, Application, ApplicationService, ApplicationBackground, ApplicationBackgroundService, ApplicationParameter, ApplicationParameterService, CodeList, CodeListService, Layer, OptionalParameter, LayerConfiguration, LayerGroup, MapOptionsConfiguration, MapComponentStatus, MapConfigurationManagerService, createTranslateLoader, SitmunFrontendCoreModule, ExternalService, RestService, Resource, ResourceArray, ResourceService, ResourceHelper, AngularHalModule, HasAnyAuthorityOnTerritoryDirective as ɵb, HasAnyAuthorityDirective as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWNvcmUuanMiLCJzb3VyY2VzIjpbIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLWFycmF5LnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UtaGVscGVyLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvZXh0ZXJuYWwuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYWNjb3VudC9hY2NvdW50LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLmludGVyY2VwdG9yLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvcHJpbmNpcGFsLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLWV4cGlyZWQuaW50ZXJjZXB0b3IudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9sb2dpbi5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2Rhc2hib2FyZC9kYXNoYm9hcmQuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXIuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24ubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLXBvc2l0aW9uLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLWNvbmZpZ3VyYXRpb24ubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5Lm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnkuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGVycml0b3J5L3RlcnJpdG9yeS10eXBlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGVycml0b3J5L3RlcnJpdG9yeS1ncm91cC10eXBlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3JvbGUvcm9sZS5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9yb2xlL3JvbGUuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY29ubmVjdGlvbi9jb25uZWN0aW9uLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay10eXBlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay10eXBlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay1ncm91cC5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay1wYXJhbWV0ZXIubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay1hdmFpbGFiaWxpdHkubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWF2YWlsYWJpbGl0eS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stdWkuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90cmFuc2xhdGlvbi90cmFuc2xhdGlvbi5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90cmFuc2xhdGlvbi90cmFuc2xhdGlvbi5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyYW5zbGF0aW9uL2xhbmd1YWdlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyYW5zbGF0aW9uL2xhbmd1YWdlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3NlcnZpY2Uvc2VydmljZS5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3NlcnZpY2Uvc2VydmljZS1wYXJhbWV0ZXIubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5Lm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5LnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZmlsdGVyLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWZpbHRlci5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXBhcmFtZXRlci5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1wYXJhbWV0ZXIuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLm1vZGVsLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2JhY2tncm91bmQuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS90cmVlL3RyZWUubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLW5vZGUubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLW5vZGUuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLWJhY2tncm91bmQubW9kZWwudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24tYmFja2dyb3VuZC5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLXBhcmFtZXRlci5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIuc2VydmljZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jb2RlbGlzdC9jb2RlbGlzdC5tb2RlbC50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9jb2RlbGlzdC9jb2RlbGlzdC5zZXJ2aWNlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL21hcC9tYXAtY29uZmlndXJhdGlvbi1tYW5hZ2VyLnNlcnZpY2UudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9oYXMtYW55LWF1dGhvcml0eS5kaXJlY3RpdmUudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9oYXMtYW55LWF1dGhvcml0eS1vbi10ZXJyaXRvcnkuZGlyZWN0aXZlLnRzIiwiQHNpdG11bi9mcm9udGVuZC1jb3JlL3NpdG11bi1mcm9udGVuZC1jb3JlLm1vZHVsZS50cyIsIkBzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL2FuZ3VsYXItaGFsLm1vZHVsZS50cyJdLCJuYW1lcyI6WyJvYnNlcnZhYmxlVGhyb3dFcnJvciIsInVybC5wYXJz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OzswQkFDSztBQUFDO0FBQUM7QUFBSTtBQUNFO0FBRUs7QUFBSTtBQUFDO0FBQUk7QUFDTjtBQUdwQjtBQUFJO0FBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHt0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7Y2F0Y2hFcnJvciwgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtBcnJheUludGVyZmFjZX0gZnJvbSAnLi9hcnJheS1pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBSRVNUIGFycmF5IG9mIHJlc291cmNlIGltcGxlbWVudGF0aW9uICovXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUFycmF5PFQgZXh0ZW5kcyBSZXNvdXJjZT4gaW1wbGVtZW50cyBBcnJheUludGVyZmFjZTxUPiB7XHJcbiAgICAvKiogc29ydGluZyBpbmZvICovXHJcbiAgICBwdWJsaWMgc29ydEluZm86IFNvcnRbXTtcclxuICAgIC8qKiBwcm94eSB1cmwgKi9cclxuICAgIHB1YmxpYyBwcm94eVVybDogc3RyaW5nO1xyXG4gICAgLyoqIHJvb3QgdXJsICovXHJcbiAgICBwdWJsaWMgcm9vdFVybDogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBzZWxmIHVybCAqL1xyXG4gICAgcHVibGljIHNlbGZfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogbmV4dCByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBuZXh0X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIHByZXZpb3VzIHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIHByZXZfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogZmlyc3QgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgZmlyc3RfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogbGFzdCByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBsYXN0X3VyaTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBlbWJlZGRlZCBhcnJheSBsaXN0ICovXHJcbiAgICBwdWJsaWMgX2VtYmVkZGVkO1xyXG5cclxuICAgIC8qKiB0b3RhbCBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBhcnJheSAqL1xyXG4gICAgcHVibGljIHRvdGFsRWxlbWVudHMgPSAwO1xyXG4gICAgLyoqIHRvdGFsIG51bWJlciBvZiBwYWdlcyBpbiB0aGUgcmVzcG9uc2UgKi9cclxuICAgIHB1YmxpYyB0b3RhbFBhZ2VzID0gMTtcclxuICAgIFxyXG4gICAgLyoqIHBhZ2UgbnVtYmVyIGluIHRoZSByZXNwb25zZSAqL1xyXG4gICAgcHVibGljIHBhZ2VOdW1iZXIgPSAxO1xyXG4gICAgXHJcbiAgICAvKiogcGFnZSBzaXplICovXHJcbiAgICBwdWJsaWMgcGFnZVNpemU6IG51bWJlcjtcclxuXHJcbiAgICAvKiogYXJyYXkgY29tcG9uZW50cyAqL1xyXG4gICAgcHVibGljIHJlc3VsdDogVFtdID0gW107XHJcblxyXG4gICAgLyoqIHB1c2ggYSBuZXcgcmVzb3VyY2UgdG8gdGhlIGFycmF5ICovXHJcbiAgICBwdXNoID0gKGVsOiBUKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZXN1bHQucHVzaChlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBsZW5ndGggb2YgdGhlIGFycmF5ICovXHJcbiAgICBsZW5ndGggPSAoKTogbnVtYmVyID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHQubGVuZ3RoO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogbG9hZCBhcnJheSBkYXRhIGZyb20gUkVTVCByZXF1ZXN0ICovXHJcbiAgICBwcml2YXRlIGluaXQgPSAodHlwZTogeyBuZXcoKTogVCB9LCByZXNwb25zZTogYW55LCBzb3J0SW5mbzogU29ydFtdKTogUmVzb3VyY2VBcnJheTxUPiA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4odGhpcy5fZW1iZWRkZWQpO1xyXG4gICAgICAgIHJlc3VsdC5zb3J0SW5mbyA9IHNvcnRJbmZvO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIG5leHQgcGFnZSAqL1xyXG4gICAgbmV4dCA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5uZXh0X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLm5leHRfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gbmV4dCBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIHByZXZpb3VzIHBhZ2UgKi9cclxuICAgIHByZXYgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJldl91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5wcmV2X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHByZXYgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBmaXJzdCBwYWdlICovXHJcbiAgICBmaXJzdCA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5maXJzdF91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5maXJzdF91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBmaXJzdCBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIGxhc3QgcGFnZSAqL1xyXG4gICAgbGFzdCA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5sYXN0X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLmxhc3RfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gbGFzdCBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIHBhZ2Ugd2l0aCBnaXZlbiBwYWdlTnVtYmVyKi9cclxuICAgIHBhZ2UgPSAodHlwZTogeyBuZXcoKTogVCB9LCBwYWdlTnVtYmVyOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7P3BhZ2Usc2l6ZSxzb3J0fScsICcnKTtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7JnNvcnR9JywgJycpO1xyXG4gICAgICAgIGxldCB1cmxQYXJzZWQgPSB1cmwucGFyc2UoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkpO1xyXG4gICAgICAgIGxldCBxdWVyeTogc3RyaW5nID0gUmVzb3VyY2VBcnJheS5yZXBsYWNlT3JBZGQodXJsUGFyc2VkLnF1ZXJ5LCAnc2l6ZScsIHRoaXMucGFnZVNpemUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgcXVlcnkgPSBSZXNvdXJjZUFycmF5LnJlcGxhY2VPckFkZChxdWVyeSwgJ3BhZ2UnLCBwYWdlTnVtYmVyLnRvU3RyaW5nKCkpO1xyXG5cclxuXHJcbiAgICAgICAgbGV0IHVyaSA9IHVybFBhcnNlZC5xdWVyeSA/XHJcbiAgICAgICAgICAgIFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLnJlcGxhY2UodXJsUGFyc2VkLnF1ZXJ5LCBxdWVyeSkgOiBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5jb25jYXQocXVlcnkpO1xyXG4gICAgICAgIHVyaSA9IHRoaXMuYWRkU29ydEluZm8odXJpKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIFNvcnQgY29sbGVjdGlvbiBiYXNlZCBvbiBnaXZlbiBzb3J0IGF0dHJpYnV0ZSAqL1xyXG4gICAgc29ydEVsZW1lbnRzID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgLi4uc29ydDogU29ydFtdKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgnez9wYWdlLHNpemUsc29ydH0nLCAnJyk7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgneyZzb3J0fScsICcnKTtcclxuICAgICAgICBsZXQgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkuY29uY2F0KCc/JywgJ3NpemU9JywgdGhpcy5wYWdlU2l6ZS50b1N0cmluZygpLCAnJnBhZ2U9JywgdGhpcy5wYWdlTnVtYmVyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHVyaSA9IHRoaXMuYWRkU29ydEluZm8odXJpKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgc29ydCkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgcGFnZSB3aXRoIGdpdmVuIHNpemUgKi9cclxuICAgIHNpemUgPSAodHlwZTogeyBuZXcoKTogVCB9LCBzaXplOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBsZXQgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkuY29uY2F0KCc/JywgJ3NpemU9Jywgc2l6ZS50b1N0cmluZygpKTtcclxuICAgICAgICB1cmkgPSB0aGlzLmFkZFNvcnRJbmZvKHVyaSk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBBZGQgc29ydCBpbmZvIHRvIGdpdmVuIFVSSSAqL1xyXG4gICAgcHJpdmF0ZSBhZGRTb3J0SW5mbyh1cmk6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLnNvcnRJbmZvKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLnNvcnRJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICB1cmkgPSB1cmkuY29uY2F0KCcmc29ydD0nLCBpdGVtLnBhdGgsICcsJywgaXRlbS5vcmRlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVyaTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQWRkIHJlcGxhY2Ugb3IgYWRkIHBhcmFtIHZhbHVlIHRvIHF1ZXJ5IHN0cmluZyAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVwbGFjZU9yQWRkKHF1ZXJ5OiBzdHJpbmcsIGZpZWxkOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChxdWVyeSkge1xyXG4gICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSBxdWVyeS5pbmRleE9mKGZpZWxkKTtcclxuICAgICAgICAgICAgbGV0IGlkeE5leHRBbXA6IG51bWJlciA9IHF1ZXJ5LmluZGV4T2YoJyYnLCBpZHgpID09IC0xID8gcXVlcnkuaW5kZXhPZignLycsIGlkeCkgOiBxdWVyeS5pbmRleE9mKCcmJywgaWR4KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWFjaFZhbHVlID0gcXVlcnkuc3Vic3RyaW5nKGlkeCwgaWR4TmV4dEFtcCk7XHJcbiAgICAgICAgICAgICAgICBxdWVyeSA9IHF1ZXJ5LnJlcGxhY2Uoc2VhY2hWYWx1ZSwgZmllbGQgKyAnPScgKyB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBxdWVyeSA9IHF1ZXJ5LmNvbmNhdChcIiZcIiArIGZpZWxkICsgJz0nICsgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcXVlcnkgPSBcIj9cIiArIGZpZWxkICsgJz0nICsgdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBxdWVyeTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0h0dHBDbGllbnQsIEh0dHBIZWFkZXJzLCBIdHRwUGFyYW1zfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQge0hhbE9wdGlvbnN9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5pbXBvcnQge2lzTnVsbE9yVW5kZWZpbmVkLCBpc1ByaW1pdGl2ZX0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xyXG5cclxuLyoqIFJFU1QgQVBJIGFjY2VzcyBoZWxwZXIgKi9cclxuZXhwb3J0IGNsYXNzIFJlc291cmNlSGVscGVyIHtcclxuXHJcbiAgICAvKiogSHR0cEhlYWRlcnMgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaGVhZGVyczogSHR0cEhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuICAgIC8qKiBQcm94eSBVUkwgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHByb3h5X3VyaTogc3RyaW5nID0gbnVsbDtcclxuICAgIC8qKiBSb290IFVSTCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcm9vdF91cmk6IHN0cmluZyA9IG51bGw7XHJcbiAgICAvKiogSHR0cENsaWVudCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaHR0cDogSHR0cENsaWVudCA9IG51bGw7XHJcblxyXG4gICAgLyoqIGdldCByZXF1ZXN0IGhlYWRlcnMgKi9cclxuICAgIC8qcHVibGljIHN0YXRpYyBnZXQgaGVhZGVycygpOiBIdHRwSGVhZGVycyB7XHJcbiAgICAgICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2hlYWRlcnMpKVxyXG4gICAgICAgICAgUmVzb3VyY2VIZWxwZXIuX2hlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuX2hlYWRlcnM7XHJcbiAgICB9Ki9cclxuXHJcbiAgICAvKiogc2V0IHJlcXVlc3QgaGVhZGVycyAqL1xyXG4gICAgLypwdWJsaWMgc3RhdGljIHNldCBoZWFkZXJzKGhlYWRlcnM6IEh0dHBIZWFkZXJzKSB7XHJcbiAgICAgIFJlc291cmNlSGVscGVyLl9oZWFkZXJzID0gaGVhZGVycztcclxuICAgIH0qL1xyXG5cclxuICAgIC8qKiBnZXQgcmVxdWVzdCBvcHRpb24gcGFyYW1zICovXHJcbiAgICBzdGF0aWMgb3B0aW9uUGFyYW1zKHBhcmFtczogSHR0cFBhcmFtcywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBIdHRwUGFyYW1zIHtcclxuICAgICAgICBpZiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHBhcmFtIG9mIG9wdGlvbnMucGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZChwYXJhbS5rZXksIHBhcmFtLnZhbHVlLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zaXplKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdzaXplJywgb3B0aW9ucy5zaXplLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zb3J0KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHMgb2Ygb3B0aW9ucy5zb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNvcnRTdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICBzb3J0U3RyaW5nID0gcy5wYXRoID8gc29ydFN0cmluZy5jb25jYXQocy5wYXRoKSA6IHNvcnRTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydFN0cmluZyA9IHMub3JkZXIgPyBzb3J0U3RyaW5nLmNvbmNhdCgnLCcpLmNvbmNhdChzLm9yZGVyKSA6IHNvcnRTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnc29ydCcsIHNvcnRTdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiByZXNvbHZlIHJlc291cmNlIHJlbGF0aW9ucyAqL1xyXG4gICAgc3RhdGljIHJlc29sdmVSZWxhdGlvbnMocmVzb3VyY2U6IFJlc291cmNlKTogT2JqZWN0IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IGFueSA9IHt9O1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHJlc291cmNlKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2Vba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChSZXNvdXJjZUhlbHBlci5jbGFzc05hbWUocmVzb3VyY2Vba2V5XSlcclxuICAgICAgICAgICAgICAgICAgICAuZmluZCgoY2xhc3NOYW1lOiBzdHJpbmcpID0+IGNsYXNzTmFtZSA9PSAnUmVzb3VyY2UnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZVtrZXldWydfbGlua3MnXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSByZXNvdXJjZVtrZXldWydfbGlua3MnXVsnc2VsZiddWydocmVmJ107XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmVzb3VyY2Vba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXJyYXk6IGFueVtdID0gcmVzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0ucHVzaChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldLnB1c2godGhpcy5yZXNvbHZlUmVsYXRpb25zKGVsZW1lbnQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHJlc291cmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCBhcyBPYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSBhbiBlbXB0eSByZXNvdXJjZSBmcm9tIGVtYmVkZGVkIGRhdGEqL1xyXG4gICAgc3RhdGljIGNyZWF0ZUVtcHR5UmVzdWx0PFQgZXh0ZW5kcyBSZXNvdXJjZT4oX2VtYmVkZGVkOiBzdHJpbmcpOiBSZXNvdXJjZUFycmF5PFQ+IHtcclxuICAgICAgICBsZXQgcmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiA9IG5ldyBSZXNvdXJjZUFycmF5PFQ+KCk7XHJcbiAgICAgICAgcmVzb3VyY2VBcnJheS5fZW1iZWRkZWQgPSBfZW1iZWRkZWQ7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBjbGFzcyBuYW1lKi9cclxuICAgIHN0YXRpYyBnZXRDbGFzc05hbWUob2JqOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBmdW5jTmFtZVJlZ2V4ID0gL2Z1bmN0aW9uICguKz8pXFwoLztcclxuICAgICAgICB2YXIgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKG9iai5jb25zdHJ1Y3Rvci50b1N0cmluZygpKTtcclxuICAgICAgICByZXR1cm4gKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiAxKSA/IHJlc3VsdHNbMV0gOiAnJztcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgY2xhc3MgbmFtZSBmcm9tIGEgcHJvdG90eXBlIG9iamVjdCovXHJcbiAgICBzdGF0aWMgY2xhc3NOYW1lKG9ialByb3RvOiBhbnkpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZXMgPSBbXTtcclxuICAgICAgICBsZXQgb2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9ialByb3RvKTtcclxuICAgICAgICBsZXQgY2xhc3NOYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIHdoaWxlICgoY2xhc3NOYW1lID0gUmVzb3VyY2VIZWxwZXIuZ2V0Q2xhc3NOYW1lKG9iaikpICE9PSAnT2JqZWN0Jykge1xyXG4gICAgICAgICAgICBjbGFzc05hbWVzLnB1c2goY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgb2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2xhc3NOYW1lcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogaW5zdGFudGlhdGUgYSBSZXNvdXJjZUNvbGxlY3Rpb24gZnJvbSByZXNwb25zZSBlbWJlZGRlZCBkYXRhKi9cclxuICAgIHN0YXRpYyBpbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcGF5bG9hZDogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+LCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIsZW1iZWRkZWROYW1lPzpTdHJpbmcpOiBSZXNvdXJjZUFycmF5PFQ+IHtcclxuICAgICAgICBmb3IgKGNvbnN0IGVtYmVkZGVkQ2xhc3NOYW1lIG9mIE9iamVjdC5rZXlzKHBheWxvYWRbcmVzdWx0Ll9lbWJlZGRlZF0pKSB7XHJcbiAgICAgICAgICAgIGlmKCFlbWJlZGRlZE5hbWUgfHwgKGVtYmVkZGVkTmFtZSAmJiBlbWJlZGRlZENsYXNzTmFtZT09ZW1iZWRkZWROYW1lKSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZW1iZWRkZWQ6IGFueSA9IHBheWxvYWRbcmVzdWx0Ll9lbWJlZGRlZF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IGVtYmVkZGVkW2VtYmVkZGVkQ2xhc3NOYW1lXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5zdGFuY2U6IFQgPSBuZXcgdHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0gdGhpcy5zZWFyY2hTdWJ0eXBlcyhidWlsZGVyLCBlbWJlZGRlZENsYXNzTmFtZSwgaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc3RhbnRpYXRlUmVzb3VyY2UoaW5zdGFuY2UsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdWx0LnRvdGFsRWxlbWVudHMgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2UudG90YWxFbGVtZW50cyA6IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgcmVzdWx0LnRvdGFsUGFnZXMgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2UudG90YWxQYWdlcyA6IDE7XHJcbiAgICAgICAgcmVzdWx0LnBhZ2VOdW1iZXIgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2UubnVtYmVyIDogMTtcclxuICAgICAgICByZXN1bHQucGFnZVNpemUgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2Uuc2l6ZSA6IDIwO1xyXG5cclxuICAgICAgICByZXN1bHQuc2VsZl91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5zZWxmID8gcGF5bG9hZC5fbGlua3Muc2VsZi5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5uZXh0X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLm5leHQgPyBwYXlsb2FkLl9saW5rcy5uZXh0LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVzdWx0LnByZXZfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3MucHJldiA/IHBheWxvYWQuX2xpbmtzLnByZXYuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQuZmlyc3RfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3MuZmlyc3QgPyBwYXlsb2FkLl9saW5rcy5maXJzdC5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5sYXN0X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLmxhc3QgPyBwYXlsb2FkLl9saW5rcy5sYXN0LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHN1YnR5cGVzKi9cclxuICAgIHN0YXRpYyBzZWFyY2hTdWJ0eXBlczxUIGV4dGVuZHMgUmVzb3VyY2U+KGJ1aWxkZXI6IFN1YlR5cGVCdWlsZGVyLCBlbWJlZGRlZENsYXNzTmFtZTogc3RyaW5nLCBpbnN0YW5jZTogVCkge1xyXG4gICAgICAgIGlmIChidWlsZGVyICYmIGJ1aWxkZXIuc3VidHlwZXMpIHtcclxuICAgICAgICAgICAgbGV0IGtleXMgPSBidWlsZGVyLnN1YnR5cGVzLmtleXMoKTtcclxuICAgICAgICAgICAgQXJyYXkuZnJvbShrZXlzKS5mb3JFYWNoKChzdWJ0eXBlS2V5OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbWJlZGRlZENsYXNzTmFtZS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoc3VidHlwZUtleS50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdWJ0eXBlOiB7IG5ldygpOiBhbnkgfSA9IGJ1aWxkZXIuc3VidHlwZXMuZ2V0KHN1YnR5cGVLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0gbmV3IHN1YnR5cGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogaW5zdGFudGlhdGUgYSBSZXNvdXJjZSBmcm9tIHJlc3BvbnNlICovXHJcbiAgICBzdGF0aWMgaW5zdGFudGlhdGVSZXNvdXJjZTxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCwgcGF5bG9hZDogT2JqZWN0KTogVCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBwIGluIHBheWxvYWQpIHtcclxuICAgICAgICAgICAgLy9UT0RPIGFycmF5IGluaXRcclxuICAgICAgICAgICAgLyogaWYoZW50aXR5W3BdLmNvbnN0cnVjdG9yID09PSBBcnJheSAmJiBpc051bGxPclVuZGVmaW5lZChwYXlsb2FkW3BdKSlcclxuICAgICAgICAgICAgICAgICBlbnRpdHlbcF0gPSBbXTtcclxuICAgICAgICAgICAgIGVsc2UqL1xyXG4gICAgICAgICAgICBlbnRpdHlbcF0gPSBwYXlsb2FkW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgcHJveHkgVVJMICovXHJcbiAgICBzdGF0aWMgc2V0UHJveHlVcmkocHJveHlfdXJpOiBzdHJpbmcpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgPSBwcm94eV91cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBSb290IFVSSSAqL1xyXG4gICAgc3RhdGljIHNldFJvb3RVcmkocm9vdF91cmk6IHN0cmluZykge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnJvb3RfdXJpID0gcm9vdF91cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBVUkwgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLnByb3h5X3VyaSAmJiBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgIT0gJycgP1xyXG4gICAgICAgICAgICBSZXNvdXJjZUhlbHBlci5hZGRTbGFzaChSZXNvdXJjZUhlbHBlci5wcm94eV91cmkpIDpcclxuICAgICAgICAgICAgUmVzb3VyY2VIZWxwZXIuYWRkU2xhc2goUmVzb3VyY2VIZWxwZXIucm9vdF91cmkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBhZGQgc2xhc2ggdG8gVVJJICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhZGRTbGFzaCh1cmk6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHVyaVBhcnNlZCA9IHVybC5wYXJzZSh1cmkpO1xyXG4gICAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZCh1cmlQYXJzZWQuc2VhcmNoKSAmJiB1cmkgJiYgdXJpW3VyaS5sZW5ndGggLSAxXSAhPSAnLycpXHJcbiAgICAgICAgICAgIHJldHVybiB1cmkgKyAnLyc7XHJcbiAgICAgICAgcmV0dXJuIHVyaTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHByb3h5IGZyb20gVVJMICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFByb3h5KHVybDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIVJlc291cmNlSGVscGVyLnByb3h5X3VyaSB8fCBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgPT0gJycpXHJcbiAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmFkZFNsYXNoKHVybC5yZXBsYWNlKFJlc291cmNlSGVscGVyLnJvb3RfdXJpLCBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IEh0dHBDbGllbnQqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXRIdHRwKGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5odHRwID0gaHR0cDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEh0dHBDbGllbnQqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRIdHRwKCk6IEh0dHBDbGllbnQge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5odHRwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcm9vdCBVUkkqL1xyXG4gICAgc3RhdGljIGdldFJvb3RVcmkoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLnJvb3RfdXJpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5pbXBvcnQge3Rocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3IsIG9mIGFzIG9ic2VydmFibGVPZn0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuXHJcbmltcG9ydCB7SHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWR9IGZyb20gJ3V0aWwnO1xyXG5cclxuaW1wb3J0IHtIYWxPcHRpb25zfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBBYnN0cmFjdCByZXNvdXJjZSBjbGFzcyovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlc291cmNlIHtcclxuXHJcbiAgICAvKiogcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgcHJveHlVcmw6IHN0cmluZztcclxuICAgIC8qKiByb290IFVSTCAqL1xyXG4gICAgcHVibGljIHJvb3RVcmw6IHN0cmluZztcclxuXHJcbiAgICAvKiogbGlua3MgKi9cclxuICAgIHB1YmxpYyBfbGlua3M6IGFueTtcclxuICAgIC8qKiBzdWJ0eXBlcyAqL1xyXG4gICAgcHVibGljIF9zdWJ0eXBlczogTWFwPHN0cmluZywgYW55PjtcclxuXHJcbiAgICBcclxuICAgIC8qKiBnZXQgc3VidHlwZXMgKi8gICAgXHJcbiAgICBwdWJsaWMgZ2V0IHN1YnR5cGVzKCk6IE1hcDxzdHJpbmcsIGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJ0eXBlcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHN1YnR5cGVzICovXHJcbiAgICBwdWJsaWMgc2V0IHN1YnR5cGVzKF9zdWJ0eXBlczogTWFwPHN0cmluZywgYW55Pikge1xyXG4gICAgICAgIHRoaXMuX3N1YnR5cGVzID0gX3N1YnR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKiogR2V0IGNvbGxlY3Rpb24gb2YgcmVsYXRlZCByZXNvdXJjZXMgKi9cclxuICAgIHB1YmxpYyBnZXRSZWxhdGlvbkFycmF5PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZWxhdGlvbjogc3RyaW5nLCBfZW1iZWRkZWQ/OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oaXNOdWxsT3JVbmRlZmluZWQoX2VtYmVkZGVkKSA/IFwiX2VtYmVkZGVkXCIgOiBfZW1iZWRkZWQpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb248VD4odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCwgYnVpbGRlcikpLFxyXG4gICAgICAgICAgICAgICAgbWFwKChhcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4gYXJyYXkucmVzdWx0KSwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YoW10pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogR2V0IHJlbGF0ZWQgcmVzb3VyY2UgKi9cclxuICAgIHB1YmxpYyBnZXRSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVsYXRpb246IHN0cmluZywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ1aWxkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGVtYmVkZGVkQ2xhc3NOYW1lIG9mIE9iamVjdC5rZXlzKGRhdGFbJ19saW5rcyddKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1iZWRkZWRDbGFzc05hbWUgPT0gJ3NlbGYnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaHJlZjogc3RyaW5nID0gZGF0YS5fbGlua3NbZW1iZWRkZWRDbGFzc05hbWVdLmhyZWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSBocmVmLmxhc3RJbmRleE9mKCcvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhbENsYXNzTmFtZSA9IGhyZWYucmVwbGFjZShSZXNvdXJjZUhlbHBlci5nZXRSb290VXJpKCksIFwiXCIpLnN1YnN0cmluZygwLCBpZHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gUmVzb3VyY2VIZWxwZXIuc2VhcmNoU3VidHlwZXMoYnVpbGRlciwgcmVhbENsYXNzTmFtZSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBBZGRzIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGUgYm91bmQgY29sbGVjdGlvbiBieSB0aGUgcmVsYXRpb24gKi9cclxuICAgIHB1YmxpYyBhZGRSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucG9zdChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYsIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBCaW5kIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSBnaXZlbiByZWxhdGlvbiovXHJcbiAgICBwdWJsaWMgdXBkYXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBhdGNoKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEJpbmQgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoaXMgcmVzb3VyY2UgYnkgdGhlIGdpdmVuIHJlbGF0aW9uKi9cclxuICAgIHB1YmxpYyBzdWJzdGl0dXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYsIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIC8qKiBCaW5kIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSBnaXZlbiByZWxhdGlvbiovXHJcbiAgICBwdWJsaWMgc3Vic3RpdHV0ZUFsbFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2VzOiBSZXNvdXJjZVtdKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2VzLm1hcCgocmVzb3VyY2UpID0+IHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYpLCB7aGVhZGVyczogaGVhZGVyfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8qKiBVbmJpbmQgdGhlIHJlc291cmNlIHdpdGggdGhlIGdpdmVuIHJlbGF0aW9uIGZyb20gdGhpcyByZXNvdXJjZSovXHJcbiAgICBwdWJsaWMgZGVsZXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlLl9saW5rcykpIHtcclxuICAgICAgICAgICAgbGV0IGxpbms6IHN0cmluZyA9IHJlc291cmNlLl9saW5rc1snc2VsZiddLmhyZWY7XHJcbiAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IGxpbmsubGFzdEluZGV4T2YoJy8nKSArIDE7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWR4ID09IC0xKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlbGF0aW9uSWQ6IHN0cmluZyA9IGxpbmsuc3Vic3RyaW5nKGlkeCk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmICsgJy8nICsgcmVsYXRpb25JZCksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIFVuYmluZCB0aGUgcmVzb3VyY2Ugd2l0aCB0aGUgZ2l2ZW4gcmVsYXRpb24gZnJvbSB0aGlzIHJlc291cmNlKi9cclxuICAgIHB1YmxpYyBkZWxldGVBbGxSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmICksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFVzZXJDb25maWd1cmF0aW9uIH0gZnJvbSAnLi91c2VyLWNvbmZpZ3VyYXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBVc2VyUG9zaXRpb24gfSBmcm9tICcuL3VzZXItcG9zaXRpb24ubW9kZWwnO1xyXG5cclxuLyoqXHJcbiAqIFVzZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBVc2VyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIHVzZXJuYW1lICovXHJcbiAgcHVibGljIHVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHBhc3N3b3JkICovXHJcbiAgcHVibGljIHBhc3N3b3JkOiBzdHJpbmc7XHJcbiAgLyoqIGZpcnN0IG5hbWUgKi9cclxuICBwdWJsaWMgZmlyc3ROYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGxhc3QgbmFtZSAqL1xyXG4gIHB1YmxpYyBsYXN0TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB3aGV0aGVyIHVzZXIgaXMgYmxvY2tlZCAqL1xyXG4gIHB1YmxpYyBibG9ja2VkOiBib29sZWFuO1xyXG4gIC8qKiB3aGV0aGVyIHVzZXIgaXMgYWRtaW5pc3RyYXRvciAqL1xyXG4gIHB1YmxpYyBhZG1pbmlzdHJhdG9yOiBib29sZWFuO1xyXG4gIC8qKiBJcyBwYXNzd29yZFNldCAqL1xyXG4gIHB1YmxpYyBwYXNzd29yZFNldDogYm9vbGVhbjtcclxuICAvKiogdXNlciBwb3NpdGlvbnMgKi9cclxuICBwdWJsaWMgcG9zaXRpb25zOiBVc2VyUG9zaXRpb25bXTtcclxuICAvKiogdXNlciBwZXJtaXNzaW9ucyAqL1xyXG4gIHB1YmxpYyBwZXJtaXNzaW9uczogVXNlckNvbmZpZ3VyYXRpb25bXTtcclxufVxyXG4iLCJpbXBvcnQge0h0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5pbXBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9FeHRlcm5hbENvbmZpZ3VyYXRpb24nO1xyXG5cclxuXHJcbi8qKiBFeHRlcm5hbFNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxTZXJ2aWNlIHtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoJ0V4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UnKSBwcml2YXRlIGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2U6IEV4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2UpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRQcm94eVVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFByb3h5VXJpKCkpO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFJvb3RVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRSb290VXJpKCkpO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldEh0dHAoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRIdHRwKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlciAqL1xyXG4gICAgcHVibGljIHVwZGF0ZUV4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2UoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTogRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZSkge1xyXG5cdHRoaXMuZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZSA9IGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2U7XHJcblxyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFByb3h5VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0Um9vdFVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0SHR0cChleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEh0dHAoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBFeHRlcm5hbENvbmZpZ3VyYXRpb24gKi9cclxuICAgIHB1YmxpYyBnZXRFeHRlcm5hbENvbmZpZ3VyYXRpb24oKTogRXh0ZXJuYWxDb25maWd1cmF0aW9uIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEV4dGVybmFsQ29uZmlndXJhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgZ2V0UHJveHlVcmkoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFByb3h5VXJpKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBSb290IFVSSSAqL1xyXG4gICAgcHVibGljIGdldFJvb3RVcmkoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IFVSTCAqL1xyXG4gICAgcHVibGljIGdldFVSTCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRVUkwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEh0dHBDbGllbnQgKi9cclxuICAgIHB1YmxpYyBnZXRIdHRwKCk6IEh0dHBDbGllbnQge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IHRocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0IHsgUmVzb3VyY2VIZWxwZXIgfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cFBhcmFtcywgSHR0cFJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBTb3J0IH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHsgUmVzb3VyY2VBcnJheSB9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQgeyBFeHRlcm5hbFNlcnZpY2UgfSBmcm9tICcuL2V4dGVybmFsLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBIYWxPcHRpb25zIH0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdWJUeXBlQnVpbGRlciB9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFJlc291cmNlU2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZVNlcnZpY2Uge1xyXG5cclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZXh0ZXJuYWxTZXJ2aWNlOiBFeHRlcm5hbFNlcnZpY2UpIHsgfVxyXG5cclxuXHJcbiAgICAvKiogZ2V0IFVSTCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldFVSTCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgYWxsIHJlc291cmNlcyBmcm9tIGEgYmFzZSBVUkkgb2YgYSBnaXZlbiB0eXBlICovXHJcbiAgICBwdWJsaWMgZ2V0QWxsPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZTogc3RyaW5nLCBfZW1iZWRkZWQ6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMsIHN1YlR5cGU/OiBTdWJUeXBlQnVpbGRlciwgZW1iZWRkZWROYW1lPzpTdHJpbmcpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJz9wcm9qZWN0aW9uPXZpZXcnKTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oX2VtYmVkZGVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzKHJlc3VsdCk7XHJcbiAgICAgICAgcmVzdWx0LnNvcnRJbmZvID0gb3B0aW9ucyA/IG9wdGlvbnMuc29ydCA6IHVuZGVmaW5lZDtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIHBhcmFtczogcGFyYW1zIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQsIHN1YlR5cGUsZW1iZWRkZWROYW1lKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGEgYmFzZSBVUkkgYW5kIGEgZ2l2ZW4gaWQgKi9cclxuICAgIHB1YmxpYyBnZXQ8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlOiBzdHJpbmcsIGlkOiBhbnkpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy8nLCBpZCwgJz9wcm9qZWN0aW9uPXZpZXcnKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChkYXRhID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGl0cyBzZWxmbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5U2VsZkxpbms8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkocmVzb3VyY2VMaW5rKSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKGRhdGEgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlcyBmcm9tIGEgZ2l2ZW4gYmFzZSBwYXRoLCBxdWVyeSBhbmQgb3B0aW9ucyAqL1xyXG4gICAgcHVibGljIHNlYXJjaDxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcXVlcnk6IHN0cmluZywgcmVzb3VyY2U6IHN0cmluZywgX2VtYmVkZGVkOiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvc2VhcmNoLycsIHF1ZXJ5KTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oX2VtYmVkZGVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtcyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCBhIHNpbmdsZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gYmFzZSBwYXRoLCBxdWVyeSBhbmQgb3B0aW9ucyAqL1xyXG4gICAgcHVibGljIHNlYXJjaFNpbmdsZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcXVlcnk6IHN0cmluZywgcmVzb3VyY2U6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy9zZWFyY2gvJywgcXVlcnkpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIHJlc3BvbnNlKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgY3VzdG9tIHF1ZXJ5IGFuZCBvcHRpb25zICovXHJcbiAgICBwdWJsaWMgY3VzdG9tUXVlcnk8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UgKyBxdWVyeSk7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZ2l2ZW4gYSByZWxhdGlvbiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2VMaW5rOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQocmVzb3VyY2VMaW5rLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoZGF0YSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgZGF0YSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZ2l2ZW4gYSByZWxhdGlvbiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlSZWxhdGlvbkFycmF5PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZUxpbms6IHN0cmluZywgX2VtYmVkZGVkOiBzdHJpbmcsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChyZXNvdXJjZUxpbmssIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0LCBidWlsZGVyKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNvdW50IHJlc291cmNlcyBnaXZlbiBhIHBhdGggKi9cclxuICAgIHB1YmxpYyBjb3VudChyZXNvdXJjZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy9zZWFyY2gvY291bnRBbGwnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdib2R5JyB9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHJlc3BvbnNlOiBSZXNwb25zZSkgPT4gTnVtYmVyKHJlc3BvbnNlLmJvZHkpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY3JlYXRlIHJlc291cmNlIGZyb20gc2VsZiBsaW5rIGFuZCBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgY3JlYXRlPFQgZXh0ZW5kcyBSZXNvdXJjZT4oc2VsZlJlc291cmNlOiBzdHJpbmcsIGVudGl0eTogVCkge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFVSTCgpICsgc2VsZlJlc291cmNlO1xyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKGVudGl0eSk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucG9zdCh1cmksIHBheWxvYWQsIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShlbnRpdHksIHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLCBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyB1cGRhdGU8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShlbnRpdHkuX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dCh1cmksIHBheWxvYWQsIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShlbnRpdHksIHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLCBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyB1cGRhdGVDb2xsZWN0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgcmVzb3VyY2VMaW5rOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShyZXNvdXJjZUxpbmspO1xyXG4gICAgICAgIC8vY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuICAgICAgICAvL3RoaXMuc2V0VXJsc1Jlc291cmNlKGVudGl0eSk7XHJcbiAgICAgICAgdmFyIGhlYWRlcnNSZXEgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzO1xyXG4gICAgICAgIGhlYWRlcnNSZXEuc2V0KFwiQ29udGVudC1UeXBlXCIsIFwidGV4dC91cmktbGlzdFwiKTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wdXQodXJpLCByZXNvdXJjZUFycmF5LCB7IGhlYWRlcnM6IGhlYWRlcnNSZXEsIG9ic2VydmU6ICdyZXNwb25zZScgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA1MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5OiBhbnkgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGJvZHkuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHBhdGNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgcGF0Y2g8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShlbnRpdHkuX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBhdGNoKHVyaSwgcGF5bG9hZCwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDw9IDIwNylcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKGVudGl0eSwgcmVzcG9uc2UuYm9keSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA1MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5OiBhbnkgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGJvZHkuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGRlbGV0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGRlbGV0ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCk6IE9ic2VydmFibGU8T2JqZWN0PiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkoZW50aXR5Ll9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzIH0pLnBpcGUoY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzTmV4dDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5uZXh0X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNQcmV2PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnByZXZfdXJpICE9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0ZpcnN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LmZpcnN0X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0xhc3Q8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubGFzdF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIG5leHQ8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5uZXh0KHR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBwcmV2PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucHJldih0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGZpcnN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgZmlyc3Q8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5maXJzdCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBsYXN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubGFzdCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHBhZ2Ugb2YgcmVzdWx0cyBnaXZlbiBhIHBhZ2UgbnVtYmVyKi9cclxuICAgIHB1YmxpYyBwYWdlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9LCBpZDogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucGFnZSh0eXBlLCBpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNvcnQgcmVzb3VyY2UgYXJyYXkgd2l0aCBhIGdpdmVuIHNvcnRpbmcgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc29ydEVsZW1lbnRzPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9LCAuLi5zb3J0OiBTb3J0W10pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5zb3J0RWxlbWVudHModHlwZSwgLi4uc29ydCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBzaXplKi9cclxuICAgIHB1YmxpYyBzaXplPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9LCBzaXplOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5zaXplKHR5cGUsIHNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgVVJMIGZyb20gYSBnaXZlbiBwYXRoKi9cclxuICAgIHB1YmxpYyBnZXRSZXNvdXJjZVVybChyZXNvdXJjZT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHVybCA9IFJlc291cmNlU2VydmljZS5nZXRVUkwoKTtcclxuICAgICAgICBpZiAoIXVybC5lbmRzV2l0aCgnLycpKSB7XHJcbiAgICAgICAgICAgIHVybCA9IHVybC5jb25jYXQoJy8nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc291cmNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmwuY29uY2F0KHJlc291cmNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVybDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHByb3h5IGFuZCByb290IHVybHMgb2YgZ2l2ZW4gcmVzb3VyY2UgYXJyYXkgKi9cclxuICAgIHByaXZhdGUgc2V0VXJsczxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPikge1xyXG4gICAgICAgIHJlc3VsdC5wcm94eVVybCA9IHRoaXMuZXh0ZXJuYWxTZXJ2aWNlLmdldFByb3h5VXJpKCk7XHJcbiAgICAgICAgcmVzdWx0LnJvb3RVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRSb290VXJpKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBwcm94eSBhbmQgcm9vdCB1cmxzIG9mIGdpdmVuIHJlc291cmNlICovXHJcbiAgICBwcml2YXRlIHNldFVybHNSZXNvdXJjZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc3VsdDogVCkge1xyXG4gICAgICAgIHJlc3VsdC5wcm94eVVybCA9IHRoaXMuZXh0ZXJuYWxTZXJ2aWNlLmdldFByb3h5VXJpKCk7XHJcbiAgICAgICAgcmVzdWx0LnJvb3RVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRSb290VXJpKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtvZiBhcyBvYnNlcnZhYmxlT2YsIHRocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge21hcCwgbWVyZ2VNYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZH0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG4vKiogSEFMIHBhcmFtIGRhdGEgbW9kZWwgKi9cclxuZXhwb3J0IHR5cGUgSGFsUGFyYW0gPSB7IGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9O1xyXG4vKiogSEFMIG9wdGlvbiBkYXRhIG1vZGVsICovXHJcbmV4cG9ydCB0eXBlIEhhbE9wdGlvbnMgPSB7IG5vdFBhZ2VkPzogYm9vbGVhbiwgc2l6ZT86IG51bWJlciwgc29ydD86IFNvcnRbXSwgcGFyYW1zPzogSGFsUGFyYW1bXSB9O1xyXG5cclxuLyoqIFJFU1QgQVBJIGFjY2VzcyBpbnRlcmZhY2UgKi9cclxuZXhwb3J0IGNsYXNzIFJlc3RTZXJ2aWNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ge1xyXG4gICAgLyoqIHJlc291cmNlIHR5cGUgKi9cclxuICAgIHByaXZhdGUgdHlwZTogYW55O1xyXG4gICAgLyoqIHJlc291cmNlIHBhdGggKi9cclxuICAgIHByaXZhdGUgcmVzb3VyY2U6IHN0cmluZztcclxuICAgIC8qKiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHVibGljIHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD47XHJcbiAgICAvKiogcmVzb3VyY2Ugc2VydmljZSAqL1xyXG4gICAgcHVibGljIHJlc291cmNlU2VydmljZTogUmVzb3VyY2VTZXJ2aWNlO1xyXG4gICAgLyoqIF9lbWJlZGRlZCBmaWVsZCBuYW1lICovXHJcbiAgICBwcml2YXRlIF9lbWJlZGRlZDogc3RyaW5nID0gJ19lbWJlZGRlZCc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiB7IG5ldygpOiBUIH0sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXHJcbiAgICAgICAgICAgICAgICBfZW1iZWRkZWQ/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2UgPSByZXNvdXJjZTtcclxuICAgICAgICB0aGlzLnJlc291cmNlU2VydmljZSA9IGluamVjdG9yLmdldChSZXNvdXJjZVNlcnZpY2UpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQoX2VtYmVkZGVkKSlcclxuICAgICAgICAgICAgdGhpcy5fZW1iZWRkZWQgPSBfZW1iZWRkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGVycm9yIGhhbmRsZXIgKi9cclxuICAgIHByb3RlY3RlZCBoYW5kbGVFcnJvcihlcnJvcjogYW55KTpPYnNlcnZhYmxlPG5ldmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIFJlc3RTZXJ2aWNlLmhhbmRsZUVycm9yKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZXJyb3IgaGFuZGxlciAqL1xyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBoYW5kbGVFcnJvcihlcnJvcjogYW55KTpPYnNlcnZhYmxlPG5ldmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IGFsbCByZXNvdXJjZXMgd2l0aCBvcHRpb25hbCBvcHRpb25zIGFuIHN1YlR5cGUgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgZ2V0QWxsKG9wdGlvbnM/OiBIYWxPcHRpb25zLCBzdWJUeXBlPzogU3ViVHlwZUJ1aWxkZXIsIGVtYmVkZGVkTmFtZT86U3RyaW5nKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QWxsKHRoaXMudHlwZSwgdGhpcy5yZXNvdXJjZSwgdGhpcy5fZW1iZWRkZWQsIG9wdGlvbnMsIHN1YlR5cGUsZW1iZWRkZWROYW1lKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBbGwob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gYSBnaXZlbiBpZCAqL1xyXG4gICAgcHVibGljIGdldChpZDogYW55KTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldCh0aGlzLnR5cGUsIHRoaXMucmVzb3VyY2UsIGlkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gc2VsZiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlTZWxmTGluayhzZWxmTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEJ5U2VsZkxpbmsodGhpcy50eXBlLCBzZWxmTGluayk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2gocXVlcnk6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5zZWFyY2godGhpcy50eXBlLCBxdWVyeSwgdGhpcy5yZXNvdXJjZSwgdGhpcy5fZW1iZWRkZWQsIG9wdGlvbnMpLnBpcGUoXHJcbiAgICAgICAgICAgIG1lcmdlTWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm5vdFBhZ2VkICYmICFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZUFycmF5LmZpcnN0X3VyaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm5vdFBhZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zaXplID0gcmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaChxdWVyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoU2luZ2xlKHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnNlYXJjaFNpbmdsZSh0aGlzLnR5cGUsIHF1ZXJ5LCB0aGlzLnJlc291cmNlLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlcyBmcm9tIGEgZ2l2ZW4gY3VzdG9tIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBjdXN0b21RdWVyeShxdWVyeTogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmN1c3RvbVF1ZXJ5KHRoaXMudHlwZSwgcXVlcnksIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXN0b21RdWVyeShxdWVyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uQXJyYXkocmVsYXRpb246IHN0cmluZywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QnlSZWxhdGlvbkFycmF5KHRoaXMudHlwZSwgcmVsYXRpb24sIHRoaXMuX2VtYmVkZGVkLCBidWlsZGVyKS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb24ocmVsYXRpb246IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRCeVJlbGF0aW9uKHRoaXMudHlwZSwgcmVsYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb3VudCByZXNvdXJjZXMgZ2l2ZW4gYSBwYXRoICovXHJcbiAgICBwdWJsaWMgY291bnQoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY291bnQodGhpcy5yZXNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSByZXNvdXJjZSBmcm9tIHNlbGYgbGluayBhbmQgZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGNyZWF0ZShlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY3JlYXRlKHRoaXMucmVzb3VyY2UsIGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHVwZGF0ZShlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UudXBkYXRlKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHBhdGNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgcGF0Y2goZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnBhdGNoKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGRlbGV0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGRlbGV0ZShlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5kZWxldGUoZW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyBvZiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHVibGljIHRvdGFsRWxlbWVudCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkgJiYgdGhpcy5yZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHMpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0ZpcnN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNGaXJzdCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzTmV4dCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuaGFzTmV4dCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBwcmV2aW91cyBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc1ByZXYoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc1ByZXYodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0xhc3QoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc0xhc3QodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbmV4dCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5uZXh0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBwcmV2KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnByZXYodGhpcy5yZXNvdXJjZUFycmF5LCB0aGlzLnR5cGUpLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGZpcnN0KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmZpcnN0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbGFzdCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5sYXN0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwYWdlIG9mIHJlc3VsdHMgZ2l2ZW4gYSBwYWdlIG51bWJlciovXHJcbiAgICBwdWJsaWMgcGFnZShwYWdlTnVtYmVyOiBudW1iZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wYWdlKHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlLCBwYWdlTnVtYmVyKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi91c2VyL3VzZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcblxyXG4vKiogQWNjb3VudCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQWNjb3VudFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBQ0NPVU5UX0FQSSA9ICdhY2NvdW50JztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlciwgXCJhY2NvdW50XCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKiBnZXQgbG9nZ2VkIGluIHVzZXIgYWNjb3VudCovXHJcbiAgZ2V0KCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQUNDT1VOVF9BUEkpKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFjY291bnQqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQUNDT1VOVF9BUEkpICwgaXRlbSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8qKiBjaGFuZ2UgbG9nZ2VkIGluIHVzZXIgYWNjb3VudCovICBcclxuICBjaGFuZ2VQYXNzd29yZChpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BQ0NPVU5UX0FQSStcIi9jaGFuZ2UtcGFzc3dvcmRcIikgLCBpdGVtKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcy1jb21wYXQnO1xyXG5pbXBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuLy9pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcbi8qKiBBdXRoZW50aWNhdGlvbiBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xyXG4gICAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFVVEhfQVBJID0gJ2F1dGhlbnRpY2F0ZSc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgICBwcml2YXRlIHJlc291cmNlU2VydmljZTogUmVzb3VyY2VTZXJ2aWNlXHJcbiAgICApIHt9XHJcbiAgICBcclxuICAgIC8qKiBnZXQgY3VycmVudCB1c2VyIGp3dCB0b2tlbiBmcm9tIHNlc3Npb24gc3RvcmFnZSovXHJcbiAgICBnZXRUb2tlbigpIHtcclxuICAgICAgICByZXR1cm4gIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9naW4gb3BlcmF0aW9uICovXHJcbiAgICBsb2dpbihjcmVkZW50aWFscyk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiBjcmVkZW50aWFscy51c2VybmFtZSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IGNyZWRlbnRpYWxzLnBhc3N3b3JkXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BVVRIX0FQSSksIGRhdGEsIHtvYnNlcnZlIDogJ3Jlc3BvbnNlJ30pLm1hcChhdXRoZW50aWNhdGVTdWNjZXNzLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhdXRoZW50aWNhdGVTdWNjZXNzKHJlc3ApIHtcclxuICAgICAgICAgICAgaWYgKHJlc3Aub2spIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGp3dCA9IHJlc3AuYm9keS5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnN0IGV4cGlyZXNBdCA9IG1vbWVudCgpLmFkZCggcmVzcC5oZWFkZXJzLmdldCgnVG9rZW4tVmFsaWRpdHknKSwnbWlsaXNlY29uZCcpO1xyXG4gICAgICAgICAgICAgICAgLy9zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdleHBpcmVzX2F0JywgSlNPTi5zdHJpbmdpZnkoZXhwaXJlc0F0LnZhbHVlT2YoKSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGp3dDtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogbG9naW4gb3BlcmF0aW9uIHdpdGggand0IHRva2VuICovXHJcbiAgICBsb2dpbldpdGhUb2tlbihqd3QpIHtcclxuICAgICAgICBpZiAoand0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoand0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJ2F1dGgtand0LXNlcnZpY2UgUHJvbWlzZSByZWplY3QnKTsgLy8gUHV0IGFwcHJvcHJpYXRlIGVycm9yIG1lc3NhZ2UgaGVyZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogc3RvcmUgand0IHRva2VuIGluIHNlc3Npb24gc3RvcmFnZSovXHJcbiAgICBzdG9yZUF1dGhlbnRpY2F0aW9uVG9rZW4oand0KSB7XHJcbiAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJywgand0KTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGxvZ2dlZCBpbiovXHJcbiAgICBwdWJsaWMgaXNMb2dnZWRJbigpIHtcclxuICAgICAgICAvL3JldHVybiBtb21lbnQoKS5pc0JlZm9yZSh0aGlzLmdldEV4cGlyYXRpb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW4oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGxvZ2dlZCBvdXQqL1xyXG4gICAgaXNMb2dnZWRPdXQoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzTG9nZ2VkSW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9nb3V0IG9wZXJhdGlvbiAqL1xyXG4gICAgbG9nb3V0KCk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgLy9sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicpO1xyXG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICAgICAgICAgIC8vc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnZXhwaXJlc19hdCcpO1xyXG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBcclxufVxyXG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3QsIEh0dHBIYW5kbGVyLCBIdHRwRXZlbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG4vKiogSW50ZXJjZXB0b3IgZm9yIGF1dGhlbnRpY2F0aW9uIHRva2VuIGluIEFQSSByZXF1ZXN0cyAqL1xyXG5leHBvcnQgY2xhc3MgQXV0aEludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICApIHtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHJlcXVlc3QgaGFuZGxlciAqL1xyXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xyXG4gICAgICAgIGlmICghcmVxdWVzdCB8fCAhcmVxdWVzdC51cmwgfHwgIShyZXF1ZXN0LnVybC5pbmNsdWRlcyhcIi9hcGkvXCIpKSApIHtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcXVlc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgICAgICBpZiAoISF0b2tlbikge1xyXG4gICAgICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XHJcbiAgICAgICAgICAgICAgICBzZXRIZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEFjY291bnRTZXJ2aWNlIH0gZnJvbSAnLi4vYWNjb3VudC9hY2NvdW50LnNlcnZpY2UnO1xyXG5cclxuLyoqIFByaW5jaXBhbCBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUHJpbmNpcGFsIHtcclxuICAgIHByaXZhdGUgdXNlcklkZW50aXR5OiBhbnk7XHJcbiAgICBwcml2YXRlIGF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgYXV0aGVudGljYXRpb25TdGF0ZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgYWNjb3VudDogQWNjb3VudFNlcnZpY2VcclxuICAgICkge31cclxuXHJcbiAgICAvKiogYXV0aGVudGljYXRlIHdpdGggZ2l2ZW4gaWRlbnRpdHkqL1xyXG4gICAgYXV0aGVudGljYXRlKGlkZW50aXR5KSB7XHJcbiAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBpZGVudGl0eTtcclxuICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBpZGVudGl0eSAhPT0gbnVsbDtcclxuICAgICAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUubmV4dCh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHkoYXV0aG9yaXRpZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhc0FueUF1dGhvcml0eURpcmVjdChhdXRob3JpdGllcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyBvbiB0aGUgZ2l2ZW4gdGVycml0b3J5ICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeShhdXRob3JpdGllczogc3RyaW5nW10sdGVycml0b3J5OiBzdHJpbmcgKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhc0FueUF1dGhvcml0eURpcmVjdE9uVGVycml0b3J5KGF1dGhvcml0aWVzLHRlcnJpdG9yeSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyB3aXRob3V0IHJlc29sdmluZyBwcm9taXNlcyovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlEaXJlY3QoYXV0aG9yaXRpZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMudXNlcklkZW50aXR5IHx8ICF0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF1dGhvcml0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcy5pbmNsdWRlcyhhdXRob3JpdGllc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkgd2l0aG91dCByZXNvbHZpbmcgcHJvbWlzZXMgKi9cclxuICAgIGhhc0FueUF1dGhvcml0eURpcmVjdE9uVGVycml0b3J5KGF1dGhvcml0aWVzOiBzdHJpbmdbXSx0ZXJyaXRvcnk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkIHx8ICF0aGlzLnVzZXJJZGVudGl0eSB8fCAhdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdXRob3JpdGllcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0gJiYgdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XS5pbmNsdWRlcyhhdXRob3JpdGllc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyB0aGUgZ2l2ZW4gYXV0aG9yaXR5ICovXHJcbiAgICBoYXNBdXRob3JpdHkoYXV0aG9yaXR5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKS50aGVuKChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkLmF1dGhvcml0aWVzICYmIGlkLmF1dGhvcml0aWVzLmluY2x1ZGVzKGF1dGhvcml0eSkpO1xyXG4gICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyB0aGUgZ2l2ZW4gYXV0aG9yaXR5IG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkqL1xyXG4gICAgaGFzQXV0aG9yaXR5T25UZXJyaXRvcnkoYXV0aG9yaXR5OiBzdHJpbmcsdGVycml0b3J5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKS50aGVuKChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5ICYmIGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0gJiYgaWQuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XS5pbmNsdWRlcyhhdXRob3JpdHkpKTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB1c2VyIGlkZW50aXR5Ki9cclxuICAgIGlkZW50aXR5KGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgaWYgKGZvcmNlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2hlY2sgYW5kIHNlZSBpZiB3ZSBoYXZlIHJldHJpZXZlZCB0aGUgdXNlcklkZW50aXR5IGRhdGEgZnJvbSB0aGUgc2VydmVyLlxyXG4gICAgICAgIC8vIGlmIHdlIGhhdmUsIHJldXNlIGl0IGJ5IGltbWVkaWF0ZWx5IHJlc29sdmluZ1xyXG4gICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJldHJpZXZlIHRoZSB1c2VySWRlbnRpdHkgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIsIHVwZGF0ZSB0aGUgaWRlbnRpdHkgb2JqZWN0LCBhbmQgdGhlbiByZXNvbHZlLlxyXG4gICAgICAgIHJldHVybiB0aGlzLmFjY291bnQuZ2V0KCkudG9Qcm9taXNlKCkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYWNjb3VudCA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBhY2NvdW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5uZXh0KHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcklkZW50aXR5O1xyXG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLm5leHQodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaXMgYXV0aGVudGljYXRlZCAqL1xyXG4gICAgaXNBdXRoZW50aWNhdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlkZW50aXR5IGlzIHJlc29sdmVkICovXHJcbiAgICBpc0lkZW50aXR5UmVzb2x2ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlcklkZW50aXR5ICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBjdXJyZW50IHVzZXIgYXV0aGVudGljYXRpb24gc3RhdGUgKi9cclxuICAgIGdldEF1dGhlbnRpY2F0aW9uU3RhdGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0b3IsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cEludGVyY2VwdG9yLCBIdHRwUmVxdWVzdCwgSHR0cEhhbmRsZXIsIEh0dHBFdmVudCwgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuXHJcbi8qKiBJbnRlcmNlcHRvciBmb3IgYXV0aGVudGljYXRpb24gZXhwaXJlZCByZXNwb25zZSBpbiBBUEkgcmVxdWVzdHMgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aEV4cGlyZWRJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLCAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UsIFxyXG4gICAgICAgIHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWxcclxuICAgICkge31cclxuXHJcbiAgICAvKiogcmVxdWVzdCBoYW5kbGVyICovXHJcbiAgICBpbnRlcmNlcHQocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcXVlc3QpLmRvKChldmVudDogSHR0cEV2ZW50PGFueT4pID0+IHt9LCAoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJjZXB0OiBib29sZWFuID0gcmVxdWVzdC51cmwuaW5kZXhPZihcIi9hcGkvXCIpICE9IC0xO1xyXG4gICAgICAgICAgICAvL3RyYWN0ZW0gcmVxdWVzdFxyXG4gICAgICAgICAgICBpZiAoaW50ZXJjZXB0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5sb2dvdXQoKS5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmluY2lwYWwuYXV0aGVudGljYXRlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy8nXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKiogTG9naW4gc2VydmljZSovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIExvZ2luU2VydmljZSB7XHJcbiAgICBcclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmVyUHJvdmlkZXI6IEF1dGhTZXJ2aWNlLCBcclxuICAgICAgICBwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqTG9naW4gb3BlcmF0aW9uKi9cclxuICAgIGxvZ2luKGNyZWRlbnRpYWxzLCBjYWxsYmFjaz8pIHtcclxuICAgICAgICBjb25zdCBjYiA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZlclByb3ZpZGVyLmxvZ2luKGNyZWRlbnRpYWxzKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJpbmNpcGFsLmlkZW50aXR5KHRydWUpLnRoZW4oKGFjY291bnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBZnRlciB0aGUgbG9naW4gdGhlIGxhbmd1YWdlIHdpbGwgYmUgY2hhbmdlZCB0b1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBsYW5ndWFnZSBzZWxlY3RlZCBieSB0aGUgdXNlciBkdXJpbmcgaGlzIHJlZ2lzdHJhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoKTtcclxuICAgICAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqbG9naW4gd2l0aCBqd3QgdG9rZW4gKi9cclxuICAgIGxvZ2luV2l0aFRva2VuKGp3dCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dpbldpdGhUb2tlbihqd3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBsb2dvdXQgb3BlcmF0aW9uICovXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dvdXQoKS5zdWJzY3JpYmUoKTtcclxuICAgICAgIHRoaXMucHJpbmNpcGFsLmF1dGhlbnRpY2F0ZShudWxsKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkU2VydmljZXtcclxuXHJcbiAgICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICAgIHB1YmxpYyBEQVNIQk9BUkRfQVBJID0gJ2Rhc2hib2FyZC9pbmZvJztcclxuICAgIHB1YmxpYyBEQVNIQk9BUkRfRU1CRURERUQ9ICdkYXNoYm9hcmQnO1xyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvciggICAgICAgXHJcbiAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgcHJpdmF0ZSByZXNvdXJjZVNlcnZpY2U6IFJlc291cmNlU2VydmljZSkge1xyXG4gICAgfVxyXG4gIFxyXG4gICAgLyoqIGdldCBhbGwga3BpICovXHJcbiAgICBnZXRBbGwoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5EQVNIQk9BUkRfQVBJKSkubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlW3RoaXMuREFTSEJPQVJEX0VNQkVEREVEXSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi91c2VyLm1vZGVsJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFVzZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VXNlcj4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBVU0VSX0FQSSA9J3VzZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlciwgXCJ1c2Vyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdXNlciovXHJcbiAgcmVtb3ZlKGl0ZW06IFVzZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB1c2VyKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gICAgXHJcbiAgLyoqIGNoYW5nZSBwYXNzd29yZCBvIGdpdmVuIHVzZXIgaWQgKi9cclxuICBjaGFuZ2VQYXNzd29yZChpZCxpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX0FQSStcIi9cIitpZCtcIi9jaGFuZ2UtcGFzc3dvcmRcIikgLCBpdGVtKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuLi90ZXJyaXRvcnkvdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vdXNlci5tb2RlbCc7XHJcbi8qKlxyXG4gKiBVc2VyIHBvc2l0aW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVXNlclBvc2l0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogZW1haWwgKi9cclxuICBwdWJsaWMgZW1haWw6IHN0cmluZztcclxuICAvKiogb3JnYW5pemF0aW9uIG5hbWUqL1xyXG4gIHB1YmxpYyBvcmdhbml6YXRpb246IHN0cmluZztcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIHN5c3RlbSBkYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgZGF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIHBvc2l0aW9uIHRlcnJpdG9yeSovXHJcbiAgcHVibGljIHRlcnJpdG9yeTogVGVycml0b3J5O1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgdXNlcjogVXNlcjtcclxufVxyXG4iLCJpbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJQb3NpdGlvbiB9IGZyb20gJy4vdXNlci1wb3NpdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBVc2VyIHBvc2l0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyUG9zaXRpb25TZXJ2aWNlICBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXJQb3NpdGlvbj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVVNFUl9QT1NJVElPTl9BUEkgPSAndXNlci1wb3NpdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihVc2VyUG9zaXRpb24sIFwidXNlci1wb3NpdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHVzZXIgcG9zaXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBVc2VyUG9zaXRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB1c2VyIHBvc2l0aW9uKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS51c2VyICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndXNlcicsaXRlbS51c2VyKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnVzZXIgPSBpdGVtLnVzZXIuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX1BPU0lUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBSb2xlIH0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL3VzZXIubW9kZWwnO1xyXG5cclxuLyoqXHJcbiAqIFVzZXIgcGVybWlzc2lvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVzZXJDb25maWd1cmF0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiByb2xlICovICBcclxuICBwdWJsaWMgcm9sZTogUm9sZTtcclxuXHJcbiAgLyoqIHJvbGUgQ2hpbGRyZW4gKi8gIFxyXG4gIHB1YmxpYyByb2xlQ2hpbGRyZW46IFJvbGU7XHJcbiAgXHJcbiAgLyoqIHRlcnJpdG9yeSAqLyBcclxuICBwdWJsaWMgdGVycml0b3J5OiBUZXJyaXRvcnk7XHJcbiAgLyoqIHVzZXIgKi9cclxuICBwdWJsaWMgdXNlcjogVXNlcjtcclxufVxyXG4iLCJpbXBvcnQgeyBSZXN0U2VydmljZSB9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlckNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL3VzZXItY29uZmlndXJhdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBVc2VyIGNvbmZpZ3VyYXRpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFVzZXJDb25maWd1cmF0aW9uU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXJDb25maWd1cmF0aW9uPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBVU0VSX0NPTkZJR1VSQVRJT05fQVBJID0gJ3VzZXItY29uZmlndXJhdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlckNvbmZpZ3VyYXRpb24sIFwidXNlci1jb25maWd1cmF0aW9uc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIHVzZXIgY29uZmlndXJhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IFVzZXJDb25maWd1cmF0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKiBzYXZlIHVzZXIgY29uZmlndXJhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzICE9IG51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS51c2VyICE9IG51bGwpIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndXNlcicsIGl0ZW0udXNlcikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcblxyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT0gbnVsbCkge1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLCBpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcblxyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS5yb2xlICE9IG51bGwpIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigncm9sZScsIGl0ZW0ucm9sZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcblxyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS5yb2xlQ2hpbGRyZW4gIT0gbnVsbCkge1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdyb2xlQ2hpbGRyZW4nLCBpdGVtLnJvbGVDaGlsZHJlbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcblxyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnJvbGUgPSBpdGVtLnJvbGUhPW51bGw/aXRlbS5yb2xlLl9saW5rcy5zZWxmLmhyZWY6bnVsbDtcclxuICAgICAgaXRlbS51c2VyID0gaXRlbS51c2VyLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0ucm9sZUNoaWxkcmVuID0gaXRlbS5yb2xlQ2hpbGRyZW4hPW51bGw/aXRlbS5yb2xlQ2hpbGRyZW4uX2xpbmtzLnNlbGYuaHJlZjpudWxsO1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlVTRVJfQ09ORklHVVJBVElPTl9BUEkpLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5R3JvdXBUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktZ3JvdXAtdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeVR5cGUgfSBmcm9tICcuL3RlcnJpdG9yeS10eXBlLm1vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBUZXJyaXRvcnkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogY29kZSAqL1xyXG4gIHB1YmxpYyBjb2RlOiBzdHJpbmc7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBhZGRyZXNzKi9cclxuICBwdWJsaWMgdGVycml0b3JpYWxBdXRob3JpdHlBZGRyZXNzOiBzdHJpbmc7XHJcbiAgLyoqIGFkbWluICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB3aGV0aGVyIHRlcnJpdG9yeSBpcyBibG9ja2VkKi9cclxuICBwdWJsaWMgYmxvY2tlZDogYm9vbGVhbjtcclxuICAvKiogY29tbWVudHMqL1xyXG4gIHB1YmxpYyBub3RlOiBzdHJpbmc7XHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIC8qKiBjb250YWN0IGVtYWlsICovICBcclxuICBwdWJsaWMgdGVycml0b3JpYWxBdXRob3JpdHlFbWFpbDogc3RyaW5nO1xyXG4gIC8qKiBleHRlbnNpb24gKi9cclxuICBwdWJsaWMgZXh0ZW50OiBzdHJpbmc7XHJcbiAgLyoqIGxvZ28gaW1hZ2UgVVJMICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5TG9nbzogc3RyaW5nO1xyXG4gIC8qKiBjb250YWN0IG9yZ2FuaXphdGlvbiBuYW1lICovXHJcbiAgLy8gcHVibGljIG9yZ2FuaXphdGlvbk5hbWU6IHN0cmluZztcclxuICAvKiogc2NvcGUqL1xyXG4gIHB1YmxpYyBzY29wZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlICovICBcclxuICBwdWJsaWMgdHlwZTogVGVycml0b3J5VHlwZTtcclxuICAvKiogZ3JvdXAgdHlwZSAqL1xyXG4gIHB1YmxpYyBncm91cFR5cGU6IFRlcnJpdG9yeUdyb3VwVHlwZTtcclxuICAvKiogdGVycml0b3J5IG1lbWJlcnMqL1xyXG4gIHB1YmxpYyBtZW1iZXJzOiBUZXJyaXRvcnlbXTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFJlc3RTZXJ2aWNlIH0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRlcnJpdG9yeSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRlcnJpdG9yeT4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZX0FQSSA9ICd0ZXJyaXRvcmllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUZXJyaXRvcnksIFwidGVycml0b3JpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSB0ZXJyaXRvcnkqL1xyXG4gIHJlbW92ZShpdGVtOiBUZXJyaXRvcnkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqIHNhdmUgdGVycml0b3J5Ki9cclxuICBzYXZlKGl0ZW06IFRlcnJpdG9yeSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IHRlcnJpdG9yeUdyb3VwVHlwZTphbnkgPSB7fVxyXG4gICAgdGVycml0b3J5R3JvdXBUeXBlLl9saW5rcyA9IHt9O1xyXG4gICAgdGVycml0b3J5R3JvdXBUeXBlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICB0ZXJyaXRvcnlHcm91cFR5cGUuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcblxyXG4gICAgaWYgKGl0ZW0uZ3JvdXBUeXBlICE9IG51bGwpIHtcclxuICAgICAgdGVycml0b3J5R3JvdXBUeXBlID0gaXRlbS5ncm91cFR5cGU7XHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5ncm91cFR5cGUuX2xpbmtzICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgaXRlbS5ncm91cFR5cGUgPSBpdGVtLmdyb3VwVHlwZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9IFxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5ncm91cFR5cGU7XHJcblxyXG4gICAgICBpZiAodGVycml0b3J5R3JvdXBUeXBlLl9saW5rcy5zZWxmLmhyZWYgPT0gJycpIHtcclxuICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdncm91cFR5cGUnLCB0ZXJyaXRvcnlHcm91cFR5cGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2dyb3VwVHlwZScsIHRlcnJpdG9yeUdyb3VwVHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXRlbS50eXBlICE9IG51bGwpXHJcbiAgICAgICAgaXRlbS50eXBlID0gaXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWY7XHJcblxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRFUlJJVE9SWV9BUEkpLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuXHJcbi8qKlxyXG4gKiBUZXJyaXRvcnkgdHlwZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeVR5cGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgIC8qKiBpZCAqL1xyXG4gICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuL3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnlUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktdHlwZS5tb2RlbCc7XHJcblxyXG4vKiogVGVycml0b3J5VHlwZSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5VHlwZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUZXJyaXRvcnlUeXBlPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBURVJSSVRPUllUWVBFX0FQSSA9ICd0ZXJyaXRvcnktdHlwZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUZXJyaXRvcnlUeXBlLCBcInRlcnJpdG9yeS10eXBlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGVycml0b3J5IHR5cGUqL1xyXG4gIHJlbW92ZShpdGVtOiBUZXJyaXRvcnlUeXBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGVycml0b3J5IHR5cGUqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRFUlJJVE9SWVRZUEVfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IHR5cGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlHcm91cFR5cGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGVycml0b3J5R3JvdXBUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktZ3JvdXAtdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlHcm91cFR5cGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGVycml0b3J5R3JvdXBUeXBlPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRFUlJJVE9SWUdST1VQVFlQRV9BUEkgPSAndGVycml0b3J5LWdyb3VwLXR5cGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGVycml0b3J5R3JvdXBUeXBlLCBcInRlcnJpdG9yeS1ncm91cC10eXBlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGVycml0b3J5Ki9cclxuICByZW1vdmUoaXRlbTogVGVycml0b3J5R3JvdXBUeXBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGVycml0b3J5Ki9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllHUk9VUFRZUEVfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn0iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuXHJcbi8qKlxyXG4gKiBSb2xlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUm9sZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogY29tbWVudHMqL1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBSb2xlIH0gZnJvbSAnLi9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogUm9sZSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUm9sZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxSb2xlPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFJPTEVfQVBJID0gJ3JvbGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoUm9sZSwgXCJyb2xlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgcm9sZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFJvbGUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSByb2xlKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5ST0xFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogQ29ubmVjdGlvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb24gZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgLyoqIHVzZXIqL1xyXG4gIHB1YmxpYyB1c2VyOiBzdHJpbmc7XHJcbiAgLyoqIHBhc3N3b3JkKi9cclxuICBwdWJsaWMgcGFzc3dvcmQ6IHN0cmluZztcclxuICAvKiogY29ubmVjdGlvbiBzdHJpbmcqL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uU3RyaW5nOiBzdHJpbmc7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICcuL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDb25uZWN0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENvbm5lY3Rpb24+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gJ2Nvbm5lY3Rpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ29ubmVjdGlvbiwgXCJjb25uZWN0aW9uc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY29ubmVjdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IENvbm5lY3Rpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjb25uZWN0aW9uKi9cclxuICBzYXZlKGl0ZW06IENvbm5lY3Rpb24pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHRlc3RDb25uZWN0aW9uKGl0ZW06YW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdD10aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKStcIi90ZXN0XCIgLCBpdGVtKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJy4uL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IFJvbGUgfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnO1xyXG5pbXBvcnQgeyBUYXNrVHlwZSB9IGZyb20gJy4vdGFzay10eXBlLm1vZGVsJztcclxuaW1wb3J0IHsgVGFza0dyb3VwIH0gZnJvbSAnLi90YXNrLWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHsgVGFza0F2YWlsYWJpbGl0eSB9IGZyb20gJy4vdGFzay1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG5pbXBvcnQgeyBUYXNrUGFyYW1ldGVyIH0gZnJvbSAnLi90YXNrLXBhcmFtZXRlci5tb2RlbCc7XHJcblxyXG4vL0ZJWE1FIGVuc3VyZSB0YXNrIGNyZWF0aW9uIGluIGFkbWluIGFwcCB1cG9uIGluaXRpYWxpemF0aW9uIChhcyBpdCBpcyBkb25lIHdpdGggUm9sZXMgYW5kIGRlZmF1bHQgVXNlcnMpXHJcbi8qKiBHRU9BRE1JTl90YXNrIGlkICovXHJcbmV4cG9ydCBjb25zdCBHRU9BRE1JTl9UUkVFX1RBU0tfSUQ6c3RyaW5nICA9IFwiZ2VvYWRtaW5cIjtcclxuXHJcbmltcG9ydCB7IFRhc2tVSSB9IGZyb20gJy4vdGFzay11aS5tb2RlbCc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5IH0gZnJvbSAnLi4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHkubW9kZWwnO1xyXG5pbXBvcnQgeyBTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZS9zZXJ2aWNlLm1vZGVsJztcclxuLyoqIFRhc2sgbW9kZWwgKi9cclxuZXhwb3J0IGNsYXNzIFRhc2sgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkPzogbnVtYmVyO1xyXG4gIC8qKiBuYW1lICovICBcclxuICBwdWJsaWMgbmFtZT86IHN0cmluZztcclxuICAvKiogb3JkZXIqL1xyXG4gIHB1YmxpYyBvcmRlcj86IE51bWJlcjtcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlPzogYW55O1xyXG4gIC8qKiB0YXNrIGdyb3VwKi9cclxuICBwdWJsaWMgZ3JvdXA/OiBUYXNrR3JvdXA7XHJcbiAgLyoqIHRhc2sgdHlwZSovXHJcbiAgcHVibGljIHR5cGU/OiBUYXNrVHlwZTtcclxuICAvKiogdGFzayBVSSovXHJcbiAgcHVibGljIHVpPzogVGFza1VJO1xyXG4gIC8qKiBwYXJhbWV0ZXJzKi9cclxuICBwdWJsaWMgcGFyYW1ldGVycz86IFRhc2tQYXJhbWV0ZXJbXTtcclxuICAvKiogY29ubmVjdGlvbiovXHJcbiAgcHVibGljIGNvbm5lY3Rpb24/OiBDb25uZWN0aW9uO1xyXG4gIC8qKiByb2xlcyovXHJcbiAgcHVibGljIHJvbGVzPzogUm9sZVtdO1xyXG4gIC8qKiBhdmFpbGFiaWxpdGllcyovXHJcbiAgcHVibGljIGF2YWlsYWJpbGl0aWVzPzogVGFza0F2YWlsYWJpbGl0eVtdO1xyXG5cclxuICBwdWJsaWMgY2FydG9ncmFwaHk/OiBDYXJ0b2dyYXBoeTtcclxuXHJcbiAgcHVibGljIHNlcnZpY2U/OiBTZXJ2aWNlO1xyXG5cclxuICBwdWJsaWMgcHJvcGVydGllcz87XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4vdGFzay5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGFzaz4ge1xyXG5cclxuICAgIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gICAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gJ3Rhc2tzJztcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICAgICAgc3VwZXIoVGFzaywgXCJ0YXNrc1wiLCBpbmplY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHJlbW92ZSB0YXNrKi9cclxuICAgIHJlbW92ZShpdGVtOiBUYXNrKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHNhdmUgdGFzayovXHJcbiAgICBzYXZlKGl0ZW06IFRhc2spOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW0uX2xpbmtzICE9IG51bGwpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghaXRlbS5zZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VydmljZTphbnkgPSB7fVxyXG4gICAgICAgICAgICAgICAgc2VydmljZS5fbGlua3MgPSB7fTtcclxuICAgICAgICAgICAgICAgIHNlcnZpY2UuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgICAgICAgICAgICAgIHNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdzZXJ2aWNlJywgc2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7IFxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZj1pdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZi5zcGxpdChcIntcIilbMF1cclxuICAgICAgICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzZXJ2aWNlJywgaXRlbS5zZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uc2VydmljZSA9IGl0ZW0uc2VydmljZS5fbGlua3Muc2VsZi5ocmVmXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFpdGVtLmNhcnRvZ3JhcGh5KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FydG9ncmFwaHk6YW55ID0ge31cclxuICAgICAgICAgICAgICAgIGNhcnRvZ3JhcGh5Ll9saW5rcyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignY2FydG9ncmFwaHknLCBjYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7IFxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY9aXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmLnNwbGl0KFwie1wiKVswXVxyXG4gICAgICAgICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JywgaXRlbS5jYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghaXRlbS5jb25uZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29ubmVjdGlvbjphbnkgPSB7fVxyXG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbi5fbGlua3MgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24uX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdjb25uZWN0aW9uJywgY29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7IFxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZj1pdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZi5zcGxpdChcIntcIilbMF1cclxuICAgICAgICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjb25uZWN0aW9uJywgaXRlbS5jb25uZWN0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY29ubmVjdGlvbiA9IGl0ZW0uY29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghaXRlbS51aSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaXRlbS5kZWxldGVSZWxhdGlvbigndWknLCBpdGVtLnVpKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgXHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0udWkuX2xpbmtzLnNlbGYuaHJlZj1pdGVtLnVpLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndWknLCBpdGVtLnVpKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0udWkgPSBpdGVtLnVpLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFpdGVtLmdyb3VwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdncm91cCcsIGl0ZW0uZ3JvdXApLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ncm91cC5fbGlua3Muc2VsZi5ocmVmPWl0ZW0uZ3JvdXAuX2xpbmtzLnNlbGYuaHJlZi5zcGxpdChcIntcIilbMF1cclxuICAgICAgICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdncm91cCcsIGl0ZW0uZ3JvdXApLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ncm91cCA9IGl0ZW0uZ3JvdXAuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0udHlwZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaXRlbS5kZWxldGVSZWxhdGlvbigndHlwZScsIGl0ZW0udHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7IFxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnR5cGUuX2xpbmtzLnNlbGYuaHJlZj1pdGVtLnR5cGUuX2xpbmtzLnNlbGYuaHJlZi5zcGxpdChcIntcIilbMF1cclxuICAgICAgICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0eXBlJywgaXRlbS50eXBlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0udHlwZSA9IGl0ZW0udHlwZS5fbGlua3Muc2VsZi5ocmVmXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTsgICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZihpdGVtLmNhcnRvZ3JhcGh5KXtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLmNvbm5lY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnNlcnZpY2Upe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZXJ2aWNlID0gaXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnVpKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0udWkgPSBpdGVtLnVpLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLmdyb3VwKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAgPSBpdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnR5cGUpe1xyXG4gICAgICAgICAgICAgICAgaXRlbS50eXBlID0gaXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1R5cGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2tUeXBlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrVHlwZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrVHlwZT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRhc2tUeXBlLCBcInRhc2stdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgdHlwZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRhc2tUeXBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayB0eXBlKi9cclxuICBzYXZlKGl0ZW06IFRhc2tUeXBlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayBncm91cCBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRhc2tHcm91cCB9IGZyb20gJy4vdGFzay1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgZ3JvdXAgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrR3JvdXA+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gJ3Rhc2stZ3JvdXBzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza0dyb3VwLCBcInRhc2stZ3JvdXBzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0YXNrIGdyb3VwKi9cclxuICByZW1vdmUoaXRlbTogVGFza0dyb3VwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBncm91cCovXHJcbiAgc2F2ZShpdGVtOiBUYXNrR3JvdXApOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VGFza30gZnJvbSAnLi90YXNrLm1vZGVsJzsgIFxyXG4vKipcclxuICogVGFzayBwYXJhbWV0ZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrUGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBvcmRlciovICBcclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjtcclxuICBcclxuICAvKiogdGFzayovICBcclxuICBwdWJsaWMgdGFzazpUYXNrO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrUGFyYW1ldGVyIH0gZnJvbSAnLi90YXNrLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgVGFza1BhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrUGFyYW1ldGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUQVNLX1BBUkFNRVRFUl9BUEkgPSAndGFzay1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza1BhcmFtZXRlciwgXCJ0YXNrLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogVGFza1BhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IFRhc2tQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnRhc2sgPSBpdGVtLnRhc2suX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UQVNLX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3Rhc2subW9kZWwnO1xyXG4vKipcclxuICogVGFzayBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrQXZhaWxhYmlsaXR5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiB0ZXJyaXRvcnkqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICAvKiogdGFzayovXHJcbiAgcHVibGljIHRhc2s6IFRhc2s7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza0F2YWlsYWJpbGl0eSB9IGZyb20gJy4vdGFzay1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIGF2YWlsYWJpbGl0eSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIFRhc2tBdmFpbGFiaWxpdHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGFza0F2YWlsYWJpbGl0eT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEFTS19BVkFJTEFCSUxJVFlfQVBJID0gJ3Rhc2stYXZhaWxhYmlsaXRpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrQXZhaWxhYmlsaXR5LCBcInRhc2stYXZhaWxhYmlsaXRpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICByZW1vdmUoaXRlbTogVGFza0F2YWlsYWJpbGl0eSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICBzYXZlKGl0ZW06IFRhc2tBdmFpbGFiaWxpdHkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS50YXNrID0gaXRlbS50YXNrLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEFTS19BVkFJTEFCSUxJVFlfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBUYXNrIFVJIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1VJIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0b29sdGlwKi8gIFxyXG4gIHB1YmxpYyB0b29sdGlwOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogb3JkZXIqLyBcclxuICBwdWJsaWMgb3JkZXI6IG51bWJlcjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1VJIH0gZnJvbSAnLi90YXNrLXVpLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBVSSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFza1VJU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tVST4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay11aXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrVUksIFwidGFzay11aXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgVUkqL1xyXG4gIHJlbW92ZShpdGVtOiBUYXNrVUkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0YXNrIFVJKi9cclxuICBzYXZlKGl0ZW06IFRhc2tVSSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHsgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBMYW5ndWFnZSB9IGZyb20gJy4vbGFuZ3VhZ2UubW9kZWwnO1xyXG5cclxuXHJcbi8qKiBUYXNrIG1vZGVsICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgZWxlbWVudDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIHRyYW5zbGF0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIGNvbHVtbiAqL1xyXG4gIHB1YmxpYyBjb2x1bW46IHN0cmluZztcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBsYW5ndWFnZTogTGFuZ3VhZ2U7XHJcblxyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFRyYW5zbGF0aW9uIH0gZnJvbSAnLi90cmFuc2xhdGlvbi5tb2RlbCc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRpb25TZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VHJhbnNsYXRpb24+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRSQU5TTEFUSU9OX0FQSSA9ICd0cmFuc2xhdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUcmFuc2xhdGlvbiwgXCJ0cmFuc2xhdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRyYW5zbGF0aW9uKi9cclxuICByZW1vdmUoaXRlbTogVHJhbnNsYXRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0cmFuc2xhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBUcmFuc2xhdGlvbik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IGxhbmd1YWdlOmFueSA9IHt9XHJcbiAgICBsYW5ndWFnZS5fbGlua3MgPSB7fTtcclxuICAgIGxhbmd1YWdlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICBsYW5ndWFnZS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuXHJcbiAgICBpZiAoaXRlbS5sYW5ndWFnZSAhPSBudWxsKSB7XHJcbiAgICAgIGxhbmd1YWdlID0gaXRlbS5sYW5ndWFnZTtcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtLmxhbmd1YWdlLl9saW5rcyAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGl0ZW0ubGFuZ3VhZ2UgPSBpdGVtLmxhbmd1YWdlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH0gXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIGRlbGV0ZSBpdGVtLmxhbmd1YWdlO1xyXG4gICAgICAvLyBpZiAobGFuZ3VhZ2UuX2xpbmtzLnNlbGYuaHJlZiA9PSAnJykge1xyXG4gICAgICAvLyAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2xhbmd1YWdlJywgbGFuZ3VhZ2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAvLyAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuXHJcbiAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgIC8vICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2xhbmd1YWdlJywgbGFuZ3VhZ2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAvLyAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgLy8gfVxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRSQU5TTEFUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuXHJcbi8qKiBUYXNrIG1vZGVsICovXHJcbmV4cG9ydCBjbGFzcyBMYW5ndWFnZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBzaG9ydG5hbWU6IHN0cmluZztcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IExhbmd1YWdlIH0gZnJvbSAnLi9sYW5ndWFnZS5tb2RlbCc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTGFuZ3VhZ2VTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8TGFuZ3VhZ2U+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIExBTkdVQUdFU19BUEkgPSAnbGFuZ3VhZ2VzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoTGFuZ3VhZ2UsIFwibGFuZ3VhZ2VzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmFuc2xhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IExhbmd1YWdlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdHJhbnNsYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogTGFuZ3VhZ2UpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuTEFOR1VBR0VTX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0Nvbm5lY3Rpb259IGZyb20gJy4uL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7U2VydmljZVBhcmFtZXRlcn0gZnJvbSAnLi9zZXJ2aWNlLXBhcmFtZXRlci5tb2RlbCc7XHJcbi8qKlxyXG4gKiBTZXJ2aWNlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2VydmljZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG5cclxuICAvKiogdXJsKi8gIFxyXG4gIHB1YmxpYyBzZXJ2aWNlVVJMOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBwcm9qZWN0aW9ucyovICBcclxuICBwdWJsaWMgc3VwcG9ydGVkU1JTOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGxlZ2VuZCovXHJcbiAgcHVibGljIGxlZ2VuZDogc3RyaW5nO1xyXG5cclxuICAvKiogaW5mb1VybCovICBcclxuICBwdWJsaWMgaW5mb1VybDogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuXHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xyXG4gIFxyXG4gIC8qKiBwYXJhbWV0ZXJzKi8gIFxyXG4gIHB1YmxpYyBwYXJhbWV0ZXJzOiBTZXJ2aWNlUGFyYW1ldGVyW107XHJcblxyXG4gIC8qKiB3aGV0aGVyIHNlcnZpY2UgaXMgYmxvY2tlZCovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0IHsgU2VydmljZSB9IGZyb20gJy4vc2VydmljZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8U2VydmljZT4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgU0VSVklDRV9BUEkgPSAnc2VydmljZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihTZXJ2aWNlLCBcInNlcnZpY2VzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBzZXJ2aWNlKi9cclxuICByZW1vdmUoaXRlbTogU2VydmljZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UqL1xyXG4gIHNhdmUoaXRlbTogU2VydmljZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBsZXQgc2VydmljZUNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb247XHJcblxyXG4gICAgaWYgKGl0ZW0uY29ubmVjdGlvbiE9bnVsbCl7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uY29ubmVjdGlvbiA9IGl0ZW0uY29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcz0ge307XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICAvKmRlbGV0ZSBpdGVtLmNvbm5lY3Rpb247ICAgICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChzZXJ2aWNlQ29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmPT0nJyl7XHJcbiAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2Nvbm5lY3Rpb24nLHNlcnZpY2VDb25uZWN0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgIFxyXG5cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY29ubmVjdGlvbicsc2VydmljZUNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICBcclxuXHJcbiAgICAgIFxyXG4gICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7ICAgICAgICAgICBcclxuICAgICAgIH0gKi9cclxuICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG5cclxuICAgICAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuU0VSVklDRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2UubW9kZWwnOyBcclxuLyoqXHJcbiAqIFNlcnZpY2UgcGFyYW1ldGVyIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2VydmljZVBhcmFtZXRlciBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiB2YWx1ZSovICBcclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICBcclxuICAvKiogc2VydmljZSovXHJcbiAgcHVibGljIHNlcnZpY2U6IFNlcnZpY2U7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFNlcnZpY2VQYXJhbWV0ZXIgfSBmcm9tICcuL3NlcnZpY2UtcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogU2VydmljZSBwYXJhbWV0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlUGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFNlcnZpY2VQYXJhbWV0ZXI+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFNFUlZJQ0VfUEFSQU1FVEVSX0FQSSA9ICdzZXJ2aWNlLXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihTZXJ2aWNlUGFyYW1ldGVyLCBcInNlcnZpY2UtcGFyYW1ldGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBTZXJ2aWNlUGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHNhdmUoaXRlbTogU2VydmljZVBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoaXRlbS5zZXJ2aWNlICE9bnVsbCl7XHJcbiAgICAgICAgICBsZXQgc2VydmljZSA9ICBpdGVtLnNlcnZpY2U7XHJcbiAgICAgICAgICBkZWxldGUgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NlcnZpY2UnLHNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uc2VydmljZSA9IGl0ZW0uc2VydmljZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlNFUlZJQ0VfUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1NlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2Uvc2VydmljZS5tb2RlbCc7XHJcbmltcG9ydCB7Q29ubmVjdGlvbn0gZnJvbSAnLi4vY29ubmVjdGlvbi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZSA6IHN0cmluZztcclxuXHJcbiAgLyoqIHNlcnZpY2UqL1xyXG4gIHB1YmxpYyBzZXJ2aWNlIDogU2VydmljZTtcclxuXHJcbiAgLyoqIG9yZGVyKi8gIFxyXG4gIHB1YmxpYyBvcmRlcjogTnVtYmVyOyBcclxuXHJcbiAgLyoqIGRlc2NyaXB0aW9uKi8gIFxyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogU3RyaW5nO1xyXG5cclxuICAvKiogc291cmNlKi8gIFxyXG4gIHB1YmxpYyBzb3VyY2U6IFN0cmluZztcclxuXHJcbiAgLyoqIHdoZXRoZXIgY2FydG9ncmFwaHkgaXMgYmxvY2tlZCovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47ICBcclxuXHJcbiAgLyoqIGFwcGx5IGZpbHRlciB0byBnZXQgbWFwKi9cclxuICBwdWJsaWMgYXBwbHlGaWx0ZXJUb0dldE1hcDogU3RyaW5nOyAgXHJcblxyXG4gIC8qKiBhcHBseSBmaWx0ZXIgdG8gZ2V0IGZlYXR1cmUgaW5mb3JtYXRpb24qL1xyXG4gIHB1YmxpYyBhcHBseUZpbHRlclRvR2V0RmVhdHVyZUluZm86IGJvb2xlYW47ICBcclxuXHJcbiAgLyoqIGFwcGx5IGZpbHRlciB0byBzcGF0aWFsIHNlbGVjdGlvbiovXHJcbiAgcHVibGljIGFwcGx5RmlsdGVyVG9TcGF0aWFsU2VsZWN0aW9uOiBib29sZWFuOyAgXHJcblxyXG4gIC8qKiBzZWxlY3RhYmxlIGxheWVycyovXHJcbiAgcHVibGljIHNlbGVjdGFibGVMYXllcnM6IHN0cmluZ1tdO1xyXG5cclxuICAvKiogdHJhbnNwYXJlbmN5Ki8gXHJcbiAgcHVibGljIHRyYW5zcGFyZW5jeTogTnVtYmVyO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBxdWVyeWFibGUqLyAgXHJcbiAgcHVibGljIHF1ZXJ5YWJsZTogQm9vbGVhbjtcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgcXVlcnlhYmxlKi8gXHJcbiAgcHVibGljIHF1ZXJ5QWN0OiBCb29sZWFuO1xyXG5cclxuICAvKiogcXVlcnkgbGF5ZXIqL1xyXG4gIHB1YmxpYyBxdWVyeUxheTogc3RyaW5nO1xyXG5cclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcblxyXG4gIC8qKiBtaW5pbXVtIHNjYWxlKi9cclxuICBwdWJsaWMgbWluaW11bVNjYWxlOiBOdW1iZXI7XHJcblxyXG4gIC8qKiBtYXhpbXVtIHNjYWxlKi9cclxuICBwdWJsaWMgbWF4aW11bVNjYWxlOiBOdW1iZXI7XHJcblxyXG4gIC8qKiBsYXllcnMqLyAgXHJcbiAgcHVibGljIGxheWVyczogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBjb25uZWN0aW9uKi9cclxuICBwdWJsaWMgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcclxuXHJcbiAgLyoqIHF1ZXJ5YWJsZUZlYXR1cmVFbmFibGVkICovXHJcbiAgcHVibGljIHF1ZXJ5YWJsZUZlYXR1cmVFbmFibGVkOiBCb29sZWFuO1xyXG5cclxuICAgIC8qKiBxdWVyeWFibGVMYXllcnMgKi9cclxuICBwdWJsaWMgcXVlcnlhYmxlRmVhdHVyZUF2YWlsYWJsZTogQm9vbGVhbjtcclxuXHJcbiAgICAvKiogcXVlcnlhYmxlTGF5ZXJzICovXHJcbiAgcHVibGljIHF1ZXJ5YWJsZUxheWVyczogc3RyaW5nW107XHJcblxyXG4gIC8qKiBhdmFpbGFiaWxpdGllcyovXHJcbiAgcHVibGljIGF2YWlsYWJpbGl0aWVzIDogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHlbXTtcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgcXVlcnlhYmxlKi8gXHJcbiAgcHVibGljIHNlbGVjdGFibGVGZWF0dXJlRW5hYmxlZDogQm9vbGVhbjtcclxuXHJcbiAgLyoqIHNlbGVjdGlvbiBsYXllciovXHJcbiAgcHVibGljIHNlbGVjdGlvbkxheWVyOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBzZWxlY3Rpb24gc2VydmljZSovICBcclxuICBwdWJsaWMgc2VsZWN0aW9uU2VydmljZTogU2VydmljZTtcclxuXHJcbiAgLyoqIGxlZ2VuZCB0aXAqLyAgXHJcbiAgcHVibGljIGxlZ2VuZFR5cGU6IHN0cmluZztcclxuICBcclxuICAvKiogbGVnZW5kIHVybCovXHJcbiAgcHVibGljIGxlZ2VuZFVSTDogc3RyaW5nO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBlZGl0YWJsZSovXHJcbiAgcHVibGljIGVkaXRhYmxlOiBCb29sZWFuO1xyXG5cclxuICAvKiogbWV0YWRhdGEgVVJMKi9cclxuICBwdWJsaWMgbWV0YWRhdGFVUkw6IHN0cmluZztcclxuXHJcbiAgLyoqIG1ldGFkYXRhIFVSTCovXHJcbiAgcHVibGljIGRhdGFzZXRVUkw6IHN0cmluZztcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgdGhlbWFibGUqL1xyXG4gIHB1YmxpYyB0aGVtYXRpYzogQm9vbGVhbjtcclxuICBcclxuICAvKiogZ2VvbWV0cnkgdHlwZSovXHJcbiAgcHVibGljIGdlb21ldHJ5VHlwZTogc3RyaW5nO1xyXG4gIFxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFJlc3RTZXJ2aWNlIH0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi4vY29ubmVjdGlvbi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2Uvc2VydmljZS5tb2RlbCc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5PiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9BUEkgPSAnY2FydG9ncmFwaGllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeSwgXCJjYXJ0b2dyYXBoaWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IGNhcnRvZ3JhcGh5Q29ubmVjdGlvbjphbnk9e307XHJcbiAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuICAgICBcclxuICAgIGxldCBjYXJ0b2dyYXBoeVNlcnZpY2U6YW55PXt9O1xyXG4gICAgY2FydG9ncmFwaHlTZXJ2aWNlLl9saW5rcyA9IHt9O1xyXG4gICAgY2FydG9ncmFwaHlTZXJ2aWNlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcbiAgICBcclxuICAgIGxldCBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2U6YW55ID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UuX2xpbmtzID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuXHJcbiAgICBpZiAoaXRlbS5zZXJ2aWNlICE9IG51bGwpIHtcclxuICAgICAgY2FydG9ncmFwaHlTZXJ2aWNlPSAgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uc2VydmljZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLnNlbGVjdGlvblNlcnZpY2UgIT0gbnVsbCkge1xyXG4gICAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UgPSBpdGVtLnNlbGVjdGlvblNlcnZpY2VcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtLnNlbGVjdGlvblNlcnZpY2UuX2xpbmtzICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgaXRlbS5zZWxlY3Rpb25TZXJ2aWNlID0gaXRlbS5zZWxlY3Rpb25TZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5jb25uZWN0aW9uICE9IG51bGwpIHtcclxuICAgICAgY2FydG9ncmFwaHlDb25uZWN0aW9uPSAgaXRlbS5jb25uZWN0aW9uO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uY29ubmVjdGlvbi5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLmNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcblxyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uY29ubmVjdGlvbjtcclxuICAgICAgZGVsZXRlIGl0ZW0uc2VydmljZTtcclxuICAgICAgZGVsZXRlIGl0ZW0uc2VsZWN0aW9uU2VydmljZTtcclxuXHJcbiAgICAgIC8vIGlmIChjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZiA9PSAnJyAmJiBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24pIHtcclxuICAgICAgLy8gICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdzcGF0aWFsU2VsZWN0aW9uQ29ubmVjdGlvbicsIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIC8vICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAvLyAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzcGF0aWFsU2VsZWN0aW9uQ29ubmVjdGlvbicsIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIC8vICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAvLyB9XHJcblxyXG4gICAgICBpZiAoY2FydG9ncmFwaHlTZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYgPT0gJycpIHtcclxuICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdzZXJ2aWNlJywgY2FydG9ncmFwaHlTZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NlcnZpY2UnLCBjYXJ0b2dyYXBoeVNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZS5fbGlua3Muc2VsZi5ocmVmID09ICcnICYmIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZSkge1xyXG4gICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3NwYXRpYWxTZWxlY3Rpb25TZXJ2aWNlJywgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NwYXRpYWxTZWxlY3Rpb25TZXJ2aWNlJywgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0FQSSksIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHtSb2xlfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHkgZ3JvdXBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUdyb3VwIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgLyoqIG1lbWJlcnMqL1xyXG4gIHB1YmxpYyBtZW1iZXJzOiBDYXJ0b2dyYXBoeVtdO1xyXG4gIC8qKiByb2xlcyovXHJcbiAgcHVibGljIHJvbGVzOiBSb2xlW107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5R3JvdXAgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHlHcm91cCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlHcm91cFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeUdyb3VwPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9HUk9VUF9BUEkgPSdjYXJ0b2dyYXBoeS1ncm91cHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeUdyb3VwLCBcImNhcnRvZ3JhcGh5LWdyb3Vwc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkgZ3JvdXAqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUdyb3VwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY2FydG9ncmFwaHkgZ3JvdXAqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlHcm91cCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9HUk9VUF9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogdGVycml0b3J5Ki9cclxuICBwdWJsaWMgdGVycml0b3J5OiBUZXJyaXRvcnk7XHJcbiAgXHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIFxyXG4gIC8qKiBjYXJ0b2dyYXBoeSovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSB9IGZyb20gJy4vY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfQVZBSUxBQklMSVRZX0FQSSA9ICdjYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdGllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5LCBcImNhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0aWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxpdGVtLmNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0FWQUlMQUJJTElUWV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5VHlwZSB9IGZyb20gJy4uL3RlcnJpdG9yeS90ZXJyaXRvcnktdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUZpbHRlciBleHRlbmRzIFJlc291cmNlIHtcclxuIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogcmVxdWlyZWQgKi9cclxuICBwdWJsaWMgcmVxdWlyZWQ6IGJvb2xlYW47XHJcblxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG5cclxuICAvKiogVGVycml0b3JpYWwgbGV2ZWwuICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsTGV2ZWw6IFRlcnJpdG9yeVR5cGU7XHJcbiAgXHJcbiAgLyoqIGNvbHVtbiAqL1xyXG4gIHB1YmxpYyBjb2x1bW46IHN0cmluZztcclxuXHJcbiAgLyoqIHZhbHVlcyovICBcclxuICBwdWJsaWMgdmFsdWVzOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB2YWx1ZSovICBcclxuICBwdWJsaWMgdmFsdWVUeXBlOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBjYXJ0b2dyYXBoeSovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5RmlsdGVyIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1maWx0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDYXJ0b2dyYXBoeUZpbHRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5RmlsdGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5RmlsdGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9GSUxURVJfQVBJID0gJ2NhcnRvZ3JhcGh5LWZpbHRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeUZpbHRlciwgXCJjYXJ0b2dyYXBoeS1maWx0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBmaWx0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUZpbHRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUZpbHRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxpdGVtLmNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZihpdGVtLnRlcnJpdG9yaWFsTGV2ZWwgIT0gbnVsbCAmJiBpdGVtLnRlcnJpdG9yaWFsTGV2ZWwgIT0gdW5kZWZpbmVkICl7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3RlcnJpdG9yaWFsTGV2ZWwnLGl0ZW0udGVycml0b3JpYWxMZXZlbCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBcclxuICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS50ZXJyaXRvcmlhbExldmVsPWl0ZW0udGVycml0b3JpYWxMZXZlbC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9GSUxURVJfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHl9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnOyBcclxuLyoqXHJcbiAqIFNlcnZpY2UgcGFyYW1ldGVyIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlQYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqLyAgXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIG9yZGVyKi8gIFxyXG4gIHB1YmxpYyBvcmRlcjogc3RyaW5nO1xyXG5cclxuICAvKiogY2FydG9ncmFwaHkqL1xyXG4gIHB1YmxpYyBjYXJ0b2dyYXBoeTogQ2FydG9ncmFwaHk7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5UGFyYW1ldGVyIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBTZXJ2aWNlIHBhcmFtZXRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5UGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5UGFyYW1ldGVyPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9QQVJBTUVURVJfQVBJID0gJ2NhcnRvZ3JhcGh5LXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeVBhcmFtZXRlciwgXCJjYXJ0b2dyYXBoeS1wYXJhbWV0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5UGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGxldCBjYXJ0b2dyYXBoeSA9ICBpdGVtLmNhcnRvZ3JhcGh5O1xyXG4gICAgICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY2FydG9ncmFwaHknLGNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUdyb3VwfSBmcm9tICcuL2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuLyoqXHJcbiAqIEJhY2tncm91bmQgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBCYWNrZ3JvdW5kIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBkZXNjcmlwdGlvbiovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBpbWFnZSAqL1xyXG4gIHB1YmxpYyBpbWFnZTogc3RyaW5nO1xyXG5cclxuICAvKiogd2hldGhlciBiYWNrZ3JvdW5kIGlzIGFjdGl2ZSovXHJcbiAgcHVibGljIGFjdGl2ZTogQm9vbGVhbjtcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcblxyXG4gIC8qKiBjYXJ0b2dyYXBoeSBncm91cCovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5R3JvdXA6IENhcnRvZ3JhcGh5R3JvdXA7XHJcbn1cclxuIiwiaW1wb3J0IHsgQmFja2dyb3VuZCB9IGZyb20gJy4vYmFja2dyb3VuZC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIEJhY2tncm91bmQgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEJhY2tncm91bmRTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QmFja2dyb3VuZD4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQkFDS0dST1VORF9BUEkgPSAnYmFja2dyb3VuZHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihCYWNrZ3JvdW5kLCBcImJhY2tncm91bmRzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBiYWNrZ3JvdW5kKi9cclxuICByZW1vdmUoaXRlbTogQmFja2dyb3VuZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTsgICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYmFja2dyb3VuZCovXHJcbiAgc2F2ZShpdGVtOiBCYWNrZ3JvdW5kKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGxldCBiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cDphbnkgPSB7fSAgICAgICAgIFxyXG4gICAgXHJcbiAgICBiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cC5fbGlua3M9IHt9O1xyXG4gICAgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgIGl0ZW0uY2FydG9ncmFwaHlHcm91cDtcclxuXHJcbiAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeUdyb3VwIT1udWxsKXtcclxuICAgICAgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAgPSBpdGVtLmNhcnRvZ3JhcGh5R3JvdXA7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLmNhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uY2FydG9ncmFwaHlHcm91cCA9IGl0ZW0uY2FydG9ncmFwaHlHcm91cC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHlHcm91cDsgICAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmLmhyZWY9PScnKXtcclxuICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignY2FydG9ncmFwaHlHcm91cCcsYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXApLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgXHJcblxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeUdyb3VwJyxiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgIFxyXG5cclxuICAgICAgXHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgICAgICAgICAgIFxyXG4gICAgICAgfSBcclxuICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG5cclxuICAgICAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQkFDS0dST1VORF9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtUcmVlTm9kZX0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xyXG5pbXBvcnQge1JvbGV9IGZyb20gJy4uL3JvbGUvcm9sZS5tb2RlbCc7ICAgIFxyXG4vKipcclxuICogVHJlZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRyZWUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBkZXNjcmlwdGlvbiAqL1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIC8qKiBpbWFnZSAqL1xyXG4gIHB1YmxpYyBpbWFnZTogc3RyaW5nO1xyXG4gIC8qKiBub2RlcyAqL1xyXG4gIHB1YmxpYyBub2RlczogVHJlZU5vZGVbXTtcclxuICAvKiogYXZhaWxhYmxlIHJvbGVzICovXHJcbiAgcHVibGljIGF2YWlsYWJsZVJvbGVzIDogUm9sZVtdO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUcmVlIH0gZnJvbSAnLi90cmVlLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVHJlZSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVHJlZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUcmVlPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRSRUVfQVBJID0gJ3RyZWVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVHJlZSwgXCJ0cmVlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdHJlZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRyZWUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0cmVlKi9cclxuICBzYXZlKGl0ZW06IFRyZWUpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRSRUVfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHl9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHtUcmVlfSBmcm9tICcuL3RyZWUubW9kZWwnO1xyXG4vKipcclxuICogVHJlZSBub2RlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJlZU5vZGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0b29sdGlwKi9cclxuICBwdWJsaWMgdG9vbHRpcDogc3RyaW5nO1xyXG4gIC8qKiBkZXNjcmlwdGlvbiovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIGRhdGFzZXRVUkwqL1xyXG4gIHB1YmxpYyBkYXRhc2V0VVJMOiBzdHJpbmc7XHJcbiAgLyoqIG1ldGFkYXRhVVJMKi9cclxuICBwdWJsaWMgbWV0YWRhdGFVUkw6IHN0cmluZztcclxuICAvKiogb3JkZXIqL1xyXG4gIHB1YmxpYyBvcmRlciA6IG51bWJlcjtcclxuICAvKiogd2hldGhlciB0cmVlIG5vZGUgaXMgYWN0aXZlKi9cclxuICBwdWJsaWMgYWN0aXZlOiBib29sZWFuO1xyXG4gIC8qKiBwYXJlbnQgdHJlZSBub2RlICovXHJcbiAgcHVibGljIHJhZGlvOiBib29sZWFuO1xyXG4gIC8qKiBwYXJlbnQgdHJlZSBub2RlICovXHJcbiAgcHVibGljIHBhcmVudDogVHJlZU5vZGU7XHJcbiAgLyoqIGRpc3BsYXllZCBjYXJ0b2dyYXBoeSAqLyAgXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuICAvKiogdHJlZSAqLyAgXHJcbiAgcHVibGljIHRyZWU6IFRyZWU7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUcmVlIG5vZGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBUcmVlTm9kZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUcmVlTm9kZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUUkVFX05PREVfQVBJID0gJ3RyZWUtbm9kZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUcmVlTm9kZSwgXCJ0cmVlLW5vZGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmVlIG5vZGUqL1xyXG4gIHJlbW92ZShpdGVtOiBUcmVlTm9kZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRyZWUgbm9kZSovXHJcbiAgc2F2ZShpdGVtOiBUcmVlTm9kZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgY29uc3QgaXRlbVRyZWUgPSBpdGVtLnRyZWU7XHJcbiAgICAgIGNvbnN0IGl0ZW1DYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgIGNvbnN0IGl0ZW1QYXJlbnQgPSBpdGVtLnBhcmVudDtcclxuICAgICAgICBcclxuICAgICAgZGVsZXRlIGl0ZW0udHJlZTtcclxuICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgIGRlbGV0ZSBpdGVtLnBhcmVudDtcclxuICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbVRyZWUgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0cmVlJyxpdGVtVHJlZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtQ2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsaXRlbUNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW1QYXJlbnQgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdwYXJlbnQnLGl0ZW1QYXJlbnQpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgICAgbGV0IHRyZWVOb2RlUGFyZW50OmFueSA9IHt9O1xyXG4gICAgICAgICAgdHJlZU5vZGVQYXJlbnQuX2xpbmtzPSB7fTtcclxuICAgICAgICAgIHRyZWVOb2RlUGFyZW50Ll9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICB0cmVlTm9kZVBhcmVudC5fbGlua3Muc2VsZi5ocmVmPVwiXCI7XHJcbiAgICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdwYXJlbnQnLCB0cmVlTm9kZVBhcmVudCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGl0ZW0udHJlZSAmJiBpdGVtLnRyZWUuX2xpbmtzICYmIGl0ZW0udHJlZS5fbGlua3Muc2VsZikge1xyXG4gICAgICAgIGl0ZW0udHJlZSA9IGl0ZW0udHJlZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLmNhcnRvZ3JhcGh5ICYmIGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzICYmIGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYpIHtcclxuICAgICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9ICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVFJFRV9OT0RFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1RyZWV9IGZyb20gJy4uL3RyZWUvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Um9sZX0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUdyb3VwfSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25QYXJhbWV0ZXJ9IGZyb20gJy4vYXBwbGljYXRpb24tcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbkJhY2tncm91bmR9IGZyb20gJy4vYXBwbGljYXRpb24tYmFja2dyb3VuZC5tb2RlbCc7XHJcblxyXG4vL0ZJWE1FIGVuc3VyZSBhcHBsaWNhdGlvbiBjcmVhdGlvbiBpbiBhZG1pbiBhcHAgdXBvbiBpbml0aWFsaXphdGlvbiAoYXMgaXQgaXMgZG9uZSB3aXRoIFJvbGVzIGFuZCBkZWZhdWx0IFVzZXJzKVxyXG4vKiogVGVycml0b3JpYWwgYXBwbGljdGlvbiBuYW1lICovXHJcbmV4cG9ydCBjb25zdCBURVJSSVRPUklBTF9BUFBfTkFNRTpzdHJpbmcgID0gXCJBcGxpY2FjacODwrNuIFRlcnJpdG9yaWFsXCI7XHJcblxyXG4vKipcclxuICogQXBwbGljYXRpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICBcclxuICAvKiogdGl0bGUqL1xyXG4gIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0aGVtZSovXHJcbiAgcHVibGljIHRoZW1lOiBzdHJpbmc7XHJcblxyXG4gICAgXHJcbiAgLyoqIHVybFRlbXBsYXRlKi9cclxuICBwdWJsaWMganNwVGVtcGxhdGU6IHN0cmluZztcclxuICBcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgXHJcbiAgLyoqIGF2YWlsYWJsZSByb2xlcyovXHJcbiAgcHVibGljIGF2YWlsYWJsZVJvbGVzIDogUm9sZVtdO1xyXG4gIFxyXG4gIC8qKiB0cmVlcyovXHJcbiAgcHVibGljIHRyZWVzIDogVHJlZVtdO1xyXG4gIFxyXG4gIC8qKiBzY2FsZXMgKGNvbW1hLXNlcGFyYXRlZCB2YWx1ZXMpKi9cclxuICBwdWJsaWMgc2NhbGVzOiBzdHJpbmdbXTtcclxuICBcclxuICAvKiogcHJvamVjdGlvbnMoY29tbWEtc2VwYXJhdGVkIEVQU0cgY29kZXMpKi9cclxuICBwdWJsaWMgc3JzOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHdoZXRoZXIgYXBwbGljYXRpb24gdHJlZSB3aWxsIGF1dG8gcmVmcmVzaCovICBcclxuICBwdWJsaWMgdHJlZUF1dG9SZWZyZXNoOiBCb29sZWFuO1xyXG5cclxuICAvKiogYmFja2dyb3VuZHMqL1xyXG4gIHB1YmxpYyBiYWNrZ3JvdW5kczogQXBwbGljYXRpb25CYWNrZ3JvdW5kW107XHJcblxyXG4gIC8qKiBzaXR1YXRpb24gbWFwKi9cclxuICBwdWJsaWMgc2l0dWF0aW9uTWFwOiBDYXJ0b2dyYXBoeUdyb3VwOyAgICBcclxuICBcclxuICAvKiogcGFyYW1ldGVycyovXHJcbiAgcHVibGljIHBhcmFtZXRlcnM6IEFwcGxpY2F0aW9uUGFyYW1ldGVyW107XHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICcuL2FwcGxpY2F0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5R3JvdXAgfSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbCc7XHJcblxyXG4vKiogQXBwbGljYXRpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEFwcGxpY2F0aW9uPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUFBMSUNBVElPTl9BUEkgPSAnYXBwbGljYXRpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQXBwbGljYXRpb24sIFwiYXBwbGljYXRpb25zXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBhcHBsaWNhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IEFwcGxpY2F0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYXBwbGljYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogQXBwbGljYXRpb24pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG5cclxuICAgIGxldCBhcHBsaWNhdGlvblNpdHVhdGlvbk1hcDphbnkgPSB7fTtcclxuICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcz0ge307XHJcbiAgICBhcHBsaWNhdGlvblNpdHVhdGlvbk1hcC5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgYXBwbGljYXRpb25TaXR1YXRpb25NYXAuX2xpbmtzLnNlbGYuaHJlZj1cIlwiO1xyXG4gICAgIFxyXG4gICAgaWYgKGl0ZW0uc2l0dWF0aW9uTWFwIT1udWxsKXtcclxuICAgICAgICBhcHBsaWNhdGlvblNpdHVhdGlvbk1hcD1pdGVtLnNpdHVhdGlvbk1hcDtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW0uc2l0dWF0aW9uTWFwLl9saW5rcyE9ICd1bmRlZmluZWQnKSB7IFxyXG4gICAgICAgICAgICBpdGVtLnNpdHVhdGlvbk1hcCA9IGl0ZW0uc2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgICAgfSAgICAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5zaXR1YXRpb25NYXA7ICAgICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChhcHBsaWNhdGlvblNpdHVhdGlvbk1hcC5fbGlua3Muc2VsZi5ocmVmPT0nJyl7XHJcbiAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3NpdHVhdGlvbk1hcCcsYXBwbGljYXRpb25TaXR1YXRpb25NYXApLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgXHJcbiAgICAgICAgICAgICBcclxuICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgIFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NpdHVhdGlvbk1hcCcsYXBwbGljYXRpb25TaXR1YXRpb25NYXApLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICBcclxuICAgICAgXHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgICAgICAgICAgIFxyXG4gICAgICAgfSBcclxuICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG5cclxuICAgICAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQVBQTElDQVRJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgICBcclxuICAgIFxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0JhY2tncm91bmR9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2JhY2tncm91bmQubW9kZWwnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9ufSBmcm9tICcuL2FwcGxpY2F0aW9uLm1vZGVsJzsgXHJcblxyXG4vKipcclxuICogQXBwbGljYXRpb24gYmFja2dyb3VuZCBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uQmFja2dyb3VuZCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogb3JkZXIqL1xyXG4gIHB1YmxpYyBvcmRlcjogTnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBiYWNrZ3JvdW5kKi9cclxuICBwdWJsaWMgYmFja2dyb3VuZDogQmFja2dyb3VuZDtcclxuICBcclxuICAvKiogYXBwbGljYXRpb24qL1xyXG4gIHB1YmxpYyBhcHBsaWNhdGlvbjogQXBwbGljYXRpb247XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uQmFja2dyb3VuZCB9IGZyb20gJy4vYXBwbGljYXRpb24tYmFja2dyb3VuZC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIEFwcGxpY2F0aW9uIGJhY2tncm91bmQgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbkJhY2tncm91bmRTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QXBwbGljYXRpb25CYWNrZ3JvdW5kPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUFBMSUNBVElPTl9CQUNLR1JPVU5EX0FQSSA9J2FwcGxpY2F0aW9uLWJhY2tncm91bmRzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQXBwbGljYXRpb25CYWNrZ3JvdW5kLCBcImFwcGxpY2F0aW9uLWJhY2tncm91bmRzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBhcHBsaWNhdGlvbiBiYWNrZ3JvdW5kKi9cclxuICByZW1vdmUoaXRlbTogQXBwbGljYXRpb25CYWNrZ3JvdW5kKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYXBwbGljYXRpb24gYmFja2dyb3VuZCovXHJcbiAgc2F2ZShpdGVtOiBBcHBsaWNhdGlvbkJhY2tncm91bmQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0uYXBwbGljYXRpb24gIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdhcHBsaWNhdGlvbicsaXRlbS5hcHBsaWNhdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0uYmFja2dyb3VuZCAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2JhY2tncm91bmQnLGl0ZW0uYmFja2dyb3VuZCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmFwcGxpY2F0aW9uID0gaXRlbS5hcHBsaWNhdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLmJhY2tncm91bmQgPSBpdGVtLmJhY2tncm91bmQuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BUFBMSUNBVElPTl9CQUNLR1JPVU5EX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9ufSBmcm9tICcuL2FwcGxpY2F0aW9uLm1vZGVsJzsgXHJcblxyXG4vKipcclxuICogQXBwbGljYXRpb24gcGFyYW1ldGVyIG1vZGVsIFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uUGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB2YWx1ZSovICAgIFxyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBhcHBsaWNhdGlvbiovXHJcbiAgcHVibGljIGFwcGxpY2F0aW9uOiBBcHBsaWNhdGlvbjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb25QYXJhbWV0ZXIgfSBmcm9tICcuL2FwcGxpY2F0aW9uLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIEFwcGxpY2F0aW9uIHBhcmFtZXRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEFwcGxpY2F0aW9uUGFyYW1ldGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUFBMSUNBVElPTl9QQVJBTUVURVJfQVBJID0gJ2FwcGxpY2F0aW9uLXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihBcHBsaWNhdGlvblBhcmFtZXRlciwgXCJhcHBsaWNhdGlvbi1wYXJhbWV0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBhcHBsaWNhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IEFwcGxpY2F0aW9uUGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYXBwbGljYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogQXBwbGljYXRpb25QYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0uYXBwbGljYXRpb24gIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdhcHBsaWNhdGlvbicsaXRlbS5hcHBsaWNhdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmFwcGxpY2F0aW9uID0gaXRlbS5hcHBsaWNhdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFQUExJQ0FUSU9OX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIENvbm5lY3Rpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb2RlTGlzdCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIGNvZGVMaXN0TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICAvKiogdXNlciovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDb2RlTGlzdCB9IGZyb20gJy4vY29kZWxpc3QubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDb25uZWN0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb2RlTGlzdFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDb2RlTGlzdD4ge1xyXG4gIFxyXG4gXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPREVMSVNUX0FQSSA9ICdjb2RlbGlzdC12YWx1ZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDb2RlTGlzdCwgXCJjb2RlbGlzdC12YWx1ZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNvbm5lY3Rpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBDb2RlTGlzdCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNvbm5lY3Rpb24qL1xyXG4gIHNhdmUoaXRlbTogQ29kZUxpc3QpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPREVMSVNUX0FQSSApLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIExheWVyIG1vZGVsOiBjb25maWd1cmUgTGF5ZXIgZGF0YSBhbmQgZGlzcGxheWluZyBjb25maWd1cmF0aW9uICovIFxyXG5leHBvcnQgY2xhc3MgTGF5ZXIge1xyXG4gIC8vIERpc3BsYXkgZGF0YVxyXG4gIC8qKiBsYXllciB2aXNpYmlsaXR5Ki8gIFxyXG4gIHZpc2liaWxpdHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAvKiogVHJhbnNwYXJlbmN5IChUcmFuc3BhcmVudCkgMC0xIChPcGFxdWUpKi9cclxuICBvcGFjaXR5OiBudW1iZXIgPSAxLjA7XHJcblxyXG4gIC8vIENvbmZpZ3VyYXRpb24gZGF0YVxyXG4gIC8qKiB0aXRsZSovXHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBcclxuICAvKiogSWQgdG8gaW5kZXgqL1xyXG4gIGlkOiBhbnk7XHJcbiAgXHJcbiAgLyoqIFNlcnZpY2UgTmFtZSovXHJcbiAgc2VydmVyTmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogU2VydmljZSBhdHRyaWJ1dGlvbnMqL1xyXG4gIGF0dHJpYnV0aW9uczogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgLyoqIFJlcXVlc3QgZm9ybWF0IChpbWFnZS9qcGcsIC4uLikqL1xyXG4gIGZvcm1hdDogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBSZXF1ZXN0IHNlcnZpY2UgdmVyc2lvbiovXHJcbiAgdmVyc2lvbjpzdHJpbmc7XHJcblxyXG4gIC8qKiBTZXJ2aWNlIHVybCovXHJcbiAgdXJsOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBJcyBiYXNlIGxheWVyPyovXHJcbiAgaXNCYXNlTGF5ZXI6IGJvb2xlYW47XHJcblxyXG4gIC8qKiBSZXF1ZXN0IGxheWVyIG5hbWUqL1xyXG4gIG5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIElzIHRpbGVkPyovXHJcbiAgdGlsZWQ6IGJvb2xlYW47XHJcbiAgXHJcbiAgLyoqIERlc2NyaXB0aW9uKi9cclxuICBkZXNjOiBzdHJpbmcgPSBcIlwiO1xyXG4gIFxyXG4gIC8qKiAgVHJhbnNwYXJlbnQgcmVxdWVzdCBwYXJhbWV0ZXI/Ki9cclxuICB1cmxfdHJhbnNwYXJlbnQ6IHN0cmluZyA9IFwidHJ1ZVwiO1xyXG4gIFxyXG4gIC8qKiBSZXF1ZXN0IEJhY2tncm91bmQgcGFyYW1ldGVyIGNvbG9yIChIZXhhKSovXHJcbiAgdXJsX2JnY29sb3I6IHN0cmluZyA9IFwiMHgwMDAwMDBcIjtcclxuICBcclxuICAvKiogUmVxdWVzdCBFeGNlcHRpb24gVVJMKi9cclxuICB1cmxfZXhjZXB0aW9uOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIEV4dGVudCBmb3IgdGlsZWQgc2VydmljZXMqL1xyXG4gIGV4dGVudDogYW55ID0gbnVsbDtcclxuXHJcbiAgLyoqIFRpbGUgaGVpZ2h0IChpZiBub3QgZGVmaW5lZCwgdGhlIGRlZmF1bHQgbWFwIGlzIHRha2VuKSovXHJcbiAgdGlsZUhlaWdodD86bnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBUaWxlIHdpZHRoIChpZiBub3QgZGVmaW5lZCwgdGhlIGRlZmF1bHQgbWFwIGlzIHRha2VuKSovXHJcbiAgdGlsZVdpZHRoPzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIEVuYWJsZWQgZm9yIEdldEZlYXR1cmVJbmZvIHJlcXVlc3RzIChlbmFibGVkIHRvIHVzZSB0aGUgdmlld2VyIGZlYXR1cmVzIGluZm9ybWF0aW9uIHRvb2wpKi9cclxuICBxdWVyeWFibGU/OmJvb2xlYW4gPSBmYWxzZTtcclxuICBcclxuICAvKiogTWluaW11bSBzY2FsZSovXHJcbiAgbWluaW11bVNjYWxlPzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIE1heGltdW0gc2NhbGUqL1xyXG4gIG1heGltdW1TY2FsZT86bnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBMaXN0IG9mIGF2YWlsYWJsZSBDUlMqL1xyXG4gIHByb2plY3Rpb25zPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIEZlYXR1cmVzIGluZm9ybWF0aW9uIFVSTCovXHJcbiAgaW5mb1VybD86c3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBNZXRhZGF0YSBpbmZvcm1hdGlvbiBVUkwqL1xyXG4gIG1ldGFkYXRhVXJsPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIExlZ2VuZCBVUkwqL1xyXG4gIGxlZ2VuZFVybD86c3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBBcnJheSBvZiBPcHRpb25hbFBhcmFtZXRlciBvYmplY3QgdGhhdCBkZWZpbmVzIG90aGVyIG9wdGlvbmFsIHBhcmFtZXRlci12YWx1ZSBwYWlycyBmb3IgdGhlIHJlcXVlc3QgKFRJTUUgLi4uKSovXHJcbiAgb3B0aW9uYWxQYXJhbWV0ZXJzPzpBcnJheTxPcHRpb25hbFBhcmFtZXRlcj47XHJcbn1cclxuXHJcbi8qKiBPcHRpb25hbCBwYXJhbWV0ZXIgbW9kZWw6IGNvbmZpZ3VyZSBwYXJhbWV0ZXItdmFsdWUgcGFpciB0byBhZGQgdG8gdGhlIHJlcXVlc3QgbGF5ZXIgVVJMICovXHJcbmV4cG9ydCBjbGFzcyBPcHRpb25hbFBhcmFtZXRlciB7XHJcbiAgLyoqIGtleSova2V5OnN0cmluZztcclxuICAvKiogdmFsdWUqL3ZhbHVlOnN0cmluZztcclxufVxyXG5cclxuLyoqIExheWVyIGNvbmZpZ3VyYXRpb24gbW9kZWw6IG1vZGlmeSB0aGUgY29uZmlndXJhdGlvbiBvZiBhIGxheWVyIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgbWFwIChtYWtlIHZpc2libGUsIG1vdmUgdGhlIGxheWVyIC4uLikgKi9cclxuZXhwb3J0IGNsYXNzIExheWVyQ29uZmlndXJhdGlvbiB7XHJcbiAgLyoqIElkZW50aWZpZXIgdG8gaW5kZXgqL2lkOiBhbnk7XHJcbiAgLyoqIExheWVyIHZpc2liaWxpdHkqL3Zpc2liaWxpdHk6IGJvb2xlYW47XHJcbiAgLyoqIExheWVyIHRyYW5zcGFyZW5jeSAoVHJhbnNwYXJlbnQpIDAtMSAoT3BhcXVlKSovb3BhY2l0eTogbnVtYmVyO1xyXG4gIC8qKiBMYXllciBwb3NpdGlvbiovcG9zaXRpb246IG51bWJlcjtcclxufVxyXG5cclxuLyoqIExheWVyIGdyb3VwIG1vZGVsKi9cclxuZXhwb3J0IGNsYXNzIExheWVyR3JvdXAge1xyXG4gIC8qKiBpbml0aWFsbHkgYWN0aXZhdGVkIChhbGwgdmlzaWJsZSBsYXllcnMpKi9hY3RpdmU/OmJvb2xlYW47XHJcbiAgLyoqIGdyb3VwIG5hbWUqL25hbWU/OiBTdHJpbmc7XHJcbiAgLyoqIGdyb3VwIGlkKi9pZDogU3RyaW5nO1xyXG4gIC8qKiBhcnJheSBvZiBjaGlsZCBMYXllcnMqL2xheWVyczogQXJyYXk8TGF5ZXI+O1xyXG59XHJcblxyXG4vKiogTWFwIG9wdGlvbnMgY29uZmlndXJhdGlvbiBtb2RlbCovXHJcbmV4cG9ydCBjbGFzcyBNYXBPcHRpb25zQ29uZmlndXJhdGlvbiB7XHJcbiAgLyoqIHNjYWxlcyovc2NhbGVzPzogc3RyaW5nO1xyXG4gIC8qKiBwcm9qZWN0aW9ucyovcHJvamVjdGlvbnM/OiBzdHJpbmc7XHJcbiAgLyoqIG1pbmltdW0gc2NhbGUqL21pblNjYWxlPzpudW1iZXI7XHJcbiAgLyoqIG1heGltdW0gc2NhbGUqL21heFNjYWxlPzpudW1iZXI7XHJcbiAgLyoqIGV4dGVudCovZXh0ZW50Pzphbnk7XHJcbiAgLyoqIG1heGltdW0gZXh0ZW50Ki9tYXhFeHRlbnQ/OmFueTtcclxuICAvKiogdGlsZSB3aWR0aCovdGlsZVdpZHRoPzpudW1iZXI7XHJcbiAgLyoqIHRpbGUgaGVpZ2h0Ki90aWxlSGVpZ2h0PzpudW1iZXI7XHJcbiAgLyoqIHBhcmFtZXRlcnMqL3BhcmFtZXRlcnM/OiBBcnJheTxPcHRpb25hbFBhcmFtZXRlcj5cclxufVxyXG5cclxuLyoqIE1hcCBjb21wb25lbnQgc3RhdHVzIG1vZGVsKi9cclxuZXhwb3J0IGNsYXNzIE1hcENvbXBvbmVudFN0YXR1cyB7XHJcbiAgICAvKiogbG9hZGVkPyovbG9hZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuXHJcbi8qKiBNYXAgY29uZmlndXJhdGlvbiBtYW5hZ2VyIHNlcnZpY2UqL1xyXG5leHBvcnQgY2xhc3MgTWFwQ29uZmlndXJhdGlvbk1hbmFnZXJTZXJ2aWNlIHtcclxuICBwcml2YXRlIGxheWVyc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIGxheWVyczogQXJyYXk8TGF5ZXI+ID0gbnVsbDtcclxuXHJcbiAgcHJpdmF0ZSBiYXNlTGF5ZXJHcm91cHNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgcHJpdmF0ZSBiYXNlTGF5ZXJHcm91cHM6IEFycmF5PExheWVyR3JvdXA+ID0gbnVsbDtcclxuXHJcbiAgcHJpdmF0ZSBsYXllckNvbmZpZ3VyYXRpb25TdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcblxyXG4gIHByaXZhdGUgYWRkTGF5ZXJzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG4gIHByaXZhdGUgcmVtb3ZlTGF5ZXJzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG5cclxuICBwcml2YXRlIHNpdHVhdGlvbk1hcENvbmZpZ3VyYXRpb25TdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgcHJpdmF0ZSBtYXBPcHRpb25zQ29uZmlndXJhdGlvblN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgcHJpdmF0ZSBtYXBDb21wb25lbnRTdGF0dXNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciovXHJcbiAgY29uc3RydWN0b3IoKSB7IFxyXG4gICAvL1xyXG4gIH1cclxuICBcclxuICAvKiogbGF5ZXIgY291bnQgKi9cclxuICBjb3VudCA9IDA7XHJcblxyXG4gIC8qKiBjb25maWd1cmUgdGhlIG92ZXJsYXkgbGF5ZXJzIG9mIHRoZSBtYXAsIGJ5IHBhc3NpbmcgYXMgYSBwYXJhbWV0ZXIgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvZiB0eXBlIExheWVyIG9iamVjdHMgZGVmaW5pbmcgdGhlIGxheWVycyB0byBsb2FkLiovXHJcbiAgbG9hZExheWVyc0NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikge1xyXG4gICAgaWYgKHRoaXMubGF5ZXJzICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5jbGVhckxheWVycyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNldExheWVycyhjb25maWd1cmF0aW9uKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqY29uZmlndXJlIHRoZSBiYXNlIGxheWVycyBvZiB0aGUgbWFwIGJ5IHBhc3NpbmcgYXMgYSBwYXJhbWV0ZXIgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvZiB0eXBlIExheWVyR3JvdXAgZWFjaCBvZiB0aGVtIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgTGF5ZXIgb2JqZWN0cyBkZWZpbmluZyB0aGUgbGF5ZXJzIHRvIGxvYWQuKi9cclxuICBsb2FkQmFzZUxheWVyc0NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikge1xyXG4gICAgdGhpcy5zZXRCYXNlTGF5ZXJHcm91cHMoY29uZmlndXJhdGlvbik7XHJcbiAgfVxyXG5cclxuICAvKiogZ2V0IGJhc2UgbGF5ZXIgZ3JvdXBzKi9cclxuICBnZXRCYXNlTGF5ZXJHcm91cHMoKTogT2JzZXJ2YWJsZTxMYXllckdyb3VwW10+IHtcclxuICAgIHJldHVybiB0aGlzLmJhc2VMYXllckdyb3Vwc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogc2V0IGJhc2UgbGF5ZXIgZ3JvdXBzKi9cclxuICBzZXRCYXNlTGF5ZXJHcm91cHMoZ3JvdXBzOkFycmF5PExheWVyR3JvdXA+KSB7XHJcbiAgICB0aGlzLmJhc2VMYXllckdyb3VwcyA9IGdyb3VwcztcclxuICAgIHRoaXMucmVmcmVzaEJhc2VMYXllckdyb3VwcygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoQmFzZUxheWVyR3JvdXBzKCkge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5iYXNlTGF5ZXJHcm91cHNTdWJqZWN0Lm5leHQodGhpcy5iYXNlTGF5ZXJHcm91cHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGdldCBsYXllcnMqL1xyXG4gIGdldExheWVycygpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLmxheWVyc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIGFsbCBsYXllcnMgZnJvbSBtYXAqL1xyXG4gIGNsZWFyTGF5ZXJzKHJlZnJlc2g6Ym9vbGVhbikge1xyXG4gICAgd2hpbGUodGhpcy5sYXllcnMubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMubGF5ZXJzLnBvcCgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHJlZnJlc2gpIHtcclxuICAgICAgdGhpcy5yZWZyZXNoTGF5ZXJzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogc2V0IGxheWVycyovXHJcbiAgc2V0TGF5ZXJzKGxheWVyczpBcnJheTxMYXllcj4pIHtcclxuICAgIHRoaXMubGF5ZXJzID0gbGF5ZXJzO1xyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJzKCk7XHJcbiAgfVxyXG5cclxuICAvKiogYWRkIGdpdmVuIGxheWVyIHRvIG1hcCovXHJcbiAgYWRkTGF5ZXIobGF5ZXI6TGF5ZXIpIHtcclxuICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xyXG4gICAgdGhpcy5yZWZyZXNoQWRkTGF5ZXJzKGxheWVyKTtcclxuICB9XHJcblxyXG4gIC8qKiBhZGQgZ2l2ZW4gbGF5ZXIgdG8gbWFwIGF0IGdpdmVuIGluZGV4Ki9cclxuICBhZGRMYXllckF0KGxheWVyOkxheWVyLCBpbmRleDpudW1iZXIpIHtcclxuICAgIGlmIChpbmRleCA9PSAwKSB7XHJcbiAgICAgIHRoaXMubGF5ZXJzID0gW2xheWVyXS5jb25jYXQodGhpcy5sYXllcnMpO1xyXG4gICAgfSBlbHNlIGlmIChpbmRleCA+PSB0aGlzLmxheWVycy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxheWVycyA9IHRoaXMubGF5ZXJzLnNsaWNlKDAsIGluZGV4KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jb25jYXQoW2xheWVyXSlcclxuICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHRoaXMubGF5ZXJzLnNsaWNlKGluZGV4LCB0aGlzLmxheWVycy5sZW5ndGgpKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVmcmVzaEFkZExheWVycyhsYXllcik7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24obGF5ZXIuaWQsIG51bGwsIG51bGwsIGluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgZ2l2ZW4gbGF5ZXIgZnJvbSBtYXAqL1xyXG4gIHJlbW92ZUxheWVyKGxheWVyOkxheWVyKSB7XHJcbiAgICB2YXIgaW5kZXggPSB0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKTtcclxuICAgIHRoaXMucmVtb3ZlTGF5ZXJJbmRleChpbmRleCk7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIGxheWVyIHdpdGggZ2l2ZW4gaWQgZnJvbSBtYXAgKi9cclxuICByZW1vdmVMYXllcklkKGlkKSB7XHJcbiAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gdGhpcy5sYXllcnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLmxheWVyc1tpXS5pZCA9PSBpZCkge1xyXG4gICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5yZW1vdmVMYXllckluZGV4KGluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgbGF5ZXIgYXQgZ2l2ZW4gaW5kZXggZnJvbSBtYXAgKi9cclxuICByZW1vdmVMYXllckluZGV4KGluZGV4Om51bWJlcikge1xyXG4gICAgdmFyIGxheWVyID0gdGhpcy5sYXllcnNbaW5kZXhdO1xyXG4gICAgdGhpcy5sYXllcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIHRoaXMucmVmcmVzaFJlbW92ZUxheWVycyhsYXllcik7XHJcbiAgfVxyXG5cclxuICAvKiogcmVmcmVzaCBsYXllcnMgKi9cclxuICBwcml2YXRlIHJlZnJlc2hMYXllcnMoKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLmxheWVyc1N1YmplY3QubmV4dCh0aGlzLmxheWVycyk7XHJcbiAgfVxyXG5cclxuICAvKiogT2JzZXJ2YWJsZSBmb3IgbGF5ZXJzIGFkZGVkICovXHJcbiAgZ2V0TGF5ZXJzQWRkZWQoKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5hZGRMYXllcnNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoQWRkTGF5ZXJzKGxheWVyOkxheWVyKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLmFkZExheWVyc1N1YmplY3QubmV4dChbbGF5ZXJdKTtcclxuICB9XHJcblxyXG4gIGdldExheWVyc1JlbW92ZWQoKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5yZW1vdmVMYXllcnNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoUmVtb3ZlTGF5ZXJzKGxheWVyOkxheWVyKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLnJlbW92ZUxheWVyc1N1YmplY3QubmV4dChbbGF5ZXJdKTtcclxuICB9XHJcblxyXG4gIGdldExheWVyQ29uZmlndXJhdGlvbkxpc3RlbmVyKCk6IE9ic2VydmFibGU8TGF5ZXJDb25maWd1cmF0aW9uW10+IHtcclxuICAgIHJldHVybiB0aGlzLmxheWVyQ29uZmlndXJhdGlvblN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldExheWVySW5kZXhCeUlkKGlkOnN0cmluZyk6bnVtYmVye1xyXG4gICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IHRoaXMubGF5ZXJzLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5sYXllcnNbaV0uaWQgPT0gaWQpIHtcclxuICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBpbmRleDtcclxuICB9XHJcbiAgXHJcbiAgLyoqIG1vdmUgbGF5ZXIgd2l0aCBnaXZlbiBpZCB0byB0aGUgZ2l2ZW4gaW5kZXgqL1xyXG4gIG1vdmVMYXllcihpZCwgaW5kZXgpIHtcclxuICAgIHZhciBsYXllckluZGV4ID0gdGhpcy5nZXRMYXllckluZGV4QnlJZChpZCk7XHJcbiAgICBpZiAobGF5ZXJJbmRleCAhPSAtMSkge1xyXG4gICAgICB2YXIgbGF5ZXIgPSB0aGlzLmxheWVycy5zcGxpY2UobGF5ZXJJbmRleCwgMSk7XHJcbiAgICAgIHRoaXMubGF5ZXJzID0gXHJcbiAgICAgICAgdGhpcy5sYXllcnMuc2xpY2UoMCwgaW5kZXgpXHJcbiAgICAgICAgLmNvbmNhdChsYXllcilcclxuICAgICAgICAuY29uY2F0KHRoaXMubGF5ZXJzLnNsaWNlKGluZGV4LCB0aGlzLmxheWVycy5sZW5ndGgpKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihpZCwgbnVsbCwgbnVsbCwgaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGNoYW5nZSB2aXNpYmlsaXR5IG9mIGxheWVyIHdpdGggZ2l2ZW4gaWQgdG8gdGhlIGdpdmVuIHZhbHVlKi9cclxuICBjaGFuZ2VMYXllclZpc2liaWxpdHkoaWQsIHZpc2liaWxpdHkpIHtcclxuICAgIHRoaXMucmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihpZCwgbnVsbCwgdmlzaWJpbGl0eSwgbnVsbCk7XHJcbiAgfVxyXG5cclxuICAvKiogY2hhbmdlIG9wYWNpdHkgb2YgbGF5ZXIgd2l0aCBnaXZlbiBpZCB0byB0aGUgZ2l2ZW4gdmFsdWUqL1xyXG4gIGNoYW5nZUxheWVyT3BhY2l0eShpZCwgb3BhY2l0eSkge1xyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBvcGFjaXR5LCBudWxsLCBudWxsKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihpZCwgb3BhY2l0eSwgdmlzaWJpbGl0eSwgcG9zaXRpb24pIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHZhciBsYXllciA9IG5ldyBMYXllckNvbmZpZ3VyYXRpb24oKTtcclxuICAgIGxheWVyLmlkID0gaWQ7XHJcbiAgICBsYXllci5vcGFjaXR5ID0gb3BhY2l0eTtcclxuICAgIGxheWVyLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xyXG4gICAgbGF5ZXIucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgIHRoaXMubGF5ZXJDb25maWd1cmF0aW9uU3ViamVjdC5uZXh0KFtsYXllcl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvbkxpc3RlbmVyKCk6IE9ic2VydmFibGU8TGF5ZXJbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvblN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogY29uZmlndXJlIHRoZSBzaXR1YXRpb24gbWFwIG9mIHRoZSBtYXAgY29tcG9uZW50IGJ5IHBhc3NpbmcgYXMgYSBwYXJhbWV0ZXIgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvZiB0eXBlIExheWVyR3JvdXAsIGVhY2ggb2YgdGhlbSB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIExheWVyIG9iamVjdHMgZGVmaW5pbmcgdGhlIGxheWVycyB0byBsb2FkIGFzIHNpdHVhdGlvbiBtYXAuKi9cclxuICBsb2FkU2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvbihsYXllcnM6QXJyYXk8TGF5ZXI+KSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLnNpdHVhdGlvbk1hcENvbmZpZ3VyYXRpb25TdWJqZWN0Lm5leHQobGF5ZXJzKTtcclxuICB9XHJcblxyXG4gIGdldE1hcE9wdGlvbnNDb25maWd1cmF0aW9uTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxNYXBPcHRpb25zQ29uZmlndXJhdGlvbltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXBPcHRpb25zQ29uZmlndXJhdGlvblN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogbG9hZCBtYXAgb3B0aW9ucyBjb25maWd1cmF0aW9uICovXHJcbiAgbG9hZE1hcE9wdGlvbnNDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb246TWFwT3B0aW9uc0NvbmZpZ3VyYXRpb24pIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMubWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25TdWJqZWN0Lm5leHQoW2NvbmZpZ3VyYXRpb25dKTtcclxuICB9XHJcblxyXG4gIGdldE1hcENvbXBvbmVudFN0YXR1c0xpc3RlbmVyKCk6IE9ic2VydmFibGU8TWFwQ29tcG9uZW50U3RhdHVzW10+IHtcclxuICAgIHJldHVybiB0aGlzLm1hcENvbXBvbmVudFN0YXR1c1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzZXQgbWFwIGNvbXBvbmVudCBzdGF0dXMgKi9cclxuICBzZXRNYXBDb21wb25lbnRTdGF0dXMoc3RhdHVzOk1hcENvbXBvbmVudFN0YXR1cykge1xyXG4gICAgLy9Ob3RpZnkgdGhlIG1hcCBjb21wb25lbnQgc3RhdHVzXHJcbiAgICB0aGlzLm1hcENvbXBvbmVudFN0YXR1c1N1YmplY3QubmV4dChbc3RhdHVzXSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBAd2hhdEl0RG9lcyBDb25kaXRpb25hbGx5IGluY2x1ZGVzIGFuIEhUTUwgZWxlbWVudCBpZiBjdXJyZW50IHVzZXIgaGFzIGFueVxyXG4gKiBvZiB0aGUgYXV0aG9yaXRpZXMgcGFzc2VkIGFzIHRoZSBgZXhwcmVzc2lvbmAuXHJcbiAqXHJcbiAqIEBob3dUb1VzZVxyXG4gKiBgYGBcclxuICogICAgIDxzb21lLWVsZW1lbnQgKnNpdG11bkhhc0FueUF1dGhvcml0eT1cIidST0xFX0FETUlOJ1wiPi4uLjwvc29tZS1lbGVtZW50PlxyXG4gKlxyXG4gKiAgICAgPHNvbWUtZWxlbWVudCAqc2l0bXVuSGFzQW55QXV0aG9yaXR5PVwiWydST0xFX0FETUlOJywgJ1JPTEVfVVNFUiddXCI+Li4uPC9zb21lLWVsZW1lbnQ+XHJcbiAqIGBgYFxyXG4gKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1tzaXRtdW5IYXNBbnlBdXRob3JpdHldJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlIHtcclxuICAgIFxyXG4gICAgLyoqIGF1dGhvcml0aWVzIHRvIGNoZWNrICovXHJcbiAgICBwdWJsaWMgYXV0aG9yaXRpZXM6IHN0cmluZ1tdOyBcclxuICAgIFxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsLCBwcml2YXRlIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+LCBwcml2YXRlIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHRlcnJpdG9yeSB0byBjaGVjayBhdXRob3JpdGllcyovXHJcbiAgICBASW5wdXQoKSB0ZXJyaXRvcnk6IHN0cmluZztcclxuICAgIFxyXG4gICAgLyoqIFNldCB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyAqL1xyXG4gICAgQElucHV0KClcclxuICAgIHNldCBzaXRtdW5IYXNBbnlBdXRob3JpdHkodmFsdWU6IHN0cmluZ3xzdHJpbmdbXSkge1xyXG4gICAgICAgIHRoaXMuYXV0aG9yaXRpZXMgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gWyA8c3RyaW5nPiB2YWx1ZSBdIDogPHN0cmluZ1tdPiB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcclxuICAgICAgICAvLyBHZXQgbm90aWZpZWQgZWFjaCB0aW1lIGF1dGhlbnRpY2F0aW9uIHN0YXRlIGNoYW5nZXMuXHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuZ2V0QXV0aGVudGljYXRpb25TdGF0ZSgpLnN1YnNjcmliZSgoaWRlbnRpdHkpID0+IHRoaXMudXBkYXRlVmlldygpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHVwZGF0ZSB2aWV3ICovXHJcbiAgICBwcml2YXRlIHVwZGF0ZVZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMudGVycml0b3J5KXtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeSh0aGlzLmF1dGhvcml0aWVzLHRoaXMudGVycml0b3J5KS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHkodGhpcy5hdXRob3JpdGllcykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIEB3aGF0SXREb2VzIENvbmRpdGlvbmFsbHkgaW5jbHVkZXMgYW4gSFRNTCBlbGVtZW50IGlmIGN1cnJlbnQgdXNlciBoYXMgYW55XHJcbiAqIG9mIHRoZSBhdXRob3JpdGllcyBwYXNzZWQgYXMgdGhlIGBleHByZXNzaW9uYC5cclxuICpcclxuICogQGhvd1RvVXNlXHJcbiAqIGBgYFxyXG4gKiAgICAgPHNvbWUtZWxlbWVudCAqc2l0bXVuSGFzQW55QXV0aG9yaXR5PVwiJ1JPTEVfQURNSU4nXCI+Li4uPC9zb21lLWVsZW1lbnQ+XHJcbiAqXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCJbJ1JPTEVfQURNSU4nLCAnUk9MRV9VU0VSJ11cIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICogYGBgXHJcbiAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3NpdG11bkhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5XSdcclxufSlcclxuZXhwb3J0IGNsYXNzIEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlIHtcclxuXHJcbiAgICAvKiogYXV0aG9yaXRpZXMgdG8gY2hlY2sgKi9cclxuICAgIHB1YmxpYyBhdXRob3JpdGllczogc3RyaW5nW107IFxyXG5cclxuICAgIC8qKiB0ZXJyaXRvcnkgdG8gY2hlY2sgYXV0aG9yaXRpZXMqL1xyXG4gICAgcHVibGljIHRlcnJpdG9yeTogc3RyaW5nOyBcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWwsIHByaXZhdGUgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4sIHByaXZhdGUgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogU2V0IHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIG9uIHRlcnJpdG9yeSAqL1xyXG4gICAgQElucHV0KClcclxuICAgIHNldCBzaXRtdW5IYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeShvcHRzOiBhbnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hdXRob3JpdGllcyA9IHR5cGVvZiBvcHRzLmF1dGhvcml0aWVzID09PSAnc3RyaW5nJyA/IFsgPHN0cmluZz4gb3B0cy5hdXRob3JpdGllcyBdIDogPHN0cmluZ1tdPiBvcHRzLmF1dGhvcml0aWVzO1xyXG4gICAgICAgIHRoaXMudGVycml0b3J5ID0gb3B0cy50ZXJyaXRvcnk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7XHJcbiAgICAgICAgLy8gR2V0IG5vdGlmaWVkIGVhY2ggdGltZSBhdXRoZW50aWNhdGlvbiBzdGF0ZSBjaGFuZ2VzLlxyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmdldEF1dGhlbnRpY2F0aW9uU3RhdGUoKS5zdWJzY3JpYmUoKGlkZW50aXR5KSA9PiB0aGlzLnVwZGF0ZVZpZXcoKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiB1cGRhdGUgdmlldyAqL1xyXG4gICAgcHJpdmF0ZSB1cGRhdGVWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnRlcnJpdG9yeSl7XHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuaGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnkodGhpcy5hdXRob3JpdGllcyx0aGlzLnRlcnJpdG9yeSkudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuaGFzQW55QXV0aG9yaXR5KHRoaXMuYXV0aG9yaXRpZXMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50TW9kdWxlLCBIVFRQX0lOVEVSQ0VQVE9SUywgSHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG4vL2ltcG9ydCB7IEFuZ3VsYXJIYWxNb2R1bGUgfSBmcm9tICcuLi8uLi9saWIvYW5ndWxhci1oYWwnO1xyXG5pbXBvcnQge0NvZGVMaXN0U2VydmljZX0gZnJvbSAnLi9jb2RlbGlzdC9jb2RlbGlzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUZXJyaXRvcnlTZXJ2aWNlfSBmcm9tICcuL3RlcnJpdG9yeS90ZXJyaXRvcnkuc2VydmljZSc7XHJcbmltcG9ydCB7VGVycml0b3J5VHlwZVNlcnZpY2V9IGZyb20gJy4vdGVycml0b3J5L3RlcnJpdG9yeS10eXBlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RlcnJpdG9yeUdyb3VwVHlwZVNlcnZpY2V9IGZyb20gJy4vdGVycml0b3J5L3RlcnJpdG9yeS1ncm91cC10eXBlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJQb3NpdGlvblNlcnZpY2V9IGZyb20gJy4vdXNlci91c2VyLXBvc2l0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJDb25maWd1cmF0aW9uU2VydmljZX0gZnJvbSAnLi91c2VyL3VzZXItY29uZmlndXJhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtSb2xlU2VydmljZX0gZnJvbSAnLi9yb2xlL3JvbGUuc2VydmljZSc7XHJcbmltcG9ydCB7VXNlclNlcnZpY2V9IGZyb20gJy4vdXNlci91c2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0Nvbm5lY3Rpb25TZXJ2aWNlfSBmcm9tICcuL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2suc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1R5cGVTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay10eXBlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tHcm91cFNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLWdyb3VwLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tQYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza0F2YWlsYWJpbGl0eVNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLWF2YWlsYWJpbGl0eS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrVUlTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay11aS5zZXJ2aWNlJztcclxuaW1wb3J0IHtTZXJ2aWNlU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlL3NlcnZpY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7U2VydmljZVBhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vc2VydmljZS9zZXJ2aWNlLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeVNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHkuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlBdmFpbGFiaWxpdHlTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUZpbHRlclNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZmlsdGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5UGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7QmFja2dyb3VuZFNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvYmFja2dyb3VuZC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmVlU2VydmljZX0gZnJvbSAnLi90cmVlL3RyZWUuc2VydmljZSc7XHJcbmltcG9ydCB7VHJlZU5vZGVTZXJ2aWNlfSBmcm9tICcuL3RyZWUvdHJlZS1ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uU2VydmljZX0gZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvblBhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vYXBwbGljYXRpb24vYXBwbGljYXRpb24tcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uQmFja2dyb3VuZFNlcnZpY2V9IGZyb20gJy4vYXBwbGljYXRpb24vYXBwbGljYXRpb24tYmFja2dyb3VuZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTWFwQ29uZmlndXJhdGlvbk1hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9tYXAvbWFwLWNvbmZpZ3VyYXRpb24tbWFuYWdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGgvYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9hdXRoL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aEludGVyY2VwdG9yIH0gZnJvbSAnLi9hdXRoL2F1dGguaW50ZXJjZXB0b3InO1xyXG5pbXBvcnQgeyBBdXRoRXhwaXJlZEludGVyY2VwdG9yIH0gZnJvbSAnLi9hdXRoL2F1dGgtZXhwaXJlZC5pbnRlcmNlcHRvcic7XHJcbmltcG9ydCB7IEhhc0FueUF1dGhvcml0eURpcmVjdGl2ZSB9IGZyb20gJy4vYXV0aC9oYXMtYW55LWF1dGhvcml0eS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSB9IGZyb20gJy4vYXV0aC9oYXMtYW55LWF1dGhvcml0eS1vbi10ZXJyaXRvcnkuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi9hdXRoL2xvZ2luLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBY2NvdW50U2VydmljZSB9IGZyb20gJy4vYWNjb3VudC9hY2NvdW50LnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUh0dHBMb2FkZXJ9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2h0dHAtbG9hZGVyJztcclxuaW1wb3J0IHtUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZU1vZHVsZX0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcbmltcG9ydCB7IFRyYW5zbGF0aW9uU2VydmljZSB9IGZyb20gJy4vdHJhbnNsYXRpb24vdHJhbnNsYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7IExhbmd1YWdlU2VydmljZSB9IGZyb20gJy4vdHJhbnNsYXRpb24vbGFuZ3VhZ2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IERhc2hib2FyZFNlcnZpY2UgfSBmcm9tICcuL2Rhc2hib2FyZC9kYXNoYm9hcmQuc2VydmljZSc7XHJcbi8qKiBsb2FkIGkxOG4gYXNzZXRzKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zbGF0ZUxvYWRlcihodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgcmV0dXJuIG5ldyBUcmFuc2xhdGVIdHRwTG9hZGVyKGh0dHAsICcuL2Fzc2V0cy9pMThuLycsICcuanNvbicpO1xyXG59XHJcblxyXG5cclxuLyoqIFNJVE1VTiBmcm9udGVuZCBjb3JlIG1vZHVsZSAqL1xyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIC8qUm91dGVyTW9kdWxlLFxyXG4gICAgSHR0cENsaWVudE1vZHVsZSxcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIEFuZ3VsYXJIYWxNb2R1bGUsKi9cclxuICAgIFRyYW5zbGF0ZU1vZHVsZS5mb3JSb290KHtcclxuICAgICAgbG9hZGVyOiB7XHJcbiAgICAgICAgcHJvdmlkZTogVHJhbnNsYXRlTG9hZGVyLFxyXG4gICAgICAgIHVzZUZhY3Rvcnk6IChjcmVhdGVUcmFuc2xhdGVMb2FkZXIpLFxyXG4gICAgICAgIGRlcHM6IFtIdHRwQ2xpZW50XVxyXG4gICAgICB9XHJcbiAgICB9KSxcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlLFxyXG4gICAgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUsXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUsXHJcbiAgICBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSxcclxuICAgIFRyYW5zbGF0ZU1vZHVsZVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFNpdG11bkZyb250ZW5kQ29yZU1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBDb2RlTGlzdFNlcnZpY2UsXHJcbiAgICAgICAgVGVycml0b3J5U2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlUeXBlU2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlHcm91cFR5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFJvbGVTZXJ2aWNlLFxyXG4gICAgICAgIEFjY291bnRTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhTZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJTZXJ2aWNlLFxyXG4gICAgICAgIENvbm5lY3Rpb25TZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tUeXBlU2VydmljZSxcclxuICAgICAgICBUYXNrVUlTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tHcm91cFNlcnZpY2UsXHJcbiAgICAgICAgVGFza1BhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgVGFza0F2YWlsYWJpbGl0eVNlcnZpY2UsXHJcbiAgICAgICAgU2VydmljZVNlcnZpY2UsXHJcbiAgICAgICAgU2VydmljZVBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5U2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeVBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlGaWx0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIEJhY2tncm91bmRTZXJ2aWNlLFxyXG4gICAgICAgIFRyZWVTZXJ2aWNlLFxyXG4gICAgICAgIFRyZWVOb2RlU2VydmljZSxcclxuICAgICAgICBBcHBsaWNhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgQXBwbGljYXRpb25QYXJhbWV0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIEFwcGxpY2F0aW9uQmFja2dyb3VuZFNlcnZpY2UsXHJcbiAgICAgICAgQXV0aEludGVyY2VwdG9yLFxyXG4gICAgICAgIEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgUHJpbmNpcGFsLFxyXG4gICAgICAgIFVzZXJQb3NpdGlvblNlcnZpY2UsXHJcbiAgICAgICAgVXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIExvZ2luU2VydmljZSxcclxuICAgICAgICBUcmFuc2xhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgTGFuZ3VhZ2VTZXJ2aWNlLFxyXG4gICAgICAgIERhc2hib2FyZFNlcnZpY2UsXHJcbiAgICAgICAgTWFwQ29uZmlndXJhdGlvbk1hbmFnZXJTZXJ2aWNlLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxyXG4gICAgICAgICAgdXNlQ2xhc3M6IEF1dGhJbnRlcmNlcHRvcixcclxuICAgICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgICwge1xyXG4gICAgICAgICAgcHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXHJcbiAgICAgICAgICB1c2VDbGFzczogQXV0aEV4cGlyZWRJbnRlcmNlcHRvcixcclxuICAgICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cENsaWVudE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0hhbFBhcmFtLCBSZXN0U2VydmljZX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge0V4dGVybmFsU2VydmljZX0gZnJvbSAnLi9leHRlcm5hbC5zZXJ2aWNlJztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5cclxuaW1wb3J0ICdyeGpzJztcclxuXHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuXHJcbmV4cG9ydCB7RXh0ZXJuYWxTZXJ2aWNlfSBmcm9tICcuL2V4dGVybmFsLnNlcnZpY2UnO1xyXG5leHBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmV4cG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5leHBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5leHBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuZXhwb3J0IHtTb3J0fSBmcm9tICcuL3NvcnQnO1xyXG5leHBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmV4cG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9ufSBmcm9tICcuL0V4dGVybmFsQ29uZmlndXJhdGlvbic7XHJcbmV4cG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5leHBvcnQge0hhbE9wdGlvbnMsIEhhbFBhcmFtfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmV4cG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuXHJcblxyXG4vKiogQW5ndWxhciBIQUwgbW9kdWxlICovXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbSHR0cENsaWVudE1vZHVsZV0sXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxyXG4gICAgZXhwb3J0czogW0h0dHBDbGllbnRNb2R1bGVdLFxyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgRXh0ZXJuYWxTZXJ2aWNlLFxyXG4gICAgICAgIEh0dHBDbGllbnQsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcm92aWRlOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIHVzZUNsYXNzOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIGRlcHM6IFtFeHRlcm5hbFNlcnZpY2VdXHJcbiAgICAgICAgfV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJIYWxNb2R1bGUge1xyXG4gICAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmdNb2R1bGU6IEFuZ3VsYXJIYWxNb2R1bGUsXHJcbiAgICAgICAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgICAgICAgICAgRXh0ZXJuYWxTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgSHR0cENsaWVudCxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlQ2xhc3M6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICBkZXBzOiBbRXh0ZXJuYWxTZXJ2aWNlXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSJdfQ==