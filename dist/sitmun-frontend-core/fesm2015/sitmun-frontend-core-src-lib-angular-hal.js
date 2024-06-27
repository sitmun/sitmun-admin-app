import { ɵɵinject, ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, Inject, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient, HttpClientModule } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { parse } from 'url';
import { isNullOrUndefined, isPrimitive } from 'util';

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
 * Public API Surface of angular-hal
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AngularHalModule, ExternalService, Resource, ResourceArray, ResourceHelper, ResourceService, RestService };
//# sourceMappingURL=sitmun-frontend-core-src-lib-angular-hal.js.map
