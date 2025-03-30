import {throwError as observableThrowError, of as observableOf, Observable, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpParams, HttpHeaders} from '@angular/common/http';
import {ResourceHelper} from '@app/core';
import {ResourceArray} from '@app/core';
import {isNullOrUndefined} from 'util';
import {HalOptions} from '@app/core';
import {SubTypeBuilder} from '@app/core';
import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import UriTemplate from 'uri-templates';
import utpl from "uri-templates";

/** Abstract resource class*/
@Injectable()
export abstract class Resource {

  /** proxy URL */
  public proxyUrl: string;
  /** root URL */
  public rootUrl: string;

  /** links */
  public _links: any;
  /** subtypes */
  public _subtypes: Map<string, any>;


  /** get subtypes */
  public get subtypes(): Map<string, any> {
    return this._subtypes;
  }

  /** set subtypes */
  public set subtypes(_subtypes: Map<string, any>) {
    this._subtypes = _subtypes;
  }

  /** constructor*/
  constructor() {
  }

  public getRelationArrayEx<T extends Resource>(type: { new(): T }, relation: string, options: {
    [p: string]: string
  } = {}): Observable<T[]> {
    const result: ResourceArray<T> = ResourceHelper.createEmptyResult<T>("_embedded");
    if (this._links?.[relation]?.href) {
      const template = utpl(this._links[relation].href);
      const url = template.fillFromObject(options);

      // Extract variables used in the template
      const templateVariables = template.varNames;

      // Filter out template variables from options to get remaining options
      const remainingOptions = Object.keys(options).reduce((acc, key) => {
        if (!templateVariables.includes(key)) {
          acc[key] = options[key];
        }
        return acc;
      }, {});

      console.log("Getting relation array", {url: url, options: remainingOptions});
      const observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(url), {
        headers: ResourceHelper.headers,
        params: remainingOptions
      });
      return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection<T>(type, response, result)),
        map((array: ResourceArray<T>) => array.result),);
    } else {
      console.error('No relation found for', {
        resource: this,
        relation: relation
      });
      return observableOf([]);
    }
  }

  /** Get collection of related resources */
  public getRelationArray<T extends Resource>(type: {
    new(): T
  }, relation: string, _embedded?: string, options?: HalOptions, builder?: SubTypeBuilder): Observable<T[]> {

    const params = ResourceHelper.optionParams(new HttpParams(), options);
    const result: ResourceArray<T> = ResourceHelper.createEmptyResult<T>(isNullOrUndefined(_embedded) ? "_embedded" : _embedded);
    if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
      let observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), {
        headers: ResourceHelper.headers,
        params: params
      });
      return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection<T>(type, response, result, builder)),
        map((array: ResourceArray<T>) => array.result),);
    } else {
      return observableOf([]);
    }
  }

  /** Get related resource */
  public getRelation<T extends Resource>(type: {
    new(): T
  }, relation: string, builder?: SubTypeBuilder): Observable<T> {
    let result: T = new type();
    if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
      let observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), {headers: ResourceHelper.headers});
      return observable.pipe(map((data: any) => {
        if (builder) {
          for (const embeddedClassName of Object.keys(data['_links'])) {
            if (embeddedClassName == 'self') {
              let href: string = data._links[embeddedClassName].href;
              let idx: number = href.lastIndexOf('/');
              let realClassName = href.replace(ResourceHelper.getRootUri(), "").substring(0, idx);
              result = ResourceHelper.searchSubtypes(builder, realClassName, result);
              break;
            }
          }
        }
        return ResourceHelper.instantiateResource(result, data);
      }));
    } else {
      return observableOf(null);
    }
  }

  /** Adds the given resource to the bound collection by the relation */
  public addRelation<T extends Resource>(relation: string, resource: T): Observable<any> {
    if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
      let header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
      return ResourceHelper.getHttp().post(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, {headers: header});
    } else {
      return observableThrowError('no relation found');
    }
  }

  /** Bind the given resource to this resource by the given relation*/

  public updateRelationship<T extends Resource>(relation: string, resource?: T, options: {
    [p: string]: string
  } = {}): Observable<any> {
    if (this._links?.[relation]?.href) {
      const template = utpl(this._links[relation].href);
      const url = template.fillFromObject(options);

      // Extract variables used in the template
      const templateVariables = template.varNames;

      // Filter out template variables from options to get remaining options
      const remainingOptions = Object.keys(options).reduce((acc, key) => {
        if (!templateVariables.includes(key)) {
          acc[key] = options[key];
        }
        return acc;
      }, {});

      if (resource == null) {
        return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(url), {
          headers: ResourceHelper.headers,
          params: remainingOptions
        });
      } else if (resource._links?.self?.href) {
        return ResourceHelper.getHttp().put(ResourceHelper.getProxy(url), resource._links.self.href, {
          headers: new HttpHeaders().set('Content-Type', 'text/uri-list'),
          params: remainingOptions
        });
      } else  {
        console.error('No target found for', {
          resource: this,
          relation: relation
        });
        return observableOf([]);
      }
    } else {
      console.error('No relation found for', {
        resource: this,
        relation: relation
      });
      return observableOf([]);
    }
  }

  public updateRelation<T extends Resource>(relation: string, resource: T): Observable<any> {
    if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
      let header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
      return ResourceHelper.getHttp().patch(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, {headers: header});
    } else {
      return observableThrowError('no relation found');
    }
  }

  /** Bind the given resource to this resource by the given relation*/
  public substituteRelation<T extends Resource>(relation: string, resource: T): Observable<any> {
    if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
      let header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
      let targetUrl = this._links[relation].href;
      if (targetUrl.endsWith('{?projection}')) {
        targetUrl = targetUrl.substring(0, targetUrl.indexOf('{?projection}'))
      }
      const url = ResourceHelper.getProxy(targetUrl);
      console.log("Substituting relation", {url: url, resource: resource});
      const body = resource._links.self.href;
      console.log("Substituting relation", {body: body, headers: header});
      return ResourceHelper.getHttp().put(url, body, {headers: header});
    } else {
      return observableThrowError('no relation found');
    }
  }

  public substituteRelationById(relation: string, type: string, key: any): Observable<any> {
    if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
      let header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
      let targetUrl = this._links[relation].href;
      if (targetUrl.endsWith('{?projection}')) {
        targetUrl = targetUrl.substring(0, targetUrl.indexOf('{?projection}'))
      }
      const url = ResourceHelper.getProxy(targetUrl);
      const body = type + "/" + key;
      console.log("Substituting relation", {url: url, body: body});
      return ResourceHelper.getHttp().put(url, body, {headers: header});
    } else {
      return observableThrowError('no relation found');
    }
  }

  /**
   * Binds the given resources to this resource by the specified relation
   * @param relation - The relation name to bind the resources to
   * @param resources - Array of resources to bind
   * @returns Observable that completes when the binding is successful
   * @throws Error if the relation is not found or if resources are invalid
   */
  public substituteAllRelation<T extends Resource>(relation: string, resources: T[]): Observable<void> {
    if (!this._links?.[relation]) {
      return throwError(() => new Error(`Relation "${relation}" not found in resource links`));
    }

    if (!Array.isArray(resources)) {
      return throwError(() => new Error('Resources must be an array'));
    }

    const resourceUrls = resources.map(resource => {
      if (!resource?._links?.self?.href) {
        throw new Error('Invalid resource: missing self link');
      }
      return resource._links.self.href;
    }).join('\n');

    const headers = new HttpHeaders().set('Content-Type', 'text/uri-list');
    const template = utpl(this._links[relation].href);
    const url = template.fillFromObject({});

    return ResourceHelper.getHttp().put<void>(
      url,
      resourceUrls,
      {headers}
    ).pipe(
      catchError(error => {
        return throwError(() => new Error(`Failed to substitute relation "${relation}": ${error.message}`));
      })
    );
  }

  public substituteAllRelationUsingIds(relation: string, ids: string[]): Observable<any> {
    if (this._links?.[relation]?.href) {
      const header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
      const body = ids.join('\n');
      return ResourceHelper.getHttp().put(ResourceHelper.getProxy(this._links[relation].href), body, {headers: header});
    } else {
      return throwError(() => new Error('no relation found'));
    }
  }

  /** Unbind the resource with the given relation from this resource*/
  public deleteRelation<T extends Resource>(relation: string, resource: T): Observable<any> {
    if (!isNullOrUndefined(this._links) && !isNullOrUndefined(resource._links)) {
      let link: string = resource._links['self'].href;
      let idx: number = link.lastIndexOf('/') + 1;

      if (idx == -1)
        return observableThrowError('no relation found');

      let relationId: string = link.substring(idx);
      let targetUrl = this._links[relation].href;
      if (targetUrl.endsWith('{?projection}')) {
        targetUrl = targetUrl.substring(0, targetUrl.indexOf('{?projection}'))
      }
      return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(targetUrl + '/' + relationId), {headers: ResourceHelper.headers});
    } else {
      return observableThrowError('no relation found');
    }
  }

  /** Unbind the resource with the given relation from this resource*/
  public deleteAllRelation<T extends Resource>(relation: string): Observable<any> {
    return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(this._links[relation].href), {headers: ResourceHelper.headers});

  }

}
