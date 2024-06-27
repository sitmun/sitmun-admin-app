import { throwError, of, Subject, BehaviorSubject } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { HttpHeaders, HttpParams, HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { parse } from 'url';
import { isNullOrUndefined, isPrimitive } from 'util';
import { ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, ɵɵinject, Inject, Injector, ɵɵdirectiveInject, TemplateRef, ViewContainerRef, ɵɵdefineDirective, Directive, Input, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { Router } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

/** REST array of resource implementation */
class ResourceArray {
    constructor() {
        /** total number of elements in this array */
        this.totalElements = 0;
        /** total number of pages in the response */
        this.totalPages = 1;
        /** page number in the response */
        this.pageNumber = 1;
        /** array components */
        this.result = [];
        /** push a new resource to the array */
        this.push = (el) => {
            this.result.push(el);
        };
        /** length of the array */
        this.length = () => {
            return this.result.length;
        };
        /** load array data from REST request */
        this.init = (type, response, sortInfo) => {
            const result = ResourceHelper.createEmptyResult(this._embedded);
            result.sortInfo = sortInfo;
            ResourceHelper.instantiateResourceCollection(type, response, result);
            return result;
        };
        /** Load next page */
        this.next = (type) => {
            if (this.next_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.next_uri), { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, this.sortInfo)), catchError(error => throwError(error)));
            }
            return throwError('no next defined');
        };
        /** Load previous page */
        this.prev = (type) => {
            if (this.prev_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.prev_uri), { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, this.sortInfo)), catchError(error => throwError(error)));
            }
            return throwError('no prev defined');
        };
        /** Load first page */
        this.first = (type) => {
            if (this.first_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.first_uri), { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, this.sortInfo)), catchError(error => throwError(error)));
            }
            return throwError('no first defined');
        };
        /** Load last page */
        this.last = (type) => {
            if (this.last_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.last_uri), { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, this.sortInfo)), catchError(error => throwError(error)));
            }
            return throwError('no last defined');
        };
        /** Load page with given pageNumber*/
        this.page = (type, pageNumber) => {
            this.self_uri = this.self_uri.replace('{?page,size,sort}', '');
            this.self_uri = this.self_uri.replace('{&sort}', '');
            let urlParsed = parse(ResourceHelper.getProxy(this.self_uri));
            let query = ResourceArray.replaceOrAdd(urlParsed.query, 'size', this.pageSize.toString());
            query = ResourceArray.replaceOrAdd(query, 'page', pageNumber.toString());
            let uri = urlParsed.query ?
                ResourceHelper.getProxy(this.self_uri).replace(urlParsed.query, query) : ResourceHelper.getProxy(this.self_uri).concat(query);
            uri = this.addSortInfo(uri);
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, this.sortInfo)), catchError(error => throwError(error)));
        };
        /** Sort collection based on given sort attribute */
        this.sortElements = (type, ...sort) => {
            this.self_uri = this.self_uri.replace('{?page,size,sort}', '');
            this.self_uri = this.self_uri.replace('{&sort}', '');
            let uri = ResourceHelper.getProxy(this.self_uri).concat('?', 'size=', this.pageSize.toString(), '&page=', this.pageNumber.toString());
            uri = this.addSortInfo(uri);
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, sort)), catchError(error => throwError(error)));
        };
        /** Load page with given size */
        this.size = (type, size) => {
            let uri = ResourceHelper.getProxy(this.self_uri).concat('?', 'size=', size.toString());
            uri = this.addSortInfo(uri);
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(map(response => this.init(type, response, this.sortInfo)), catchError(error => throwError(error)));
        };
    }
    /** Add sort info to given URI */
    addSortInfo(uri) {
        if (this.sortInfo) {
            for (const item of this.sortInfo) {
                uri = uri.concat('&sort=', item.path, ',', item.order);
            }
        }
        return uri;
    }
    /** Add replace or add param value to query string */
    static replaceOrAdd(query, field, value) {
        if (query) {
            let idx = query.indexOf(field);
            let idxNextAmp = query.indexOf('&', idx) == -1 ? query.indexOf('/', idx) : query.indexOf('&', idx);
            if (idx != -1) {
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

/** REST API access helper */
class ResourceHelper {
    /** get request headers */
    /*public static get headers(): HttpHeaders {
        if (isNullOrUndefined(this._headers))
          ResourceHelper._headers = new HttpHeaders();
        return ResourceHelper._headers;
    }*/
    /** set request headers */
    /*public static set headers(headers: HttpHeaders) {
      ResourceHelper._headers = headers;
    }*/
    /** get request option params */
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
                    let sortString = '';
                    sortString = s.path ? sortString.concat(s.path) : sortString;
                    sortString = s.order ? sortString.concat(',').concat(s.order) : sortString;
                    params = params.append('sort', sortString);
                }
            }
        }
        return params;
    }
    /** resolve resource relations */
    static resolveRelations(resource) {
        const result = {};
        for (const key in resource) {
            if (!isNullOrUndefined(resource[key])) {
                if (ResourceHelper.className(resource[key])
                    .find((className) => className == 'Resource')) {
                    if (resource[key]['_links'])
                        result[key] = resource[key]['_links']['self']['href'];
                }
                else if (Array.isArray(resource[key])) {
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
        return result;
    }
    /** create an empty resource from embedded data*/
    static createEmptyResult(_embedded) {
        let resourceArray = new ResourceArray();
        resourceArray._embedded = _embedded;
        return resourceArray;
    }
    /** get resource class name*/
    static getClassName(obj) {
        var funcNameRegex = /function (.+?)\(/;
        var results = (funcNameRegex).exec(obj.constructor.toString());
        return (results && results.length > 1) ? results[1] : '';
    }
    /** get resource class name from a prototype object*/
    static className(objProto) {
        let classNames = [];
        let obj = Object.getPrototypeOf(objProto);
        let className;
        while ((className = ResourceHelper.getClassName(obj)) !== 'Object') {
            classNames.push(className);
            obj = Object.getPrototypeOf(obj);
        }
        return classNames;
    }
    /** instantiate a ResourceCollection from response embedded data*/
    static instantiateResourceCollection(type, payload, result, builder, embeddedName) {
        for (const embeddedClassName of Object.keys(payload[result._embedded])) {
            if (!embeddedName || (embeddedName && embeddedClassName == embeddedName)) {
                let embedded = payload[result._embedded];
                const items = embedded[embeddedClassName];
                for (let item of items) {
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
    /** search subtypes*/
    static searchSubtypes(builder, embeddedClassName, instance) {
        if (builder && builder.subtypes) {
            let keys = builder.subtypes.keys();
            Array.from(keys).forEach((subtypeKey) => {
                if (embeddedClassName.toLowerCase().startsWith(subtypeKey.toLowerCase())) {
                    let subtype = builder.subtypes.get(subtypeKey);
                    instance = new subtype();
                }
            });
        }
        return instance;
    }
    /** instantiate a Resource from response */
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
    /** set proxy URL */
    static setProxyUri(proxy_uri) {
        ResourceHelper.proxy_uri = proxy_uri;
    }
    /** set Root URI */
    static setRootUri(root_uri) {
        ResourceHelper.root_uri = root_uri;
    }
    /** get proxy URL */
    static getURL() {
        return ResourceHelper.proxy_uri && ResourceHelper.proxy_uri != '' ?
            ResourceHelper.addSlash(ResourceHelper.proxy_uri) :
            ResourceHelper.addSlash(ResourceHelper.root_uri);
    }
    /** add slash to URI */
    static addSlash(uri) {
        let uriParsed = parse(uri);
        if (isNullOrUndefined(uriParsed.search) && uri && uri[uri.length - 1] != '/')
            return uri + '/';
        return uri;
    }
    /** get proxy from URL */
    static getProxy(url) {
        if (!ResourceHelper.proxy_uri || ResourceHelper.proxy_uri == '')
            return url;
        return ResourceHelper.addSlash(url.replace(ResourceHelper.root_uri, ResourceHelper.proxy_uri));
    }
    /** set HttpClient*/
    static setHttp(http) {
        ResourceHelper.http = http;
    }
    /** get HttpClient*/
    static getHttp() {
        return ResourceHelper.http;
    }
    /** get root URI*/
    static getRootUri() {
        return ResourceHelper.root_uri;
    }
}
/** HttpHeaders */
ResourceHelper.headers = new HttpHeaders();
/** Proxy URL */
ResourceHelper.proxy_uri = null;
/** Root URL */
ResourceHelper.root_uri = null;
/** HttpClient */
ResourceHelper.http = null;

/** Abstract resource class*/
class Resource {
    /** constructor*/
    constructor() {
    }
    /** get subtypes */
    get subtypes() {
        return this._subtypes;
    }
    /** set subtypes */
    set subtypes(_subtypes) {
        this._subtypes = _subtypes;
    }
    /** Get collection of related resources */
    getRelationArray(type, relation, _embedded, options, builder) {
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        const result = ResourceHelper.createEmptyResult(isNullOrUndefined(_embedded) ? "_embedded" : _embedded);
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
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
    /** Get related resource */
    getRelation(type, relation, builder) {
        let result = new type();
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            let observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), { headers: ResourceHelper.headers });
            return observable.pipe(map((data) => {
                if (builder) {
                    for (const embeddedClassName of Object.keys(data['_links'])) {
                        if (embeddedClassName == 'self') {
                            let href = data._links[embeddedClassName].href;
                            let idx = href.lastIndexOf('/');
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
    /** Adds the given resource to the bound collection by the relation */
    addRelation(relation, resource) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            let header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
            return ResourceHelper.getHttp().post(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
        }
        else {
            return throwError('no relation found');
        }
    }
    /** Bind the given resource to this resource by the given relation*/
    updateRelation(relation, resource) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            let header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
            return ResourceHelper.getHttp().patch(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
        }
        else {
            return throwError('no relation found');
        }
    }
    /** Bind the given resource to this resource by the given relation*/
    substituteRelation(relation, resource) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            let header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
            return ResourceHelper.getHttp().put(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
        }
        else {
            return throwError('no relation found');
        }
    }
    /** Bind the given resource to this resource by the given relation*/
    substituteAllRelation(relation, resources) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            let header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
            return ResourceHelper.getHttp().put(ResourceHelper.getProxy(this._links[relation].href), resources.map((resource) => resource._links.self.href), { headers: header });
        }
        else {
            return throwError('no relation found');
        }
    }
    /** Unbind the resource with the given relation from this resource*/
    deleteRelation(relation, resource) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(resource._links)) {
            let link = resource._links['self'].href;
            let idx = link.lastIndexOf('/') + 1;
            if (idx == -1)
                return throwError('no relation found');
            let relationId = link.substring(idx);
            return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(this._links[relation].href + '/' + relationId), { headers: ResourceHelper.headers });
        }
        else {
            return throwError('no relation found');
        }
    }
    /** Unbind the resource with the given relation from this resource*/
    deleteAllRelation(relation) {
        return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(this._links[relation].href), { headers: ResourceHelper.headers });
    }
}
Resource.ɵfac = function Resource_Factory(t) { return new (t || Resource)(); };
Resource.ɵprov = ɵɵdefineInjectable({ token: Resource, factory: Resource.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(Resource, [{
        type: Injectable
    }], function () { return []; }, null); })();

/**
 * User model
 */
class User extends Resource {
}

/** ExternalService */
class ExternalService {
    /** constructor */
    constructor(externalConfigurationService) {
        this.externalConfigurationService = externalConfigurationService;
        ResourceHelper.setProxyUri(externalConfigurationService.getProxyUri());
        ResourceHelper.setRootUri(externalConfigurationService.getRootUri());
        ResourceHelper.setHttp(externalConfigurationService.getHttp());
    }
    /** update ExternalConfigurationHandler */
    updateExternalConfigurationHandlerInterface(externalConfigurationService) {
        this.externalConfigurationService = externalConfigurationService;
        ResourceHelper.setProxyUri(externalConfigurationService.getProxyUri());
        ResourceHelper.setRootUri(externalConfigurationService.getRootUri());
        ResourceHelper.setHttp(externalConfigurationService.getHttp());
    }
    /** get ExternalConfiguration */
    getExternalConfiguration() {
        return this.externalConfigurationService.getExternalConfiguration();
    }
    /** get proxy URL */
    getProxyUri() {
        return this.externalConfigurationService.getProxyUri();
    }
    /** get Root URI */
    getRootUri() {
        return this.externalConfigurationService.getRootUri();
    }
    /** get URL */
    getURL() {
        return ResourceHelper.getURL();
    }
    /** get HttpClient */
    getHttp() {
        return ResourceHelper.getHttp();
    }
}
ExternalService.ɵfac = function ExternalService_Factory(t) { return new (t || ExternalService)(ɵɵinject('ExternalConfigurationService')); };
ExternalService.ɵprov = ɵɵdefineInjectable({ token: ExternalService, factory: ExternalService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ExternalService, [{
        type: Injectable
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: ['ExternalConfigurationService']
            }] }]; }, null); })();

