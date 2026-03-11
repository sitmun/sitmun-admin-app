import { HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';

import {EMPTY, Observable, of as observableOf, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import utpl from 'uri-templates';

import {LoggerService} from '@app/services/logger.service';

import type {ResourceArray} from './resource-array.model';
import {ResourceHelper} from './resource-helper';
import type {SubTypeBuilder} from '../common/subtype-builder';
import type {HalOptions} from '../rest/rest.service';


/** Abstract resource class*/
@Injectable()
export abstract class Resource {

  public id: number;

  /** proxy URL */
  public proxyUrl: string;
  /** root URL */
  public rootUrl: string;

  /** links */
  public _links: any;
  /** subtypes */
  public _subtypes: Map<string, any>;

  /** Static logger service for error logging */
  private static loggerService: LoggerService;

  /** Sets the logger service for this resource class */
  static setLoggerService(loggerService: LoggerService) {
    Resource.loggerService = loggerService;
  }

  /** get subtypes */
  public get subtypes(): Map<string, any> {
    return this._subtypes;
  }

  /** set subtypes */
  public set subtypes(_subtypes: Map<string, any>) {
    this._subtypes = _subtypes;
  }

  /** constructor*/
  // Empty constructor required by TypeScript

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

      const observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(url), {
        headers: ResourceHelper.headers,
        params: remainingOptions
      });
      return observable.pipe(map(response => {
          const collection = ResourceHelper.instantiateResourceCollection<T>(type, response, result);
          return collection;
        }),
        map((array: ResourceArray<T>) => array.result),);
    } else {
      if (Resource.loggerService) {
        Resource.loggerService.error('No relation found for', new Error(`Relation ${relation} not found`), {
          resource: this,
          relation: relation
        });
      } else {
        console.error('No relation found for', {
          resource: this,
          relation: relation
        });
      }
      return observableOf([]);
    }
  }

  /** Get collection of related resources */
  public getRelationArray<T extends Resource>(type: {
    new(): T
  }, relation: string, _embedded?: string, options?: HalOptions, builder?: SubTypeBuilder): Observable<T[]> {

    const params = ResourceHelper.optionParams(new HttpParams(), options);
    const result: ResourceArray<T> = ResourceHelper.createEmptyResult<T>((_embedded === null || _embedded === undefined) ? "_embedded" : _embedded);
    if (!(this._links === null || this._links === undefined) && !(this._links[relation] === null || this._links[relation] === undefined)) {
      const observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), {
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

  public getRelationEx<T extends Resource>(type: { new(): T }, relation: string, options: {
    [p: string]: string
  } = {}): Observable<T> {
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

      const observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(url), {
        headers: ResourceHelper.headers,
        params: remainingOptions
      });
      return observable.pipe(map(response => Object.assign(new type(), response)))
    } else {
      if (Resource.loggerService) {
        Resource.loggerService.error('No relation instance found for', new Error(`Relation ${relation} not found`), {
          resource: this,
          relation: relation
        });
      } else {
        console.error('No relation intance found for', {
          resource: this,
          relation: relation
        });
      }
      return observableOf(null);
    }
  }

  public getRelation<T extends Resource>(type: {
    new(): T
  }, relation: string, builder?: SubTypeBuilder): Observable<T> {
    let result: T = new type();
    if (!(this._links === null || this._links === undefined) && !(this._links[relation] === null || this._links[relation] === undefined)) {
      const observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), {headers: ResourceHelper.headers});
      return observable.pipe(map((data: any) => {
        if (builder) {
          for (const embeddedClassName of Object.keys(data['_links'])) {
            if (embeddedClassName == 'self') {
              const href: string = data._links[embeddedClassName].href;
              const idx: number = href.lastIndexOf('/');
              const realClassName = href.replace(ResourceHelper.getRootUri(), "").substring(0, idx);
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
    if (!(this._links === null || this._links === undefined) && !(this._links[relation] === null || this._links[relation] === undefined)) {
      const header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
      const targetUrl = ResourceHelper.normalizeTemplatedUrl(
        this._links[relation].href
      );
      const body = ResourceHelper.normalizeTemplatedUrl(
        resource._links.self.href
      );
      return ResourceHelper.getHttp().post(
        ResourceHelper.getProxy(targetUrl),
        body,
        {headers: header}
      );
    } else {
      return throwError(() => new Error('no relation found'));
    }
  }

  public addRelationEx<T extends Resource>(relation: string, resource: T): Observable<any> {
    if (this._links?.[relation]?.href) {
      const template = utpl(this._links[relation].href);
      const url = template.fillFromObject({});
      const header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
      const body = ResourceHelper.normalizeTemplatedUrl(
        resource._links.self.href
      );
      return ResourceHelper.getHttp().post(
        ResourceHelper.getProxy(url),
        body,
        {headers: header}
      );
    } else {
      return throwError(() => new Error('no relation found'));
    }
  }


  /** Bind the given resource to this resource by the given relation*/

  public updateRelationEx<T extends Resource>(relation: string, resource?: T, options: {
    [p: string]: string
  } = {}) {
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
        const body = ResourceHelper.normalizeTemplatedUrl(
          resource._links.self.href
        );
        return ResourceHelper.getHttp().put(
          ResourceHelper.getProxy(url),
          body,
          {
            headers: new HttpHeaders().set('Content-Type', 'text/uri-list'),
            params: remainingOptions
          }
        );
      } else  {
        if (Resource.loggerService) {
          Resource.loggerService.error('No target found for', new Error(`No target found for relation ${relation}`), {
            resource: this,
            relation: relation
          });
        } else {
          console.error('No target found for', {
            resource: this,
            relation: relation
          });
        }
        return EMPTY;
      }
    } else {
      if (Resource.loggerService) {
        Resource.loggerService.error('No relation found for', new Error(`Relation ${relation} not found`), {
          resource: this,
          relation: relation
        });
      } else {
        console.error('No relation found for', {
          resource: this,
          relation: relation
        });
      }
      return EMPTY;
    }
  }

  public updateRelation<T extends Resource>(relation: string, resource: T): Observable<any> {
    if (!(this._links === null || this._links === undefined) && !(this._links[relation] === null || this._links[relation] === undefined)) {
      const header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
      const targetUrl = ResourceHelper.normalizeTemplatedUrl(
        this._links[relation].href
      );
      const body = ResourceHelper.normalizeTemplatedUrl(
        resource._links.self.href
      );
      return ResourceHelper.getHttp().patch(
        ResourceHelper.getProxy(targetUrl),
        body,
        {headers: header}
      );
    } else {
      return throwError(() => new Error('no relation found'));
    }
  }

  /** Bind the given resource to this resource by the given relation*/
  public substituteRelation<T extends Resource>(relation: string, resource: T): Observable<any> {
    if (!(this._links === null || this._links === undefined) && !(this._links[relation] === null || this._links[relation] === undefined)) {
      const header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
      const targetUrl = ResourceHelper.normalizeTemplatedUrl(
        this._links[relation].href
      );
      const url = ResourceHelper.getProxy(targetUrl);
      const body = ResourceHelper.normalizeTemplatedUrl(
        resource._links.self.href
      );
      return ResourceHelper.getHttp().put(url, body, {headers: header});
    } else {
      return throwError(() => new Error('no relation found'));
    }
  }

  public substituteRelationById(relation: string, type: string, key: any): Observable<any> {
    if (!(this._links === null || this._links === undefined) && !(this._links[relation] === null || this._links[relation] === undefined)) {
      const header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
      const targetUrl = ResourceHelper.normalizeTemplatedUrl(
        this._links[relation].href
      );
      const url = ResourceHelper.getProxy(targetUrl);
      const body = type + "/" + key;
      if (Resource.loggerService) {
        Resource.loggerService.debug("Substituting relation", {url: url, body: body});
      }
      return ResourceHelper.getHttp().put(url, body, {headers: header});
    } else {
      return throwError(() => new Error('no relation found'));
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
      const url = ResourceHelper.normalizeTemplatedUrl(
        resource?._links?.self?.href
      );
      if (!url) {
        throw new Error('Invalid resource: missing self link');
      }
      return url;
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
        if (Resource.loggerService) {
          Resource.loggerService.error(`Failed to substitute relation "${relation}"`, error);
        }
        return throwError(() => error);  // Preserve original error structure
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
    if (!(this._links === null || this._links === undefined) && !(resource._links === null || resource._links === undefined)) {
      const link = ResourceHelper.normalizeTemplatedUrl(
        resource._links['self'].href
      );
      const idx: number = link.lastIndexOf('/') + 1;

      if (idx == -1)
        return throwError(() => new Error('no relation found'));

      const relationId: string = link.substring(idx);

      const template = utpl(this._links[relation].href);
      const url = template.fillFromObject({});
      return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(url + '/' + relationId), {headers: ResourceHelper.headers});
    } else {
      return throwError(() => new Error('no relation found'));
    }
  }

  public deleteRelationById(relation: string, id: number): Observable<any> {
    if (this._links?.[relation]?.href) {
      const template = utpl(this._links[relation].href);
      const url = template.fillFromObject({});
      return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(url + '/' + id), {headers: ResourceHelper.headers});
    } else {
      return throwError(() => new Error('no relation found'));
    }
  }


  /** Unbind the resource with the given relation from this resource*/
  public deleteAllRelation(relation: string): Observable<any> {
    const template = utpl(this._links[relation].href);
    const url = template.fillFromObject({});
    return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(url), {headers: ResourceHelper.headers});

  }

}

