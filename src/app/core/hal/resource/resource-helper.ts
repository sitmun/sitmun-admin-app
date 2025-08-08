import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {HalOptions, Resource, SubTypeBuilder} from '@app/core';
import {ResourceArray} from './resource-array.model';

/** REST API access helper */
export class ResourceHelper {

    /** HttpHeaders */
    public static headers: HttpHeaders = new HttpHeaders();
    /** Proxy URL */
    private static proxy_uri: string = null;
    /** Root URL */
    private static root_uri: string = null;
    /** HttpClient */
    private static http: HttpClient = null;

    /** get request option params */
    static optionParams(params: HttpParams, options?: HalOptions): HttpParams {
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
    static resolveRelations(resource: Resource): object {
        const result: any = {};
        for (const key in resource) {
            if (resource[key] === null) {
                result[key] = null;
            } else  if (Array.isArray(resource[key])) {
              result[key] = resource[key].map((element) => {
                if (element?._links?.self?.href) {
                  return element?._links?.self?.href;
                } else {
                  return element;
                }
              });
            } else if (resource[key]?._links?.self?.href) {
              result[key] = resource[key]?._links?.self?.href;
            } else {
              result[key] = resource[key];
            }
        }
        return result as object;
    }

    /** create an empty resource from embedded data*/
    static createEmptyResult<T extends Resource>(_embedded: string): ResourceArray<T> {
      const resourceArray: ResourceArray<T> = new ResourceArray<T>();
        resourceArray._embedded = _embedded;
        return resourceArray;
    }

    /** get resource class name*/
    static getClassName(obj: any): string {
      const funcNameRegex = /function (.+?)\(/;
      const results = (funcNameRegex).exec(obj.constructor.toString());
        return (results && results.length > 1) ? results[1] : '';
    }


    /** get resource class name from a prototype object*/
    static className(objProto: any): string[] {
      const classNames = [];
        let obj = Object.getPrototypeOf(objProto);
        let className: string;

        while ((className = ResourceHelper.getClassName(obj)) !== 'Object') {
            classNames.push(className);
            obj = Object.getPrototypeOf(obj);
        }

        return classNames;
    }

    /** instantiate a ResourceCollection from response embedded data*/
    static instantiateResourceCollection<T extends Resource>(type: { new(): T }, payload: any,
                                                             result: ResourceArray<T>, builder?: SubTypeBuilder, embeddedName?: string): ResourceArray<T> {
        for (const embeddedClassName of Object.keys(payload[result._embedded])) {
            if(!embeddedName || (embeddedName && embeddedClassName==embeddedName)){
              const embedded: any = payload[result._embedded];
                const items = embedded[embeddedClassName];
              for (const item of items) {
                    let instance: T = new type();
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
    static searchSubtypes<T extends Resource>(builder: SubTypeBuilder, embeddedClassName: string, instance: T) {
        if (builder && builder.subtypes) {
          const keys = builder.subtypes.keys();
            Array.from(keys).forEach((subtypeKey: string) => {
                if (embeddedClassName.toLowerCase().startsWith(subtypeKey.toLowerCase())) {
                  const subtype: { new(): any } = builder.subtypes.get(subtypeKey);
                    instance = new subtype();
                }
            });
        }
        return instance;
    }

    /** instantiate a Resource from response */
    static instantiateResource<T extends Resource>(entity: T, payload: Object): T {
        for (const p in payload) {
            entity[p] = payload[p];
        }
        return entity;
    }

    /** set proxy URL */
    static setProxyUri(proxy_uri: string) {
        ResourceHelper.proxy_uri = proxy_uri;
    }

    /** set Root URI */
    static setRootUri(root_uri: string) {
        ResourceHelper.root_uri = root_uri;
    }

    /** get proxy URL */
    public static getURL(): string {
        return ResourceHelper.proxy_uri && ResourceHelper.proxy_uri != '' ?
            ResourceHelper.addSlash(ResourceHelper.proxy_uri) :
            ResourceHelper.addSlash(ResourceHelper.root_uri);
    }

    /** add slash to URI */
    private static addSlash(uri: string): string {
      return uri
    }

    /** get proxy from URL */
    public static getProxy(url: string): string {
        if (!ResourceHelper.proxy_uri || ResourceHelper.proxy_uri == '')
            return url;
        return ResourceHelper.addSlash(url.replace(ResourceHelper.root_uri, ResourceHelper.proxy_uri));
    }

    /** set HttpClient*/
    public static setHttp(http: HttpClient) {
        ResourceHelper.http = http;
    }

    /** get HttpClient*/
    public static getHttp(): HttpClient {
        return ResourceHelper.http;
    }

    /** get root URI*/
    static getRootUri() {
        return ResourceHelper.root_uri;
    }
}