/** ResourceService */
class ResourceService {
    /** constructor */
    constructor(externalService) {
        this.externalService = externalService;
    }
    /** get URL */
    static getURL() {
        return ResourceHelper.getURL();
    }
    /** get all resources from a base URI of a given type */
    getAll(type, resource, _embedded, options, subType, embeddedName, ignoreProjection) {
        let uri = this.getResourceUrl(resource);
        if (!ignoreProjection) {
            uri = uri.concat('?projection=view');
        }
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        const result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        result.sortInfo = options ? options.sort : undefined;
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result, subType, embeddedName)), catchError(error => throwError(error)));
    }
    /** get resource from a base URI and a given id */
    get(type, resource, id) {
        const uri = this.getResourceUrl(resource).concat('/', id, '?projection=view');
        const result = new type();
        this.setUrlsResource(result);
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers });
        return observable.pipe(map(data => ResourceHelper.instantiateResource(result, data)), catchError(error => throwError(error)));
    }
    /** get resource from its selflink */
    getBySelfLink(type, resourceLink) {
        const result = new type();
        this.setUrlsResource(result);
        let observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(resourceLink), { headers: ResourceHelper.headers });
        return observable.pipe(map(data => ResourceHelper.instantiateResource(result, data)), catchError(error => throwError(error)));
    }
    /** search resources from a given base path, query and options */
    search(type, query, resource, _embedded, options) {
        const uri = this.getResourceUrl(resource).concat('/search/', query);
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        const result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result)), catchError(error => throwError(error)));
    }
    /** search a single resource from a given base path, query and options */
    searchSingle(type, query, resource, options) {
        const uri = this.getResourceUrl(resource).concat('/search/', query);
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        const result = new type();
        this.setUrlsResource(result);
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResource(result, response)), catchError(error => throwError(error)));
    }
    /** search resources from a given base path, custom query and options */
    customQuery(type, query, resource, _embedded, options) {
        const uri = this.getResourceUrl(resource + query);
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        const result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result)), catchError(error => throwError(error)));
    }
    /** get resource given a relation link */
    getByRelation(type, resourceLink) {
        let result = new type();
        this.setUrlsResource(result);
        let observable = ResourceHelper.getHttp().get(resourceLink, { headers: ResourceHelper.headers });
        return observable.pipe(map(data => ResourceHelper.instantiateResource(result, data)), catchError(error => throwError(error)));
    }
    /** get resource array given a relation link */
    getByRelationArray(type, resourceLink, _embedded, builder) {
        const result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        let observable = ResourceHelper.getHttp().get(resourceLink, { headers: ResourceHelper.headers });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result, builder)), catchError(error => throwError(error)));
    }
    /** count resources given a path */
    count(resource) {
        const uri = this.getResourceUrl(resource).concat('/search/countAll');
        return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, observe: 'body' }).pipe(map((response) => Number(response.body)), catchError(error => throwError(error)));
    }
    /** create resource from self link and entity data*/
    create(selfResource, entity) {
        const uri = ResourceHelper.getURL() + selfResource;
        const payload = ResourceHelper.resolveRelations(entity);
        this.setUrlsResource(entity);
        let observable = ResourceHelper.getHttp().post(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
        return observable.pipe(map((response) => {
            if (response.status >= 200 && response.status <= 207)
                return ResourceHelper.instantiateResource(entity, response.body);
            else if (response.status == 500) {
                let body = response.body;
                return throwError(body.error);
            }
        }), catchError(error => throwError(error)));
    }
    /** update resource from a given entity data*/
    update(entity) {
        const uri = ResourceHelper.getProxy(entity._links.self.href);
        const payload = ResourceHelper.resolveRelations(entity);
        this.setUrlsResource(entity);
        let observable = ResourceHelper.getHttp().put(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
        return observable.pipe(map((response) => {
            if (response.status >= 200 && response.status <= 207)
                return ResourceHelper.instantiateResource(entity, response.body);
            else if (response.status == 500) {
                let body = response.body;
                return throwError(body.error);
            }
        }), catchError(error => throwError(error)));
    }
    /** update resource from a given entity data*/
    updateCollection(resourceArray, resourceLink) {
        const uri = ResourceHelper.getProxy(resourceLink);
        //const payload = ResourceHelper.resolveRelations(entity);
        //this.setUrlsResource(entity);
        var headersReq = ResourceHelper.headers;
        headersReq.set("Content-Type", "text/uri-list");
        let observable = ResourceHelper.getHttp().put(uri, resourceArray, { headers: headersReq, observe: 'response' });
        return observable.pipe(map((response) => {
            if (response.status >= 200 && response.status <= 207)
                return "";
            else if (response.status == 500) {
                let body = response.body;
                return throwError(body.error);
            }
        }), catchError(error => throwError(error)));
    }
    /** patch resource from a given entity data*/
    patch(entity) {
        const uri = ResourceHelper.getProxy(entity._links.self.href);
        const payload = ResourceHelper.resolveRelations(entity);
        this.setUrlsResource(entity);
        let observable = ResourceHelper.getHttp().patch(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
        return observable.pipe(map((response) => {
            if (response.status >= 200 && response.status <= 207)
                return ResourceHelper.instantiateResource(entity, response.body);
            else if (response.status == 500) {
                let body = response.body;
                return throwError(body.error);
            }
        }), catchError(error => throwError(error)));
    }
    /** delete resource from a given entity data*/
    delete(entity) {
        const uri = ResourceHelper.getProxy(entity._links.self.href);
        return ResourceHelper.getHttp().delete(uri, { headers: ResourceHelper.headers }).pipe(catchError(error => throwError(error)));
    }
    /** whether a resource array has next page of results*/
    hasNext(resourceArray) {
        return resourceArray.next_uri != undefined;
    }
    /** whether a resource array has previous page of results*/
    hasPrev(resourceArray) {
        return resourceArray.prev_uri != undefined;
    }
    /** whether a resource array has first page of results*/
    hasFirst(resourceArray) {
        return resourceArray.first_uri != undefined;
    }
    /** whether a resource array has last page of results*/
    hasLast(resourceArray) {
        return resourceArray.last_uri != undefined;
    }
    /** get resource array next page of results*/
    next(resourceArray, type) {
        return resourceArray.next(type);
    }
    /** get resource array previous page of results*/
    prev(resourceArray, type) {
        return resourceArray.prev(type);
    }
    /** get resource array first page of results*/
    first(resourceArray, type) {
        return resourceArray.first(type);
    }
    /** get resource array last page of results*/
    last(resourceArray, type) {
        return resourceArray.last(type);
    }
    /** get resource array page of results given a page number*/
    page(resourceArray, type, id) {
        return resourceArray.page(type, id);
    }
    /** sort resource array with a given sorting params */
    sortElements(resourceArray, type, ...sort) {
        return resourceArray.sortElements(type, ...sort);
    }
    /** get resource array size*/
    size(resourceArray, type, size) {
        return resourceArray.size(type, size);
    }
    /** get resource URL from a given path*/
    getResourceUrl(resource) {
        let url = ResourceService.getURL();
        if (!url.endsWith('/')) {
            url = url.concat('/');
        }
        if (resource) {
            return url.concat(resource);
        }
        return url;
    }
    /** set proxy and root urls of given resource array */
    setUrls(result) {
        result.proxyUrl = this.externalService.getProxyUri();
        result.rootUrl = this.externalService.getRootUri();
    }
    /** set proxy and root urls of given resource */
    setUrlsResource(result) {
        result.proxyUrl = this.externalService.getProxyUri();
        result.rootUrl = this.externalService.getRootUri();
    }
}
ResourceService.ɵfac = function ResourceService_Factory(t) { return new (t || ResourceService)(ɵɵinject(ExternalService)); };
ResourceService.ɵprov = ɵɵdefineInjectable({ token: ResourceService, factory: ResourceService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ResourceService, [{
        type: Injectable
    }], function () { return [{ type: ExternalService }]; }, null); })();

/** REST API access interface */
class RestService {
    /** constructor */
    constructor(type, resource, injector, _embedded) {
        this.injector = injector;
        /** _embedded field name */
        this._embedded = '_embedded';
        this.type = type;
        this.resource = resource;
        this.resourceService = injector.get(ResourceService);
        if (!isNullOrUndefined(_embedded))
            this._embedded = _embedded;
    }
    /** error handler */
    handleError(error) {
        return RestService.handleError(error);
    }
    /** error handler */
    static handleError(error) {
        return throwError(error);
    }
    /** get all resources with optional options an subType params */
    getAll(options, subType, embeddedName, ignoreProjection) {
        return this.resourceService.getAll(this.type, this.resource, this._embedded, options, subType, embeddedName, ignoreProjection).pipe(mergeMap((resourceArray) => {
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
    /** get resource from a given id */
    get(id) {
        return this.resourceService.get(this.type, this.resource, id);
    }
    /** get resource from self link */
    getBySelfLink(selfLink) {
        return this.resourceService.getBySelfLink(this.type, selfLink);
    }
    /** search resources from a given query string and optional options params */
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
    /** search resource from a given query string and optional options params */
    searchSingle(query, options) {
        return this.resourceService.searchSingle(this.type, query, this.resource, options);
    }
    /** search resources from a given custom query string and optional options params */
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
    /** get resource array given a relation link */
    getByRelationArray(relation, builder) {
        return this.resourceService.getByRelationArray(this.type, relation, this._embedded, builder).pipe(map((resourceArray) => {
            this.resourceArray = resourceArray;
            return resourceArray.result;
        }));
    }
    /** get resource given a relation link */
    getByRelation(relation) {
        return this.resourceService.getByRelation(this.type, relation);
    }
    /** count resources given a path */
    count() {
        return this.resourceService.count(this.resource);
    }
    /** create resource from self link and entity data*/
    create(entity) {
        return this.resourceService.create(this.resource, entity);
    }
    /** update resource from a given entity data*/
    update(entity) {
        return this.resourceService.update(entity);
    }
    /** patch resource from a given entity data*/
    patch(entity) {
        return this.resourceService.patch(entity);
    }
    /** delete resource from a given entity data*/
    delete(entity) {
        return this.resourceService.delete(entity);
    }
    /** get total number of elements of resource array */
    totalElement() {
        if (this.resourceArray && this.resourceArray.totalElements)
            return this.resourceArray.totalElements;
        return 0;
    }
    /** whether a resource array has first page of results*/
    hasFirst() {
        if (this.resourceArray)
            return this.resourceService.hasFirst(this.resourceArray);
        return false;
    }
    /** whether a resource array has next page of results*/
    hasNext() {
        if (this.resourceArray)
            return this.resourceService.hasNext(this.resourceArray);
        return false;
    }
    /** whether a resource array has previous page of results*/
    hasPrev() {
        if (this.resourceArray)
            return this.resourceService.hasPrev(this.resourceArray);
        return false;
    }
    /** whether a resource array has last page of results*/
    hasLast() {
        if (this.resourceArray)
            return this.resourceService.hasLast(this.resourceArray);
        return false;
    }
    /** get resource array next page of results*/
    next() {
        if (this.resourceArray)
            return this.resourceService.next(this.resourceArray, this.type).pipe(map((resourceArray) => {
                this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        else
            throwError('no resourceArray found');
    }
    /** get resource array previous page of results*/
    prev() {
        if (this.resourceArray)
            return this.resourceService.prev(this.resourceArray, this.type).pipe(map((resourceArray) => {
                this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        else
            throwError('no resourceArray found');
    }
    /** get resource array first page of results*/
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
    /** get resource array last page of results*/
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
    /** get resource array page of results given a page number*/
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

/** Account manager service */
class AccountService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(User, "account", injector);
        this.http = http;
        /** API resource path */
        this.ACCOUNT_API = 'account';
    }
    /** get logged in user account*/
    get() {
        let result;
        result = this.http.get(this.resourceService.getResourceUrl(this.ACCOUNT_API));
        return result;
    }
    /** save account*/
    save(item) {
        let result;
        result = this.http.post(this.resourceService.getResourceUrl(this.ACCOUNT_API), item);
        return result;
    }
    /** change logged in user account*/
    changePassword(item) {
        let result;
        result = this.http.post(this.resourceService.getResourceUrl(this.ACCOUNT_API + "/change-password"), item);
        return result;
    }
}
AccountService.ɵfac = function AccountService_Factory(t) { return new (t || AccountService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
AccountService.ɵprov = ɵɵdefineInjectable({ token: AccountService, factory: AccountService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(AccountService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

//import * as moment from 'moment';
/** Authentication service*/
class AuthService {
    /** constructor*/
    constructor(http, resourceService) {
        this.http = http;
        this.resourceService = resourceService;
        /** API resource path */
        this.AUTH_API = 'authenticate';
    }
    /** get current user jwt token from session storage*/
    getToken() {
        return sessionStorage.getItem('authenticationToken');
    }
    /** login operation */
    login(credentials) {
        const data = {
            username: credentials.username,
            password: credentials.password
        };
        return this.http.post(this.resourceService.getResourceUrl(this.AUTH_API), data, { observe: 'response' }).map(authenticateSuccess.bind(this));
        function authenticateSuccess(resp) {
            if (resp.ok) {
                const jwt = resp.body.id_token;
                this.storeAuthenticationToken(jwt);
                //const expiresAt = moment().add( resp.headers.get('Token-Validity'),'milisecond');
                //sessionStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
                return jwt;
            }
        }
    }
    /** login operation with jwt token */
    loginWithToken(jwt) {
        if (jwt) {
            this.storeAuthenticationToken(jwt);
            return Promise.resolve(jwt);
        }
        else {
            return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
        }
    }
    /** store jwt token in session storage*/
    storeAuthenticationToken(jwt) {
        sessionStorage.setItem('authenticationToken', jwt);
    }
    /** check whether current user is logged in*/
    isLoggedIn() {
        //return moment().isBefore(this.getExpiration());
        return this.getToken();
    }
    /** check whether current user is logged out*/
    isLoggedOut() {
        return !this.isLoggedIn();
    }
    /** logout operation */
    logout() {
        return new Observable((observer) => {
            //localStorage.removeItem('authenticationToken');
            sessionStorage.removeItem('authenticationToken');
            //sessionStorage.removeItem('expires_at');
            observer.complete();
        });
    }
}
AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(ɵɵinject(HttpClient), ɵɵinject(ResourceService)); };
AuthService.ɵprov = ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(AuthService, [{
        type: Injectable
    }], function () { return [{ type: HttpClient }, { type: ResourceService }]; }, null); })();

/** Interceptor for authentication token in API requests */
class AuthInterceptor {
    /** constructor*/
    constructor() {
    }
    /** request handler */
    intercept(request, next) {
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

/** Principal service*/
class Principal {
    /** constructor */
    constructor(account) {
        this.account = account;
        this.authenticated = false;
        this.authenticationState = new Subject();
    }
    /** authenticate with given identity*/
    authenticate(identity) {
        this.userIdentity = identity;
        this.authenticated = identity !== null;
        this.authenticationState.next(this.userIdentity);
    }
    /** check whether current user has any of the given authorities */
    hasAnyAuthority(authorities) {
        return Promise.resolve(this.hasAnyAuthorityDirect(authorities));
    }
    /** check whether current user has any of the given authorities on the given territory */
    hasAnyAuthorityOnTerritory(authorities, territory) {
        return Promise.resolve(this.hasAnyAuthorityDirectOnTerritory(authorities, territory));
    }
    /** check whether current user has any of the given authorities without resolving promises*/
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
    /** check whether current user has any of the given authorities on the given territory without resolving promises */
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
    /** check whether current user has the given authority */
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
    /** check whether current user has the given authority on the given territory*/
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
    /** check user identity*/
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
    /** check whether current user is authenticated */
    isAuthenticated() {
        return this.authenticated;
    }
    /** check whether current user identity is resolved */
    isIdentityResolved() {
        return this.userIdentity !== undefined;
    }
    /** get current user authentication state */
    getAuthenticationState() {
        return this.authenticationState.asObservable();
    }
}
Principal.ɵfac = function Principal_Factory(t) { return new (t || Principal)(ɵɵinject(AccountService)); };
Principal.ɵprov = ɵɵdefineInjectable({ token: Principal, factory: Principal.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(Principal, [{
        type: Injectable
    }], function () { return [{ type: AccountService }]; }, null); })();

/** Interceptor for authentication expired response in API requests */
class AuthExpiredInterceptor {
    /** constructor */
    constructor(router, authService, principal) {
        this.router = router;
        this.authService = authService;
        this.principal = principal;
    }
    /** request handler */
    intercept(request, next) {
        return next.handle(request).do((event) => { }, (err) => {
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
AuthExpiredInterceptor.ɵfac = function AuthExpiredInterceptor_Factory(t) { return new (t || AuthExpiredInterceptor)(ɵɵinject(Router), ɵɵinject(AuthService), ɵɵinject(Principal)); };
AuthExpiredInterceptor.ɵprov = ɵɵdefineInjectable({ token: AuthExpiredInterceptor, factory: AuthExpiredInterceptor.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(AuthExpiredInterceptor, [{
        type: Injectable
    }], function () { return [{ type: Router }, { type: AuthService }, { type: Principal }]; }, null); })();

/** Login service*/
class LoginService {
    /** constructor */
    constructor(authServerProvider, principal) {
        this.authServerProvider = authServerProvider;
        this.principal = principal;
    }
    /**Login operation*/
    login(credentials, callback) {
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
    /**login with jwt token */
    loginWithToken(jwt) {
        return this.authServerProvider.loginWithToken(jwt);
    }
    /** logout operation */
    logout() {
        this.authServerProvider.logout().subscribe();
        this.principal.authenticate(null);
    }
}
LoginService.ɵfac = function LoginService_Factory(t) { return new (t || LoginService)(ɵɵinject(AuthService), ɵɵinject(Principal)); };
LoginService.ɵprov = ɵɵdefineInjectable({ token: LoginService, factory: LoginService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(LoginService, [{
        type: Injectable
    }], function () { return [{ type: AuthService }, { type: Principal }]; }, null); })();

class DashboardService {
    /** constructor */
    constructor(http, resourceService) {
        this.http = http;
        this.resourceService = resourceService;
        /** API resource path */
        this.DASHBOARD_API = 'dashboard/info';
        this.DASHBOARD_EMBEDDED = 'dashboard';
    }
    /** get all kpi */
    getAll() {
        return this.http.get(this.resourceService.getResourceUrl(this.DASHBOARD_API)).map(response => response[this.DASHBOARD_EMBEDDED]);
    }
}
DashboardService.ɵfac = function DashboardService_Factory(t) { return new (t || DashboardService)(ɵɵinject(HttpClient), ɵɵinject(ResourceService)); };
DashboardService.ɵprov = ɵɵdefineInjectable({ token: DashboardService, factory: DashboardService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(DashboardService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: HttpClient }, { type: ResourceService }]; }, null); })();

/** User manager service */
class UserService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(User, "users", injector);
        this.http = http;
        /** API resource path */
        this.USER_API = 'users';
    }
    /** remove user*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save user*/
    save(item) {
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.USER_API), item);
        }
        return result;
    }
    /** change password o given user id */
    changePassword(id, item) {
        let result;
        result = this.http.post(this.resourceService.getResourceUrl(this.USER_API + "/" + id + "/change-password"), item);
        return result;
    }
}
UserService.ɵfac = function UserService_Factory(t) { return new (t || UserService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
UserService.ɵprov = ɵɵdefineInjectable({ token: UserService, factory: UserService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(UserService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * User position model
 */
class UserPosition extends Resource {
}

/** User position manager service */
class UserPositionService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(UserPosition, "user-positions", injector);
        this.http = http;
        /** API resource path */
        this.USER_POSITION_API = 'user-positions';
    }
    /** remove user position*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save user position*/
    save(item) {
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
UserPositionService.ɵfac = function UserPositionService_Factory(t) { return new (t || UserPositionService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
UserPositionService.ɵprov = ɵɵdefineInjectable({ token: UserPositionService, factory: UserPositionService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(UserPositionService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * User permission model
 */
class UserConfiguration extends Resource {
}

/** User configuration manager service */
class UserConfigurationService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(UserConfiguration, "user-configurations", injector);
        this.http = http;
        /** API resource path */
        this.USER_CONFIGURATION_API = 'user-configurations';
    }
    /** remove user configuration*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save user configuration*/
    save(item) {
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
UserConfigurationService.ɵfac = function UserConfigurationService_Factory(t) { return new (t || UserConfigurationService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
UserConfigurationService.ɵprov = ɵɵdefineInjectable({ token: UserConfigurationService, factory: UserConfigurationService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(UserConfigurationService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Territory model
 */
class Territory extends Resource {
}

/** Territory manager service */
class TerritoryService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Territory, "territories", injector);
        this.http = http;
        /** API resource path */
        this.TERRITORY_API = 'territories';
    }
    /** remove territory*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save territory*/
    save(item) {
        let result;
        let territoryGroupType = {};
        territoryGroupType._links = {};
        territoryGroupType._links.self = {};
        territoryGroupType._links.self.href = "";
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
TerritoryService.ɵfac = function TerritoryService_Factory(t) { return new (t || TerritoryService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
TerritoryService.ɵprov = ɵɵdefineInjectable({ token: TerritoryService, factory: TerritoryService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(TerritoryService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Territory type model
 */
class TerritoryType extends Resource {
}

/** TerritoryType manager service */
class TerritoryTypeService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(TerritoryType, "territory-types", injector);
        this.http = http;
        /** API resource path */
        this.TERRITORYTYPE_API = 'territory-types';
    }
    /** remove territory type*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save territory type*/
    save(item) {
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
TerritoryTypeService.ɵfac = function TerritoryTypeService_Factory(t) { return new (t || TerritoryTypeService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
TerritoryTypeService.ɵprov = ɵɵdefineInjectable({ token: TerritoryTypeService, factory: TerritoryTypeService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(TerritoryTypeService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Territory type model
 */
class TerritoryGroupType extends Resource {
}

class TerritoryGroupTypeService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(TerritoryGroupType, "territory-group-types", injector);
        this.http = http;
        /** API resource path */
        this.TERRITORYGROUPTYPE_API = 'territory-group-types';
    }
    /** remove territory*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save territory*/
    save(item) {
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
TerritoryGroupTypeService.ɵfac = function TerritoryGroupTypeService_Factory(t) { return new (t || TerritoryGroupTypeService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
TerritoryGroupTypeService.ɵprov = ɵɵdefineInjectable({ token: TerritoryGroupTypeService, factory: TerritoryGroupTypeService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(TerritoryGroupTypeService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Role model
 */
class Role extends Resource {
}

/** Role manager service */
class RoleService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Role, "roles", injector);
        this.http = http;
        /** API resource path */
        this.ROLE_API = 'roles';
    }
    /** remove role*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save role*/
    save(item) {
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
RoleService.ɵfac = function RoleService_Factory(t) { return new (t || RoleService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
RoleService.ɵprov = ɵɵdefineInjectable({ token: RoleService, factory: RoleService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(RoleService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Connection model
 */
class Connection extends Resource {
}

/** Connection manager service */
class ConnectionService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Connection, "connections", injector);
        this.http = http;
        /** API resource path */
        this.CONNECTION_API = 'connections';
    }
    /** remove connection*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save connection*/
    save(item) {
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
        }
        return result;
    }
    testConnection(item) {
        let result;
        result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API) + "/test", item);
        return result;
    }
}
ConnectionService.ɵfac = function ConnectionService_Factory(t) { return new (t || ConnectionService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
ConnectionService.ɵprov = ɵɵdefineInjectable({ token: ConnectionService, factory: ConnectionService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ConnectionService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

//FIXME ensure task creation in admin app upon initialization (as it is done with Roles and default Users)
/** GEOADMIN_task id */
const GEOADMIN_TREE_TASK_ID = "geoadmin";
/** Task model */
class Task extends Resource {
}

/** Task manager service */
class TaskService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Task, "tasks", injector);
        this.http = http;
        /** API resource path */
        this.CONNECTION_API = 'tasks';
    }
    /** remove task*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save task*/
    save(item) {
        let result;
        if (item._links != null) {
            if (!item.service) {
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
            if (!item.ui) {
                // item.deleteRelation('ui', item.ui).subscribe(result => {
                // }, error => console.error(error)); 
            }
            else {
                item.ui._links.self.href = item.ui._links.self.href.split("{")[0];
                item.substituteRelation('ui', item.ui).subscribe(result => {
                }, error => console.error(error));
                item.ui = item.ui._links.self.href;
            }
            if (!item.group) {
                // item.deleteRelation('group', item.group).subscribe(result => {
                // }, error => console.error(error)); 
            }
            else {
                item.group._links.self.href = item.group._links.self.href.split("{")[0];
                item.substituteRelation('group', item.group).subscribe(result => {
                }, error => console.error(error));
                item.group = item.group._links.self.href;
            }
            if (!item.type) {
                // item.deleteRelation('type', item.type).subscribe(result => {
                // }, error => console.error(error)); 
            }
            else {
                item.type._links.self.href = item.type._links.self.href.split("{")[0];
                item.substituteRelation('type', item.type).subscribe(result => {
                }, error => console.error(error));
                item.type = item.type._links.self.href;
            }
            if (item.roles) {
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
TaskService.ɵfac = function TaskService_Factory(t) { return new (t || TaskService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
TaskService.ɵprov = ɵɵdefineInjectable({ token: TaskService, factory: TaskService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(TaskService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Task type model
 */
class TaskType extends Resource {
}

/** TaskType manager service */
class TaskTypeService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(TaskType, "task-types", injector);
        this.http = http;
        /** API resource path */
        this.CONNECTION_API = 'task-types';
    }
    /** remove task type*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save task type*/
    save(item) {
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
TaskTypeService.ɵfac = function TaskTypeService_Factory(t) { return new (t || TaskTypeService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
TaskTypeService.ɵprov = ɵɵdefineInjectable({ token: TaskTypeService, factory: TaskTypeService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(TaskTypeService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Task group model
 */
class TaskGroup extends Resource {
}

/** Task group manager service */
class TaskGroupService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(TaskGroup, "task-groups", injector);
        this.http = http;
        /** API resource path */
        this.CONNECTION_API = 'task-groups';
    }
    /** remove task group*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save task group*/
    save(item) {
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
TaskGroupService.ɵfac = function TaskGroupService_Factory(t) { return new (t || TaskGroupService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
TaskGroupService.ɵprov = ɵɵdefineInjectable({ token: TaskGroupService, factory: TaskGroupService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(TaskGroupService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Task parameter model
 */
class TaskParameter extends Resource {
}

/** Task parameter manager service */
class TaskParameterService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(TaskParameter, "task-parameters", injector);
        this.http = http;
        /** API resource path */
        this.TASK_PARAMETER_API = 'task-parameters';
    }
    /** remove task parameter*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save task parameter*/
    save(item) {
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
TaskParameterService.ɵfac = function TaskParameterService_Factory(t) { return new (t || TaskParameterService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
TaskParameterService.ɵprov = ɵɵdefineInjectable({ token: TaskParameterService, factory: TaskParameterService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(TaskParameterService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Task availability model
 */
class TaskAvailability extends Resource {
}

/** Task availability manager service */
class TaskAvailabilityService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(TaskAvailability, "task-availabilities", injector);
        this.http = http;
        /** API resource path */
        this.TASK_AVAILABILITY_API = 'task-availabilities';
    }
    /** remove task availability*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save task availability*/
    save(item) {
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
TaskAvailabilityService.ɵfac = function TaskAvailabilityService_Factory(t) { return new (t || TaskAvailabilityService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
TaskAvailabilityService.ɵprov = ɵɵdefineInjectable({ token: TaskAvailabilityService, factory: TaskAvailabilityService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(TaskAvailabilityService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Task UI model
 */
class TaskUI extends Resource {
}

/** Task UI manager service */
class TaskUIService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(TaskUI, "task-uis", injector);
        this.http = http;
        /** API resource path */
        this.CONNECTION_API = 'task-uis';
    }
    /** remove task UI*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save task UI*/
    save(item) {
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
TaskUIService.ɵfac = function TaskUIService_Factory(t) { return new (t || TaskUIService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
TaskUIService.ɵprov = ɵɵdefineInjectable({ token: TaskUIService, factory: TaskUIService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(TaskUIService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/** Task model */
class Translation extends Resource {
}

class TranslationService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Translation, "translations", injector);
        this.http = http;
        /** API resource path */
        this.TRANSLATION_API = 'translations';
    }
    /** remove translation*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save translation*/
    save(item) {
        let result;
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
TranslationService.ɵfac = function TranslationService_Factory(t) { return new (t || TranslationService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
TranslationService.ɵprov = ɵɵdefineInjectable({ token: TranslationService, factory: TranslationService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(TranslationService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/** Task model */
class Language extends Resource {
}

class LanguageService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Language, "languages", injector);
        this.http = http;
        /** API resource path */
        this.LANGUAGES_API = 'languages';
    }
    /** remove translation*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save translation*/
    save(item) {
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
LanguageService.ɵfac = function LanguageService_Factory(t) { return new (t || LanguageService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
LanguageService.ɵprov = ɵɵdefineInjectable({ token: LanguageService, factory: LanguageService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(LanguageService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Service model
 */
class Service extends Resource {
}

/** Service manager service */
class ServiceService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Service, "services", injector);
        this.http = http;
        /** API resource path */
        this.SERVICE_API = 'services';
    }
    /** remove service*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save service*/
    save(item) {
        let result;
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
ServiceService.ɵfac = function ServiceService_Factory(t) { return new (t || ServiceService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
ServiceService.ɵprov = ɵɵdefineInjectable({ token: ServiceService, factory: ServiceService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ServiceService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Service model
 */
class ConfigurationParameter extends Resource {
}

class ConfigurationParametersService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(ConfigurationParameter, "configuration-parameters", injector);
        this.http = http;
        /** API resource path */
        this.CONFIGURATION_PARAMETERS_API = 'configuration-parameters';
    }
}
ConfigurationParametersService.ɵfac = function ConfigurationParametersService_Factory(t) { return new (t || ConfigurationParametersService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
ConfigurationParametersService.ɵprov = ɵɵdefineInjectable({ token: ConfigurationParametersService, factory: ConfigurationParametersService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ConfigurationParametersService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Service parameter model
 */
class ServiceParameter extends Resource {
}

/** Service parameter manager service */
class ServiceParameterService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(ServiceParameter, "service-parameters", injector);
        this.http = http;
        /** API resource path */
        this.SERVICE_PARAMETER_API = 'service-parameters';
    }
    /** remove service parameter*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save service parameter*/
    save(item) {
        let result;
        if (item._links != null) {
            if (item.service != null) {
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
ServiceParameterService.ɵfac = function ServiceParameterService_Factory(t) { return new (t || ServiceParameterService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
ServiceParameterService.ɵprov = ɵɵdefineInjectable({ token: ServiceParameterService, factory: ServiceParameterService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ServiceParameterService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Capabilitie model
 */
class Capabilitie extends Resource {
}

class CapabilitiesService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Capabilitie, "helpers/capabilities?url=", injector);
        this.http = http;
        /** API resource path */
        this.CAPABILITIES_API = 'helpers/capabilities?url=';
    }
    /** save service*/
    getInfo(url) {
        let result;
        if (url) {
            const headerDict = {
                'Charset': 'UTF-8'
            };
            const requestOptions = {
                headers: new HttpHeaders(headerDict),
            };
            let finalUrl = this.resourceService.getResourceUrl(this.CAPABILITIES_API);
            finalUrl = finalUrl.concat(url);
            console.log(finalUrl);
            result = this.http.get(finalUrl, requestOptions);
        }
        return result;
    }
}
CapabilitiesService.ɵfac = function CapabilitiesService_Factory(t) { return new (t || CapabilitiesService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
CapabilitiesService.ɵprov = ɵɵdefineInjectable({ token: CapabilitiesService, factory: CapabilitiesService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(CapabilitiesService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Info model
 */
class Info extends Resource {
}

class GetInfoService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Info, "helpers/feature-type?url=", injector);
        this.http = http;
        /** API resource path */
        this.INFO_API = 'helpers/feature-type?url=';
    }
    /** save service*/
    getInfo(url) {
        let result;
        if (url) {
            const headerDict = {
                'Charset': 'UTF-8'
            };
            const requestOptions = {
                headers: new HttpHeaders(headerDict),
            };
            let finalUrl = this.resourceService.getResourceUrl(this.INFO_API);
            finalUrl = finalUrl.concat(url);
            console.log(finalUrl);
            result = this.http.get(finalUrl, requestOptions);
        }
        return result;
    }
}
GetInfoService.ɵfac = function GetInfoService_Factory(t) { return new (t || GetInfoService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
GetInfoService.ɵprov = ɵɵdefineInjectable({ token: GetInfoService, factory: GetInfoService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(GetInfoService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Cartography
 */
class Cartography extends Resource {
}

/** Cartography manager service */
class CartographyService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Cartography, "cartographies", injector);
        this.http = http;
        /** API resource path */
        this.CARTOGRAPHY_API = 'cartographies';
    }
    /** remove cartography*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save cartography*/
    save(item) {
        let result;
        let cartographyConnection = {};
        cartographyConnection._links = {};
        cartographyConnection._links.self = {};
        cartographyConnection._links.self.href = "";
        let cartographyService = {};
        cartographyService._links = {};
        cartographyService._links.self = {};
        cartographyService._links.self.href = "";
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
CartographyService.ɵfac = function CartographyService_Factory(t) { return new (t || CartographyService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
CartographyService.ɵprov = ɵɵdefineInjectable({ token: CartographyService, factory: CartographyService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(CartographyService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Cartography group
 */
class CartographyGroup extends Resource {
}

/** CartographyGroup manager service */
class CartographyGroupService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(CartographyGroup, "cartography-groups", injector);
        this.http = http;
        /** API resource path */
        this.CARTOGRAPHY_GROUP_API = 'cartography-groups';
    }
    /** remove cartography group*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save cartography group*/
    save(item) {
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
CartographyGroupService.ɵfac = function CartographyGroupService_Factory(t) { return new (t || CartographyGroupService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
CartographyGroupService.ɵprov = ɵɵdefineInjectable({ token: CartographyGroupService, factory: CartographyGroupService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(CartographyGroupService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Cartography availability model
 */
class CartographyAvailability extends Resource {
}

/** CartographyAvailability manager service */
class CartographyAvailabilityService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(CartographyAvailability, "cartography-availabilities", injector);
        this.http = http;
        /** API resource path */
        this.CARTOGRAPHY_AVAILABILITY_API = 'cartography-availabilities';
    }
    /** remove cartography availability*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save cartography availability*/
    save(item) {
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
CartographyAvailabilityService.ɵfac = function CartographyAvailabilityService_Factory(t) { return new (t || CartographyAvailabilityService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
CartographyAvailabilityService.ɵprov = ɵɵdefineInjectable({ token: CartographyAvailabilityService, factory: CartographyAvailabilityService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(CartographyAvailabilityService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Cartography availability model
 */
class CartographyFilter extends Resource {
}

/** CartographyFilter manager service */
class CartographyFilterService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(CartographyFilter, "cartography-filters", injector);
        this.http = http;
        /** API resource path */
        this.CARTOGRAPHY_FILTER_API = 'cartography-filters';
    }
    /** remove cartography filter*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save cartography availability*/
    save(item) {
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
CartographyFilterService.ɵfac = function CartographyFilterService_Factory(t) { return new (t || CartographyFilterService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
CartographyFilterService.ɵprov = ɵɵdefineInjectable({ token: CartographyFilterService, factory: CartographyFilterService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(CartographyFilterService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Service parameter model
 */
class CartographyParameter extends Resource {
}

/** Service parameter manager service */
class CartographyParameterService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(CartographyParameter, "cartography-parameters", injector);
        this.http = http;
        /** API resource path */
        this.CARTOGRAPHY_PARAMETER_API = 'cartography-parameters';
    }
    /** remove service parameter*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save service parameter*/
    save(item) {
        let result;
        if (item._links != null) {
            if (item.cartography != null) {
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
CartographyParameterService.ɵfac = function CartographyParameterService_Factory(t) { return new (t || CartographyParameterService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
CartographyParameterService.ɵprov = ɵɵdefineInjectable({ token: CartographyParameterService, factory: CartographyParameterService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(CartographyParameterService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/** Service parameter manager service */
class CartographySpatialSelectionParameterService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(CartographyParameter, "cartography-spatial-selection-parameters", injector);
        this.http = http;
        /** API resource path */
        this.CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API = 'cartography-spatial-selection-parameters';
    }
    /** remove service parameter*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save service parameter*/
    save(item) {
        let result;
        if (item._links != null) {
            if (item.cartography != null) {
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
CartographySpatialSelectionParameterService.ɵfac = function CartographySpatialSelectionParameterService_Factory(t) { return new (t || CartographySpatialSelectionParameterService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
CartographySpatialSelectionParameterService.ɵprov = ɵɵdefineInjectable({ token: CartographySpatialSelectionParameterService, factory: CartographySpatialSelectionParameterService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(CartographySpatialSelectionParameterService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Cartography style model
 */
class CartographyStyle extends Resource {
}

class CartographyStyleService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(CartographyStyle, "cartography-styles", injector);
        this.http = http;
        /** API resource path */
        this.CARTOGRAPHY_STYLES_API = 'cartography-styles';
    }
    /** remove service parameter*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save service parameter*/
    save(item) {
        let result;
        if (item._links != null) {
            if (item.cartography != null) {
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
CartographyStyleService.ɵfac = function CartographyStyleService_Factory(t) { return new (t || CartographyStyleService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
CartographyStyleService.ɵprov = ɵɵdefineInjectable({ token: CartographyStyleService, factory: CartographyStyleService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(CartographyStyleService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Background model
 */
class Background extends Resource {
}

/** Background manager service */
class BackgroundService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Background, "backgrounds", injector);
        this.http = http;
        /** API resource path */
        this.BACKGROUND_API = 'backgrounds';
    }
    /** remove background*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save background*/
    save(item) {
        let result;
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
BackgroundService.ɵfac = function BackgroundService_Factory(t) { return new (t || BackgroundService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
BackgroundService.ɵprov = ɵɵdefineInjectable({ token: BackgroundService, factory: BackgroundService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(BackgroundService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Tree model
 */
class Tree extends Resource {
}

/** Tree manager service */
class TreeService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Tree, "trees", injector);
        this.http = http;
        /** API resource path */
        this.TREE_API = 'trees';
    }
    /** remove tree*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save tree*/
    save(item) {
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
TreeService.ɵfac = function TreeService_Factory(t) { return new (t || TreeService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
TreeService.ɵprov = ɵɵdefineInjectable({ token: TreeService, factory: TreeService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(TreeService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Tree node model
 */
class TreeNode extends Resource {
}

/** Tree node manager service */
class TreeNodeService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(TreeNode, "tree-nodes", injector);
        this.http = http;
        /** API resource path */
        this.TREE_NODE_API = 'tree-nodes';
    }
    /** remove tree node*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save tree node*/
    save(item) {
        let result;
        if (item._links != null) {
            const itemTree = item.tree;
            const itemCartography = item.cartography;
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
TreeNodeService.ɵfac = function TreeNodeService_Factory(t) { return new (t || TreeNodeService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
TreeNodeService.ɵprov = ɵɵdefineInjectable({ token: TreeNodeService, factory: TreeNodeService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(TreeNodeService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

//FIXME ensure application creation in admin app upon initialization (as it is done with Roles and default Users)
/** Territorial appliction name */
const TERRITORIAL_APP_NAME = "Aplicación Territorial";
/**
 * Application model
 */
class Application extends Resource {
}

/** Application manager service */
class ApplicationService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Application, "applications", injector);
        this.http = http;
        /** API resource path */
        this.APPLICATION_API = 'applications';
    }
    /** remove application*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save application*/
    save(item) {
        let result;
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
ApplicationService.ɵfac = function ApplicationService_Factory(t) { return new (t || ApplicationService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
ApplicationService.ɵprov = ɵɵdefineInjectable({ token: ApplicationService, factory: ApplicationService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ApplicationService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Application background model
 */
class ApplicationBackground extends Resource {
}

/** Application background manager service */
class ApplicationBackgroundService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(ApplicationBackground, "application-backgrounds", injector);
        this.http = http;
        /** API resource path */
        this.APPLICATION_BACKGROUND_API = 'application-backgrounds';
    }
    /** remove application background*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save application background*/
    save(item) {
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
ApplicationBackgroundService.ɵfac = function ApplicationBackgroundService_Factory(t) { return new (t || ApplicationBackgroundService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
ApplicationBackgroundService.ɵprov = ɵɵdefineInjectable({ token: ApplicationBackgroundService, factory: ApplicationBackgroundService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ApplicationBackgroundService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Application parameter model
 */
class ApplicationParameter extends Resource {
}

/** Application parameter manager service */
class ApplicationParameterService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(ApplicationParameter, "application-parameters", injector);
        this.http = http;
        /** API resource path */
        this.APPLICATION_PARAMETER_API = 'application-parameters';
    }
    /** remove application*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save application*/
    save(item) {
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
ApplicationParameterService.ɵfac = function ApplicationParameterService_Factory(t) { return new (t || ApplicationParameterService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
ApplicationParameterService.ɵprov = ɵɵdefineInjectable({ token: ApplicationParameterService, factory: ApplicationParameterService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ApplicationParameterService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/**
 * Connection model
 */
class CodeList extends Resource {
}

/** Connection manager service */
class CodeListService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(CodeList, "codelist-values", injector);
        this.http = http;
        /** API resource path */
        this.CODELIST_API = 'codelist-values';
    }
    /** remove connection*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save connection*/
    save(item) {
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
CodeListService.ɵfac = function CodeListService_Factory(t) { return new (t || CodeListService)(ɵɵinject(Injector), ɵɵinject(HttpClient)); };
CodeListService.ɵprov = ɵɵdefineInjectable({ token: CodeListService, factory: CodeListService.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(CodeListService, [{
        type: Injectable
    }], function () { return [{ type: Injector }, { type: HttpClient }]; }, null); })();

/** Layer model: configure Layer data and displaying configuration */
class Layer {
    constructor() {
        // Display data
        /** layer visibility*/
        this.visibility = false;
        /** Transparency (Transparent) 0-1 (Opaque)*/
        this.opacity = 1.0;
        /** Service attributions*/
        this.attributions = "";
        /** Description*/
        this.desc = "";
        /**  Transparent request parameter?*/
        this.url_transparent = "true";
        /** Request Background parameter color (Hexa)*/
        this.url_bgcolor = "0x000000";
        /** Extent for tiled services*/
        this.extent = null;
        /** Enabled for GetFeatureInfo requests (enabled to use the viewer features information tool)*/
        this.queryable = false;
    }
}
/** Optional parameter model: configure parameter-value pair to add to the request layer URL */
class OptionalParameter {
}
/** Layer configuration model: modify the configuration of a layer when interacting with the map (make visible, move the layer ...) */
class LayerConfiguration {
}
/** Layer group model*/
class LayerGroup {
}
/** Map options configuration model*/
class MapOptionsConfiguration {
}
/** Map component status model*/
class MapComponentStatus {
    constructor() {
        /** loaded?*/ this.loaded = false;
    }
}
/** Map configuration manager service*/
class MapConfigurationManagerService {
    /** constructor*/
    constructor() {
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
        /** layer count */
        this.count = 0;
        //
    }
    /** configure the overlay layers of the map, by passing as a parameter an array of objects of type Layer objects defining the layers to load.*/
    loadLayersConfiguration(configuration) {
        if (this.layers != null) {
            this.clearLayers(false);
        }
        this.setLayers(configuration);
    }
    /**configure the base layers of the map by passing as a parameter an array of objects of type LayerGroup each of them with the corresponding Layer objects defining the layers to load.*/
    loadBaseLayersConfiguration(configuration) {
        this.setBaseLayerGroups(configuration);
    }
    /** get base layer groups*/
    getBaseLayerGroups() {
        return this.baseLayerGroupsSubject.asObservable();
    }
    /** set base layer groups*/
    setBaseLayerGroups(groups) {
        this.baseLayerGroups = groups;
        this.refreshBaseLayerGroups();
    }
    refreshBaseLayerGroups() {
        // Send the new values so that all subscribers are updated
        this.baseLayerGroupsSubject.next(this.baseLayerGroups);
    }
    /** get layers*/
    getLayers() {
        return this.layersSubject.asObservable();
    }
    /** remove all layers from map*/
    clearLayers(refresh) {
        while (this.layers.length) {
            this.layers.pop();
        }
        if (refresh) {
            this.refreshLayers();
        }
    }
    /** set layers*/
    setLayers(layers) {
        this.layers = layers;
        this.refreshLayers();
    }
    /** add given layer to map*/
    addLayer(layer) {
        this.layers.push(layer);
        this.refreshAddLayers(layer);
    }
    /** add given layer to map at given index*/
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
    /** remove given layer from map*/
    removeLayer(layer) {
        var index = this.layers.indexOf(layer);
        this.removeLayerIndex(index);
    }
    /** remove layer with given id from map */
    removeLayerId(id) {
        var index = -1;
        for (var i = 0, iLen = this.layers.length; i < iLen; i++) {
            if (this.layers[i].id == id) {
                index = i;
                break;
            }
        }
        this.removeLayerIndex(index);
    }
    /** remove layer at given index from map */
    removeLayerIndex(index) {
        var layer = this.layers[index];
        this.layers.splice(index, 1);
        this.refreshRemoveLayers(layer);
    }
    /** refresh layers */
    refreshLayers() {
        // Send the new values so that all subscribers are updated
        this.layersSubject.next(this.layers);
    }
    /** Observable for layers added */
    getLayersAdded() {
        return this.addLayersSubject.asObservable();
    }
    refreshAddLayers(layer) {
        // Send the new values so that all subscribers are updated
        this.addLayersSubject.next([layer]);
    }
    getLayersRemoved() {
        return this.removeLayersSubject.asObservable();
    }
    refreshRemoveLayers(layer) {
        // Send the new values so that all subscribers are updated
        this.removeLayersSubject.next([layer]);
    }
    getLayerConfigurationListener() {
        return this.layerConfigurationSubject.asObservable();
    }
    getLayerIndexById(id) {
        var index = -1;
        for (var i = 0, iLen = this.layers.length; i < iLen; i++) {
            if (this.layers[i].id == id) {
                index = i;
                break;
            }
        }
        return index;
    }
    /** move layer with given id to the given index*/
    moveLayer(id, index) {
        var layerIndex = this.getLayerIndexById(id);
        if (layerIndex != -1) {
            var layer = this.layers.splice(layerIndex, 1);
            this.layers =
                this.layers.slice(0, index)
                    .concat(layer)
                    .concat(this.layers.slice(index, this.layers.length));
        }
        this.refreshLayerConfiguration(id, null, null, index);
    }
    /** change visibility of layer with given id to the given value*/
    changeLayerVisibility(id, visibility) {
        this.refreshLayerConfiguration(id, null, visibility, null);
    }
    /** change opacity of layer with given id to the given value*/
    changeLayerOpacity(id, opacity) {
        this.refreshLayerConfiguration(id, opacity, null, null);
    }
    refreshLayerConfiguration(id, opacity, visibility, position) {
        // Send the new values so that all subscribers are updated
        var layer = new LayerConfiguration();
        layer.id = id;
        layer.opacity = opacity;
        layer.visibility = visibility;
        layer.position = position;
        this.layerConfigurationSubject.next([layer]);
    }
    getSituationMapConfigurationListener() {
        return this.situationMapConfigurationSubject.asObservable();
    }
    /** configure the situation map of the map component by passing as a parameter an array of objects of type LayerGroup, each of them with the corresponding Layer objects defining the layers to load as situation map.*/
    loadSituationMapConfiguration(layers) {
        // Send the new values so that all subscribers are updated
        this.situationMapConfigurationSubject.next(layers);
    }
    getMapOptionsConfigurationListener() {
        return this.mapOptionsConfigurationSubject.asObservable();
    }
    /** load map options configuration */
    loadMapOptionsConfiguration(configuration) {
        // Send the new values so that all subscribers are updated
        this.mapOptionsConfigurationSubject.next([configuration]);
    }
    getMapComponentStatusListener() {
        return this.mapComponentStatusSubject.asObservable();
    }
    /** set map component status */
    setMapComponentStatus(status) {
        //Notify the map component status
        this.mapComponentStatusSubject.next([status]);
    }
}
MapConfigurationManagerService.ɵfac = function MapConfigurationManagerService_Factory(t) { return new (t || MapConfigurationManagerService)(); };
MapConfigurationManagerService.ɵprov = ɵɵdefineInjectable({ token: MapConfigurationManagerService, factory: MapConfigurationManagerService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(MapConfigurationManagerService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *sitmunHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *sitmunHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
class HasAnyAuthorityDirective {
    /** constructor */
    constructor(principal, templateRef, viewContainerRef) {
        this.principal = principal;
        this.templateRef = templateRef;
        this.viewContainerRef = viewContainerRef;
    }
    /** Set whether current user has any of the given authorities */
    set sitmunHasAnyAuthority(value) {
        this.authorities = typeof value === 'string' ? [value] : value;
        this.updateView();
        // Get notified each time authentication state changes.
        this.principal.getAuthenticationState().subscribe((identity) => this.updateView());
    }
    /** update view */
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
HasAnyAuthorityDirective.ɵfac = function HasAnyAuthorityDirective_Factory(t) { return new (t || HasAnyAuthorityDirective)(ɵɵdirectiveInject(Principal), ɵɵdirectiveInject(TemplateRef), ɵɵdirectiveInject(ViewContainerRef)); };
HasAnyAuthorityDirective.ɵdir = ɵɵdefineDirective({ type: HasAnyAuthorityDirective, selectors: [["", "sitmunHasAnyAuthority", ""]], inputs: { territory: "territory", sitmunHasAnyAuthority: "sitmunHasAnyAuthority" } });
/*@__PURE__*/ (function () { ɵsetClassMetadata(HasAnyAuthorityDirective, [{
        type: Directive,
        args: [{
                selector: '[sitmunHasAnyAuthority]'
            }]
    }], function () { return [{ type: Principal }, { type: TemplateRef }, { type: ViewContainerRef }]; }, { territory: [{
            type: Input
        }], sitmunHasAnyAuthority: [{
            type: Input
        }] }); })();

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *sitmunHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *sitmunHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
class HasAnyAuthorityOnTerritoryDirective {
    /** constructor */
    constructor(principal, templateRef, viewContainerRef) {
        this.principal = principal;
        this.templateRef = templateRef;
        this.viewContainerRef = viewContainerRef;
    }
    /** Set whether current user has any of the given authorities on territory */
    set sitmunHasAnyAuthorityOnTerritory(opts) {
        this.authorities = typeof opts.authorities === 'string' ? [opts.authorities] : opts.authorities;
        this.territory = opts.territory;
        this.updateView();
        // Get notified each time authentication state changes.
        this.principal.getAuthenticationState().subscribe((identity) => this.updateView());
    }
    /** update view */
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
HasAnyAuthorityOnTerritoryDirective.ɵfac = function HasAnyAuthorityOnTerritoryDirective_Factory(t) { return new (t || HasAnyAuthorityOnTerritoryDirective)(ɵɵdirectiveInject(Principal), ɵɵdirectiveInject(TemplateRef), ɵɵdirectiveInject(ViewContainerRef)); };
HasAnyAuthorityOnTerritoryDirective.ɵdir = ɵɵdefineDirective({ type: HasAnyAuthorityOnTerritoryDirective, selectors: [["", "sitmunHasAnyAuthorityOnTerritory", ""]], inputs: { sitmunHasAnyAuthorityOnTerritory: "sitmunHasAnyAuthorityOnTerritory" } });
/*@__PURE__*/ (function () { ɵsetClassMetadata(HasAnyAuthorityOnTerritoryDirective, [{
        type: Directive,
        args: [{
                selector: '[sitmunHasAnyAuthorityOnTerritory]'
            }]
    }], function () { return [{ type: Principal }, { type: TemplateRef }, { type: ViewContainerRef }]; }, { sitmunHasAnyAuthorityOnTerritory: [{
            type: Input
        }] }); })();

/** load i18n assets*/
function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
/** SITMUN frontend core module */
class SitmunFrontendCoreModule {
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
                GetInfoService,
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
SitmunFrontendCoreModule.ɵmod = ɵɵdefineNgModule({ type: SitmunFrontendCoreModule });
SitmunFrontendCoreModule.ɵinj = ɵɵdefineInjector({ factory: function SitmunFrontendCoreModule_Factory(t) { return new (t || SitmunFrontendCoreModule)(); }, imports: [[
            /*RouterModule,
            HttpClientModule,
            CommonModule,
            AngularHalModule,*/
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: (createTranslateLoader),
                    deps: [HttpClient]
                }
            }),
        ], TranslateModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(SitmunFrontendCoreModule, { declarations: [HasAnyAuthorityDirective,
        HasAnyAuthorityOnTerritoryDirective], imports: [TranslateModule], exports: [HasAnyAuthorityDirective,
        HasAnyAuthorityOnTerritoryDirective,
        TranslateModule] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(SitmunFrontendCoreModule, [{
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
                            useFactory: (createTranslateLoader),
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

/** Angular HAL module */
class AngularHalModule {
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
AngularHalModule.ɵmod = ɵɵdefineNgModule({ type: AngularHalModule });
AngularHalModule.ɵinj = ɵɵdefineInjector({ factory: function AngularHalModule_Factory(t) { return new (t || AngularHalModule)(); }, providers: [
        ExternalService,
        HttpClient,
        {
            provide: ResourceService,
            useClass: ResourceService,
            deps: [ExternalService]
        }
    ], imports: [[HttpClientModule], HttpClientModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(AngularHalModule, { imports: [HttpClientModule], exports: [HttpClientModule] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(AngularHalModule, [{
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

/*
 * Public API Surface of sitmun-plugin-core
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AccountService, AngularHalModule, Application, ApplicationBackground, ApplicationBackgroundService, ApplicationParameter, ApplicationParameterService, ApplicationService, AuthExpiredInterceptor, AuthInterceptor, AuthService, Background, BackgroundService, Capabilitie, CapabilitiesService, Cartography, CartographyAvailability, CartographyAvailabilityService, CartographyFilter, CartographyFilterService, CartographyGroup, CartographyGroupService, CartographyParameter, CartographyParameterService, CartographyService, CartographySpatialSelectionParameterService, CartographyStyle, CartographyStyleService, CodeList, CodeListService, ConfigurationParameter, ConfigurationParametersService, Connection, ConnectionService, DashboardService, ExternalService, GEOADMIN_TREE_TASK_ID, GetInfoService, HasAnyAuthorityDirective, HasAnyAuthorityOnTerritoryDirective, Info, Language, LanguageService, Layer, LayerConfiguration, LayerGroup, LoginService, MapComponentStatus, MapConfigurationManagerService, MapOptionsConfiguration, OptionalParameter, Principal, Resource, ResourceArray, ResourceHelper, ResourceService, RestService, Role, RoleService, Service, ServiceParameter, ServiceParameterService, ServiceService, SitmunFrontendCoreModule, TERRITORIAL_APP_NAME, Task, TaskAvailability, TaskAvailabilityService, TaskGroup, TaskGroupService, TaskParameter, TaskParameterService, TaskService, TaskType, TaskTypeService, TaskUI, TaskUIService, Territory, TerritoryGroupType, TerritoryGroupTypeService, TerritoryService, TerritoryType, TerritoryTypeService, Translation, TranslationService, Tree, TreeNode, TreeNodeService, TreeService, User, UserConfiguration, UserConfigurationService, UserPosition, UserPositionService, UserService, createTranslateLoader };
//# sourceMappingURL=sitmun-frontend-core.js.map
