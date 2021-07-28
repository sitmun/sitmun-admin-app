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
Resource.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Resource.ctorParameters = () => [];

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
ExternalService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ExternalService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: ['ExternalConfigurationService',] }] }
];

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
ResourceService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ResourceService.ctorParameters = () => [
    { type: ExternalService }
];

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
AccountService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
AccountService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
AuthService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
AuthService.ctorParameters = () => [
    { type: HttpClient },
    { type: ResourceService }
];

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
Principal.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Principal.ctorParameters = () => [
    { type: AccountService }
];

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
AuthExpiredInterceptor.decorators = [
    { type: Injectable },
];
/** @nocollapse */
AuthExpiredInterceptor.ctorParameters = () => [
    { type: Router },
    { type: AuthService },
    { type: Principal }
];

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
LoginService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
LoginService.ctorParameters = () => [
    { type: AuthService },
    { type: Principal }
];

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
DashboardService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
DashboardService.ctorParameters = () => [
    { type: HttpClient },
    { type: ResourceService }
];
/** @nocollapse */ DashboardService.ngInjectableDef = defineInjectable({ factory: function DashboardService_Factory() { return new DashboardService(inject(HttpClient), inject(ResourceService)); }, token: DashboardService, providedIn: "root" });

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
UserService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
UserService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
UserPositionService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
UserPositionService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
UserConfigurationService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
UserConfigurationService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
        /** @type {?} */
        let territoryType = {};
        territoryType._links = {};
        territoryType._links.self = {};
        territoryType._links.self.href = "";
        if (item.type != null) {
            territoryType = item.type;
            if (typeof item.type._links != 'undefined') {
                item.type = item.type._links.self.href;
            }
        }
        if (item._links != null) {
            //update relations
            delete item.groupType;
            // if (territoryGroupType._links.self.href == '') {
            //   item.deleteRelation('groupType', territoryGroupType).subscribe(result => {
            //   }, error => console.error(error));
            // } else {
            //   item.substituteRelation('groupType', territoryGroupType).subscribe(result => {
            //   }, error => console.error(error));
            // }
            if (territoryType._links.self.href == '') {
                item.deleteRelation('type', territoryType).subscribe(result => {
                }, error => console.error(error));
            }
            else {
                item.substituteRelation('type', territoryType).subscribe(result => {
                }, error => console.error(error));
            }
            delete item.type;
            // if (item.type != null)
            //   item.type = item.type._links.self.href;
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORY_API), item);
        }
        return result;
    }
}
TerritoryService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TerritoryService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
TerritoryTypeService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TerritoryTypeService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
TerritoryGroupTypeService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
TerritoryGroupTypeService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ TerritoryGroupTypeService.ngInjectableDef = defineInjectable({ factory: function TerritoryGroupTypeService_Factory() { return new TerritoryGroupTypeService(inject(INJECTOR), inject(HttpClient)); }, token: TerritoryGroupTypeService, providedIn: "root" });

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
RoleService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
RoleService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
ConnectionService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ConnectionService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
            if (item.roles) {
                /** @type {?} */
                let roles = [...item.roles];
                delete item.roles;
                item.substituteAllRelation('roles', roles).subscribe(result => {
                }, error => console.error(error));
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
TaskService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TaskService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
TaskTypeService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TaskTypeService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
TaskGroupService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TaskGroupService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
TaskParameterService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TaskParameterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
TaskAvailabilityService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TaskAvailabilityService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
TaskUIService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TaskUIService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
TranslationService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
TranslationService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ TranslationService.ngInjectableDef = defineInjectable({ factory: function TranslationService_Factory() { return new TranslationService(inject(INJECTOR), inject(HttpClient)); }, token: TranslationService, providedIn: "root" });

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
LanguageService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
LanguageService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ LanguageService.ngInjectableDef = defineInjectable({ factory: function LanguageService_Factory() { return new LanguageService(inject(INJECTOR), inject(HttpClient)); }, token: LanguageService, providedIn: "root" });

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
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.SERVICE_API), item);
        }
        return result;
    }
}
ServiceService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ServiceService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service model
 */
class ConfigurationParameter extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class ConfigurationParametersService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(ConfigurationParameter, "configuration-parameters", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.CONFIGURATION_PARAMETERS_API = 'configuration-parameters';
    }
}
ConfigurationParametersService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
ConfigurationParametersService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ ConfigurationParametersService.ngInjectableDef = defineInjectable({ factory: function ConfigurationParametersService_Factory() { return new ConfigurationParametersService(inject(INJECTOR), inject(HttpClient)); }, token: ConfigurationParametersService, providedIn: "root" });

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
ServiceParameterService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ServiceParameterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Capabilitie model
 */
class Capabilitie extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class CapabilitiesService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Capabilitie, "helpers/capabilities?url=", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.CAPABILITIES_API = 'helpers/capabilities?url=';
    }
    /**
     * save service
     * @param {?} url
     * @return {?}
     */
    getInfo(url) {
        /** @type {?} */
        let result;
        if (url) {
            /** @type {?} */
            const headerDict = {
                'Charset': 'UTF-8'
            };
            /** @type {?} */
            const requestOptions = {
                headers: new HttpHeaders(headerDict),
            };
            /** @type {?} */
            let finalUrl = this.resourceService.getResourceUrl(this.CAPABILITIES_API);
            finalUrl = finalUrl.concat(url);
            console.log(finalUrl);
            result = this.http.get(finalUrl, requestOptions);
        }
        return result;
    }
}
CapabilitiesService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
CapabilitiesService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ CapabilitiesService.ngInjectableDef = defineInjectable({ factory: function CapabilitiesService_Factory() { return new CapabilitiesService(inject(INJECTOR), inject(HttpClient)); }, token: CapabilitiesService, providedIn: "root" });

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
CartographyService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
CartographyService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
CartographyGroupService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
CartographyGroupService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
CartographyAvailabilityService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
CartographyAvailabilityService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
CartographyFilterService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
CartographyFilterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
CartographyParameterService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
CartographyParameterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service parameter manager service
 */
class CartographySpatialSelectionParameterService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(CartographyParameter, "cartography-spatial-selection-parameters", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API = 'cartography-spatial-selection-parameters';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API), item);
        }
        return result;
    }
}
CartographySpatialSelectionParameterService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
CartographySpatialSelectionParameterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Cartography style model
 */
class CartographyStyle extends Resource {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class CartographyStyleService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(CartographyStyle, "cartography-styles", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.CARTOGRAPHY_STYLES_API = 'cartography-styles';
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
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_STYLES_API), item);
        }
        return result;
    }
}
CartographyStyleService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
CartographyStyleService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ CartographyStyleService.ngInjectableDef = defineInjectable({ factory: function CartographyStyleService_Factory() { return new CartographyStyleService(inject(INJECTOR), inject(HttpClient)); }, token: CartographyStyleService, providedIn: "root" });

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
BackgroundService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
BackgroundService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
TreeService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TreeService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
TreeNodeService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TreeNodeService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
ApplicationService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ApplicationService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
ApplicationBackgroundService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ApplicationBackgroundService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
ApplicationParameterService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ApplicationParameterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
CodeListService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
CodeListService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];

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
MapConfigurationManagerService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
MapConfigurationManagerService.ctorParameters = () => [];
/** @nocollapse */ MapConfigurationManagerService.ngInjectableDef = defineInjectable({ factory: function MapConfigurationManagerService_Factory() { return new MapConfigurationManagerService(); }, token: MapConfigurationManagerService, providedIn: "root" });

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
HasAnyAuthorityDirective.decorators = [
    { type: Directive, args: [{
                selector: '[sitmunHasAnyAuthority]'
            },] },
];
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
HasAnyAuthorityOnTerritoryDirective.decorators = [
    { type: Directive, args: [{
                selector: '[sitmunHasAnyAuthorityOnTerritory]'
            },] },
];
/** @nocollapse */
HasAnyAuthorityOnTerritoryDirective.ctorParameters = () => [
    { type: Principal },
    { type: TemplateRef },
    { type: ViewContainerRef }
];
HasAnyAuthorityOnTerritoryDirective.propDecorators = {
    sitmunHasAnyAuthorityOnTerritory: [{ type: Input }]
};

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
                ConfigurationParametersService,
                CapabilitiesService,
                ServiceParameterService,
                CartographyService,
                CartographyGroupService,
                CartographyAvailabilityService,
                CartographyParameterService,
                CartographySpatialSelectionParameterService,
                CartographyStyleService,
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
SitmunFrontendCoreModule.decorators = [
    { type: NgModule, args: [{
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
            },] },
];

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
AngularHalModule.decorators = [
    { type: NgModule, args: [{
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
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { AccountService, AuthService, AuthInterceptor, AuthExpiredInterceptor, LoginService, Principal, DashboardService, User, UserService, UserPosition, UserPositionService, UserConfiguration, UserConfigurationService, Territory, TerritoryService, TerritoryType, TerritoryTypeService, TerritoryGroupType, TerritoryGroupTypeService, Role, RoleService, Connection, ConnectionService, GEOADMIN_TREE_TASK_ID, Task, TaskService, TaskType, TaskTypeService, TaskGroup, TaskGroupService, TaskParameter, TaskParameterService, TaskAvailability, TaskAvailabilityService, TaskUI, TaskUIService, TranslationService, Translation, Language, LanguageService, Service, ServiceService, ConfigurationParametersService, ConfigurationParameter, ServiceParameter, ServiceParameterService, Capabilitie, CapabilitiesService, Cartography, CartographyService, CartographyGroup, CartographyGroupService, CartographyAvailability, CartographyAvailabilityService, CartographyFilter, CartographyFilterService, CartographyParameter, CartographyParameterService, CartographySpatialSelectionParameterService, CartographyStyle, CartographyStyleService, Background, BackgroundService, Tree, TreeService, TreeNode, TreeNodeService, TERRITORIAL_APP_NAME, Application, ApplicationService, ApplicationBackground, ApplicationBackgroundService, ApplicationParameter, ApplicationParameterService, CodeList, CodeListService, Layer, OptionalParameter, LayerConfiguration, LayerGroup, MapOptionsConfiguration, MapComponentStatus, MapConfigurationManagerService, createTranslateLoader, SitmunFrontendCoreModule, ExternalService, RestService, Resource, ResourceArray, ResourceService, ResourceHelper, AngularHalModule, HasAnyAuthorityOnTerritoryDirective as ɵb, HasAnyAuthorityDirective as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWNvcmUuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLWFycmF5LnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS1oZWxwZXIudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9leHRlcm5hbC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hY2NvdW50L2FjY291bnQuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvYXV0aC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLmludGVyY2VwdG9yLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9wcmluY2lwYWwuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvYXV0aC1leHBpcmVkLmludGVyY2VwdG9yLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9sb2dpbi5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvZGFzaGJvYXJkL2Rhc2hib2FyZC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3VzZXIvdXNlci1jb25maWd1cmF0aW9uLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXR5cGUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stdHlwZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWF2YWlsYWJpbGl0eS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay1hdmFpbGFiaWxpdHkuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJhbnNsYXRpb24vdHJhbnNsYXRpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmFuc2xhdGlvbi90cmFuc2xhdGlvbi5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJhbnNsYXRpb24vbGFuZ3VhZ2UubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmFuc2xhdGlvbi9sYW5ndWFnZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb24tcGFyYW1ldGVycy5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9zZXJ2aWNlL3NlcnZpY2UtcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHkubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5Lm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1maWx0ZXIubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1maWx0ZXIuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXBhcmFtZXRlci5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktc3BhdGlhbC1zZWxlY3Rpb24tcGFyYW1ldGVyLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1zdHlsZS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXN0eWxlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvYmFja2dyb3VuZC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmVlL3RyZWUtbm9kZS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS1ub2RlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24tYmFja2dyb3VuZC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24tcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24tcGFyYW1ldGVyLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb2RlbGlzdC9jb2RlbGlzdC5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NvZGVsaXN0L2NvZGVsaXN0LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9tYXAvbWFwLWNvbmZpZ3VyYXRpb24tbWFuYWdlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9oYXMtYW55LWF1dGhvcml0eS5kaXJlY3RpdmUudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LW9uLXRlcnJpdG9yeS5kaXJlY3RpdmUudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9zaXRtdW4tZnJvbnRlbmQtY29yZS5tb2R1bGUudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL2FuZ3VsYXItaGFsLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHt0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7Y2F0Y2hFcnJvciwgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtBcnJheUludGVyZmFjZX0gZnJvbSAnLi9hcnJheS1pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBSRVNUIGFycmF5IG9mIHJlc291cmNlIGltcGxlbWVudGF0aW9uICovXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUFycmF5PFQgZXh0ZW5kcyBSZXNvdXJjZT4gaW1wbGVtZW50cyBBcnJheUludGVyZmFjZTxUPiB7XHJcbiAgICAvKiogc29ydGluZyBpbmZvICovXHJcbiAgICBwdWJsaWMgc29ydEluZm86IFNvcnRbXTtcclxuICAgIC8qKiBwcm94eSB1cmwgKi9cclxuICAgIHB1YmxpYyBwcm94eVVybDogc3RyaW5nO1xyXG4gICAgLyoqIHJvb3QgdXJsICovXHJcbiAgICBwdWJsaWMgcm9vdFVybDogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBzZWxmIHVybCAqL1xyXG4gICAgcHVibGljIHNlbGZfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogbmV4dCByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBuZXh0X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIHByZXZpb3VzIHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIHByZXZfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogZmlyc3QgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgZmlyc3RfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogbGFzdCByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBsYXN0X3VyaTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBlbWJlZGRlZCBhcnJheSBsaXN0ICovXHJcbiAgICBwdWJsaWMgX2VtYmVkZGVkO1xyXG5cclxuICAgIC8qKiB0b3RhbCBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBhcnJheSAqL1xyXG4gICAgcHVibGljIHRvdGFsRWxlbWVudHMgPSAwO1xyXG4gICAgLyoqIHRvdGFsIG51bWJlciBvZiBwYWdlcyBpbiB0aGUgcmVzcG9uc2UgKi9cclxuICAgIHB1YmxpYyB0b3RhbFBhZ2VzID0gMTtcclxuICAgIFxyXG4gICAgLyoqIHBhZ2UgbnVtYmVyIGluIHRoZSByZXNwb25zZSAqL1xyXG4gICAgcHVibGljIHBhZ2VOdW1iZXIgPSAxO1xyXG4gICAgXHJcbiAgICAvKiogcGFnZSBzaXplICovXHJcbiAgICBwdWJsaWMgcGFnZVNpemU6IG51bWJlcjtcclxuXHJcbiAgICAvKiogYXJyYXkgY29tcG9uZW50cyAqL1xyXG4gICAgcHVibGljIHJlc3VsdDogVFtdID0gW107XHJcblxyXG4gICAgLyoqIHB1c2ggYSBuZXcgcmVzb3VyY2UgdG8gdGhlIGFycmF5ICovXHJcbiAgICBwdXNoID0gKGVsOiBUKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZXN1bHQucHVzaChlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBsZW5ndGggb2YgdGhlIGFycmF5ICovXHJcbiAgICBsZW5ndGggPSAoKTogbnVtYmVyID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHQubGVuZ3RoO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogbG9hZCBhcnJheSBkYXRhIGZyb20gUkVTVCByZXF1ZXN0ICovXHJcbiAgICBwcml2YXRlIGluaXQgPSAodHlwZTogeyBuZXcoKTogVCB9LCByZXNwb25zZTogYW55LCBzb3J0SW5mbzogU29ydFtdKTogUmVzb3VyY2VBcnJheTxUPiA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4odGhpcy5fZW1iZWRkZWQpO1xyXG4gICAgICAgIHJlc3VsdC5zb3J0SW5mbyA9IHNvcnRJbmZvO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIG5leHQgcGFnZSAqL1xyXG4gICAgbmV4dCA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5uZXh0X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLm5leHRfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gbmV4dCBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIHByZXZpb3VzIHBhZ2UgKi9cclxuICAgIHByZXYgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJldl91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5wcmV2X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHByZXYgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBmaXJzdCBwYWdlICovXHJcbiAgICBmaXJzdCA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5maXJzdF91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5maXJzdF91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBmaXJzdCBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIGxhc3QgcGFnZSAqL1xyXG4gICAgbGFzdCA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5sYXN0X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLmxhc3RfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gbGFzdCBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIHBhZ2Ugd2l0aCBnaXZlbiBwYWdlTnVtYmVyKi9cclxuICAgIHBhZ2UgPSAodHlwZTogeyBuZXcoKTogVCB9LCBwYWdlTnVtYmVyOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7P3BhZ2Usc2l6ZSxzb3J0fScsICcnKTtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7JnNvcnR9JywgJycpO1xyXG4gICAgICAgIGxldCB1cmxQYXJzZWQgPSB1cmwucGFyc2UoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkpO1xyXG4gICAgICAgIGxldCBxdWVyeTogc3RyaW5nID0gUmVzb3VyY2VBcnJheS5yZXBsYWNlT3JBZGQodXJsUGFyc2VkLnF1ZXJ5LCAnc2l6ZScsIHRoaXMucGFnZVNpemUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgcXVlcnkgPSBSZXNvdXJjZUFycmF5LnJlcGxhY2VPckFkZChxdWVyeSwgJ3BhZ2UnLCBwYWdlTnVtYmVyLnRvU3RyaW5nKCkpO1xyXG5cclxuXHJcbiAgICAgICAgbGV0IHVyaSA9IHVybFBhcnNlZC5xdWVyeSA/XHJcbiAgICAgICAgICAgIFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLnJlcGxhY2UodXJsUGFyc2VkLnF1ZXJ5LCBxdWVyeSkgOiBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5jb25jYXQocXVlcnkpO1xyXG4gICAgICAgIHVyaSA9IHRoaXMuYWRkU29ydEluZm8odXJpKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIFNvcnQgY29sbGVjdGlvbiBiYXNlZCBvbiBnaXZlbiBzb3J0IGF0dHJpYnV0ZSAqL1xyXG4gICAgc29ydEVsZW1lbnRzID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgLi4uc29ydDogU29ydFtdKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgnez9wYWdlLHNpemUsc29ydH0nLCAnJyk7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgneyZzb3J0fScsICcnKTtcclxuICAgICAgICBsZXQgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkuY29uY2F0KCc/JywgJ3NpemU9JywgdGhpcy5wYWdlU2l6ZS50b1N0cmluZygpLCAnJnBhZ2U9JywgdGhpcy5wYWdlTnVtYmVyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHVyaSA9IHRoaXMuYWRkU29ydEluZm8odXJpKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgc29ydCkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgcGFnZSB3aXRoIGdpdmVuIHNpemUgKi9cclxuICAgIHNpemUgPSAodHlwZTogeyBuZXcoKTogVCB9LCBzaXplOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBsZXQgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkuY29uY2F0KCc/JywgJ3NpemU9Jywgc2l6ZS50b1N0cmluZygpKTtcclxuICAgICAgICB1cmkgPSB0aGlzLmFkZFNvcnRJbmZvKHVyaSk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBBZGQgc29ydCBpbmZvIHRvIGdpdmVuIFVSSSAqL1xyXG4gICAgcHJpdmF0ZSBhZGRTb3J0SW5mbyh1cmk6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLnNvcnRJbmZvKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLnNvcnRJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICB1cmkgPSB1cmkuY29uY2F0KCcmc29ydD0nLCBpdGVtLnBhdGgsICcsJywgaXRlbS5vcmRlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVyaTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQWRkIHJlcGxhY2Ugb3IgYWRkIHBhcmFtIHZhbHVlIHRvIHF1ZXJ5IHN0cmluZyAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVwbGFjZU9yQWRkKHF1ZXJ5OiBzdHJpbmcsIGZpZWxkOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChxdWVyeSkge1xyXG4gICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSBxdWVyeS5pbmRleE9mKGZpZWxkKTtcclxuICAgICAgICAgICAgbGV0IGlkeE5leHRBbXA6IG51bWJlciA9IHF1ZXJ5LmluZGV4T2YoJyYnLCBpZHgpID09IC0xID8gcXVlcnkuaW5kZXhPZignLycsIGlkeCkgOiBxdWVyeS5pbmRleE9mKCcmJywgaWR4KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWFjaFZhbHVlID0gcXVlcnkuc3Vic3RyaW5nKGlkeCwgaWR4TmV4dEFtcCk7XHJcbiAgICAgICAgICAgICAgICBxdWVyeSA9IHF1ZXJ5LnJlcGxhY2Uoc2VhY2hWYWx1ZSwgZmllbGQgKyAnPScgKyB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBxdWVyeSA9IHF1ZXJ5LmNvbmNhdChcIiZcIiArIGZpZWxkICsgJz0nICsgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcXVlcnkgPSBcIj9cIiArIGZpZWxkICsgJz0nICsgdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBxdWVyeTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0h0dHBDbGllbnQsIEh0dHBIZWFkZXJzLCBIdHRwUGFyYW1zfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQge0hhbE9wdGlvbnN9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5pbXBvcnQge2lzTnVsbE9yVW5kZWZpbmVkLCBpc1ByaW1pdGl2ZX0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xyXG5cclxuLyoqIFJFU1QgQVBJIGFjY2VzcyBoZWxwZXIgKi9cclxuZXhwb3J0IGNsYXNzIFJlc291cmNlSGVscGVyIHtcclxuXHJcbiAgICAvKiogSHR0cEhlYWRlcnMgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaGVhZGVyczogSHR0cEhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuICAgIC8qKiBQcm94eSBVUkwgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHByb3h5X3VyaTogc3RyaW5nID0gbnVsbDtcclxuICAgIC8qKiBSb290IFVSTCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcm9vdF91cmk6IHN0cmluZyA9IG51bGw7XHJcbiAgICAvKiogSHR0cENsaWVudCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaHR0cDogSHR0cENsaWVudCA9IG51bGw7XHJcblxyXG4gICAgLyoqIGdldCByZXF1ZXN0IGhlYWRlcnMgKi9cclxuICAgIC8qcHVibGljIHN0YXRpYyBnZXQgaGVhZGVycygpOiBIdHRwSGVhZGVycyB7XHJcbiAgICAgICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2hlYWRlcnMpKVxyXG4gICAgICAgICAgUmVzb3VyY2VIZWxwZXIuX2hlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuX2hlYWRlcnM7XHJcbiAgICB9Ki9cclxuXHJcbiAgICAvKiogc2V0IHJlcXVlc3QgaGVhZGVycyAqL1xyXG4gICAgLypwdWJsaWMgc3RhdGljIHNldCBoZWFkZXJzKGhlYWRlcnM6IEh0dHBIZWFkZXJzKSB7XHJcbiAgICAgIFJlc291cmNlSGVscGVyLl9oZWFkZXJzID0gaGVhZGVycztcclxuICAgIH0qL1xyXG5cclxuICAgIC8qKiBnZXQgcmVxdWVzdCBvcHRpb24gcGFyYW1zICovXHJcbiAgICBzdGF0aWMgb3B0aW9uUGFyYW1zKHBhcmFtczogSHR0cFBhcmFtcywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBIdHRwUGFyYW1zIHtcclxuICAgICAgICBpZiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHBhcmFtIG9mIG9wdGlvbnMucGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZChwYXJhbS5rZXksIHBhcmFtLnZhbHVlLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zaXplKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdzaXplJywgb3B0aW9ucy5zaXplLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zb3J0KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHMgb2Ygb3B0aW9ucy5zb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNvcnRTdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICBzb3J0U3RyaW5nID0gcy5wYXRoID8gc29ydFN0cmluZy5jb25jYXQocy5wYXRoKSA6IHNvcnRTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydFN0cmluZyA9IHMub3JkZXIgPyBzb3J0U3RyaW5nLmNvbmNhdCgnLCcpLmNvbmNhdChzLm9yZGVyKSA6IHNvcnRTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnc29ydCcsIHNvcnRTdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiByZXNvbHZlIHJlc291cmNlIHJlbGF0aW9ucyAqL1xyXG4gICAgc3RhdGljIHJlc29sdmVSZWxhdGlvbnMocmVzb3VyY2U6IFJlc291cmNlKTogT2JqZWN0IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IGFueSA9IHt9O1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHJlc291cmNlKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2Vba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChSZXNvdXJjZUhlbHBlci5jbGFzc05hbWUocmVzb3VyY2Vba2V5XSlcclxuICAgICAgICAgICAgICAgICAgICAuZmluZCgoY2xhc3NOYW1lOiBzdHJpbmcpID0+IGNsYXNzTmFtZSA9PSAnUmVzb3VyY2UnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZVtrZXldWydfbGlua3MnXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSByZXNvdXJjZVtrZXldWydfbGlua3MnXVsnc2VsZiddWydocmVmJ107XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmVzb3VyY2Vba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXJyYXk6IGFueVtdID0gcmVzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0ucHVzaChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldLnB1c2godGhpcy5yZXNvbHZlUmVsYXRpb25zKGVsZW1lbnQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHJlc291cmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCBhcyBPYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSBhbiBlbXB0eSByZXNvdXJjZSBmcm9tIGVtYmVkZGVkIGRhdGEqL1xyXG4gICAgc3RhdGljIGNyZWF0ZUVtcHR5UmVzdWx0PFQgZXh0ZW5kcyBSZXNvdXJjZT4oX2VtYmVkZGVkOiBzdHJpbmcpOiBSZXNvdXJjZUFycmF5PFQ+IHtcclxuICAgICAgICBsZXQgcmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiA9IG5ldyBSZXNvdXJjZUFycmF5PFQ+KCk7XHJcbiAgICAgICAgcmVzb3VyY2VBcnJheS5fZW1iZWRkZWQgPSBfZW1iZWRkZWQ7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBjbGFzcyBuYW1lKi9cclxuICAgIHN0YXRpYyBnZXRDbGFzc05hbWUob2JqOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBmdW5jTmFtZVJlZ2V4ID0gL2Z1bmN0aW9uICguKz8pXFwoLztcclxuICAgICAgICB2YXIgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKG9iai5jb25zdHJ1Y3Rvci50b1N0cmluZygpKTtcclxuICAgICAgICByZXR1cm4gKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiAxKSA/IHJlc3VsdHNbMV0gOiAnJztcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgY2xhc3MgbmFtZSBmcm9tIGEgcHJvdG90eXBlIG9iamVjdCovXHJcbiAgICBzdGF0aWMgY2xhc3NOYW1lKG9ialByb3RvOiBhbnkpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZXMgPSBbXTtcclxuICAgICAgICBsZXQgb2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9ialByb3RvKTtcclxuICAgICAgICBsZXQgY2xhc3NOYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIHdoaWxlICgoY2xhc3NOYW1lID0gUmVzb3VyY2VIZWxwZXIuZ2V0Q2xhc3NOYW1lKG9iaikpICE9PSAnT2JqZWN0Jykge1xyXG4gICAgICAgICAgICBjbGFzc05hbWVzLnB1c2goY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgb2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2xhc3NOYW1lcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogaW5zdGFudGlhdGUgYSBSZXNvdXJjZUNvbGxlY3Rpb24gZnJvbSByZXNwb25zZSBlbWJlZGRlZCBkYXRhKi9cclxuICAgIHN0YXRpYyBpbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcGF5bG9hZDogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+LCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIsZW1iZWRkZWROYW1lPzpTdHJpbmcpOiBSZXNvdXJjZUFycmF5PFQ+IHtcclxuICAgICAgICBmb3IgKGNvbnN0IGVtYmVkZGVkQ2xhc3NOYW1lIG9mIE9iamVjdC5rZXlzKHBheWxvYWRbcmVzdWx0Ll9lbWJlZGRlZF0pKSB7XHJcbiAgICAgICAgICAgIGlmKCFlbWJlZGRlZE5hbWUgfHwgKGVtYmVkZGVkTmFtZSAmJiBlbWJlZGRlZENsYXNzTmFtZT09ZW1iZWRkZWROYW1lKSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZW1iZWRkZWQ6IGFueSA9IHBheWxvYWRbcmVzdWx0Ll9lbWJlZGRlZF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IGVtYmVkZGVkW2VtYmVkZGVkQ2xhc3NOYW1lXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5zdGFuY2U6IFQgPSBuZXcgdHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0gdGhpcy5zZWFyY2hTdWJ0eXBlcyhidWlsZGVyLCBlbWJlZGRlZENsYXNzTmFtZSwgaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc3RhbnRpYXRlUmVzb3VyY2UoaW5zdGFuY2UsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdWx0LnRvdGFsRWxlbWVudHMgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2UudG90YWxFbGVtZW50cyA6IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgcmVzdWx0LnRvdGFsUGFnZXMgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2UudG90YWxQYWdlcyA6IDE7XHJcbiAgICAgICAgcmVzdWx0LnBhZ2VOdW1iZXIgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2UubnVtYmVyIDogMTtcclxuICAgICAgICByZXN1bHQucGFnZVNpemUgPSBwYXlsb2FkLnBhZ2UgPyBwYXlsb2FkLnBhZ2Uuc2l6ZSA6IDIwO1xyXG5cclxuICAgICAgICByZXN1bHQuc2VsZl91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5zZWxmID8gcGF5bG9hZC5fbGlua3Muc2VsZi5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5uZXh0X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLm5leHQgPyBwYXlsb2FkLl9saW5rcy5uZXh0LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVzdWx0LnByZXZfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3MucHJldiA/IHBheWxvYWQuX2xpbmtzLnByZXYuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQuZmlyc3RfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3MuZmlyc3QgPyBwYXlsb2FkLl9saW5rcy5maXJzdC5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5sYXN0X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLmxhc3QgPyBwYXlsb2FkLl9saW5rcy5sYXN0LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHN1YnR5cGVzKi9cclxuICAgIHN0YXRpYyBzZWFyY2hTdWJ0eXBlczxUIGV4dGVuZHMgUmVzb3VyY2U+KGJ1aWxkZXI6IFN1YlR5cGVCdWlsZGVyLCBlbWJlZGRlZENsYXNzTmFtZTogc3RyaW5nLCBpbnN0YW5jZTogVCkge1xyXG4gICAgICAgIGlmIChidWlsZGVyICYmIGJ1aWxkZXIuc3VidHlwZXMpIHtcclxuICAgICAgICAgICAgbGV0IGtleXMgPSBidWlsZGVyLnN1YnR5cGVzLmtleXMoKTtcclxuICAgICAgICAgICAgQXJyYXkuZnJvbShrZXlzKS5mb3JFYWNoKChzdWJ0eXBlS2V5OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbWJlZGRlZENsYXNzTmFtZS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoc3VidHlwZUtleS50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdWJ0eXBlOiB7IG5ldygpOiBhbnkgfSA9IGJ1aWxkZXIuc3VidHlwZXMuZ2V0KHN1YnR5cGVLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0gbmV3IHN1YnR5cGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogaW5zdGFudGlhdGUgYSBSZXNvdXJjZSBmcm9tIHJlc3BvbnNlICovXHJcbiAgICBzdGF0aWMgaW5zdGFudGlhdGVSZXNvdXJjZTxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCwgcGF5bG9hZDogT2JqZWN0KTogVCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBwIGluIHBheWxvYWQpIHtcclxuICAgICAgICAgICAgLy9UT0RPIGFycmF5IGluaXRcclxuICAgICAgICAgICAgLyogaWYoZW50aXR5W3BdLmNvbnN0cnVjdG9yID09PSBBcnJheSAmJiBpc051bGxPclVuZGVmaW5lZChwYXlsb2FkW3BdKSlcclxuICAgICAgICAgICAgICAgICBlbnRpdHlbcF0gPSBbXTtcclxuICAgICAgICAgICAgIGVsc2UqL1xyXG4gICAgICAgICAgICBlbnRpdHlbcF0gPSBwYXlsb2FkW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgcHJveHkgVVJMICovXHJcbiAgICBzdGF0aWMgc2V0UHJveHlVcmkocHJveHlfdXJpOiBzdHJpbmcpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgPSBwcm94eV91cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBSb290IFVSSSAqL1xyXG4gICAgc3RhdGljIHNldFJvb3RVcmkocm9vdF91cmk6IHN0cmluZykge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnJvb3RfdXJpID0gcm9vdF91cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBVUkwgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLnByb3h5X3VyaSAmJiBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgIT0gJycgP1xyXG4gICAgICAgICAgICBSZXNvdXJjZUhlbHBlci5hZGRTbGFzaChSZXNvdXJjZUhlbHBlci5wcm94eV91cmkpIDpcclxuICAgICAgICAgICAgUmVzb3VyY2VIZWxwZXIuYWRkU2xhc2goUmVzb3VyY2VIZWxwZXIucm9vdF91cmkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBhZGQgc2xhc2ggdG8gVVJJICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhZGRTbGFzaCh1cmk6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHVyaVBhcnNlZCA9IHVybC5wYXJzZSh1cmkpO1xyXG4gICAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZCh1cmlQYXJzZWQuc2VhcmNoKSAmJiB1cmkgJiYgdXJpW3VyaS5sZW5ndGggLSAxXSAhPSAnLycpXHJcbiAgICAgICAgICAgIHJldHVybiB1cmkgKyAnLyc7XHJcbiAgICAgICAgcmV0dXJuIHVyaTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHByb3h5IGZyb20gVVJMICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFByb3h5KHVybDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIVJlc291cmNlSGVscGVyLnByb3h5X3VyaSB8fCBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgPT0gJycpXHJcbiAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmFkZFNsYXNoKHVybC5yZXBsYWNlKFJlc291cmNlSGVscGVyLnJvb3RfdXJpLCBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IEh0dHBDbGllbnQqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXRIdHRwKGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5odHRwID0gaHR0cDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEh0dHBDbGllbnQqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRIdHRwKCk6IEh0dHBDbGllbnQge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5odHRwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcm9vdCBVUkkqL1xyXG4gICAgc3RhdGljIGdldFJvb3RVcmkoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLnJvb3RfdXJpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5pbXBvcnQge3Rocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3IsIG9mIGFzIG9ic2VydmFibGVPZn0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuXHJcbmltcG9ydCB7SHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWR9IGZyb20gJ3V0aWwnO1xyXG5cclxuaW1wb3J0IHtIYWxPcHRpb25zfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBBYnN0cmFjdCByZXNvdXJjZSBjbGFzcyovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlc291cmNlIHtcclxuXHJcbiAgICAvKiogcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgcHJveHlVcmw6IHN0cmluZztcclxuICAgIC8qKiByb290IFVSTCAqL1xyXG4gICAgcHVibGljIHJvb3RVcmw6IHN0cmluZztcclxuXHJcbiAgICAvKiogbGlua3MgKi9cclxuICAgIHB1YmxpYyBfbGlua3M6IGFueTtcclxuICAgIC8qKiBzdWJ0eXBlcyAqL1xyXG4gICAgcHVibGljIF9zdWJ0eXBlczogTWFwPHN0cmluZywgYW55PjtcclxuXHJcbiAgICBcclxuICAgIC8qKiBnZXQgc3VidHlwZXMgKi8gICAgXHJcbiAgICBwdWJsaWMgZ2V0IHN1YnR5cGVzKCk6IE1hcDxzdHJpbmcsIGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJ0eXBlcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHN1YnR5cGVzICovXHJcbiAgICBwdWJsaWMgc2V0IHN1YnR5cGVzKF9zdWJ0eXBlczogTWFwPHN0cmluZywgYW55Pikge1xyXG4gICAgICAgIHRoaXMuX3N1YnR5cGVzID0gX3N1YnR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKiogR2V0IGNvbGxlY3Rpb24gb2YgcmVsYXRlZCByZXNvdXJjZXMgKi9cclxuICAgIHB1YmxpYyBnZXRSZWxhdGlvbkFycmF5PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZWxhdGlvbjogc3RyaW5nLCBfZW1iZWRkZWQ/OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oaXNOdWxsT3JVbmRlZmluZWQoX2VtYmVkZGVkKSA/IFwiX2VtYmVkZGVkXCIgOiBfZW1iZWRkZWQpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb248VD4odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCwgYnVpbGRlcikpLFxyXG4gICAgICAgICAgICAgICAgbWFwKChhcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4gYXJyYXkucmVzdWx0KSwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YoW10pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogR2V0IHJlbGF0ZWQgcmVzb3VyY2UgKi9cclxuICAgIHB1YmxpYyBnZXRSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVsYXRpb246IHN0cmluZywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ1aWxkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGVtYmVkZGVkQ2xhc3NOYW1lIG9mIE9iamVjdC5rZXlzKGRhdGFbJ19saW5rcyddKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1iZWRkZWRDbGFzc05hbWUgPT0gJ3NlbGYnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaHJlZjogc3RyaW5nID0gZGF0YS5fbGlua3NbZW1iZWRkZWRDbGFzc05hbWVdLmhyZWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSBocmVmLmxhc3RJbmRleE9mKCcvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhbENsYXNzTmFtZSA9IGhyZWYucmVwbGFjZShSZXNvdXJjZUhlbHBlci5nZXRSb290VXJpKCksIFwiXCIpLnN1YnN0cmluZygwLCBpZHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gUmVzb3VyY2VIZWxwZXIuc2VhcmNoU3VidHlwZXMoYnVpbGRlciwgcmVhbENsYXNzTmFtZSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBBZGRzIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGUgYm91bmQgY29sbGVjdGlvbiBieSB0aGUgcmVsYXRpb24gKi9cclxuICAgIHB1YmxpYyBhZGRSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucG9zdChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYsIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBCaW5kIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSBnaXZlbiByZWxhdGlvbiovXHJcbiAgICBwdWJsaWMgdXBkYXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBhdGNoKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEJpbmQgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoaXMgcmVzb3VyY2UgYnkgdGhlIGdpdmVuIHJlbGF0aW9uKi9cclxuICAgIHB1YmxpYyBzdWJzdGl0dXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYsIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIC8qKiBCaW5kIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSBnaXZlbiByZWxhdGlvbiovXHJcbiAgICBwdWJsaWMgc3Vic3RpdHV0ZUFsbFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2VzOiBSZXNvdXJjZVtdKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2VzLm1hcCgocmVzb3VyY2UpID0+IHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYpLCB7aGVhZGVyczogaGVhZGVyfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8qKiBVbmJpbmQgdGhlIHJlc291cmNlIHdpdGggdGhlIGdpdmVuIHJlbGF0aW9uIGZyb20gdGhpcyByZXNvdXJjZSovXHJcbiAgICBwdWJsaWMgZGVsZXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlLl9saW5rcykpIHtcclxuICAgICAgICAgICAgbGV0IGxpbms6IHN0cmluZyA9IHJlc291cmNlLl9saW5rc1snc2VsZiddLmhyZWY7XHJcbiAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IGxpbmsubGFzdEluZGV4T2YoJy8nKSArIDE7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWR4ID09IC0xKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlbGF0aW9uSWQ6IHN0cmluZyA9IGxpbmsuc3Vic3RyaW5nKGlkeCk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmICsgJy8nICsgcmVsYXRpb25JZCksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIFVuYmluZCB0aGUgcmVzb3VyY2Ugd2l0aCB0aGUgZ2l2ZW4gcmVsYXRpb24gZnJvbSB0aGlzIHJlc291cmNlKi9cclxuICAgIHB1YmxpYyBkZWxldGVBbGxSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmICksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFVzZXJDb25maWd1cmF0aW9uIH0gZnJvbSAnLi91c2VyLWNvbmZpZ3VyYXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBVc2VyUG9zaXRpb24gfSBmcm9tICcuL3VzZXItcG9zaXRpb24ubW9kZWwnO1xyXG5cclxuLyoqXHJcbiAqIFVzZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBVc2VyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIHVzZXJuYW1lICovXHJcbiAgcHVibGljIHVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHBhc3N3b3JkICovXHJcbiAgcHVibGljIHBhc3N3b3JkOiBzdHJpbmc7XHJcbiAgLyoqIGZpcnN0IG5hbWUgKi9cclxuICBwdWJsaWMgZmlyc3ROYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGxhc3QgbmFtZSAqL1xyXG4gIHB1YmxpYyBsYXN0TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB3aGV0aGVyIHVzZXIgaXMgYmxvY2tlZCAqL1xyXG4gIHB1YmxpYyBibG9ja2VkOiBib29sZWFuO1xyXG4gIC8qKiB3aGV0aGVyIHVzZXIgaXMgYWRtaW5pc3RyYXRvciAqL1xyXG4gIHB1YmxpYyBhZG1pbmlzdHJhdG9yOiBib29sZWFuO1xyXG4gIC8qKiBJcyBwYXNzd29yZFNldCAqL1xyXG4gIHB1YmxpYyBwYXNzd29yZFNldDogYm9vbGVhbjtcclxuICAvKiogdXNlciBwb3NpdGlvbnMgKi9cclxuICBwdWJsaWMgcG9zaXRpb25zOiBVc2VyUG9zaXRpb25bXTtcclxuICAvKiogdXNlciBwZXJtaXNzaW9ucyAqL1xyXG4gIHB1YmxpYyBwZXJtaXNzaW9uczogVXNlckNvbmZpZ3VyYXRpb25bXTtcclxufVxyXG4iLCJpbXBvcnQge0h0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5pbXBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9FeHRlcm5hbENvbmZpZ3VyYXRpb24nO1xyXG5cclxuXHJcbi8qKiBFeHRlcm5hbFNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxTZXJ2aWNlIHtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoJ0V4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UnKSBwcml2YXRlIGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2U6IEV4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2UpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRQcm94eVVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFByb3h5VXJpKCkpO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFJvb3RVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRSb290VXJpKCkpO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldEh0dHAoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRIdHRwKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlciAqL1xyXG4gICAgcHVibGljIHVwZGF0ZUV4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2UoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTogRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZSkge1xyXG5cdHRoaXMuZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZSA9IGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2U7XHJcblxyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFByb3h5VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0Um9vdFVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0SHR0cChleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEh0dHAoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBFeHRlcm5hbENvbmZpZ3VyYXRpb24gKi9cclxuICAgIHB1YmxpYyBnZXRFeHRlcm5hbENvbmZpZ3VyYXRpb24oKTogRXh0ZXJuYWxDb25maWd1cmF0aW9uIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEV4dGVybmFsQ29uZmlndXJhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgZ2V0UHJveHlVcmkoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFByb3h5VXJpKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBSb290IFVSSSAqL1xyXG4gICAgcHVibGljIGdldFJvb3RVcmkoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IFVSTCAqL1xyXG4gICAgcHVibGljIGdldFVSTCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRVUkwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEh0dHBDbGllbnQgKi9cclxuICAgIHB1YmxpYyBnZXRIdHRwKCk6IEh0dHBDbGllbnQge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IHRocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0IHsgUmVzb3VyY2VIZWxwZXIgfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cFBhcmFtcywgSHR0cFJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBTb3J0IH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHsgUmVzb3VyY2VBcnJheSB9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQgeyBFeHRlcm5hbFNlcnZpY2UgfSBmcm9tICcuL2V4dGVybmFsLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBIYWxPcHRpb25zIH0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdWJUeXBlQnVpbGRlciB9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFJlc291cmNlU2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZVNlcnZpY2Uge1xyXG5cclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZXh0ZXJuYWxTZXJ2aWNlOiBFeHRlcm5hbFNlcnZpY2UpIHsgfVxyXG5cclxuXHJcbiAgICAvKiogZ2V0IFVSTCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldFVSTCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgYWxsIHJlc291cmNlcyBmcm9tIGEgYmFzZSBVUkkgb2YgYSBnaXZlbiB0eXBlICovXHJcbiAgICBwdWJsaWMgZ2V0QWxsPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZTogc3RyaW5nLCBfZW1iZWRkZWQ6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMsIHN1YlR5cGU/OiBTdWJUeXBlQnVpbGRlciwgZW1iZWRkZWROYW1lPzpTdHJpbmcpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJz9wcm9qZWN0aW9uPXZpZXcnKTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oX2VtYmVkZGVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzKHJlc3VsdCk7XHJcbiAgICAgICAgcmVzdWx0LnNvcnRJbmZvID0gb3B0aW9ucyA/IG9wdGlvbnMuc29ydCA6IHVuZGVmaW5lZDtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIHBhcmFtczogcGFyYW1zIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQsIHN1YlR5cGUsZW1iZWRkZWROYW1lKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGEgYmFzZSBVUkkgYW5kIGEgZ2l2ZW4gaWQgKi9cclxuICAgIHB1YmxpYyBnZXQ8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlOiBzdHJpbmcsIGlkOiBhbnkpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy8nLCBpZCwgJz9wcm9qZWN0aW9uPXZpZXcnKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChkYXRhID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGl0cyBzZWxmbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5U2VsZkxpbms8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkocmVzb3VyY2VMaW5rKSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKGRhdGEgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlcyBmcm9tIGEgZ2l2ZW4gYmFzZSBwYXRoLCBxdWVyeSBhbmQgb3B0aW9ucyAqL1xyXG4gICAgcHVibGljIHNlYXJjaDxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcXVlcnk6IHN0cmluZywgcmVzb3VyY2U6IHN0cmluZywgX2VtYmVkZGVkOiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvc2VhcmNoLycsIHF1ZXJ5KTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oX2VtYmVkZGVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtcyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCBhIHNpbmdsZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gYmFzZSBwYXRoLCBxdWVyeSBhbmQgb3B0aW9ucyAqL1xyXG4gICAgcHVibGljIHNlYXJjaFNpbmdsZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcXVlcnk6IHN0cmluZywgcmVzb3VyY2U6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy9zZWFyY2gvJywgcXVlcnkpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIHJlc3BvbnNlKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgY3VzdG9tIHF1ZXJ5IGFuZCBvcHRpb25zICovXHJcbiAgICBwdWJsaWMgY3VzdG9tUXVlcnk8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UgKyBxdWVyeSk7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZ2l2ZW4gYSByZWxhdGlvbiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2VMaW5rOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQocmVzb3VyY2VMaW5rLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoZGF0YSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgZGF0YSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZ2l2ZW4gYSByZWxhdGlvbiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlSZWxhdGlvbkFycmF5PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZUxpbms6IHN0cmluZywgX2VtYmVkZGVkOiBzdHJpbmcsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChyZXNvdXJjZUxpbmssIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0LCBidWlsZGVyKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNvdW50IHJlc291cmNlcyBnaXZlbiBhIHBhdGggKi9cclxuICAgIHB1YmxpYyBjb3VudChyZXNvdXJjZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy9zZWFyY2gvY291bnRBbGwnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdib2R5JyB9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHJlc3BvbnNlOiBSZXNwb25zZSkgPT4gTnVtYmVyKHJlc3BvbnNlLmJvZHkpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY3JlYXRlIHJlc291cmNlIGZyb20gc2VsZiBsaW5rIGFuZCBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgY3JlYXRlPFQgZXh0ZW5kcyBSZXNvdXJjZT4oc2VsZlJlc291cmNlOiBzdHJpbmcsIGVudGl0eTogVCkge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFVSTCgpICsgc2VsZlJlc291cmNlO1xyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKGVudGl0eSk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucG9zdCh1cmksIHBheWxvYWQsIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShlbnRpdHksIHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLCBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyB1cGRhdGU8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShlbnRpdHkuX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dCh1cmksIHBheWxvYWQsIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShlbnRpdHksIHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLCBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyB1cGRhdGVDb2xsZWN0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgcmVzb3VyY2VMaW5rOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShyZXNvdXJjZUxpbmspO1xyXG4gICAgICAgIC8vY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuICAgICAgICAvL3RoaXMuc2V0VXJsc1Jlc291cmNlKGVudGl0eSk7XHJcbiAgICAgICAgdmFyIGhlYWRlcnNSZXEgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzO1xyXG4gICAgICAgIGhlYWRlcnNSZXEuc2V0KFwiQ29udGVudC1UeXBlXCIsIFwidGV4dC91cmktbGlzdFwiKTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wdXQodXJpLCByZXNvdXJjZUFycmF5LCB7IGhlYWRlcnM6IGhlYWRlcnNSZXEsIG9ic2VydmU6ICdyZXNwb25zZScgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA1MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5OiBhbnkgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGJvZHkuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHBhdGNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgcGF0Y2g8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShlbnRpdHkuX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBhdGNoKHVyaSwgcGF5bG9hZCwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDw9IDIwNylcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKGVudGl0eSwgcmVzcG9uc2UuYm9keSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA1MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5OiBhbnkgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGJvZHkuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGRlbGV0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGRlbGV0ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCk6IE9ic2VydmFibGU8T2JqZWN0PiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkoZW50aXR5Ll9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzIH0pLnBpcGUoY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzTmV4dDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5uZXh0X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNQcmV2PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnByZXZfdXJpICE9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0ZpcnN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LmZpcnN0X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0xhc3Q8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubGFzdF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIG5leHQ8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5uZXh0KHR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBwcmV2PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucHJldih0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGZpcnN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgZmlyc3Q8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5maXJzdCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBsYXN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubGFzdCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHBhZ2Ugb2YgcmVzdWx0cyBnaXZlbiBhIHBhZ2UgbnVtYmVyKi9cclxuICAgIHB1YmxpYyBwYWdlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9LCBpZDogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucGFnZSh0eXBlLCBpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNvcnQgcmVzb3VyY2UgYXJyYXkgd2l0aCBhIGdpdmVuIHNvcnRpbmcgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc29ydEVsZW1lbnRzPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9LCAuLi5zb3J0OiBTb3J0W10pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5zb3J0RWxlbWVudHModHlwZSwgLi4uc29ydCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBzaXplKi9cclxuICAgIHB1YmxpYyBzaXplPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9LCBzaXplOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5zaXplKHR5cGUsIHNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgVVJMIGZyb20gYSBnaXZlbiBwYXRoKi9cclxuICAgIHB1YmxpYyBnZXRSZXNvdXJjZVVybChyZXNvdXJjZT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHVybCA9IFJlc291cmNlU2VydmljZS5nZXRVUkwoKTtcclxuICAgICAgICBpZiAoIXVybC5lbmRzV2l0aCgnLycpKSB7XHJcbiAgICAgICAgICAgIHVybCA9IHVybC5jb25jYXQoJy8nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc291cmNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmwuY29uY2F0KHJlc291cmNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVybDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHByb3h5IGFuZCByb290IHVybHMgb2YgZ2l2ZW4gcmVzb3VyY2UgYXJyYXkgKi9cclxuICAgIHByaXZhdGUgc2V0VXJsczxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPikge1xyXG4gICAgICAgIHJlc3VsdC5wcm94eVVybCA9IHRoaXMuZXh0ZXJuYWxTZXJ2aWNlLmdldFByb3h5VXJpKCk7XHJcbiAgICAgICAgcmVzdWx0LnJvb3RVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRSb290VXJpKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBwcm94eSBhbmQgcm9vdCB1cmxzIG9mIGdpdmVuIHJlc291cmNlICovXHJcbiAgICBwcml2YXRlIHNldFVybHNSZXNvdXJjZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc3VsdDogVCkge1xyXG4gICAgICAgIHJlc3VsdC5wcm94eVVybCA9IHRoaXMuZXh0ZXJuYWxTZXJ2aWNlLmdldFByb3h5VXJpKCk7XHJcbiAgICAgICAgcmVzdWx0LnJvb3RVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRSb290VXJpKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtvZiBhcyBvYnNlcnZhYmxlT2YsIHRocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge21hcCwgbWVyZ2VNYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZH0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG4vKiogSEFMIHBhcmFtIGRhdGEgbW9kZWwgKi9cclxuZXhwb3J0IHR5cGUgSGFsUGFyYW0gPSB7IGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9O1xyXG4vKiogSEFMIG9wdGlvbiBkYXRhIG1vZGVsICovXHJcbmV4cG9ydCB0eXBlIEhhbE9wdGlvbnMgPSB7IG5vdFBhZ2VkPzogYm9vbGVhbiwgc2l6ZT86IG51bWJlciwgc29ydD86IFNvcnRbXSwgcGFyYW1zPzogSGFsUGFyYW1bXSB9O1xyXG5cclxuLyoqIFJFU1QgQVBJIGFjY2VzcyBpbnRlcmZhY2UgKi9cclxuZXhwb3J0IGNsYXNzIFJlc3RTZXJ2aWNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ge1xyXG4gICAgLyoqIHJlc291cmNlIHR5cGUgKi9cclxuICAgIHByaXZhdGUgdHlwZTogYW55O1xyXG4gICAgLyoqIHJlc291cmNlIHBhdGggKi9cclxuICAgIHByaXZhdGUgcmVzb3VyY2U6IHN0cmluZztcclxuICAgIC8qKiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHVibGljIHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD47XHJcbiAgICAvKiogcmVzb3VyY2Ugc2VydmljZSAqL1xyXG4gICAgcHVibGljIHJlc291cmNlU2VydmljZTogUmVzb3VyY2VTZXJ2aWNlO1xyXG4gICAgLyoqIF9lbWJlZGRlZCBmaWVsZCBuYW1lICovXHJcbiAgICBwcml2YXRlIF9lbWJlZGRlZDogc3RyaW5nID0gJ19lbWJlZGRlZCc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiB7IG5ldygpOiBUIH0sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXHJcbiAgICAgICAgICAgICAgICBfZW1iZWRkZWQ/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2UgPSByZXNvdXJjZTtcclxuICAgICAgICB0aGlzLnJlc291cmNlU2VydmljZSA9IGluamVjdG9yLmdldChSZXNvdXJjZVNlcnZpY2UpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQoX2VtYmVkZGVkKSlcclxuICAgICAgICAgICAgdGhpcy5fZW1iZWRkZWQgPSBfZW1iZWRkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGVycm9yIGhhbmRsZXIgKi9cclxuICAgIHByb3RlY3RlZCBoYW5kbGVFcnJvcihlcnJvcjogYW55KTpPYnNlcnZhYmxlPG5ldmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIFJlc3RTZXJ2aWNlLmhhbmRsZUVycm9yKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZXJyb3IgaGFuZGxlciAqL1xyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBoYW5kbGVFcnJvcihlcnJvcjogYW55KTpPYnNlcnZhYmxlPG5ldmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IGFsbCByZXNvdXJjZXMgd2l0aCBvcHRpb25hbCBvcHRpb25zIGFuIHN1YlR5cGUgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgZ2V0QWxsKG9wdGlvbnM/OiBIYWxPcHRpb25zLCBzdWJUeXBlPzogU3ViVHlwZUJ1aWxkZXIsIGVtYmVkZGVkTmFtZT86U3RyaW5nKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QWxsKHRoaXMudHlwZSwgdGhpcy5yZXNvdXJjZSwgdGhpcy5fZW1iZWRkZWQsIG9wdGlvbnMsIHN1YlR5cGUsZW1iZWRkZWROYW1lKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBbGwob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gYSBnaXZlbiBpZCAqL1xyXG4gICAgcHVibGljIGdldChpZDogYW55KTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldCh0aGlzLnR5cGUsIHRoaXMucmVzb3VyY2UsIGlkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gc2VsZiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlTZWxmTGluayhzZWxmTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEJ5U2VsZkxpbmsodGhpcy50eXBlLCBzZWxmTGluayk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2gocXVlcnk6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5zZWFyY2godGhpcy50eXBlLCBxdWVyeSwgdGhpcy5yZXNvdXJjZSwgdGhpcy5fZW1iZWRkZWQsIG9wdGlvbnMpLnBpcGUoXHJcbiAgICAgICAgICAgIG1lcmdlTWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm5vdFBhZ2VkICYmICFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZUFycmF5LmZpcnN0X3VyaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm5vdFBhZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zaXplID0gcmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaChxdWVyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoU2luZ2xlKHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnNlYXJjaFNpbmdsZSh0aGlzLnR5cGUsIHF1ZXJ5LCB0aGlzLnJlc291cmNlLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlcyBmcm9tIGEgZ2l2ZW4gY3VzdG9tIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBjdXN0b21RdWVyeShxdWVyeTogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmN1c3RvbVF1ZXJ5KHRoaXMudHlwZSwgcXVlcnksIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXN0b21RdWVyeShxdWVyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uQXJyYXkocmVsYXRpb246IHN0cmluZywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QnlSZWxhdGlvbkFycmF5KHRoaXMudHlwZSwgcmVsYXRpb24sIHRoaXMuX2VtYmVkZGVkLCBidWlsZGVyKS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb24ocmVsYXRpb246IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRCeVJlbGF0aW9uKHRoaXMudHlwZSwgcmVsYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb3VudCByZXNvdXJjZXMgZ2l2ZW4gYSBwYXRoICovXHJcbiAgICBwdWJsaWMgY291bnQoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY291bnQodGhpcy5yZXNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSByZXNvdXJjZSBmcm9tIHNlbGYgbGluayBhbmQgZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGNyZWF0ZShlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY3JlYXRlKHRoaXMucmVzb3VyY2UsIGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHVwZGF0ZShlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UudXBkYXRlKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHBhdGNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgcGF0Y2goZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnBhdGNoKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGRlbGV0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGRlbGV0ZShlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5kZWxldGUoZW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyBvZiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHVibGljIHRvdGFsRWxlbWVudCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkgJiYgdGhpcy5yZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHMpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0ZpcnN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNGaXJzdCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzTmV4dCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuaGFzTmV4dCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBwcmV2aW91cyBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc1ByZXYoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc1ByZXYodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0xhc3QoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc0xhc3QodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbmV4dCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5uZXh0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBwcmV2KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnByZXYodGhpcy5yZXNvdXJjZUFycmF5LCB0aGlzLnR5cGUpLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGZpcnN0KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmZpcnN0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbGFzdCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5sYXN0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwYWdlIG9mIHJlc3VsdHMgZ2l2ZW4gYSBwYWdlIG51bWJlciovXHJcbiAgICBwdWJsaWMgcGFnZShwYWdlTnVtYmVyOiBudW1iZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wYWdlKHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlLCBwYWdlTnVtYmVyKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi91c2VyL3VzZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcblxyXG4vKiogQWNjb3VudCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQWNjb3VudFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBQ0NPVU5UX0FQSSA9ICdhY2NvdW50JztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlciwgXCJhY2NvdW50XCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKiBnZXQgbG9nZ2VkIGluIHVzZXIgYWNjb3VudCovXHJcbiAgZ2V0KCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQUNDT1VOVF9BUEkpKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFjY291bnQqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQUNDT1VOVF9BUEkpICwgaXRlbSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8qKiBjaGFuZ2UgbG9nZ2VkIGluIHVzZXIgYWNjb3VudCovICBcclxuICBjaGFuZ2VQYXNzd29yZChpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BQ0NPVU5UX0FQSStcIi9jaGFuZ2UtcGFzc3dvcmRcIikgLCBpdGVtKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcy1jb21wYXQnO1xyXG5pbXBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuLy9pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcbi8qKiBBdXRoZW50aWNhdGlvbiBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xyXG4gICAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFVVEhfQVBJID0gJ2F1dGhlbnRpY2F0ZSc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgICBwcml2YXRlIHJlc291cmNlU2VydmljZTogUmVzb3VyY2VTZXJ2aWNlXHJcbiAgICApIHt9XHJcbiAgICBcclxuICAgIC8qKiBnZXQgY3VycmVudCB1c2VyIGp3dCB0b2tlbiBmcm9tIHNlc3Npb24gc3RvcmFnZSovXHJcbiAgICBnZXRUb2tlbigpIHtcclxuICAgICAgICByZXR1cm4gIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9naW4gb3BlcmF0aW9uICovXHJcbiAgICBsb2dpbihjcmVkZW50aWFscyk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiBjcmVkZW50aWFscy51c2VybmFtZSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IGNyZWRlbnRpYWxzLnBhc3N3b3JkXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BVVRIX0FQSSksIGRhdGEsIHtvYnNlcnZlIDogJ3Jlc3BvbnNlJ30pLm1hcChhdXRoZW50aWNhdGVTdWNjZXNzLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhdXRoZW50aWNhdGVTdWNjZXNzKHJlc3ApIHtcclxuICAgICAgICAgICAgaWYgKHJlc3Aub2spIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGp3dCA9IHJlc3AuYm9keS5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnN0IGV4cGlyZXNBdCA9IG1vbWVudCgpLmFkZCggcmVzcC5oZWFkZXJzLmdldCgnVG9rZW4tVmFsaWRpdHknKSwnbWlsaXNlY29uZCcpO1xyXG4gICAgICAgICAgICAgICAgLy9zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdleHBpcmVzX2F0JywgSlNPTi5zdHJpbmdpZnkoZXhwaXJlc0F0LnZhbHVlT2YoKSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGp3dDtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogbG9naW4gb3BlcmF0aW9uIHdpdGggand0IHRva2VuICovXHJcbiAgICBsb2dpbldpdGhUb2tlbihqd3QpIHtcclxuICAgICAgICBpZiAoand0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoand0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJ2F1dGgtand0LXNlcnZpY2UgUHJvbWlzZSByZWplY3QnKTsgLy8gUHV0IGFwcHJvcHJpYXRlIGVycm9yIG1lc3NhZ2UgaGVyZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogc3RvcmUgand0IHRva2VuIGluIHNlc3Npb24gc3RvcmFnZSovXHJcbiAgICBzdG9yZUF1dGhlbnRpY2F0aW9uVG9rZW4oand0KSB7XHJcbiAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJywgand0KTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGxvZ2dlZCBpbiovXHJcbiAgICBwdWJsaWMgaXNMb2dnZWRJbigpIHtcclxuICAgICAgICAvL3JldHVybiBtb21lbnQoKS5pc0JlZm9yZSh0aGlzLmdldEV4cGlyYXRpb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW4oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGxvZ2dlZCBvdXQqL1xyXG4gICAgaXNMb2dnZWRPdXQoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzTG9nZ2VkSW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9nb3V0IG9wZXJhdGlvbiAqL1xyXG4gICAgbG9nb3V0KCk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgLy9sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicpO1xyXG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICAgICAgICAgIC8vc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnZXhwaXJlc19hdCcpO1xyXG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBcclxufVxyXG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3QsIEh0dHBIYW5kbGVyLCBIdHRwRXZlbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG4vKiogSW50ZXJjZXB0b3IgZm9yIGF1dGhlbnRpY2F0aW9uIHRva2VuIGluIEFQSSByZXF1ZXN0cyAqL1xyXG5leHBvcnQgY2xhc3MgQXV0aEludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICApIHtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHJlcXVlc3QgaGFuZGxlciAqL1xyXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xyXG5cclxuICAgICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgICAgICBpZiAoISF0b2tlbikge1xyXG4gICAgICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XHJcbiAgICAgICAgICAgICAgICBzZXRIZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEFjY291bnRTZXJ2aWNlIH0gZnJvbSAnLi4vYWNjb3VudC9hY2NvdW50LnNlcnZpY2UnO1xyXG5cclxuLyoqIFByaW5jaXBhbCBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUHJpbmNpcGFsIHtcclxuICAgIHByaXZhdGUgdXNlcklkZW50aXR5OiBhbnk7XHJcbiAgICBwcml2YXRlIGF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgYXV0aGVudGljYXRpb25TdGF0ZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgYWNjb3VudDogQWNjb3VudFNlcnZpY2VcclxuICAgICkge31cclxuXHJcbiAgICAvKiogYXV0aGVudGljYXRlIHdpdGggZ2l2ZW4gaWRlbnRpdHkqL1xyXG4gICAgYXV0aGVudGljYXRlKGlkZW50aXR5KSB7XHJcbiAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBpZGVudGl0eTtcclxuICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBpZGVudGl0eSAhPT0gbnVsbDtcclxuICAgICAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUubmV4dCh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHkoYXV0aG9yaXRpZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhc0FueUF1dGhvcml0eURpcmVjdChhdXRob3JpdGllcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyBvbiB0aGUgZ2l2ZW4gdGVycml0b3J5ICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeShhdXRob3JpdGllczogc3RyaW5nW10sdGVycml0b3J5OiBzdHJpbmcgKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhc0FueUF1dGhvcml0eURpcmVjdE9uVGVycml0b3J5KGF1dGhvcml0aWVzLHRlcnJpdG9yeSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyB3aXRob3V0IHJlc29sdmluZyBwcm9taXNlcyovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlEaXJlY3QoYXV0aG9yaXRpZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMudXNlcklkZW50aXR5IHx8ICF0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF1dGhvcml0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcy5pbmNsdWRlcyhhdXRob3JpdGllc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkgd2l0aG91dCByZXNvbHZpbmcgcHJvbWlzZXMgKi9cclxuICAgIGhhc0FueUF1dGhvcml0eURpcmVjdE9uVGVycml0b3J5KGF1dGhvcml0aWVzOiBzdHJpbmdbXSx0ZXJyaXRvcnk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkIHx8ICF0aGlzLnVzZXJJZGVudGl0eSB8fCAhdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdXRob3JpdGllcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0gJiYgdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XS5pbmNsdWRlcyhhdXRob3JpdGllc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyB0aGUgZ2l2ZW4gYXV0aG9yaXR5ICovXHJcbiAgICBoYXNBdXRob3JpdHkoYXV0aG9yaXR5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKS50aGVuKChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkLmF1dGhvcml0aWVzICYmIGlkLmF1dGhvcml0aWVzLmluY2x1ZGVzKGF1dGhvcml0eSkpO1xyXG4gICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyB0aGUgZ2l2ZW4gYXV0aG9yaXR5IG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkqL1xyXG4gICAgaGFzQXV0aG9yaXR5T25UZXJyaXRvcnkoYXV0aG9yaXR5OiBzdHJpbmcsdGVycml0b3J5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKS50aGVuKChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5ICYmIGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0gJiYgaWQuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XS5pbmNsdWRlcyhhdXRob3JpdHkpKTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB1c2VyIGlkZW50aXR5Ki9cclxuICAgIGlkZW50aXR5KGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgaWYgKGZvcmNlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2hlY2sgYW5kIHNlZSBpZiB3ZSBoYXZlIHJldHJpZXZlZCB0aGUgdXNlcklkZW50aXR5IGRhdGEgZnJvbSB0aGUgc2VydmVyLlxyXG4gICAgICAgIC8vIGlmIHdlIGhhdmUsIHJldXNlIGl0IGJ5IGltbWVkaWF0ZWx5IHJlc29sdmluZ1xyXG4gICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJldHJpZXZlIHRoZSB1c2VySWRlbnRpdHkgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIsIHVwZGF0ZSB0aGUgaWRlbnRpdHkgb2JqZWN0LCBhbmQgdGhlbiByZXNvbHZlLlxyXG4gICAgICAgIHJldHVybiB0aGlzLmFjY291bnQuZ2V0KCkudG9Qcm9taXNlKCkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYWNjb3VudCA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBhY2NvdW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5uZXh0KHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcklkZW50aXR5O1xyXG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLm5leHQodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaXMgYXV0aGVudGljYXRlZCAqL1xyXG4gICAgaXNBdXRoZW50aWNhdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlkZW50aXR5IGlzIHJlc29sdmVkICovXHJcbiAgICBpc0lkZW50aXR5UmVzb2x2ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlcklkZW50aXR5ICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBjdXJyZW50IHVzZXIgYXV0aGVudGljYXRpb24gc3RhdGUgKi9cclxuICAgIGdldEF1dGhlbnRpY2F0aW9uU3RhdGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0b3IsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cEludGVyY2VwdG9yLCBIdHRwUmVxdWVzdCwgSHR0cEhhbmRsZXIsIEh0dHBFdmVudCwgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuXHJcbi8qKiBJbnRlcmNlcHRvciBmb3IgYXV0aGVudGljYXRpb24gZXhwaXJlZCByZXNwb25zZSBpbiBBUEkgcmVxdWVzdHMgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aEV4cGlyZWRJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLCAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UsIFxyXG4gICAgICAgIHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWxcclxuICAgICkge31cclxuXHJcbiAgICAvKiogcmVxdWVzdCBoYW5kbGVyICovXHJcbiAgICBpbnRlcmNlcHQocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcXVlc3QpLmRvKChldmVudDogSHR0cEV2ZW50PGFueT4pID0+IHt9LCAoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJjZXB0OiBib29sZWFuID0gcmVxdWVzdC51cmwuaW5kZXhPZihcIi9hcGkvXCIpICE9IC0xO1xyXG4gICAgICAgICAgICAvL3RyYWN0ZW0gcmVxdWVzdFxyXG4gICAgICAgICAgICBpZiAoaW50ZXJjZXB0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5sb2dvdXQoKS5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmluY2lwYWwuYXV0aGVudGljYXRlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy8nXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKiogTG9naW4gc2VydmljZSovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIExvZ2luU2VydmljZSB7XHJcbiAgICBcclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmVyUHJvdmlkZXI6IEF1dGhTZXJ2aWNlLCBcclxuICAgICAgICBwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqTG9naW4gb3BlcmF0aW9uKi9cclxuICAgIGxvZ2luKGNyZWRlbnRpYWxzLCBjYWxsYmFjaz8pIHtcclxuICAgICAgICBjb25zdCBjYiA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZlclByb3ZpZGVyLmxvZ2luKGNyZWRlbnRpYWxzKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJpbmNpcGFsLmlkZW50aXR5KHRydWUpLnRoZW4oKGFjY291bnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBZnRlciB0aGUgbG9naW4gdGhlIGxhbmd1YWdlIHdpbGwgYmUgY2hhbmdlZCB0b1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBsYW5ndWFnZSBzZWxlY3RlZCBieSB0aGUgdXNlciBkdXJpbmcgaGlzIHJlZ2lzdHJhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoKTtcclxuICAgICAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqbG9naW4gd2l0aCBqd3QgdG9rZW4gKi9cclxuICAgIGxvZ2luV2l0aFRva2VuKGp3dCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dpbldpdGhUb2tlbihqd3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBsb2dvdXQgb3BlcmF0aW9uICovXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dvdXQoKS5zdWJzY3JpYmUoKTtcclxuICAgICAgIHRoaXMucHJpbmNpcGFsLmF1dGhlbnRpY2F0ZShudWxsKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkU2VydmljZXtcclxuXHJcbiAgICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICAgIHB1YmxpYyBEQVNIQk9BUkRfQVBJID0gJ2Rhc2hib2FyZC9pbmZvJztcclxuICAgIHB1YmxpYyBEQVNIQk9BUkRfRU1CRURERUQ9ICdkYXNoYm9hcmQnO1xyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvciggICAgICAgXHJcbiAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgcHJpdmF0ZSByZXNvdXJjZVNlcnZpY2U6IFJlc291cmNlU2VydmljZSkge1xyXG4gICAgfVxyXG4gIFxyXG4gICAgLyoqIGdldCBhbGwga3BpICovXHJcbiAgICBnZXRBbGwoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5EQVNIQk9BUkRfQVBJKSkubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlW3RoaXMuREFTSEJPQVJEX0VNQkVEREVEXSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi91c2VyLm1vZGVsJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFVzZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VXNlcj4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBVU0VSX0FQSSA9J3VzZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlciwgXCJ1c2Vyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdXNlciovXHJcbiAgcmVtb3ZlKGl0ZW06IFVzZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB1c2VyKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gICAgXHJcbiAgLyoqIGNoYW5nZSBwYXNzd29yZCBvIGdpdmVuIHVzZXIgaWQgKi9cclxuICBjaGFuZ2VQYXNzd29yZChpZCxpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX0FQSStcIi9cIitpZCtcIi9jaGFuZ2UtcGFzc3dvcmRcIikgLCBpdGVtKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuLi90ZXJyaXRvcnkvdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vdXNlci5tb2RlbCc7XHJcbi8qKlxyXG4gKiBVc2VyIHBvc2l0aW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVXNlclBvc2l0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogZW1haWwgKi9cclxuICBwdWJsaWMgZW1haWw6IHN0cmluZztcclxuICAvKiogb3JnYW5pemF0aW9uIG5hbWUqL1xyXG4gIHB1YmxpYyBvcmdhbml6YXRpb246IHN0cmluZztcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIHN5c3RlbSBkYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgZGF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIHBvc2l0aW9uIHRlcnJpdG9yeSovXHJcbiAgcHVibGljIHRlcnJpdG9yeTogVGVycml0b3J5O1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgdXNlcjogVXNlcjtcclxufVxyXG4iLCJpbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJQb3NpdGlvbiB9IGZyb20gJy4vdXNlci1wb3NpdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBVc2VyIHBvc2l0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyUG9zaXRpb25TZXJ2aWNlICBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXJQb3NpdGlvbj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVVNFUl9QT1NJVElPTl9BUEkgPSAndXNlci1wb3NpdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihVc2VyUG9zaXRpb24sIFwidXNlci1wb3NpdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHVzZXIgcG9zaXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBVc2VyUG9zaXRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB1c2VyIHBvc2l0aW9uKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS51c2VyICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndXNlcicsaXRlbS51c2VyKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnVzZXIgPSBpdGVtLnVzZXIuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX1BPU0lUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBSb2xlIH0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL3VzZXIubW9kZWwnO1xyXG5cclxuLyoqXHJcbiAqIFVzZXIgcGVybWlzc2lvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVzZXJDb25maWd1cmF0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiByb2xlICovICBcclxuICBwdWJsaWMgcm9sZTogUm9sZTtcclxuXHJcbiAgLyoqIHJvbGUgQ2hpbGRyZW4gKi8gIFxyXG4gIHB1YmxpYyByb2xlQ2hpbGRyZW46IFJvbGU7XHJcbiAgXHJcbiAgLyoqIHRlcnJpdG9yeSAqLyBcclxuICBwdWJsaWMgdGVycml0b3J5OiBUZXJyaXRvcnk7XHJcbiAgLyoqIHVzZXIgKi9cclxuICBwdWJsaWMgdXNlcjogVXNlcjtcclxufVxyXG4iLCJpbXBvcnQgeyBSZXN0U2VydmljZSB9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlckNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL3VzZXItY29uZmlndXJhdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBVc2VyIGNvbmZpZ3VyYXRpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFVzZXJDb25maWd1cmF0aW9uU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXJDb25maWd1cmF0aW9uPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBVU0VSX0NPTkZJR1VSQVRJT05fQVBJID0gJ3VzZXItY29uZmlndXJhdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlckNvbmZpZ3VyYXRpb24sIFwidXNlci1jb25maWd1cmF0aW9uc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIHVzZXIgY29uZmlndXJhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IFVzZXJDb25maWd1cmF0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKiBzYXZlIHVzZXIgY29uZmlndXJhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzICE9IG51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnJvbGUgPSBpdGVtLnJvbGUhPW51bGw/aXRlbS5yb2xlLl9saW5rcy5zZWxmLmhyZWY6bnVsbDtcclxuICAgICAgaXRlbS51c2VyID0gaXRlbS51c2VyLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0ucm9sZUNoaWxkcmVuID0gaXRlbS5yb2xlQ2hpbGRyZW4hPW51bGw/aXRlbS5yb2xlQ2hpbGRyZW4uX2xpbmtzLnNlbGYuaHJlZjpudWxsO1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlVTRVJfQ09ORklHVVJBVElPTl9BUEkpLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5R3JvdXBUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktZ3JvdXAtdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeVR5cGUgfSBmcm9tICcuL3RlcnJpdG9yeS10eXBlLm1vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBUZXJyaXRvcnkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogY29kZSAqL1xyXG4gIHB1YmxpYyBjb2RlOiBzdHJpbmc7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBhZGRyZXNzKi9cclxuICBwdWJsaWMgdGVycml0b3JpYWxBdXRob3JpdHlBZGRyZXNzOiBzdHJpbmc7XHJcbiAgLyoqIGFkbWluICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB3aGV0aGVyIHRlcnJpdG9yeSBpcyBibG9ja2VkKi9cclxuICBwdWJsaWMgYmxvY2tlZDogYm9vbGVhbjtcclxuICAvKiogY29tbWVudHMqL1xyXG4gIHB1YmxpYyBub3RlOiBzdHJpbmc7XHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIC8qKiBjb250YWN0IGVtYWlsICovICBcclxuICBwdWJsaWMgdGVycml0b3JpYWxBdXRob3JpdHlFbWFpbDogc3RyaW5nO1xyXG4gIC8qKiBleHRlbnNpb24gKi9cclxuICBwdWJsaWMgZXh0ZW50OiBzdHJpbmc7XHJcbiAgLyoqIGxvZ28gaW1hZ2UgVVJMICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5TG9nbzogc3RyaW5nO1xyXG4gIC8qKiBjb250YWN0IG9yZ2FuaXphdGlvbiBuYW1lICovXHJcbiAgLy8gcHVibGljIG9yZ2FuaXphdGlvbk5hbWU6IHN0cmluZztcclxuICAvKiogc2NvcGUqL1xyXG4gIHB1YmxpYyBzY29wZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlICovICBcclxuICBwdWJsaWMgdHlwZTogVGVycml0b3J5VHlwZTtcclxuICAvKiogZ3JvdXAgdHlwZSAqL1xyXG4gIHB1YmxpYyBncm91cFR5cGU6IFRlcnJpdG9yeUdyb3VwVHlwZTtcclxuICAvKiogdGVycml0b3J5IG1lbWJlcnMqL1xyXG4gIHB1YmxpYyBtZW1iZXJzOiBUZXJyaXRvcnlbXTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFJlc3RTZXJ2aWNlIH0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRlcnJpdG9yeSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRlcnJpdG9yeT4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZX0FQSSA9ICd0ZXJyaXRvcmllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUZXJyaXRvcnksIFwidGVycml0b3JpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSB0ZXJyaXRvcnkqL1xyXG4gIHJlbW92ZShpdGVtOiBUZXJyaXRvcnkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqIHNhdmUgdGVycml0b3J5Ki9cclxuICBzYXZlKGl0ZW06IFRlcnJpdG9yeSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IHRlcnJpdG9yeUdyb3VwVHlwZTphbnkgPSB7fVxyXG4gICAgdGVycml0b3J5R3JvdXBUeXBlLl9saW5rcyA9IHt9O1xyXG4gICAgdGVycml0b3J5R3JvdXBUeXBlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICB0ZXJyaXRvcnlHcm91cFR5cGUuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcblxyXG4gICAgbGV0IHRlcnJpdG9yeVR5cGU6YW55ID0ge31cclxuICAgIHRlcnJpdG9yeVR5cGUuX2xpbmtzID0ge307XHJcbiAgICB0ZXJyaXRvcnlUeXBlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICB0ZXJyaXRvcnlUeXBlLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG5cclxuICAgIGlmIChpdGVtLnR5cGUgIT0gbnVsbCkge1xyXG4gICAgICB0ZXJyaXRvcnlUeXBlID0gaXRlbS50eXBlO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0udHlwZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLnR5cGUgPSBpdGVtLnR5cGUuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfSBcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MgIT0gbnVsbCkge1xyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uZ3JvdXBUeXBlO1xyXG5cclxuXHJcbiAgICAgIC8vIGlmICh0ZXJyaXRvcnlHcm91cFR5cGUuX2xpbmtzLnNlbGYuaHJlZiA9PSAnJykge1xyXG4gICAgICAvLyAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2dyb3VwVHlwZScsIHRlcnJpdG9yeUdyb3VwVHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIC8vICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG5cclxuICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgLy8gICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignZ3JvdXBUeXBlJywgdGVycml0b3J5R3JvdXBUeXBlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgLy8gICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIC8vIH1cclxuXHJcbiAgICAgIGlmICh0ZXJyaXRvcnlUeXBlLl9saW5rcy5zZWxmLmhyZWYgPT0gJycpIHtcclxuICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCd0eXBlJywgdGVycml0b3J5VHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndHlwZScsIHRlcnJpdG9yeVR5cGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGVsZXRlIGl0ZW0udHlwZTtcclxuICAgICAgLy8gaWYgKGl0ZW0udHlwZSAhPSBudWxsKVxyXG4gICAgICAvLyAgIGl0ZW0udHlwZSA9IGl0ZW0udHlwZS5fbGlua3Muc2VsZi5ocmVmO1xyXG5cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllfQVBJKSwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IHR5cGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlUeXBlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAvKiogaWQgKi9cclxuICAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5VHlwZSB9IGZyb20gJy4vdGVycml0b3J5LXR5cGUubW9kZWwnO1xyXG5cclxuLyoqIFRlcnJpdG9yeVR5cGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeVR5cGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGVycml0b3J5VHlwZT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZVFlQRV9BUEkgPSAndGVycml0b3J5LXR5cGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGVycml0b3J5VHlwZSwgXCJ0ZXJyaXRvcnktdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSB0eXBlKi9cclxuICByZW1vdmUoaXRlbTogVGVycml0b3J5VHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSB0eXBlKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllUWVBFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuLyoqXHJcbiAqIFRlcnJpdG9yeSB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5R3JvdXBUeXBlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IFRlcnJpdG9yeUdyb3VwVHlwZSB9IGZyb20gJy4vdGVycml0b3J5LWdyb3VwLXR5cGUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5R3JvdXBUeXBlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRlcnJpdG9yeUdyb3VwVHlwZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBURVJSSVRPUllHUk9VUFRZUEVfQVBJID0gJ3RlcnJpdG9yeS1ncm91cC10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRlcnJpdG9yeUdyb3VwVHlwZSwgXCJ0ZXJyaXRvcnktZ3JvdXAtdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRlcnJpdG9yeUdyb3VwVHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEVSUklUT1JZR1JPVVBUWVBFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59IiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogUm9sZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJvbGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGNvbW1lbnRzKi9cclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgUm9sZSB9IGZyb20gJy4vcm9sZS5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFJvbGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJvbGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Um9sZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBST0xFX0FQSSA9ICdyb2xlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFJvbGUsIFwicm9sZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHJvbGUqL1xyXG4gIHJlbW92ZShpdGVtOiBSb2xlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgcm9sZSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuUk9MRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIENvbm5lY3Rpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgdXNlcjogc3RyaW5nO1xyXG4gIC8qKiBwYXNzd29yZCovXHJcbiAgcHVibGljIHBhc3N3b3JkOiBzdHJpbmc7XHJcbiAgLyoqIGNvbm5lY3Rpb24gc3RyaW5nKi9cclxuICBwdWJsaWMgY29ubmVjdGlvblN0cmluZzogc3RyaW5nO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ29ubmVjdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDb25uZWN0aW9uPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICdjb25uZWN0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvbm5lY3Rpb24sIFwiY29ubmVjdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNvbm5lY3Rpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBDb25uZWN0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY29ubmVjdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBDb25uZWN0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICB0ZXN0Q29ubmVjdGlvbihpdGVtOmFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQ9dGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkrXCIvdGVzdFwiICwgaXRlbSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuXHJcbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBSb2xlIH0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tHcm91cCB9IGZyb20gJy4vdGFzay1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tBdmFpbGFiaWxpdHkgfSBmcm9tICcuL3Rhc2stYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuaW1wb3J0IHsgVGFza1BhcmFtZXRlciB9IGZyb20gJy4vdGFzay1wYXJhbWV0ZXIubW9kZWwnO1xyXG5cclxuLy9GSVhNRSBlbnN1cmUgdGFzayBjcmVhdGlvbiBpbiBhZG1pbiBhcHAgdXBvbiBpbml0aWFsaXphdGlvbiAoYXMgaXQgaXMgZG9uZSB3aXRoIFJvbGVzIGFuZCBkZWZhdWx0IFVzZXJzKVxyXG4vKiogR0VPQURNSU5fdGFzayBpZCAqL1xyXG5leHBvcnQgY29uc3QgR0VPQURNSU5fVFJFRV9UQVNLX0lEOnN0cmluZyAgPSBcImdlb2FkbWluXCI7XHJcblxyXG5pbXBvcnQgeyBUYXNrVUkgfSBmcm9tICcuL3Rhc2stdWkubW9kZWwnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHsgU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2Uvc2VydmljZS5tb2RlbCc7XHJcbi8qKiBUYXNrIG1vZGVsICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZD86IG51bWJlcjtcclxuICAvKiogbmFtZSAqLyAgXHJcbiAgcHVibGljIG5hbWU/OiBzdHJpbmc7XHJcbiAgLyoqIG9yZGVyKi9cclxuICBwdWJsaWMgb3JkZXI/OiBOdW1iZXI7XHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZT86IGFueTtcclxuICAvKiogdGFzayBncm91cCovXHJcbiAgcHVibGljIGdyb3VwPzogVGFza0dyb3VwO1xyXG4gIC8qKiB0YXNrIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlPzogVGFza1R5cGU7XHJcbiAgLyoqIHRhc2sgVUkqL1xyXG4gIHB1YmxpYyB1aT86IFRhc2tVSTtcclxuICAvKiogcGFyYW1ldGVycyovXHJcbiAgcHVibGljIHBhcmFtZXRlcnM/OiBUYXNrUGFyYW1ldGVyW107XHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uPzogQ29ubmVjdGlvbjtcclxuICAvKiogcm9sZXMqL1xyXG4gIHB1YmxpYyByb2xlcz86IFJvbGVbXTtcclxuICAvKiogYXZhaWxhYmlsaXRpZXMqL1xyXG4gIHB1YmxpYyBhdmFpbGFiaWxpdGllcz86IFRhc2tBdmFpbGFiaWxpdHlbXTtcclxuXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5PzogQ2FydG9ncmFwaHk7XHJcblxyXG4gIHB1YmxpYyBzZXJ2aWNlPzogU2VydmljZTtcclxuXHJcbiAgcHVibGljIHByb3BlcnRpZXM/O1xyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3Rhc2subW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2s+IHtcclxuXHJcbiAgICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICAgIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICd0YXNrcyc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgICAgIHN1cGVyKFRhc2ssIFwidGFza3NcIiwgaW5qZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiByZW1vdmUgdGFzayovXHJcbiAgICByZW1vdmUoaXRlbTogVGFzaykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBzYXZlIHRhc2sqL1xyXG4gICAgc2F2ZShpdGVtOiBUYXNrKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uc2VydmljZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlcnZpY2U6YW55ID0ge31cclxuICAgICAgICAgICAgICAgIHNlcnZpY2UuX2xpbmtzID0ge307XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignc2VydmljZScsIHNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWY9aXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2VydmljZScsIGl0ZW0uc2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaXRlbS5jYXJ0b2dyYXBoeSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhcnRvZ3JhcGh5OmFueSA9IHt9XHJcbiAgICAgICAgICAgICAgICBjYXJ0b2dyYXBoeS5fbGlua3MgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgICAgICBjYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JywgY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmPWl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZi5zcGxpdChcIntcIilbMF1cclxuICAgICAgICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsIGl0ZW0uY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uY29ubmVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbm5lY3Rpb246YW55ID0ge31cclxuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24uX2xpbmtzID0ge307XHJcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignY29ubmVjdGlvbicsIGNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY9aXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY29ubmVjdGlvbicsIGl0ZW0uY29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0udWkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3VpJywgaXRlbS51aSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7IFxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnVpLl9saW5rcy5zZWxmLmhyZWY9aXRlbS51aS5fbGlua3Muc2VsZi5ocmVmLnNwbGl0KFwie1wiKVswXVxyXG4gICAgICAgICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3VpJywgaXRlbS51aSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnVpID0gaXRlbS51aS5fbGlua3Muc2VsZi5ocmVmXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghaXRlbS5ncm91cCkge1xyXG4gICAgICAgICAgICAgICAgLy8gaXRlbS5kZWxldGVSZWxhdGlvbignZ3JvdXAnLCBpdGVtLmdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgXHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAuX2xpbmtzLnNlbGYuaHJlZj1pdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignZ3JvdXAnLCBpdGVtLmdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAgPSBpdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFpdGVtLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3R5cGUnLCBpdGVtLnR5cGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWY9aXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndHlwZScsIGl0ZW0udHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnR5cGUgPSBpdGVtLnR5cGUuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpdGVtLnJvbGVzKXtcclxuICAgICAgICAgICAgICAgIGxldCByb2xlcyA9IFsuLi5pdGVtLnJvbGVzXTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLnJvbGVzO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zdWJzdGl0dXRlQWxsUmVsYXRpb24oJ3JvbGVzJyxyb2xlcykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTsgICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZihpdGVtLmNhcnRvZ3JhcGh5KXtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLmNvbm5lY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnNlcnZpY2Upe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZXJ2aWNlID0gaXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnVpKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0udWkgPSBpdGVtLnVpLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLmdyb3VwKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAgPSBpdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnR5cGUpe1xyXG4gICAgICAgICAgICAgICAgaXRlbS50eXBlID0gaXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1R5cGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2tUeXBlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrVHlwZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrVHlwZT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRhc2tUeXBlLCBcInRhc2stdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgdHlwZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRhc2tUeXBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayB0eXBlKi9cclxuICBzYXZlKGl0ZW06IFRhc2tUeXBlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayBncm91cCBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRhc2tHcm91cCB9IGZyb20gJy4vdGFzay1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgZ3JvdXAgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrR3JvdXA+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gJ3Rhc2stZ3JvdXBzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza0dyb3VwLCBcInRhc2stZ3JvdXBzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0YXNrIGdyb3VwKi9cclxuICByZW1vdmUoaXRlbTogVGFza0dyb3VwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBncm91cCovXHJcbiAgc2F2ZShpdGVtOiBUYXNrR3JvdXApOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VGFza30gZnJvbSAnLi90YXNrLm1vZGVsJzsgIFxyXG4vKipcclxuICogVGFzayBwYXJhbWV0ZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrUGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBvcmRlciovICBcclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjtcclxuICBcclxuICAvKiogdGFzayovICBcclxuICBwdWJsaWMgdGFzazpUYXNrO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrUGFyYW1ldGVyIH0gZnJvbSAnLi90YXNrLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgVGFza1BhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrUGFyYW1ldGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUQVNLX1BBUkFNRVRFUl9BUEkgPSAndGFzay1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza1BhcmFtZXRlciwgXCJ0YXNrLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogVGFza1BhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IFRhc2tQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnRhc2sgPSBpdGVtLnRhc2suX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UQVNLX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3Rhc2subW9kZWwnO1xyXG4vKipcclxuICogVGFzayBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrQXZhaWxhYmlsaXR5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiB0ZXJyaXRvcnkqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICAvKiogdGFzayovXHJcbiAgcHVibGljIHRhc2s6IFRhc2s7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza0F2YWlsYWJpbGl0eSB9IGZyb20gJy4vdGFzay1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIGF2YWlsYWJpbGl0eSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIFRhc2tBdmFpbGFiaWxpdHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGFza0F2YWlsYWJpbGl0eT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEFTS19BVkFJTEFCSUxJVFlfQVBJID0gJ3Rhc2stYXZhaWxhYmlsaXRpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrQXZhaWxhYmlsaXR5LCBcInRhc2stYXZhaWxhYmlsaXRpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICByZW1vdmUoaXRlbTogVGFza0F2YWlsYWJpbGl0eSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICBzYXZlKGl0ZW06IFRhc2tBdmFpbGFiaWxpdHkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS50YXNrID0gaXRlbS50YXNrLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEFTS19BVkFJTEFCSUxJVFlfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBUYXNrIFVJIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1VJIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0b29sdGlwKi8gIFxyXG4gIHB1YmxpYyB0b29sdGlwOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogb3JkZXIqLyBcclxuICBwdWJsaWMgb3JkZXI6IG51bWJlcjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1VJIH0gZnJvbSAnLi90YXNrLXVpLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBVSSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFza1VJU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tVST4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay11aXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrVUksIFwidGFzay11aXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgVUkqL1xyXG4gIHJlbW92ZShpdGVtOiBUYXNrVUkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0YXNrIFVJKi9cclxuICBzYXZlKGl0ZW06IFRhc2tVSSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHsgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBMYW5ndWFnZSB9IGZyb20gJy4vbGFuZ3VhZ2UubW9kZWwnO1xyXG5cclxuXHJcbi8qKiBUYXNrIG1vZGVsICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgZWxlbWVudDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIHRyYW5zbGF0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIGNvbHVtbiAqL1xyXG4gIHB1YmxpYyBjb2x1bW46IHN0cmluZztcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBsYW5ndWFnZTogTGFuZ3VhZ2U7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbGFuZ3VhZ2VOYW1lPzogc3RyaW5nO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIGxhbmd1YWdlU2hvcnRuYW1lPzogc3RyaW5nO1xyXG5cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGlvbiB9IGZyb20gJy4vdHJhbnNsYXRpb24ubW9kZWwnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0aW9uU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRyYW5zbGF0aW9uPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUUkFOU0xBVElPTl9BUEkgPSAndHJhbnNsYXRpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVHJhbnNsYXRpb24sIFwidHJhbnNsYXRpb25zXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmFuc2xhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IFRyYW5zbGF0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdHJhbnNsYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogVHJhbnNsYXRpb24pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG5cclxuICAgIGxldCBsYW5ndWFnZTphbnkgPSB7fVxyXG4gICAgbGFuZ3VhZ2UuX2xpbmtzID0ge307XHJcbiAgICBsYW5ndWFnZS5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgbGFuZ3VhZ2UuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcblxyXG4gICAgaWYgKGl0ZW0ubGFuZ3VhZ2UgIT0gbnVsbCkge1xyXG4gICAgICBsYW5ndWFnZSA9IGl0ZW0ubGFuZ3VhZ2U7XHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5sYW5ndWFnZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLmxhbmd1YWdlID0gaXRlbS5sYW5ndWFnZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9IFxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBkZWxldGUgaXRlbS5sYW5ndWFnZTtcclxuICAgICAgLy8gaWYgKGxhbmd1YWdlLl9saW5rcy5zZWxmLmhyZWYgPT0gJycpIHtcclxuICAgICAgLy8gICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdsYW5ndWFnZScsIGxhbmd1YWdlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgLy8gICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcblxyXG4gICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAvLyAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdsYW5ndWFnZScsIGxhbmd1YWdlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgLy8gICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIC8vIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UUkFOU0xBVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuXHJcblxyXG4vKiogVGFzayBtb2RlbCAqL1xyXG5leHBvcnQgY2xhc3MgTGFuZ3VhZ2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgc2hvcnRuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMYW5ndWFnZSB9IGZyb20gJy4vbGFuZ3VhZ2UubW9kZWwnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIExhbmd1YWdlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPExhbmd1YWdlPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBMQU5HVUFHRVNfQVBJID0gJ2xhbmd1YWdlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKExhbmd1YWdlLCBcImxhbmd1YWdlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdHJhbnNsYXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBMYW5ndWFnZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRyYW5zbGF0aW9uKi9cclxuICBzYXZlKGl0ZW06IExhbmd1YWdlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkxBTkdVQUdFU19BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDb25uZWN0aW9ufSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQge1NlcnZpY2VQYXJhbWV0ZXJ9IGZyb20gJy4vc2VydmljZS1wYXJhbWV0ZXIubW9kZWwnO1xyXG4vKipcclxuICogU2VydmljZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuXHJcbiAgLyoqIHVybCovICBcclxuICBwdWJsaWMgc2VydmljZVVSTDogc3RyaW5nO1xyXG5cclxuICAvKiogcHJvamVjdGlvbnMqLyAgXHJcbiAgcHVibGljIHN1cHBvcnRlZFNSUzogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBsZWdlbmQqL1xyXG4gIHB1YmxpYyBsZWdlbmQ6IHN0cmluZztcclxuXHJcbiAgLyoqIGluZm9VcmwqLyAgXHJcbiAgcHVibGljIGluZm9Vcmw6IHN0cmluZztcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcblxyXG4gIC8qKiBjb25uZWN0aW9uKi9cclxuICBwdWJsaWMgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcclxuICBcclxuICAvKiogcGFyYW1ldGVycyovICBcclxuICBwdWJsaWMgcGFyYW1ldGVyczogU2VydmljZVBhcmFtZXRlcltdO1xyXG5cclxuICAvKiogd2hldGhlciBzZXJ2aWNlIGlzIGJsb2NrZWQqL1xyXG4gIHB1YmxpYyBibG9ja2VkOiBib29sZWFuO1xyXG59XHJcbiIsImltcG9ydCB7IFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2UubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBTZXJ2aWNlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFNlcnZpY2U+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFNFUlZJQ0VfQVBJID0gJ3NlcnZpY2VzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoU2VydmljZSwgXCJzZXJ2aWNlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgc2VydmljZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFNlcnZpY2UpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBzZXJ2aWNlKi9cclxuICBzYXZlKGl0ZW06IFNlcnZpY2UpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgbGV0IHNlcnZpY2VDb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uO1xyXG5cclxuICAgIGlmIChpdGVtLmNvbm5lY3Rpb24hPW51bGwpe1xyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbS5jb25uZWN0aW9uLl9saW5rcyE9ICd1bmRlZmluZWQnKSB7IFxyXG4gICAgICAgICAgICBpdGVtLmNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXJ2aWNlQ29ubmVjdGlvbi5fbGlua3M9IHt9O1xyXG4gICAgICAgICAgICBzZXJ2aWNlQ29ubmVjdGlvbi5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgICAgICAgICBzZXJ2aWNlQ29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmPVwiXCI7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkgeyAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTsgICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlNFUlZJQ0VfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogU2VydmljZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRpb25QYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUGFyYW1ldGVyIH0gZnJvbSAnLi9jb25maWd1cmF0aW9uLXBhcmFtZXRlcnMubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uUGFyYW1ldGVyc1NlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDb25maWd1cmF0aW9uUGFyYW1ldGVyPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05GSUdVUkFUSU9OX1BBUkFNRVRFUlNfQVBJID0gJ2NvbmZpZ3VyYXRpb24tcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvbmZpZ3VyYXRpb25QYXJhbWV0ZXIsIFwiY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7U2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlLm1vZGVsJzsgXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIHBhcmFtZXRlciBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VQYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqLyAgXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHNlcnZpY2UqL1xyXG4gIHB1YmxpYyBzZXJ2aWNlOiBTZXJ2aWNlO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBTZXJ2aWNlUGFyYW1ldGVyIH0gZnJvbSAnLi9zZXJ2aWNlLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgU2VydmljZVBhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxTZXJ2aWNlUGFyYW1ldGVyPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBTRVJWSUNFX1BBUkFNRVRFUl9BUEkgPSAnc2VydmljZS1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoU2VydmljZVBhcmFtZXRlciwgXCJzZXJ2aWNlLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogU2VydmljZVBhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IFNlcnZpY2VQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGl0ZW0uc2VydmljZSAhPW51bGwpe1xyXG4gICAgICAgICAgbGV0IHNlcnZpY2UgPSAgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICAgICAgZGVsZXRlIGl0ZW0uc2VydmljZTtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzZXJ2aWNlJyxzZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5TRVJWSUNFX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIENhcGFiaWxpdGllIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FwYWJpbGl0aWUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIHVybCAqL1xyXG4gIHB1YmxpYyB1cmw6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IENhcGFiaWxpdGllIH0gZnJvbSAnLi9jYXBhYmlsaXRpZS5tb2RlbCc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FwYWJpbGl0aWVzU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcGFiaWxpdGllPiAge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FQQUJJTElUSUVTX0FQSSA9ICdoZWxwZXJzL2NhcGFiaWxpdGllcz91cmw9JztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FwYWJpbGl0aWUsIFwiaGVscGVycy9jYXBhYmlsaXRpZXM/dXJsPVwiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAgIC8qKiBzYXZlIHNlcnZpY2UqL1xyXG4gICAgZ2V0SW5mbyh1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgICAgaWYodXJsKXtcclxuICAgICAgICBjb25zdCBoZWFkZXJEaWN0ID0ge1xyXG4gICAgICAgICAgJ0NoYXJzZXQnOiAnVVRGLTgnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0geyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKGhlYWRlckRpY3QpLCBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBmaW5hbFVybCA9IHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FQQUJJTElUSUVTX0FQSSk7XHJcbiAgICAgICAgZmluYWxVcmwgPSBmaW5hbFVybC5jb25jYXQodXJsKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhmaW5hbFVybCk7XHJcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldChmaW5hbFVybCwgcmVxdWVzdE9wdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiBcclxuICAgIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlL3NlcnZpY2UubW9kZWwnO1xyXG5pbXBvcnQge0Nvbm5lY3Rpb259IGZyb20gJy4uL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlBdmFpbGFiaWxpdHl9IGZyb20gJy4vY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHlTdHlsZSB9IGZyb20gJy4vY2FydG9ncmFwaHktc3R5bGUubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZSA6IHN0cmluZztcclxuXHJcbiAgLyoqIHNlcnZpY2UqL1xyXG4gIHB1YmxpYyBzZXJ2aWNlIDogU2VydmljZTtcclxuXHJcbiAgLyoqIG9yZGVyKi8gIFxyXG4gIHB1YmxpYyBvcmRlcjogTnVtYmVyOyBcclxuXHJcbiAgLyoqIGRlc2NyaXB0aW9uKi8gIFxyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogU3RyaW5nO1xyXG5cclxuICAvKiogc291cmNlKi8gIFxyXG4gIHB1YmxpYyBzb3VyY2U6IFN0cmluZztcclxuXHJcbiAgLyoqIHdoZXRoZXIgY2FydG9ncmFwaHkgaXMgYmxvY2tlZCovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47ICBcclxuXHJcbiAgLyoqIGFwcGx5IGZpbHRlciB0byBnZXQgbWFwKi9cclxuICBwdWJsaWMgYXBwbHlGaWx0ZXJUb0dldE1hcDogYm9vbGVhbjsgIFxyXG5cclxuICAvKiogYXBwbHkgZmlsdGVyIHRvIGdldCBmZWF0dXJlIGluZm9ybWF0aW9uKi9cclxuICBwdWJsaWMgYXBwbHlGaWx0ZXJUb0dldEZlYXR1cmVJbmZvOiBib29sZWFuOyAgXHJcblxyXG4gIC8qKiBhcHBseSBmaWx0ZXIgdG8gc3BhdGlhbCBzZWxlY3Rpb24qL1xyXG4gIHB1YmxpYyBhcHBseUZpbHRlclRvU3BhdGlhbFNlbGVjdGlvbjogYm9vbGVhbjsgIFxyXG5cclxuICAvKiogc2VsZWN0YWJsZSBsYXllcnMqL1xyXG4gIHB1YmxpYyBzZWxlY3RhYmxlTGF5ZXJzOiBzdHJpbmdbXTtcclxuXHJcbiAgLyoqIHRyYW5zcGFyZW5jeSovIFxyXG4gIHB1YmxpYyB0cmFuc3BhcmVuY3k6IE51bWJlcjtcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgcXVlcnlhYmxlKi8gIFxyXG4gIHB1YmxpYyBxdWVyeWFibGU6IEJvb2xlYW47XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHF1ZXJ5YWJsZSovIFxyXG4gIHB1YmxpYyBxdWVyeUFjdDogQm9vbGVhbjtcclxuXHJcbiAgLyoqIHF1ZXJ5IGxheWVyKi9cclxuICBwdWJsaWMgcXVlcnlMYXk6IHN0cmluZztcclxuXHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG5cclxuICAvKiogbWluaW11bSBzY2FsZSovXHJcbiAgcHVibGljIG1pbmltdW1TY2FsZTogTnVtYmVyO1xyXG5cclxuICAvKiogbWF4aW11bSBzY2FsZSovXHJcbiAgcHVibGljIG1heGltdW1TY2FsZTogTnVtYmVyO1xyXG5cclxuICAvKiogbGF5ZXJzKi8gIFxyXG4gIHB1YmxpYyBsYXllcnM6IHN0cmluZztcclxuICBcclxuICAvKiogY29ubmVjdGlvbiovXHJcbiAgcHVibGljIGNvbm5lY3Rpb246IENvbm5lY3Rpb247XHJcblxyXG4gIC8qKiBxdWVyeWFibGVGZWF0dXJlRW5hYmxlZCAqL1xyXG4gIHB1YmxpYyBxdWVyeWFibGVGZWF0dXJlRW5hYmxlZDogQm9vbGVhbjtcclxuXHJcbiAgICAvKiogcXVlcnlhYmxlTGF5ZXJzICovXHJcbiAgcHVibGljIHF1ZXJ5YWJsZUZlYXR1cmVBdmFpbGFibGU6IEJvb2xlYW47XHJcblxyXG4gICAgLyoqIHF1ZXJ5YWJsZUxheWVycyAqL1xyXG4gIHB1YmxpYyBxdWVyeWFibGVMYXllcnM6IHN0cmluZ1tdO1xyXG5cclxuICAvKiogYXZhaWxhYmlsaXRpZXMqL1xyXG4gIHB1YmxpYyBhdmFpbGFiaWxpdGllcyA6IENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5W107XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHF1ZXJ5YWJsZSovIFxyXG4gIHB1YmxpYyBzZWxlY3RhYmxlRmVhdHVyZUVuYWJsZWQ6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBzZWxlY3Rpb24gbGF5ZXIqL1xyXG4gIHB1YmxpYyBzZWxlY3Rpb25MYXllcjogc3RyaW5nO1xyXG5cclxuICAvKiogc2VsZWN0aW9uIHNlcnZpY2UqLyAgXHJcbiAgcHVibGljIHNlbGVjdGlvblNlcnZpY2U6IFNlcnZpY2U7XHJcblxyXG4gIC8qKiBsZWdlbmQgdGlwKi8gIFxyXG4gIHB1YmxpYyBsZWdlbmRUeXBlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGxlZ2VuZCB1cmwqL1xyXG4gIHB1YmxpYyBsZWdlbmRVUkw6IHN0cmluZztcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgZWRpdGFibGUqL1xyXG4gIHB1YmxpYyBlZGl0YWJsZTogQm9vbGVhbjtcclxuXHJcbiAgLyoqIG1ldGFkYXRhIFVSTCovXHJcbiAgcHVibGljIG1ldGFkYXRhVVJMOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBtZXRhZGF0YSBVUkwqL1xyXG4gIHB1YmxpYyBkYXRhc2V0VVJMOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHRoZW1hYmxlKi9cclxuICBwdWJsaWMgdGhlbWF0aWM6IEJvb2xlYW47XHJcbiAgXHJcbiAgLyoqIGdlb21ldHJ5IHR5cGUqL1xyXG4gIHB1YmxpYyBnZW9tZXRyeVR5cGU6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHN0eWxlcz86IENhcnRvZ3JhcGh5U3R5bGVbXVxyXG5cclxuICBwdWJsaWMgdXNlQWxsU3R5bGVzOiBib29sZWFuO1xyXG4gIFxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFJlc3RTZXJ2aWNlIH0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi4vY29ubmVjdGlvbi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2Uvc2VydmljZS5tb2RlbCc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5PiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9BUEkgPSAnY2FydG9ncmFwaGllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeSwgXCJjYXJ0b2dyYXBoaWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IGNhcnRvZ3JhcGh5Q29ubmVjdGlvbjphbnk9e307XHJcbiAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuICAgICBcclxuICAgIGxldCBjYXJ0b2dyYXBoeVNlcnZpY2U6YW55PXt9O1xyXG4gICAgY2FydG9ncmFwaHlTZXJ2aWNlLl9saW5rcyA9IHt9O1xyXG4gICAgY2FydG9ncmFwaHlTZXJ2aWNlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcbiAgICBcclxuICAgIGxldCBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2U6YW55ID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UuX2xpbmtzID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuXHJcbiAgICBpZiAoaXRlbS5zZXJ2aWNlICE9IG51bGwpIHtcclxuICAgICAgY2FydG9ncmFwaHlTZXJ2aWNlPSAgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uc2VydmljZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLnNlbGVjdGlvblNlcnZpY2UgIT0gbnVsbCkge1xyXG4gICAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UgPSBpdGVtLnNlbGVjdGlvblNlcnZpY2VcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtLnNlbGVjdGlvblNlcnZpY2UuX2xpbmtzICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgaXRlbS5zZWxlY3Rpb25TZXJ2aWNlID0gaXRlbS5zZWxlY3Rpb25TZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5jb25uZWN0aW9uICE9IG51bGwpIHtcclxuICAgICAgY2FydG9ncmFwaHlDb25uZWN0aW9uPSAgaXRlbS5jb25uZWN0aW9uO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uY29ubmVjdGlvbi5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLmNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcblxyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uY29ubmVjdGlvbjtcclxuICAgICAgZGVsZXRlIGl0ZW0uc2VydmljZTtcclxuICAgICAgZGVsZXRlIGl0ZW0uc2VsZWN0aW9uU2VydmljZTtcclxuXHJcbiAgICAgIC8vIGlmIChjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZiA9PSAnJyAmJiBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24pIHtcclxuICAgICAgLy8gICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdzcGF0aWFsU2VsZWN0aW9uQ29ubmVjdGlvbicsIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIC8vICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAvLyAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzcGF0aWFsU2VsZWN0aW9uQ29ubmVjdGlvbicsIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIC8vICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAvLyB9XHJcblxyXG4gICAgICBpZiAoY2FydG9ncmFwaHlTZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYgPT0gJycpIHtcclxuICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdzZXJ2aWNlJywgY2FydG9ncmFwaHlTZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NlcnZpY2UnLCBjYXJ0b2dyYXBoeVNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZS5fbGlua3Muc2VsZi5ocmVmID09ICcnICYmIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZSkge1xyXG4gICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3NwYXRpYWxTZWxlY3Rpb25TZXJ2aWNlJywgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NwYXRpYWxTZWxlY3Rpb25TZXJ2aWNlJywgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0FQSSksIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHtSb2xlfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHkgZ3JvdXBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUdyb3VwIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgLyoqIG1lbWJlcnMqL1xyXG4gIHB1YmxpYyBtZW1iZXJzOiBDYXJ0b2dyYXBoeVtdO1xyXG4gIC8qKiByb2xlcyovXHJcbiAgcHVibGljIHJvbGVzOiBSb2xlW107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5R3JvdXAgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHlHcm91cCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlHcm91cFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeUdyb3VwPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9HUk9VUF9BUEkgPSdjYXJ0b2dyYXBoeS1ncm91cHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeUdyb3VwLCBcImNhcnRvZ3JhcGh5LWdyb3Vwc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkgZ3JvdXAqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUdyb3VwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY2FydG9ncmFwaHkgZ3JvdXAqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlHcm91cCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9HUk9VUF9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogdGVycml0b3J5Ki9cclxuICBwdWJsaWMgdGVycml0b3J5OiBUZXJyaXRvcnk7XHJcbiAgXHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIFxyXG4gIC8qKiBjYXJ0b2dyYXBoeSovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSB9IGZyb20gJy4vY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfQVZBSUxBQklMSVRZX0FQSSA9ICdjYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdGllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5LCBcImNhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0aWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxpdGVtLmNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0FWQUlMQUJJTElUWV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5VHlwZSB9IGZyb20gJy4uL3RlcnJpdG9yeS90ZXJyaXRvcnktdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUZpbHRlciBleHRlbmRzIFJlc291cmNlIHtcclxuIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogcmVxdWlyZWQgKi9cclxuICBwdWJsaWMgcmVxdWlyZWQ6IGJvb2xlYW47XHJcblxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG5cclxuICAvKiogVGVycml0b3JpYWwgbGV2ZWwuICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsTGV2ZWw6IFRlcnJpdG9yeVR5cGU7XHJcbiAgXHJcbiAgLyoqIGNvbHVtbiAqL1xyXG4gIHB1YmxpYyBjb2x1bW46IHN0cmluZztcclxuXHJcbiAgLyoqIHZhbHVlcyovICBcclxuICBwdWJsaWMgdmFsdWVzOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB2YWx1ZSovICBcclxuICBwdWJsaWMgdmFsdWVUeXBlOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBjYXJ0b2dyYXBoeSovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5RmlsdGVyIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1maWx0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDYXJ0b2dyYXBoeUZpbHRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5RmlsdGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5RmlsdGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9GSUxURVJfQVBJID0gJ2NhcnRvZ3JhcGh5LWZpbHRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeUZpbHRlciwgXCJjYXJ0b2dyYXBoeS1maWx0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBmaWx0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUZpbHRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUZpbHRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxpdGVtLmNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZihpdGVtLnRlcnJpdG9yaWFsTGV2ZWwgIT0gbnVsbCAmJiBpdGVtLnRlcnJpdG9yaWFsTGV2ZWwgIT0gdW5kZWZpbmVkICl7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3RlcnJpdG9yaWFsTGV2ZWwnLGl0ZW0udGVycml0b3JpYWxMZXZlbCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBcclxuICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS50ZXJyaXRvcmlhbExldmVsPWl0ZW0udGVycml0b3JpYWxMZXZlbC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9GSUxURVJfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHl9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnOyBcclxuLyoqXHJcbiAqIFNlcnZpY2UgcGFyYW1ldGVyIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlQYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqLyAgXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIG9yZGVyKi8gIFxyXG4gIHB1YmxpYyBvcmRlcjogc3RyaW5nO1xyXG5cclxuICAvKiogY2FydG9ncmFwaHkqL1xyXG4gIHB1YmxpYyBjYXJ0b2dyYXBoeTogQ2FydG9ncmFwaHk7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5UGFyYW1ldGVyIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBTZXJ2aWNlIHBhcmFtZXRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5UGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5UGFyYW1ldGVyPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9QQVJBTUVURVJfQVBJID0gJ2NhcnRvZ3JhcGh5LXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeVBhcmFtZXRlciwgXCJjYXJ0b2dyYXBoeS1wYXJhbWV0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5UGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGxldCBjYXJ0b2dyYXBoeSA9ICBpdGVtLmNhcnRvZ3JhcGh5O1xyXG4gICAgICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY2FydG9ncmFwaHknLGNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeVBhcmFtZXRlciB9IGZyb20gJy4vY2FydG9ncmFwaHktcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogU2VydmljZSBwYXJhbWV0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeVNwYXRpYWxTZWxlY3Rpb25QYXJhbWV0ZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlQYXJhbWV0ZXI+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX1NQQVRJQUxfU0VMRUNUSU9OX1BBUkFNRVRFUl9BUEkgPSAnY2FydG9ncmFwaHktc3BhdGlhbC1zZWxlY3Rpb24tcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5UGFyYW1ldGVyLCBcImNhcnRvZ3JhcGh5LXNwYXRpYWwtc2VsZWN0aW9uLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlQYXJhbWV0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeVBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgbGV0IGNhcnRvZ3JhcGh5ID0gIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgICAgICBkZWxldGUgaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FSVE9HUkFQSFlfU1BBVElBTF9TRUxFQ1RJT05fUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJzsgXHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeSBzdHlsZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5U3R5bGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHRpdGxlKi9cclxuICBwdWJsaWMgdGl0bGU6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiBkZXNjcmlwdGlvbiovICBcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBcclxuICAvKiogZm9ybWF0Ki8gIFxyXG4gIHB1YmxpYyBmb3JtYXQ6IHN0cmluZztcclxuICBcclxuICAvKiogd2lkdGgqLyAgXHJcbiAgcHVibGljIHdpZHRoOiBudW1iZXI7XHJcbiAgXHJcbiAgLyoqIGhlaWdodCovICBcclxuICBwdWJsaWMgaGVpZ2h0OiBudW1iZXI7XHJcbiAgXHJcbiAgLyoqIHVybCovICBcclxuICBwdWJsaWMgdXJsOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBjYXJ0b2dyYXBoeSovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuXHJcbiAgcHVibGljIGRlZmF1bHRTdHlsZTogYm9vbGVhbjtcclxuXHJcbiAgcHVibGljIGxlZ2VuZFVSTDogYW55O1xyXG4gIFxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHlTdHlsZSB9IGZyb20gJy4vY2FydG9ncmFwaHktc3R5bGUubW9kZWwnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlTdHlsZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeVN0eWxlPiB7XHJcblxyXG4gLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX1NUWUxFU19BUEkgPSAnY2FydG9ncmFwaHktc3R5bGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHlTdHlsZSwgXCJjYXJ0b2dyYXBoeS1zdHlsZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlTdHlsZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IENhcnRvZ3JhcGh5U3R5bGUpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGxldCBjYXJ0b2dyYXBoeSA9ICBpdGVtLmNhcnRvZ3JhcGh5O1xyXG4gICAgICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY2FydG9ncmFwaHknLGNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX1NUWUxFU19BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUdyb3VwfSBmcm9tICcuL2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuLyoqXHJcbiAqIEJhY2tncm91bmQgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBCYWNrZ3JvdW5kIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBkZXNjcmlwdGlvbiovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBpbWFnZSAqL1xyXG4gIHB1YmxpYyBpbWFnZTogc3RyaW5nO1xyXG5cclxuICAvKiogd2hldGhlciBiYWNrZ3JvdW5kIGlzIGFjdGl2ZSovXHJcbiAgcHVibGljIGFjdGl2ZTogQm9vbGVhbjtcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcblxyXG4gIC8qKiBjYXJ0b2dyYXBoeSBncm91cCovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5R3JvdXA6IENhcnRvZ3JhcGh5R3JvdXA7XHJcbn1cclxuIiwiaW1wb3J0IHsgQmFja2dyb3VuZCB9IGZyb20gJy4vYmFja2dyb3VuZC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIEJhY2tncm91bmQgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEJhY2tncm91bmRTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QmFja2dyb3VuZD4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQkFDS0dST1VORF9BUEkgPSAnYmFja2dyb3VuZHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihCYWNrZ3JvdW5kLCBcImJhY2tncm91bmRzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBiYWNrZ3JvdW5kKi9cclxuICByZW1vdmUoaXRlbTogQmFja2dyb3VuZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTsgICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYmFja2dyb3VuZCovXHJcbiAgc2F2ZShpdGVtOiBCYWNrZ3JvdW5kKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGxldCBiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cDphbnkgPSB7fSAgICAgICAgIFxyXG4gICAgXHJcbiAgICBiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cC5fbGlua3M9IHt9O1xyXG4gICAgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgIGl0ZW0uY2FydG9ncmFwaHlHcm91cDtcclxuXHJcbiAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeUdyb3VwIT1udWxsKXtcclxuICAgICAgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAgPSBpdGVtLmNhcnRvZ3JhcGh5R3JvdXA7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLmNhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uY2FydG9ncmFwaHlHcm91cCA9IGl0ZW0uY2FydG9ncmFwaHlHcm91cC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHlHcm91cDsgICAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmLmhyZWY9PScnKXtcclxuICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignY2FydG9ncmFwaHlHcm91cCcsYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXApLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgXHJcblxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeUdyb3VwJyxiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgIFxyXG5cclxuICAgICAgXHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgICAgICAgICAgIFxyXG4gICAgICAgfSBcclxuICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG5cclxuICAgICAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQkFDS0dST1VORF9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtUcmVlTm9kZX0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xyXG5pbXBvcnQge1JvbGV9IGZyb20gJy4uL3JvbGUvcm9sZS5tb2RlbCc7ICAgIFxyXG4vKipcclxuICogVHJlZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRyZWUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBkZXNjcmlwdGlvbiAqL1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIC8qKiBpbWFnZSAqL1xyXG4gIHB1YmxpYyBpbWFnZTogc3RyaW5nO1xyXG4gIC8qKiBub2RlcyAqL1xyXG4gIHB1YmxpYyBub2RlczogVHJlZU5vZGVbXTtcclxuICAvKiogYXZhaWxhYmxlIHJvbGVzICovXHJcbiAgcHVibGljIGF2YWlsYWJsZVJvbGVzIDogUm9sZVtdO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUcmVlIH0gZnJvbSAnLi90cmVlLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVHJlZSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVHJlZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUcmVlPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRSRUVfQVBJID0gJ3RyZWVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVHJlZSwgXCJ0cmVlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdHJlZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRyZWUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0cmVlKi9cclxuICBzYXZlKGl0ZW06IFRyZWUpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRSRUVfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHl9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHtUcmVlfSBmcm9tICcuL3RyZWUubW9kZWwnO1xyXG4vKipcclxuICogVHJlZSBub2RlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJlZU5vZGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0b29sdGlwKi9cclxuICBwdWJsaWMgdG9vbHRpcDogc3RyaW5nO1xyXG4gIC8qKiBkZXNjcmlwdGlvbiovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIGRhdGFzZXRVUkwqL1xyXG4gIHB1YmxpYyBkYXRhc2V0VVJMOiBzdHJpbmc7XHJcbiAgLyoqIG1ldGFkYXRhVVJMKi9cclxuICBwdWJsaWMgbWV0YWRhdGFVUkw6IHN0cmluZztcclxuICAvKiogb3JkZXIqL1xyXG4gIHB1YmxpYyBvcmRlciA6IG51bWJlcjtcclxuICAvKiogd2hldGhlciB0cmVlIG5vZGUgaXMgYWN0aXZlKi9cclxuICBwdWJsaWMgYWN0aXZlOiBib29sZWFuO1xyXG4gIC8qKiBwYXJlbnQgdHJlZSBub2RlICovXHJcbiAgcHVibGljIHJhZGlvOiBib29sZWFuO1xyXG4gIC8qKiBwYXJlbnQgdHJlZSBub2RlICovXHJcbiAgcHVibGljIHBhcmVudDogVHJlZU5vZGU7XHJcbiAgLyoqIGRpc3BsYXllZCBjYXJ0b2dyYXBoeSAqLyAgXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuICAvKiogdHJlZSAqLyAgXHJcbiAgcHVibGljIHRyZWU6IFRyZWU7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUcmVlIG5vZGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBUcmVlTm9kZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUcmVlTm9kZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUUkVFX05PREVfQVBJID0gJ3RyZWUtbm9kZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUcmVlTm9kZSwgXCJ0cmVlLW5vZGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmVlIG5vZGUqL1xyXG4gIHJlbW92ZShpdGVtOiBUcmVlTm9kZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRyZWUgbm9kZSovXHJcbiAgc2F2ZShpdGVtOiBUcmVlTm9kZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgY29uc3QgaXRlbVRyZWUgPSBpdGVtLnRyZWU7XHJcbiAgICAgIGNvbnN0IGl0ZW1DYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgIGNvbnN0IGl0ZW1QYXJlbnQgPSBpdGVtLnBhcmVudDtcclxuICAgICAgICBcclxuICAgICAgZGVsZXRlIGl0ZW0udHJlZTtcclxuICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgIGRlbGV0ZSBpdGVtLnBhcmVudDtcclxuICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbVRyZWUgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0cmVlJyxpdGVtVHJlZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtQ2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsaXRlbUNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW1QYXJlbnQgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdwYXJlbnQnLGl0ZW1QYXJlbnQpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgICAgbGV0IHRyZWVOb2RlUGFyZW50OmFueSA9IHt9O1xyXG4gICAgICAgICAgdHJlZU5vZGVQYXJlbnQuX2xpbmtzPSB7fTtcclxuICAgICAgICAgIHRyZWVOb2RlUGFyZW50Ll9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICB0cmVlTm9kZVBhcmVudC5fbGlua3Muc2VsZi5ocmVmPVwiXCI7XHJcbiAgICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdwYXJlbnQnLCB0cmVlTm9kZVBhcmVudCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGl0ZW0udHJlZSAmJiBpdGVtLnRyZWUuX2xpbmtzICYmIGl0ZW0udHJlZS5fbGlua3Muc2VsZikge1xyXG4gICAgICAgIGl0ZW0udHJlZSA9IGl0ZW0udHJlZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLmNhcnRvZ3JhcGh5ICYmIGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzICYmIGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYpIHtcclxuICAgICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9ICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVFJFRV9OT0RFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1RyZWV9IGZyb20gJy4uL3RyZWUvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Um9sZX0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUdyb3VwfSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25QYXJhbWV0ZXJ9IGZyb20gJy4vYXBwbGljYXRpb24tcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbkJhY2tncm91bmR9IGZyb20gJy4vYXBwbGljYXRpb24tYmFja2dyb3VuZC5tb2RlbCc7XHJcblxyXG4vL0ZJWE1FIGVuc3VyZSBhcHBsaWNhdGlvbiBjcmVhdGlvbiBpbiBhZG1pbiBhcHAgdXBvbiBpbml0aWFsaXphdGlvbiAoYXMgaXQgaXMgZG9uZSB3aXRoIFJvbGVzIGFuZCBkZWZhdWx0IFVzZXJzKVxyXG4vKiogVGVycml0b3JpYWwgYXBwbGljdGlvbiBuYW1lICovXHJcbmV4cG9ydCBjb25zdCBURVJSSVRPUklBTF9BUFBfTkFNRTpzdHJpbmcgID0gXCJBcGxpY2FjacODwrNuIFRlcnJpdG9yaWFsXCI7XHJcblxyXG4vKipcclxuICogQXBwbGljYXRpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICBcclxuICAvKiogdGl0bGUqL1xyXG4gIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0aGVtZSovXHJcbiAgcHVibGljIHRoZW1lOiBzdHJpbmc7XHJcblxyXG4gICAgXHJcbiAgLyoqIHVybFRlbXBsYXRlKi9cclxuICBwdWJsaWMganNwVGVtcGxhdGU6IHN0cmluZztcclxuICBcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgXHJcbiAgLyoqIGF2YWlsYWJsZSByb2xlcyovXHJcbiAgcHVibGljIGF2YWlsYWJsZVJvbGVzIDogUm9sZVtdO1xyXG4gIFxyXG4gIC8qKiB0cmVlcyovXHJcbiAgcHVibGljIHRyZWVzIDogVHJlZVtdO1xyXG4gIFxyXG4gIC8qKiBzY2FsZXMgKGNvbW1hLXNlcGFyYXRlZCB2YWx1ZXMpKi9cclxuICBwdWJsaWMgc2NhbGVzOiBzdHJpbmdbXTtcclxuICBcclxuICAvKiogcHJvamVjdGlvbnMoY29tbWEtc2VwYXJhdGVkIEVQU0cgY29kZXMpKi9cclxuICBwdWJsaWMgc3JzOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHdoZXRoZXIgYXBwbGljYXRpb24gdHJlZSB3aWxsIGF1dG8gcmVmcmVzaCovICBcclxuICBwdWJsaWMgdHJlZUF1dG9SZWZyZXNoOiBCb29sZWFuO1xyXG5cclxuICAvKiogYmFja2dyb3VuZHMqL1xyXG4gIHB1YmxpYyBiYWNrZ3JvdW5kczogQXBwbGljYXRpb25CYWNrZ3JvdW5kW107XHJcblxyXG4gIC8qKiBzaXR1YXRpb24gbWFwKi9cclxuICBwdWJsaWMgc2l0dWF0aW9uTWFwOiBDYXJ0b2dyYXBoeUdyb3VwOyAgICBcclxuICBcclxuICAvKiogcGFyYW1ldGVycyovXHJcbiAgcHVibGljIHBhcmFtZXRlcnM6IEFwcGxpY2F0aW9uUGFyYW1ldGVyW107XHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICcuL2FwcGxpY2F0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5R3JvdXAgfSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbCc7XHJcblxyXG4vKiogQXBwbGljYXRpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEFwcGxpY2F0aW9uPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUFBMSUNBVElPTl9BUEkgPSAnYXBwbGljYXRpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQXBwbGljYXRpb24sIFwiYXBwbGljYXRpb25zXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBhcHBsaWNhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IEFwcGxpY2F0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYXBwbGljYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogQXBwbGljYXRpb24pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG5cclxuICAgIGxldCBhcHBsaWNhdGlvblNpdHVhdGlvbk1hcDphbnkgPSB7fTtcclxuICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcz0ge307XHJcbiAgICBhcHBsaWNhdGlvblNpdHVhdGlvbk1hcC5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgYXBwbGljYXRpb25TaXR1YXRpb25NYXAuX2xpbmtzLnNlbGYuaHJlZj1cIlwiO1xyXG4gICAgIFxyXG4gICAgaWYgKGl0ZW0uc2l0dWF0aW9uTWFwIT1udWxsKXtcclxuICAgICAgICBhcHBsaWNhdGlvblNpdHVhdGlvbk1hcD1pdGVtLnNpdHVhdGlvbk1hcDtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW0uc2l0dWF0aW9uTWFwLl9saW5rcyE9ICd1bmRlZmluZWQnKSB7IFxyXG4gICAgICAgICAgICBpdGVtLnNpdHVhdGlvbk1hcCA9IGl0ZW0uc2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgICAgfSAgICAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5zaXR1YXRpb25NYXA7ICAgICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChhcHBsaWNhdGlvblNpdHVhdGlvbk1hcC5fbGlua3Muc2VsZi5ocmVmPT0nJyl7XHJcbiAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3NpdHVhdGlvbk1hcCcsYXBwbGljYXRpb25TaXR1YXRpb25NYXApLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgXHJcbiAgICAgICAgICAgICBcclxuICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgIFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NpdHVhdGlvbk1hcCcsYXBwbGljYXRpb25TaXR1YXRpb25NYXApLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICBcclxuICAgICAgXHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgICAgICAgICAgIFxyXG4gICAgICAgfSBcclxuICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG5cclxuICAgICAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQVBQTElDQVRJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgICBcclxuICAgIFxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0JhY2tncm91bmR9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2JhY2tncm91bmQubW9kZWwnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9ufSBmcm9tICcuL2FwcGxpY2F0aW9uLm1vZGVsJzsgXHJcblxyXG4vKipcclxuICogQXBwbGljYXRpb24gYmFja2dyb3VuZCBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uQmFja2dyb3VuZCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogb3JkZXIqL1xyXG4gIHB1YmxpYyBvcmRlcjogTnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBiYWNrZ3JvdW5kKi9cclxuICBwdWJsaWMgYmFja2dyb3VuZDogQmFja2dyb3VuZDtcclxuICBcclxuICAvKiogYXBwbGljYXRpb24qL1xyXG4gIHB1YmxpYyBhcHBsaWNhdGlvbjogQXBwbGljYXRpb247XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uQmFja2dyb3VuZCB9IGZyb20gJy4vYXBwbGljYXRpb24tYmFja2dyb3VuZC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIEFwcGxpY2F0aW9uIGJhY2tncm91bmQgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbkJhY2tncm91bmRTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QXBwbGljYXRpb25CYWNrZ3JvdW5kPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUFBMSUNBVElPTl9CQUNLR1JPVU5EX0FQSSA9J2FwcGxpY2F0aW9uLWJhY2tncm91bmRzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQXBwbGljYXRpb25CYWNrZ3JvdW5kLCBcImFwcGxpY2F0aW9uLWJhY2tncm91bmRzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBhcHBsaWNhdGlvbiBiYWNrZ3JvdW5kKi9cclxuICByZW1vdmUoaXRlbTogQXBwbGljYXRpb25CYWNrZ3JvdW5kKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYXBwbGljYXRpb24gYmFja2dyb3VuZCovXHJcbiAgc2F2ZShpdGVtOiBBcHBsaWNhdGlvbkJhY2tncm91bmQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0uYXBwbGljYXRpb24gIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdhcHBsaWNhdGlvbicsaXRlbS5hcHBsaWNhdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0uYmFja2dyb3VuZCAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2JhY2tncm91bmQnLGl0ZW0uYmFja2dyb3VuZCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmFwcGxpY2F0aW9uID0gaXRlbS5hcHBsaWNhdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLmJhY2tncm91bmQgPSBpdGVtLmJhY2tncm91bmQuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BUFBMSUNBVElPTl9CQUNLR1JPVU5EX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9ufSBmcm9tICcuL2FwcGxpY2F0aW9uLm1vZGVsJzsgXHJcblxyXG4vKipcclxuICogQXBwbGljYXRpb24gcGFyYW1ldGVyIG1vZGVsIFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uUGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB2YWx1ZSovICAgIFxyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBhcHBsaWNhdGlvbiovXHJcbiAgcHVibGljIGFwcGxpY2F0aW9uOiBBcHBsaWNhdGlvbjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb25QYXJhbWV0ZXIgfSBmcm9tICcuL2FwcGxpY2F0aW9uLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIEFwcGxpY2F0aW9uIHBhcmFtZXRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEFwcGxpY2F0aW9uUGFyYW1ldGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUFBMSUNBVElPTl9QQVJBTUVURVJfQVBJID0gJ2FwcGxpY2F0aW9uLXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihBcHBsaWNhdGlvblBhcmFtZXRlciwgXCJhcHBsaWNhdGlvbi1wYXJhbWV0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBhcHBsaWNhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IEFwcGxpY2F0aW9uUGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYXBwbGljYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogQXBwbGljYXRpb25QYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0uYXBwbGljYXRpb24gIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdhcHBsaWNhdGlvbicsaXRlbS5hcHBsaWNhdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmFwcGxpY2F0aW9uID0gaXRlbS5hcHBsaWNhdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFQUExJQ0FUSU9OX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIENvbm5lY3Rpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb2RlTGlzdCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIGNvZGVMaXN0TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICAvKiogdXNlciovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDb2RlTGlzdCB9IGZyb20gJy4vY29kZWxpc3QubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDb25uZWN0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb2RlTGlzdFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDb2RlTGlzdD4ge1xyXG4gIFxyXG4gXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPREVMSVNUX0FQSSA9ICdjb2RlbGlzdC12YWx1ZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDb2RlTGlzdCwgXCJjb2RlbGlzdC12YWx1ZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNvbm5lY3Rpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBDb2RlTGlzdCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNvbm5lY3Rpb24qL1xyXG4gIHNhdmUoaXRlbTogQ29kZUxpc3QpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPREVMSVNUX0FQSSApLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIExheWVyIG1vZGVsOiBjb25maWd1cmUgTGF5ZXIgZGF0YSBhbmQgZGlzcGxheWluZyBjb25maWd1cmF0aW9uICovIFxyXG5leHBvcnQgY2xhc3MgTGF5ZXIge1xyXG4gIC8vIERpc3BsYXkgZGF0YVxyXG4gIC8qKiBsYXllciB2aXNpYmlsaXR5Ki8gIFxyXG4gIHZpc2liaWxpdHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAvKiogVHJhbnNwYXJlbmN5IChUcmFuc3BhcmVudCkgMC0xIChPcGFxdWUpKi9cclxuICBvcGFjaXR5OiBudW1iZXIgPSAxLjA7XHJcblxyXG4gIC8vIENvbmZpZ3VyYXRpb24gZGF0YVxyXG4gIC8qKiB0aXRsZSovXHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBcclxuICAvKiogSWQgdG8gaW5kZXgqL1xyXG4gIGlkOiBhbnk7XHJcbiAgXHJcbiAgLyoqIFNlcnZpY2UgTmFtZSovXHJcbiAgc2VydmVyTmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogU2VydmljZSBhdHRyaWJ1dGlvbnMqL1xyXG4gIGF0dHJpYnV0aW9uczogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgLyoqIFJlcXVlc3QgZm9ybWF0IChpbWFnZS9qcGcsIC4uLikqL1xyXG4gIGZvcm1hdDogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBSZXF1ZXN0IHNlcnZpY2UgdmVyc2lvbiovXHJcbiAgdmVyc2lvbjpzdHJpbmc7XHJcblxyXG4gIC8qKiBTZXJ2aWNlIHVybCovXHJcbiAgdXJsOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBJcyBiYXNlIGxheWVyPyovXHJcbiAgaXNCYXNlTGF5ZXI6IGJvb2xlYW47XHJcblxyXG4gIC8qKiBSZXF1ZXN0IGxheWVyIG5hbWUqL1xyXG4gIG5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIElzIHRpbGVkPyovXHJcbiAgdGlsZWQ6IGJvb2xlYW47XHJcbiAgXHJcbiAgLyoqIERlc2NyaXB0aW9uKi9cclxuICBkZXNjOiBzdHJpbmcgPSBcIlwiO1xyXG4gIFxyXG4gIC8qKiAgVHJhbnNwYXJlbnQgcmVxdWVzdCBwYXJhbWV0ZXI/Ki9cclxuICB1cmxfdHJhbnNwYXJlbnQ6IHN0cmluZyA9IFwidHJ1ZVwiO1xyXG4gIFxyXG4gIC8qKiBSZXF1ZXN0IEJhY2tncm91bmQgcGFyYW1ldGVyIGNvbG9yIChIZXhhKSovXHJcbiAgdXJsX2JnY29sb3I6IHN0cmluZyA9IFwiMHgwMDAwMDBcIjtcclxuICBcclxuICAvKiogUmVxdWVzdCBFeGNlcHRpb24gVVJMKi9cclxuICB1cmxfZXhjZXB0aW9uOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIEV4dGVudCBmb3IgdGlsZWQgc2VydmljZXMqL1xyXG4gIGV4dGVudDogYW55ID0gbnVsbDtcclxuXHJcbiAgLyoqIFRpbGUgaGVpZ2h0IChpZiBub3QgZGVmaW5lZCwgdGhlIGRlZmF1bHQgbWFwIGlzIHRha2VuKSovXHJcbiAgdGlsZUhlaWdodD86bnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBUaWxlIHdpZHRoIChpZiBub3QgZGVmaW5lZCwgdGhlIGRlZmF1bHQgbWFwIGlzIHRha2VuKSovXHJcbiAgdGlsZVdpZHRoPzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIEVuYWJsZWQgZm9yIEdldEZlYXR1cmVJbmZvIHJlcXVlc3RzIChlbmFibGVkIHRvIHVzZSB0aGUgdmlld2VyIGZlYXR1cmVzIGluZm9ybWF0aW9uIHRvb2wpKi9cclxuICBxdWVyeWFibGU/OmJvb2xlYW4gPSBmYWxzZTtcclxuICBcclxuICAvKiogTWluaW11bSBzY2FsZSovXHJcbiAgbWluaW11bVNjYWxlPzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIE1heGltdW0gc2NhbGUqL1xyXG4gIG1heGltdW1TY2FsZT86bnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBMaXN0IG9mIGF2YWlsYWJsZSBDUlMqL1xyXG4gIHByb2plY3Rpb25zPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIEZlYXR1cmVzIGluZm9ybWF0aW9uIFVSTCovXHJcbiAgaW5mb1VybD86c3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBNZXRhZGF0YSBpbmZvcm1hdGlvbiBVUkwqL1xyXG4gIG1ldGFkYXRhVXJsPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIExlZ2VuZCBVUkwqL1xyXG4gIGxlZ2VuZFVybD86c3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBBcnJheSBvZiBPcHRpb25hbFBhcmFtZXRlciBvYmplY3QgdGhhdCBkZWZpbmVzIG90aGVyIG9wdGlvbmFsIHBhcmFtZXRlci12YWx1ZSBwYWlycyBmb3IgdGhlIHJlcXVlc3QgKFRJTUUgLi4uKSovXHJcbiAgb3B0aW9uYWxQYXJhbWV0ZXJzPzpBcnJheTxPcHRpb25hbFBhcmFtZXRlcj47XHJcbn1cclxuXHJcbi8qKiBPcHRpb25hbCBwYXJhbWV0ZXIgbW9kZWw6IGNvbmZpZ3VyZSBwYXJhbWV0ZXItdmFsdWUgcGFpciB0byBhZGQgdG8gdGhlIHJlcXVlc3QgbGF5ZXIgVVJMICovXHJcbmV4cG9ydCBjbGFzcyBPcHRpb25hbFBhcmFtZXRlciB7XHJcbiAgLyoqIGtleSova2V5OnN0cmluZztcclxuICAvKiogdmFsdWUqL3ZhbHVlOnN0cmluZztcclxufVxyXG5cclxuLyoqIExheWVyIGNvbmZpZ3VyYXRpb24gbW9kZWw6IG1vZGlmeSB0aGUgY29uZmlndXJhdGlvbiBvZiBhIGxheWVyIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgbWFwIChtYWtlIHZpc2libGUsIG1vdmUgdGhlIGxheWVyIC4uLikgKi9cclxuZXhwb3J0IGNsYXNzIExheWVyQ29uZmlndXJhdGlvbiB7XHJcbiAgLyoqIElkZW50aWZpZXIgdG8gaW5kZXgqL2lkOiBhbnk7XHJcbiAgLyoqIExheWVyIHZpc2liaWxpdHkqL3Zpc2liaWxpdHk6IGJvb2xlYW47XHJcbiAgLyoqIExheWVyIHRyYW5zcGFyZW5jeSAoVHJhbnNwYXJlbnQpIDAtMSAoT3BhcXVlKSovb3BhY2l0eTogbnVtYmVyO1xyXG4gIC8qKiBMYXllciBwb3NpdGlvbiovcG9zaXRpb246IG51bWJlcjtcclxufVxyXG5cclxuLyoqIExheWVyIGdyb3VwIG1vZGVsKi9cclxuZXhwb3J0IGNsYXNzIExheWVyR3JvdXAge1xyXG4gIC8qKiBpbml0aWFsbHkgYWN0aXZhdGVkIChhbGwgdmlzaWJsZSBsYXllcnMpKi9hY3RpdmU/OmJvb2xlYW47XHJcbiAgLyoqIGdyb3VwIG5hbWUqL25hbWU/OiBTdHJpbmc7XHJcbiAgLyoqIGdyb3VwIGlkKi9pZDogU3RyaW5nO1xyXG4gIC8qKiBhcnJheSBvZiBjaGlsZCBMYXllcnMqL2xheWVyczogQXJyYXk8TGF5ZXI+O1xyXG59XHJcblxyXG4vKiogTWFwIG9wdGlvbnMgY29uZmlndXJhdGlvbiBtb2RlbCovXHJcbmV4cG9ydCBjbGFzcyBNYXBPcHRpb25zQ29uZmlndXJhdGlvbiB7XHJcbiAgLyoqIHNjYWxlcyovc2NhbGVzPzogc3RyaW5nO1xyXG4gIC8qKiBwcm9qZWN0aW9ucyovcHJvamVjdGlvbnM/OiBzdHJpbmc7XHJcbiAgLyoqIG1pbmltdW0gc2NhbGUqL21pblNjYWxlPzpudW1iZXI7XHJcbiAgLyoqIG1heGltdW0gc2NhbGUqL21heFNjYWxlPzpudW1iZXI7XHJcbiAgLyoqIGV4dGVudCovZXh0ZW50Pzphbnk7XHJcbiAgLyoqIG1heGltdW0gZXh0ZW50Ki9tYXhFeHRlbnQ/OmFueTtcclxuICAvKiogdGlsZSB3aWR0aCovdGlsZVdpZHRoPzpudW1iZXI7XHJcbiAgLyoqIHRpbGUgaGVpZ2h0Ki90aWxlSGVpZ2h0PzpudW1iZXI7XHJcbiAgLyoqIHBhcmFtZXRlcnMqL3BhcmFtZXRlcnM/OiBBcnJheTxPcHRpb25hbFBhcmFtZXRlcj5cclxufVxyXG5cclxuLyoqIE1hcCBjb21wb25lbnQgc3RhdHVzIG1vZGVsKi9cclxuZXhwb3J0IGNsYXNzIE1hcENvbXBvbmVudFN0YXR1cyB7XHJcbiAgICAvKiogbG9hZGVkPyovbG9hZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuXHJcbi8qKiBNYXAgY29uZmlndXJhdGlvbiBtYW5hZ2VyIHNlcnZpY2UqL1xyXG5leHBvcnQgY2xhc3MgTWFwQ29uZmlndXJhdGlvbk1hbmFnZXJTZXJ2aWNlIHtcclxuICBwcml2YXRlIGxheWVyc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIGxheWVyczogQXJyYXk8TGF5ZXI+ID0gbnVsbDtcclxuXHJcbiAgcHJpdmF0ZSBiYXNlTGF5ZXJHcm91cHNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgcHJpdmF0ZSBiYXNlTGF5ZXJHcm91cHM6IEFycmF5PExheWVyR3JvdXA+ID0gbnVsbDtcclxuXHJcbiAgcHJpdmF0ZSBsYXllckNvbmZpZ3VyYXRpb25TdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcblxyXG4gIHByaXZhdGUgYWRkTGF5ZXJzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG4gIHByaXZhdGUgcmVtb3ZlTGF5ZXJzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG5cclxuICBwcml2YXRlIHNpdHVhdGlvbk1hcENvbmZpZ3VyYXRpb25TdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgcHJpdmF0ZSBtYXBPcHRpb25zQ29uZmlndXJhdGlvblN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgcHJpdmF0ZSBtYXBDb21wb25lbnRTdGF0dXNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciovXHJcbiAgY29uc3RydWN0b3IoKSB7IFxyXG4gICAvL1xyXG4gIH1cclxuICBcclxuICAvKiogbGF5ZXIgY291bnQgKi9cclxuICBjb3VudCA9IDA7XHJcblxyXG4gIC8qKiBjb25maWd1cmUgdGhlIG92ZXJsYXkgbGF5ZXJzIG9mIHRoZSBtYXAsIGJ5IHBhc3NpbmcgYXMgYSBwYXJhbWV0ZXIgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvZiB0eXBlIExheWVyIG9iamVjdHMgZGVmaW5pbmcgdGhlIGxheWVycyB0byBsb2FkLiovXHJcbiAgbG9hZExheWVyc0NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikge1xyXG4gICAgaWYgKHRoaXMubGF5ZXJzICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5jbGVhckxheWVycyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNldExheWVycyhjb25maWd1cmF0aW9uKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqY29uZmlndXJlIHRoZSBiYXNlIGxheWVycyBvZiB0aGUgbWFwIGJ5IHBhc3NpbmcgYXMgYSBwYXJhbWV0ZXIgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvZiB0eXBlIExheWVyR3JvdXAgZWFjaCBvZiB0aGVtIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgTGF5ZXIgb2JqZWN0cyBkZWZpbmluZyB0aGUgbGF5ZXJzIHRvIGxvYWQuKi9cclxuICBsb2FkQmFzZUxheWVyc0NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikge1xyXG4gICAgdGhpcy5zZXRCYXNlTGF5ZXJHcm91cHMoY29uZmlndXJhdGlvbik7XHJcbiAgfVxyXG5cclxuICAvKiogZ2V0IGJhc2UgbGF5ZXIgZ3JvdXBzKi9cclxuICBnZXRCYXNlTGF5ZXJHcm91cHMoKTogT2JzZXJ2YWJsZTxMYXllckdyb3VwW10+IHtcclxuICAgIHJldHVybiB0aGlzLmJhc2VMYXllckdyb3Vwc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogc2V0IGJhc2UgbGF5ZXIgZ3JvdXBzKi9cclxuICBzZXRCYXNlTGF5ZXJHcm91cHMoZ3JvdXBzOkFycmF5PExheWVyR3JvdXA+KSB7XHJcbiAgICB0aGlzLmJhc2VMYXllckdyb3VwcyA9IGdyb3VwcztcclxuICAgIHRoaXMucmVmcmVzaEJhc2VMYXllckdyb3VwcygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoQmFzZUxheWVyR3JvdXBzKCkge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5iYXNlTGF5ZXJHcm91cHNTdWJqZWN0Lm5leHQodGhpcy5iYXNlTGF5ZXJHcm91cHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGdldCBsYXllcnMqL1xyXG4gIGdldExheWVycygpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLmxheWVyc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIGFsbCBsYXllcnMgZnJvbSBtYXAqL1xyXG4gIGNsZWFyTGF5ZXJzKHJlZnJlc2g6Ym9vbGVhbikge1xyXG4gICAgd2hpbGUodGhpcy5sYXllcnMubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMubGF5ZXJzLnBvcCgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHJlZnJlc2gpIHtcclxuICAgICAgdGhpcy5yZWZyZXNoTGF5ZXJzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogc2V0IGxheWVycyovXHJcbiAgc2V0TGF5ZXJzKGxheWVyczpBcnJheTxMYXllcj4pIHtcclxuICAgIHRoaXMubGF5ZXJzID0gbGF5ZXJzO1xyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJzKCk7XHJcbiAgfVxyXG5cclxuICAvKiogYWRkIGdpdmVuIGxheWVyIHRvIG1hcCovXHJcbiAgYWRkTGF5ZXIobGF5ZXI6TGF5ZXIpIHtcclxuICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xyXG4gICAgdGhpcy5yZWZyZXNoQWRkTGF5ZXJzKGxheWVyKTtcclxuICB9XHJcblxyXG4gIC8qKiBhZGQgZ2l2ZW4gbGF5ZXIgdG8gbWFwIGF0IGdpdmVuIGluZGV4Ki9cclxuICBhZGRMYXllckF0KGxheWVyOkxheWVyLCBpbmRleDpudW1iZXIpIHtcclxuICAgIGlmIChpbmRleCA9PSAwKSB7XHJcbiAgICAgIHRoaXMubGF5ZXJzID0gW2xheWVyXS5jb25jYXQodGhpcy5sYXllcnMpO1xyXG4gICAgfSBlbHNlIGlmIChpbmRleCA+PSB0aGlzLmxheWVycy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxheWVycyA9IHRoaXMubGF5ZXJzLnNsaWNlKDAsIGluZGV4KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jb25jYXQoW2xheWVyXSlcclxuICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHRoaXMubGF5ZXJzLnNsaWNlKGluZGV4LCB0aGlzLmxheWVycy5sZW5ndGgpKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVmcmVzaEFkZExheWVycyhsYXllcik7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24obGF5ZXIuaWQsIG51bGwsIG51bGwsIGluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgZ2l2ZW4gbGF5ZXIgZnJvbSBtYXAqL1xyXG4gIHJlbW92ZUxheWVyKGxheWVyOkxheWVyKSB7XHJcbiAgICB2YXIgaW5kZXggPSB0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKTtcclxuICAgIHRoaXMucmVtb3ZlTGF5ZXJJbmRleChpbmRleCk7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIGxheWVyIHdpdGggZ2l2ZW4gaWQgZnJvbSBtYXAgKi9cclxuICByZW1vdmVMYXllcklkKGlkKSB7XHJcbiAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gdGhpcy5sYXllcnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLmxheWVyc1tpXS5pZCA9PSBpZCkge1xyXG4gICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5yZW1vdmVMYXllckluZGV4KGluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgbGF5ZXIgYXQgZ2l2ZW4gaW5kZXggZnJvbSBtYXAgKi9cclxuICByZW1vdmVMYXllckluZGV4KGluZGV4Om51bWJlcikge1xyXG4gICAgdmFyIGxheWVyID0gdGhpcy5sYXllcnNbaW5kZXhdO1xyXG4gICAgdGhpcy5sYXllcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIHRoaXMucmVmcmVzaFJlbW92ZUxheWVycyhsYXllcik7XHJcbiAgfVxyXG5cclxuICAvKiogcmVmcmVzaCBsYXllcnMgKi9cclxuICBwcml2YXRlIHJlZnJlc2hMYXllcnMoKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLmxheWVyc1N1YmplY3QubmV4dCh0aGlzLmxheWVycyk7XHJcbiAgfVxyXG5cclxuICAvKiogT2JzZXJ2YWJsZSBmb3IgbGF5ZXJzIGFkZGVkICovXHJcbiAgZ2V0TGF5ZXJzQWRkZWQoKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5hZGRMYXllcnNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoQWRkTGF5ZXJzKGxheWVyOkxheWVyKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLmFkZExheWVyc1N1YmplY3QubmV4dChbbGF5ZXJdKTtcclxuICB9XHJcblxyXG4gIGdldExheWVyc1JlbW92ZWQoKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5yZW1vdmVMYXllcnNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoUmVtb3ZlTGF5ZXJzKGxheWVyOkxheWVyKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLnJlbW92ZUxheWVyc1N1YmplY3QubmV4dChbbGF5ZXJdKTtcclxuICB9XHJcblxyXG4gIGdldExheWVyQ29uZmlndXJhdGlvbkxpc3RlbmVyKCk6IE9ic2VydmFibGU8TGF5ZXJDb25maWd1cmF0aW9uW10+IHtcclxuICAgIHJldHVybiB0aGlzLmxheWVyQ29uZmlndXJhdGlvblN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldExheWVySW5kZXhCeUlkKGlkOnN0cmluZyk6bnVtYmVye1xyXG4gICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IHRoaXMubGF5ZXJzLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5sYXllcnNbaV0uaWQgPT0gaWQpIHtcclxuICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBpbmRleDtcclxuICB9XHJcbiAgXHJcbiAgLyoqIG1vdmUgbGF5ZXIgd2l0aCBnaXZlbiBpZCB0byB0aGUgZ2l2ZW4gaW5kZXgqL1xyXG4gIG1vdmVMYXllcihpZCwgaW5kZXgpIHtcclxuICAgIHZhciBsYXllckluZGV4ID0gdGhpcy5nZXRMYXllckluZGV4QnlJZChpZCk7XHJcbiAgICBpZiAobGF5ZXJJbmRleCAhPSAtMSkge1xyXG4gICAgICB2YXIgbGF5ZXIgPSB0aGlzLmxheWVycy5zcGxpY2UobGF5ZXJJbmRleCwgMSk7XHJcbiAgICAgIHRoaXMubGF5ZXJzID0gXHJcbiAgICAgICAgdGhpcy5sYXllcnMuc2xpY2UoMCwgaW5kZXgpXHJcbiAgICAgICAgLmNvbmNhdChsYXllcilcclxuICAgICAgICAuY29uY2F0KHRoaXMubGF5ZXJzLnNsaWNlKGluZGV4LCB0aGlzLmxheWVycy5sZW5ndGgpKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihpZCwgbnVsbCwgbnVsbCwgaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGNoYW5nZSB2aXNpYmlsaXR5IG9mIGxheWVyIHdpdGggZ2l2ZW4gaWQgdG8gdGhlIGdpdmVuIHZhbHVlKi9cclxuICBjaGFuZ2VMYXllclZpc2liaWxpdHkoaWQsIHZpc2liaWxpdHkpIHtcclxuICAgIHRoaXMucmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihpZCwgbnVsbCwgdmlzaWJpbGl0eSwgbnVsbCk7XHJcbiAgfVxyXG5cclxuICAvKiogY2hhbmdlIG9wYWNpdHkgb2YgbGF5ZXIgd2l0aCBnaXZlbiBpZCB0byB0aGUgZ2l2ZW4gdmFsdWUqL1xyXG4gIGNoYW5nZUxheWVyT3BhY2l0eShpZCwgb3BhY2l0eSkge1xyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBvcGFjaXR5LCBudWxsLCBudWxsKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihpZCwgb3BhY2l0eSwgdmlzaWJpbGl0eSwgcG9zaXRpb24pIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHZhciBsYXllciA9IG5ldyBMYXllckNvbmZpZ3VyYXRpb24oKTtcclxuICAgIGxheWVyLmlkID0gaWQ7XHJcbiAgICBsYXllci5vcGFjaXR5ID0gb3BhY2l0eTtcclxuICAgIGxheWVyLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xyXG4gICAgbGF5ZXIucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgIHRoaXMubGF5ZXJDb25maWd1cmF0aW9uU3ViamVjdC5uZXh0KFtsYXllcl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvbkxpc3RlbmVyKCk6IE9ic2VydmFibGU8TGF5ZXJbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvblN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogY29uZmlndXJlIHRoZSBzaXR1YXRpb24gbWFwIG9mIHRoZSBtYXAgY29tcG9uZW50IGJ5IHBhc3NpbmcgYXMgYSBwYXJhbWV0ZXIgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvZiB0eXBlIExheWVyR3JvdXAsIGVhY2ggb2YgdGhlbSB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIExheWVyIG9iamVjdHMgZGVmaW5pbmcgdGhlIGxheWVycyB0byBsb2FkIGFzIHNpdHVhdGlvbiBtYXAuKi9cclxuICBsb2FkU2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvbihsYXllcnM6QXJyYXk8TGF5ZXI+KSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLnNpdHVhdGlvbk1hcENvbmZpZ3VyYXRpb25TdWJqZWN0Lm5leHQobGF5ZXJzKTtcclxuICB9XHJcblxyXG4gIGdldE1hcE9wdGlvbnNDb25maWd1cmF0aW9uTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxNYXBPcHRpb25zQ29uZmlndXJhdGlvbltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXBPcHRpb25zQ29uZmlndXJhdGlvblN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogbG9hZCBtYXAgb3B0aW9ucyBjb25maWd1cmF0aW9uICovXHJcbiAgbG9hZE1hcE9wdGlvbnNDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb246TWFwT3B0aW9uc0NvbmZpZ3VyYXRpb24pIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMubWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25TdWJqZWN0Lm5leHQoW2NvbmZpZ3VyYXRpb25dKTtcclxuICB9XHJcblxyXG4gIGdldE1hcENvbXBvbmVudFN0YXR1c0xpc3RlbmVyKCk6IE9ic2VydmFibGU8TWFwQ29tcG9uZW50U3RhdHVzW10+IHtcclxuICAgIHJldHVybiB0aGlzLm1hcENvbXBvbmVudFN0YXR1c1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzZXQgbWFwIGNvbXBvbmVudCBzdGF0dXMgKi9cclxuICBzZXRNYXBDb21wb25lbnRTdGF0dXMoc3RhdHVzOk1hcENvbXBvbmVudFN0YXR1cykge1xyXG4gICAgLy9Ob3RpZnkgdGhlIG1hcCBjb21wb25lbnQgc3RhdHVzXHJcbiAgICB0aGlzLm1hcENvbXBvbmVudFN0YXR1c1N1YmplY3QubmV4dChbc3RhdHVzXSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBAd2hhdEl0RG9lcyBDb25kaXRpb25hbGx5IGluY2x1ZGVzIGFuIEhUTUwgZWxlbWVudCBpZiBjdXJyZW50IHVzZXIgaGFzIGFueVxyXG4gKiBvZiB0aGUgYXV0aG9yaXRpZXMgcGFzc2VkIGFzIHRoZSBgZXhwcmVzc2lvbmAuXHJcbiAqXHJcbiAqIEBob3dUb1VzZVxyXG4gKiBgYGBcclxuICogICAgIDxzb21lLWVsZW1lbnQgKnNpdG11bkhhc0FueUF1dGhvcml0eT1cIidST0xFX0FETUlOJ1wiPi4uLjwvc29tZS1lbGVtZW50PlxyXG4gKlxyXG4gKiAgICAgPHNvbWUtZWxlbWVudCAqc2l0bXVuSGFzQW55QXV0aG9yaXR5PVwiWydST0xFX0FETUlOJywgJ1JPTEVfVVNFUiddXCI+Li4uPC9zb21lLWVsZW1lbnQ+XHJcbiAqIGBgYFxyXG4gKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1tzaXRtdW5IYXNBbnlBdXRob3JpdHldJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlIHtcclxuICAgIFxyXG4gICAgLyoqIGF1dGhvcml0aWVzIHRvIGNoZWNrICovXHJcbiAgICBwdWJsaWMgYXV0aG9yaXRpZXM6IHN0cmluZ1tdOyBcclxuICAgIFxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsLCBwcml2YXRlIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+LCBwcml2YXRlIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHRlcnJpdG9yeSB0byBjaGVjayBhdXRob3JpdGllcyovXHJcbiAgICBASW5wdXQoKSB0ZXJyaXRvcnk6IHN0cmluZztcclxuICAgIFxyXG4gICAgLyoqIFNldCB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyAqL1xyXG4gICAgQElucHV0KClcclxuICAgIHNldCBzaXRtdW5IYXNBbnlBdXRob3JpdHkodmFsdWU6IHN0cmluZ3xzdHJpbmdbXSkge1xyXG4gICAgICAgIHRoaXMuYXV0aG9yaXRpZXMgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gWyA8c3RyaW5nPiB2YWx1ZSBdIDogPHN0cmluZ1tdPiB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcclxuICAgICAgICAvLyBHZXQgbm90aWZpZWQgZWFjaCB0aW1lIGF1dGhlbnRpY2F0aW9uIHN0YXRlIGNoYW5nZXMuXHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuZ2V0QXV0aGVudGljYXRpb25TdGF0ZSgpLnN1YnNjcmliZSgoaWRlbnRpdHkpID0+IHRoaXMudXBkYXRlVmlldygpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHVwZGF0ZSB2aWV3ICovXHJcbiAgICBwcml2YXRlIHVwZGF0ZVZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMudGVycml0b3J5KXtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeSh0aGlzLmF1dGhvcml0aWVzLHRoaXMudGVycml0b3J5KS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHkodGhpcy5hdXRob3JpdGllcykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIEB3aGF0SXREb2VzIENvbmRpdGlvbmFsbHkgaW5jbHVkZXMgYW4gSFRNTCBlbGVtZW50IGlmIGN1cnJlbnQgdXNlciBoYXMgYW55XHJcbiAqIG9mIHRoZSBhdXRob3JpdGllcyBwYXNzZWQgYXMgdGhlIGBleHByZXNzaW9uYC5cclxuICpcclxuICogQGhvd1RvVXNlXHJcbiAqIGBgYFxyXG4gKiAgICAgPHNvbWUtZWxlbWVudCAqc2l0bXVuSGFzQW55QXV0aG9yaXR5PVwiJ1JPTEVfQURNSU4nXCI+Li4uPC9zb21lLWVsZW1lbnQ+XHJcbiAqXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCJbJ1JPTEVfQURNSU4nLCAnUk9MRV9VU0VSJ11cIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICogYGBgXHJcbiAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3NpdG11bkhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5XSdcclxufSlcclxuZXhwb3J0IGNsYXNzIEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlIHtcclxuXHJcbiAgICAvKiogYXV0aG9yaXRpZXMgdG8gY2hlY2sgKi9cclxuICAgIHB1YmxpYyBhdXRob3JpdGllczogc3RyaW5nW107IFxyXG5cclxuICAgIC8qKiB0ZXJyaXRvcnkgdG8gY2hlY2sgYXV0aG9yaXRpZXMqL1xyXG4gICAgcHVibGljIHRlcnJpdG9yeTogc3RyaW5nOyBcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWwsIHByaXZhdGUgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4sIHByaXZhdGUgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogU2V0IHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIG9uIHRlcnJpdG9yeSAqL1xyXG4gICAgQElucHV0KClcclxuICAgIHNldCBzaXRtdW5IYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeShvcHRzOiBhbnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hdXRob3JpdGllcyA9IHR5cGVvZiBvcHRzLmF1dGhvcml0aWVzID09PSAnc3RyaW5nJyA/IFsgPHN0cmluZz4gb3B0cy5hdXRob3JpdGllcyBdIDogPHN0cmluZ1tdPiBvcHRzLmF1dGhvcml0aWVzO1xyXG4gICAgICAgIHRoaXMudGVycml0b3J5ID0gb3B0cy50ZXJyaXRvcnk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7XHJcbiAgICAgICAgLy8gR2V0IG5vdGlmaWVkIGVhY2ggdGltZSBhdXRoZW50aWNhdGlvbiBzdGF0ZSBjaGFuZ2VzLlxyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmdldEF1dGhlbnRpY2F0aW9uU3RhdGUoKS5zdWJzY3JpYmUoKGlkZW50aXR5KSA9PiB0aGlzLnVwZGF0ZVZpZXcoKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiB1cGRhdGUgdmlldyAqL1xyXG4gICAgcHJpdmF0ZSB1cGRhdGVWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnRlcnJpdG9yeSl7XHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuaGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnkodGhpcy5hdXRob3JpdGllcyx0aGlzLnRlcnJpdG9yeSkudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuaGFzQW55QXV0aG9yaXR5KHRoaXMuYXV0aG9yaXRpZXMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50TW9kdWxlLCBIVFRQX0lOVEVSQ0VQVE9SUywgSHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG4vL2ltcG9ydCB7IEFuZ3VsYXJIYWxNb2R1bGUgfSBmcm9tICcuLi8uLi9saWIvYW5ndWxhci1oYWwnO1xyXG5pbXBvcnQge0NvZGVMaXN0U2VydmljZX0gZnJvbSAnLi9jb2RlbGlzdC9jb2RlbGlzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUZXJyaXRvcnlTZXJ2aWNlfSBmcm9tICcuL3RlcnJpdG9yeS90ZXJyaXRvcnkuc2VydmljZSc7XHJcbmltcG9ydCB7VGVycml0b3J5VHlwZVNlcnZpY2V9IGZyb20gJy4vdGVycml0b3J5L3RlcnJpdG9yeS10eXBlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RlcnJpdG9yeUdyb3VwVHlwZVNlcnZpY2V9IGZyb20gJy4vdGVycml0b3J5L3RlcnJpdG9yeS1ncm91cC10eXBlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJQb3NpdGlvblNlcnZpY2V9IGZyb20gJy4vdXNlci91c2VyLXBvc2l0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJDb25maWd1cmF0aW9uU2VydmljZX0gZnJvbSAnLi91c2VyL3VzZXItY29uZmlndXJhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtSb2xlU2VydmljZX0gZnJvbSAnLi9yb2xlL3JvbGUuc2VydmljZSc7XHJcbmltcG9ydCB7VXNlclNlcnZpY2V9IGZyb20gJy4vdXNlci91c2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0Nvbm5lY3Rpb25TZXJ2aWNlfSBmcm9tICcuL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2suc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1R5cGVTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay10eXBlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tHcm91cFNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLWdyb3VwLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tQYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza0F2YWlsYWJpbGl0eVNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLWF2YWlsYWJpbGl0eS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrVUlTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay11aS5zZXJ2aWNlJztcclxuaW1wb3J0IHtTZXJ2aWNlU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlL3NlcnZpY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7U2VydmljZVBhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vc2VydmljZS9zZXJ2aWNlLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeVNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHkuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlBdmFpbGFiaWxpdHlTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUZpbHRlclNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZmlsdGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5UGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7QmFja2dyb3VuZFNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvYmFja2dyb3VuZC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmVlU2VydmljZX0gZnJvbSAnLi90cmVlL3RyZWUuc2VydmljZSc7XHJcbmltcG9ydCB7VHJlZU5vZGVTZXJ2aWNlfSBmcm9tICcuL3RyZWUvdHJlZS1ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uU2VydmljZX0gZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvblBhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vYXBwbGljYXRpb24vYXBwbGljYXRpb24tcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uQmFja2dyb3VuZFNlcnZpY2V9IGZyb20gJy4vYXBwbGljYXRpb24vYXBwbGljYXRpb24tYmFja2dyb3VuZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTWFwQ29uZmlndXJhdGlvbk1hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9tYXAvbWFwLWNvbmZpZ3VyYXRpb24tbWFuYWdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGgvYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9hdXRoL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aEludGVyY2VwdG9yIH0gZnJvbSAnLi9hdXRoL2F1dGguaW50ZXJjZXB0b3InO1xyXG5pbXBvcnQgeyBBdXRoRXhwaXJlZEludGVyY2VwdG9yIH0gZnJvbSAnLi9hdXRoL2F1dGgtZXhwaXJlZC5pbnRlcmNlcHRvcic7XHJcbmltcG9ydCB7IEhhc0FueUF1dGhvcml0eURpcmVjdGl2ZSB9IGZyb20gJy4vYXV0aC9oYXMtYW55LWF1dGhvcml0eS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSB9IGZyb20gJy4vYXV0aC9oYXMtYW55LWF1dGhvcml0eS1vbi10ZXJyaXRvcnkuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi9hdXRoL2xvZ2luLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBY2NvdW50U2VydmljZSB9IGZyb20gJy4vYWNjb3VudC9hY2NvdW50LnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUh0dHBMb2FkZXJ9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2h0dHAtbG9hZGVyJztcclxuaW1wb3J0IHtUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZU1vZHVsZX0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcbmltcG9ydCB7IFRyYW5zbGF0aW9uU2VydmljZSB9IGZyb20gJy4vdHJhbnNsYXRpb24vdHJhbnNsYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7IExhbmd1YWdlU2VydmljZSB9IGZyb20gJy4vdHJhbnNsYXRpb24vbGFuZ3VhZ2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IERhc2hib2FyZFNlcnZpY2UgfSBmcm9tICcuL2Rhc2hib2FyZC9kYXNoYm9hcmQuc2VydmljZSc7XHJcbmltcG9ydCB7IENhcGFiaWxpdGllc1NlcnZpY2UgfSBmcm9tICcuL2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25QYXJhbWV0ZXJzU2VydmljZSB9IGZyb20gJy4vY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uLXBhcmFtZXRlcnMuc2VydmljZSc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5U3R5bGVTZXJ2aWNlIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1zdHlsZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHlTcGF0aWFsU2VsZWN0aW9uUGFyYW1ldGVyU2VydmljZSB9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktc3BhdGlhbC1zZWxlY3Rpb24tcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG4vKiogbG9hZCBpMThuIGFzc2V0cyovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2xhdGVMb2FkZXIoaHR0cDogSHR0cENsaWVudCkge1xyXG4gIHJldHVybiBuZXcgVHJhbnNsYXRlSHR0cExvYWRlcihodHRwLCAnLi9hc3NldHMvaTE4bi8nLCAnLmpzb24nKTtcclxufVxyXG5cclxuXHJcbi8qKiBTSVRNVU4gZnJvbnRlbmQgY29yZSBtb2R1bGUgKi9cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICAvKlJvdXRlck1vZHVsZSxcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBBbmd1bGFySGFsTW9kdWxlLCovXHJcbiAgICBUcmFuc2xhdGVNb2R1bGUuZm9yUm9vdCh7XHJcbiAgICAgIGxvYWRlcjoge1xyXG4gICAgICAgIHByb3ZpZGU6IFRyYW5zbGF0ZUxvYWRlcixcclxuICAgICAgICB1c2VGYWN0b3J5OiAoY3JlYXRlVHJhbnNsYXRlTG9hZGVyKSxcclxuICAgICAgICBkZXBzOiBbSHR0cENsaWVudF1cclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIEhhc0FueUF1dGhvcml0eURpcmVjdGl2ZSxcclxuICAgIEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlLFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlLFxyXG4gICAgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUsXHJcbiAgICBUcmFuc2xhdGVNb2R1bGVcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTaXRtdW5Gcm9udGVuZENvcmVNb2R1bGUge1xyXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IFNpdG11bkZyb250ZW5kQ29yZU1vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgQ29kZUxpc3RTZXJ2aWNlLFxyXG4gICAgICAgIFRlcnJpdG9yeVNlcnZpY2UsXHJcbiAgICAgICAgVGVycml0b3J5VHlwZVNlcnZpY2UsXHJcbiAgICAgICAgVGVycml0b3J5R3JvdXBUeXBlU2VydmljZSxcclxuICAgICAgICBSb2xlU2VydmljZSxcclxuICAgICAgICBBY2NvdW50U2VydmljZSxcclxuICAgICAgICBBdXRoU2VydmljZSxcclxuICAgICAgICBVc2VyU2VydmljZSxcclxuICAgICAgICBDb25uZWN0aW9uU2VydmljZSxcclxuICAgICAgICBUYXNrU2VydmljZSxcclxuICAgICAgICBUYXNrVHlwZVNlcnZpY2UsXHJcbiAgICAgICAgVGFza1VJU2VydmljZSxcclxuICAgICAgICBUYXNrR3JvdXBTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tQYXJhbWV0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tBdmFpbGFiaWxpdHlTZXJ2aWNlLFxyXG4gICAgICAgIFNlcnZpY2VTZXJ2aWNlLFxyXG4gICAgICAgIENvbmZpZ3VyYXRpb25QYXJhbWV0ZXJzU2VydmljZSxcclxuICAgICAgICBDYXBhYmlsaXRpZXNTZXJ2aWNlLFxyXG4gICAgICAgIFNlcnZpY2VQYXJhbWV0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5U2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeUdyb3VwU2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlQYXJhbWV0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5U3BhdGlhbFNlbGVjdGlvblBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlTdHlsZVNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlGaWx0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIEJhY2tncm91bmRTZXJ2aWNlLFxyXG4gICAgICAgIFRyZWVTZXJ2aWNlLFxyXG4gICAgICAgIFRyZWVOb2RlU2VydmljZSxcclxuICAgICAgICBBcHBsaWNhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgQXBwbGljYXRpb25QYXJhbWV0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIEFwcGxpY2F0aW9uQmFja2dyb3VuZFNlcnZpY2UsXHJcbiAgICAgICAgQXV0aEludGVyY2VwdG9yLFxyXG4gICAgICAgIEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgUHJpbmNpcGFsLFxyXG4gICAgICAgIFVzZXJQb3NpdGlvblNlcnZpY2UsXHJcbiAgICAgICAgVXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIExvZ2luU2VydmljZSxcclxuICAgICAgICBUcmFuc2xhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgTGFuZ3VhZ2VTZXJ2aWNlLFxyXG4gICAgICAgIERhc2hib2FyZFNlcnZpY2UsXHJcbiAgICAgICAgTWFwQ29uZmlndXJhdGlvbk1hbmFnZXJTZXJ2aWNlLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxyXG4gICAgICAgICAgdXNlQ2xhc3M6IEF1dGhJbnRlcmNlcHRvcixcclxuICAgICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgICwge1xyXG4gICAgICAgICAgcHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXHJcbiAgICAgICAgICB1c2VDbGFzczogQXV0aEV4cGlyZWRJbnRlcmNlcHRvcixcclxuICAgICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cENsaWVudE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0hhbFBhcmFtLCBSZXN0U2VydmljZX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge0V4dGVybmFsU2VydmljZX0gZnJvbSAnLi9leHRlcm5hbC5zZXJ2aWNlJztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5cclxuaW1wb3J0ICdyeGpzJztcclxuXHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuXHJcbmV4cG9ydCB7RXh0ZXJuYWxTZXJ2aWNlfSBmcm9tICcuL2V4dGVybmFsLnNlcnZpY2UnO1xyXG5leHBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmV4cG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5leHBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5leHBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuZXhwb3J0IHtTb3J0fSBmcm9tICcuL3NvcnQnO1xyXG5leHBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmV4cG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9ufSBmcm9tICcuL0V4dGVybmFsQ29uZmlndXJhdGlvbic7XHJcbmV4cG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5leHBvcnQge0hhbE9wdGlvbnMsIEhhbFBhcmFtfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmV4cG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuXHJcblxyXG4vKiogQW5ndWxhciBIQUwgbW9kdWxlICovXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbSHR0cENsaWVudE1vZHVsZV0sXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxyXG4gICAgZXhwb3J0czogW0h0dHBDbGllbnRNb2R1bGVdLFxyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgRXh0ZXJuYWxTZXJ2aWNlLFxyXG4gICAgICAgIEh0dHBDbGllbnQsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcm92aWRlOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIHVzZUNsYXNzOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIGRlcHM6IFtFeHRlcm5hbFNlcnZpY2VdXHJcbiAgICAgICAgfV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJIYWxNb2R1bGUge1xyXG4gICAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmdNb2R1bGU6IEFuZ3VsYXJIYWxNb2R1bGUsXHJcbiAgICAgICAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgICAgICAgICAgRXh0ZXJuYWxTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgSHR0cENsaWVudCxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlQ2xhc3M6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICBkZXBzOiBbRXh0ZXJuYWxTZXJ2aWNlXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSJdLCJuYW1lcyI6WyJvYnNlcnZhYmxlVGhyb3dFcnJvciIsInVybC5wYXJzZSIsIm9ic2VydmFibGVPZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7O0FBV0E7Ozs7OzZCQXVCMkIsQ0FBQzs7OzswQkFFSixDQUFDOzs7OzBCQUdELENBQUM7Ozs7c0JBTUEsRUFBRTs7OztvQkFHaEIsQ0FBQyxFQUFLO1lBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDeEI7Ozs7c0JBR1E7WUFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQzdCOzs7O29CQUdjLENBQUMsSUFBa0IsRUFBRSxRQUFhLEVBQUUsUUFBZ0I7O1lBQy9ELE1BQU0sTUFBTSxHQUFxQixjQUFjLENBQUMsaUJBQWlCLENBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JGLE1BQU0sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQzNCLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3JFLE9BQU8sTUFBTSxDQUFDO1NBQ2pCOzs7O29CQUdNLENBQUMsSUFBa0I7WUFDdEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNmLE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQy9HLEdBQUcsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUN6RCxVQUFVLENBQUMsS0FBSyxJQUFJQSxVQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUUs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