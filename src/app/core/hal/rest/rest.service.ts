import {Injector} from "@angular/core";

import {EMPTY, firstValueFrom, Observable, of, switchMap, throwError} from 'rxjs';
import {expand, map, reduce} from 'rxjs/operators';

import {Sort} from './sort.model';
import {SubTypeBuilder} from '../common/subtype-builder';
import type {HalPage} from '../hal-page';
import {ALL_PAGES_CHUNK_SIZE, ALL_PAGES_FETCH_SIZE} from '../infinite-page-size';
import {ResourceArray} from '../resource/resource-array.model';
import {Resource} from '../resource/resource.model';
import {ResourceService} from '../resource/resource.service';

/** HAL param data model */
export type HalParam = { key: string, value: string | number | boolean };
/** HAL option data model */
export type HalOptions = {
  notPaged?: boolean;
  page?: number;
  size?: number;
  sort?: Sort[];
  params?: HalParam[];
  /** When true, concatenates all pages instead of a single high-size request */
  chunkedFullFetch?: boolean;
};

/**
 * A generic service class that provides REST API access with HAL (Hypertext Application Language) support.
 * This service handles CRUD operations, pagination, and relationship navigation for HAL-compliant REST resources.
 *
 * @template T - Type parameter that extends Resource class
 */
export class RestService<T extends Resource> {
  /** The constructor type for creating new instances of the resource */
  private readonly type: { new(): T };
  /** The base resource path for API endpoints */
  private readonly resource: string;
  /** Service for handling resource operations */
  public resourceService: ResourceService;
  /** The field name for embedded resources in HAL responses */
  private _embedded = '_embedded';

  /**
   * Creates a new instance of RestService
   * @param type - The constructor for the resource type
   * @param resource - The base resource path
   * @param injector - Angular's dependency injector
   * @param _embedded - Optional custom field name for embedded resources
   */
  constructor(type: { new(): T },
              resource: string,
              injector: Injector,
              _embedded?: string) {
    this.type = type;
    this.resource = resource;
    this.resourceService = injector.get(ResourceService);
    if (!(_embedded === null || _embedded === undefined))
      this._embedded = _embedded;
  }

  /**
   * Handles error responses from the API
   * @param error - The error object to handle
   * @returns An Observable that errors with the provided error
   */
  protected handleError(error: any): Observable<never> {
    return RestService.handleError(error);
  }

  /**
   * Static error handler method
   * @param error - The error object to handle
   * @returns An Observable that errors with the provided error
   */
  protected static handleError(error: any): Observable<never> {
    return throwError(() => error);
  }

  /**
   * Retrieves all resources with optional pagination, sorting, and filtering
   * @param options - Optional HAL options for pagination, sorting, and additional parameters
   * @param subType - Optional builder for handling subtypes
   * @param embeddedName - Optional custom embedded resource name
   * @returns Observable of a resource array
   */
  public fetchAllRawItems(options?: HalOptions, subType?: SubTypeBuilder, embeddedName?: string): Observable<T[]> {
    return this.fetchRawItems({
      ...options,
      size: options?.size ?? ALL_PAGES_FETCH_SIZE,
      notPaged: options?.notPaged ?? true,
    }, subType, embeddedName);
  }

  private fetchRawItems(options?: HalOptions, subType?: SubTypeBuilder, embeddedName?: string): Observable<T[]> {
    return this.resourceService
      .fetchRawItems(this.type, this.resource, this._embedded, options, subType, embeddedName)
      .pipe(
        map((resourceArray: ResourceArray<T>) => {
          if (options?.notPaged && resourceArray.first_uri) {
            options.notPaged = false;
            options.size = resourceArray.totalElements;
            return options;
          } else {
            return resourceArray.result;
          }
        }),
        switchMap(result => {
          if (Array.isArray(result)) {
            return of(result);
          } else {
            return this.fetchRawItems(result, subType, embeddedName); // Re-call getAll with updated options
          }
        })
      );
  }


  public fetchAllProjectionItems<S extends Resource>(
    type: {new(): S},
    options?: HalOptions,
    subType?: SubTypeBuilder,
    embeddedName?: string,
  ): Observable<S[]> {
    return this.fetchProjectionItems(type, {
      ...options,
      size: options?.size ?? ALL_PAGES_FETCH_SIZE,
      notPaged: options?.notPaged ?? true,
    }, subType, embeddedName);
  }

  public fetchProjectionItems<S extends Resource>(type: {new(): S}, options?: HalOptions, subType?: SubTypeBuilder, embeddedName?: string): Observable<S[]> {
    return this.resourceService
      .fetch(type, this.resource, this._embedded, options, subType, embeddedName, false)
      .pipe(
        map((resourceArray: ResourceArray<S>) => {
          if (options?.notPaged && resourceArray.first_uri) {
            options.notPaged = false;
            options.size = resourceArray.totalElements;
            return options;
          } else {
            return resourceArray.result;
          }
        }),
        switchMap(result => {
          if (Array.isArray(result)) {
            return of(result);
          } else {
            return this.fetchProjectionItems(type, result, subType, embeddedName); // Re-call getAll with updated options
          }
        })
      );
  }


  private fetchItems(options?: HalOptions, subType?: SubTypeBuilder, embeddedName?: string, ignoreProjection?: boolean): Observable<T[]> {
    return this.resourceService
      .fetch(this.type, this.resource, this._embedded, options, subType, embeddedName, ignoreProjection)
      .pipe(
        map((resourceArray: ResourceArray<T>) => {
          if (options?.notPaged && resourceArray.first_uri) {
            options.notPaged = false;
            options.size = resourceArray.totalElements;
            return options;
          } else {
            return resourceArray.result;
          }
        }),
        switchMap(result => {
          if (Array.isArray(result)) {
            return of(result);
          } else {
            return this.fetchItems(result, subType, embeddedName, ignoreProjection); // Re-call getAll with updated options
          }
        })
      );
  }

  /**
   * Fetches a single HAL page with metadata for infinite row model block loading.
   */
  public fetchPage(
    options?: HalOptions,
    subType?: SubTypeBuilder,
    embeddedName?: string,
    ignoreProjection?: boolean,
  ): Observable<HalPage<T>> {
    return this.resourceService
      .fetch(this.type, this.resource, this._embedded, options, subType, embeddedName, ignoreProjection)
      .pipe(map((resourceArray) => RestService.toHalPage(resourceArray)));
  }

  /**
   * Fetches a single HAL search page with metadata for infinite row model block loading.
   */
  public searchPage(
    query: string,
    options?: HalOptions,
    subType?: SubTypeBuilder,
    embeddedName?: string,
    ignoreProjection?: boolean,
  ): Observable<HalPage<T>> {
    return this.resourceService
      .search(this.type, query, this.resource, this._embedded, options, subType, embeddedName, ignoreProjection ?? false)
      .pipe(map((resourceArray) => {
        return RestService.toHalPage(resourceArray);
      }));
  }

  /**
   * Fetches a single HAL content-search page for infinite grids.
   * Convenience method that calls searchPage with 'content' query and adds q parameter.
   */
  public searchTextPage(text: string, options?: HalOptions): Observable<HalPage<T>> {
    return this.searchPage('content', {
      ...options,
      params: [
        ...(options?.params ?? []),
        {key: 'q', value: text},
      ],
    });
  }

  /**
   * Fetches all rows across pages for client-side grids and dropdowns.
   * Phase A: single request with high size (default). Phase B: chunked loop when chunkedFullFetch is set.
   */
  public fetchAllItems(
    options?: HalOptions,
    subType?: SubTypeBuilder,
    embeddedName?: string,
    ignoreProjection?: boolean,
  ): Observable<T[]> {
    if (options?.chunkedFullFetch === false) {
      const fullFetchOptions: HalOptions = {
        ...options,
        page: undefined,
        size: options?.size ?? ALL_PAGES_FETCH_SIZE,
        notPaged: options?.notPaged ?? true,
      };
      return this.fetchItems(fullFetchOptions, subType, embeddedName, ignoreProjection);
    }
    return this.fetchItemsPageByPage(options, subType, embeddedName, ignoreProjection);
  }

  private fetchItemsPageByPage(
    options?: HalOptions,
    subType?: SubTypeBuilder,
    embeddedName?: string,
    ignoreProjection?: boolean,
  ): Observable<T[]> {
    const pageSize = options?.size ?? ALL_PAGES_CHUNK_SIZE;
    const firstPageOptions: HalOptions = {...options, page: 0, size: pageSize, notPaged: false, chunkedFullFetch: undefined};

    return this.fetchPage(firstPageOptions, subType, embeddedName, ignoreProjection).pipe(
      expand((page) => {
        const nextPage = page.pageNumber + 1;
        if (nextPage >= page.totalPages) {
          return EMPTY;
        }
        return this.fetchPage(
          {...firstPageOptions, page: nextPage},
          subType,
          embeddedName,
          ignoreProjection,
        );
      }),
      map((page) => page.rows),
      reduce((acc, rows) => acc.concat(rows), [] as T[]),
    );
  }

  private static toHalPage<T extends Resource>(resourceArray: ResourceArray<T>): HalPage<T> {
    return {
      rows: resourceArray.result,
      totalElements: resourceArray.totalElements,
      pageNumber: resourceArray.pageNumber,
      pageSize: resourceArray.pageSize,
      totalPages: resourceArray.totalPages,
    };
  }

  /**
   * Retrieves a single resource by its ID
   * @param id - The identifier of the resource
   * @returns Observable of single resource
   */
  public get(id: any): Observable<T> {
    return this.resourceService.get(this.type, this.resource, id);
  }

  public fetchProjectionById<S extends Resource>(type: { new(): S }, id: any): Observable<S> {
    return this.resourceService.get(type, this.resource, id);
  }

  public fetchRawById(id: any): Observable<T> {
    return this.resourceService.fetchRawById(this.type, this.resource, id);
  }


  /**
   * Retrieves a resource using its self-link
   * @param selfLink - The self-link URL of the resource
   * @returns Observable of single resource
   */
  public getBySelfLink(selfLink: string): Observable<T> {
    return this.resourceService.getBySelfLink(this.type, selfLink);
  }

  /**
   * Searches for resources using a query string
   * @param query - The search query string
   * @param options - Optional HAL options for pagination and sorting
   * @returns Observable of the resource array
   */
  public search(query: string, options?: HalOptions): Observable<T[]> {
    return this.resourceService.search(this.type, query, this.resource, this._embedded, options).pipe(
      map((resourceArray: ResourceArray<T>) => {
        if (options && options.notPaged && !(resourceArray.first_uri === null || resourceArray.first_uri === undefined)) {
          options.notPaged = false;
          options.size = resourceArray.totalElements;
          return firstValueFrom(this.search(query, options));
        } else {
          return resourceArray.result;
        }
      }) as any
    );
  }

  /**
   * Searches for a single resource using a query string
   * @param query - The search query string
   * @param options - Optional HAL options
   * @returns Observable of single resource
   */
  public searchOne(query: string, options?: HalOptions): Observable<T> {
    return this.resourceService.searchOne(this.type, query, this.resource, options);
  }

  /**
   * Executes a custom query against the API
   * @param queryString - The custom query string
   * @param options - Optional HAL options
   * @returns Observable of resource array
   */
  public fetchItemsByQueryString(queryString: string, options?: HalOptions): Observable<T[]> {
    return this.resourceService.fetchItemsByQueryString(this.type, queryString, this.resource, this._embedded, options).pipe(
      map((resourceArray: ResourceArray<T>) => {
        if (options && options.notPaged && !(resourceArray.first_uri === null || resourceArray.first_uri === undefined)) {
          options.notPaged = false;
          options.size = resourceArray.totalElements;
          return firstValueFrom(this.fetchItemsByQueryString(queryString, options));
        } else {
          return resourceArray.result;
        }
      }) as any
    );
  }

  public fetchProjectionItemsByQueryString<S extends Resource>(type: {new(): S}, queryString: string, options?: HalOptions): Observable<S[]> {
    return this.resourceService.fetchProjectedByQueryString(type, queryString, this.resource, this._embedded, options).pipe(
      map((resourceArray: ResourceArray<T>) => {
        if (options && options.notPaged && resourceArray.first_uri !== null && resourceArray.first_uri !== undefined) {
          options.notPaged = false;
          options.size = resourceArray.totalElements;
          return firstValueFrom(this.fetchProjectionItemsByQueryString(type, queryString, options));
        } else {
          return resourceArray.result;
        }
      }) as any
    );
  }


  /**
   * Retrieves an array of related resources
   * @param relation - The relation link name
   * @param builder - Optional subtype builder
   * @param options
   * @returns Observable of the resource array
   */
  public fetchRelationItems(relation: string, builder?: SubTypeBuilder, options?: HalOptions): Observable<T[]> {
    return this.resourceService.fetchRelationItems(this.type, relation, this._embedded, builder, options).pipe(
      map((resourceArray: ResourceArray<T>) => {
        if (options?.notPaged && resourceArray.first_uri) {
          const nextOptions: HalOptions = {...options, notPaged: false, size: resourceArray.totalElements};
          return nextOptions;
        }
        return resourceArray.result;
      }),
      switchMap((result) => {
        if (Array.isArray(result)) {
          return of(result);
        }
        return this.fetchRelationItems(relation, builder, result);
      }),
    );
  }

  /** Full-fetch variant for relation arrays */
  public fetchAllRelationItems(relation: string, builder?: SubTypeBuilder, options?: HalOptions): Observable<T[]> {
    return this.fetchRelationItems(relation, builder, {
      ...options,
      size: options?.size ?? ALL_PAGES_FETCH_SIZE,
      notPaged: options?.notPaged ?? true,
    });
  }

  /**
   * Retrieves a single related resource
   * @param relation - The relation link name
   * @returns Observable of single resource
   */
  public fetchRelation(relation: string): Observable<T> {
    return this.resourceService.fetchRelation(this.type, relation);
  }

  /**
   * Counts the total number of resources
   * @returns Observable of resource count
   */
  public count(): Observable<number> {
    return this.resourceService.count(this.resource);
  }

  /**
   * Creates a new resource
   * @param entity - The resource entity to create
   * @returns Observable of the created resource
   */
  public create(entity: T) {
    return this.resourceService.create(this.resource, entity);
  }

  /**
   * Updates an existing resource
   * @param entity - The resource entity to update
   * @returns Observable of the updated resource
   */
  public update(entity: T) {
    return this.resourceService.update(entity);
  }

  /**
   * Partially updates a resource
   * @param entity - The resource entity to patch
   * @returns Observable of the patched resource
   */
  public patch(entity: T) {
    return this.resourceService.patch(entity);
  }

  /**
   * Deletes a resource
   * @param entity - The resource entity to delete
   * @returns Observable of the operation result
   */
  /**
   * Deletes a resource entity
   * Extracts entity type and name from the entity and passes it to ResourceService for enhanced error messages
   * @param entity The resource entity to delete
   * @returns Observable of the deletion operation
   */
  public delete(entity: T) {
    // Extract entity type translation key from resource path
    // e.g., "services" -> "entity.service.label", "cartographies" -> "entity.cartography.label"
    const entityTypeKey = this.getEntityTypeTranslationKey();

    // Extract entity name from entity object (try name, title, or id as fallback)
    const entityName = this.getEntityName(entity);

    return this.resourceService.delete(entity, entityTypeKey, entityName);
  }

  /**
   * Maps resource path to entity type translation key
   * @returns Translation key for the entity type (e.g., "entity.service.label")
   */
  private getEntityTypeTranslationKey(): string | undefined {
    // Map common resource paths to entity translation keys
    const resourceToEntityType: Record<string, string> = {
      'services': 'entity.service.label',
      'cartographies': 'entity.cartography.label',
      'tasks': 'entity.task.label',
      'applications': 'entity.application.label',
      'territories': 'entity.territory.label',
      'users': 'entity.user.label',
      'roles': 'entity.role.label',
      'trees': 'entity.tree.label',
      'backgrounds': 'entity.background.label',
      'cartography-groups': 'entity.cartography-group.label',
      'task-groups': 'entity.taskGroup.label',
      'connections': 'entity.connection.label'
    };

    return resourceToEntityType[this.resource] || undefined;
  }

  /**
   * Extracts entity name from entity object
   * Tries name, title, or falls back to id
   * @param entity The entity object
   * @returns Entity name or identifier
   */
  private getEntityName(entity: T): string | undefined {
    if (!entity) {
      return undefined;
    }

    // Try common name properties
    const name = (entity as any).name;
    if (name && typeof name === 'string' && name.trim()) {
      return name;
    }

    const title = (entity as any).title;
    if (title && typeof title === 'string' && title.trim()) {
      return title;
    }

    // Fallback to id if available
    if (entity.id !== undefined && entity.id !== null) {
      return `#${entity.id}`;
    }

    return undefined;
  }

  /**
   * Gets the total number of elements in the current resource array
   * @returns The total number of elements
   */
  public totalElement(resourceArray: ResourceArray<T>): number {
    if (resourceArray?.totalElements)
      return resourceArray.totalElements;
    return 0;
  }

  /**
   * Checks if the resource array has a first page
   * @returns True if first page exists
   */
  public hasFirst(resourceArray: ResourceArray<T>): boolean {
    return this.resourceService.hasFirst(resourceArray);
  }

  /**
   * Checks if the resource array has a next page
   * @returns True if next page exists
   */
  public hasNext(resourceArray: ResourceArray<T>): boolean {
    return this.resourceService.hasNext(resourceArray);
  }

  /**
   * Checks if the resource array has a previous page
   * @returns True if previous page exists
   */
  public hasPrev(resourceArray: ResourceArray<T>): boolean {
    return this.resourceService.hasPrev(resourceArray);
  }

  /**
   * Checks if the resource array has a last page
   * @returns True if last page exists
   */
  public hasLast(resourceArray: ResourceArray<T>): boolean {
    return this.resourceService.hasLast(resourceArray);
  }

  /**
   * Navigates to the next page of results
   * @returns Observable of the next page's resource array
   */
  public next(resourceArray: ResourceArray<T>): Observable<T[]> {
    return this.resourceService.next(resourceArray, this.type).pipe(
      map((resourceArray: ResourceArray<T>) => {
        return resourceArray.result;
      }));
  }

  /**
   * Navigates to the previous page of results
   * @returns Observable of the previous page's resource array
   */
  public prev(resourceArray: ResourceArray<T>): Observable<T[]> {
    return this.resourceService.prev(resourceArray, this.type).pipe(
      map((resourceArray: ResourceArray<T>) => {
        return resourceArray.result;
      }))
  }

  /**
   * Navigates to the first page of results
   * @returns Observable of the first page's resource array
   */
  public first(resourceArray: ResourceArray<T>): Observable<T[]> {
    return this.resourceService.first(resourceArray, this.type).pipe(
      map((resourceArray: ResourceArray<T>) => {
        return resourceArray.result;
      }))
  }

  /**
   * Navigates to the last page of results
   * @returns Observable of the last page's resource array
   */
  public last(resourceArray: ResourceArray<T>): Observable<T[]> {
    return this.resourceService.last(resourceArray, this.type).pipe(
      map((resourceArray: ResourceArray<T>) => {
        return resourceArray.result;
      }));
  }

  /**
   * Navigates to a specific page of results
   * @param resourceArray - The resource array to navigate
   * @param pageNumber - The page number to navigate to
   * @returns Observable of the specified page's resource array
   */
  public page(resourceArray: ResourceArray<T>, pageNumber: number): Observable<T[]> {
    return this.resourceService.page(resourceArray, this.type, pageNumber).pipe(
      map((resourceArray: ResourceArray<T>) => {
        return resourceArray.result;
      }));
  }

  /**
   * Creates a proxy instance of the resource with the given ID.
   * This is useful for referencing a resource by ID without fetching it from the server.
   *
   * @param id - The ID of the resource to proxy, or null/undefined for no proxy.
   * @returns A new resource instance with the specified ID and self-link, or null if ID is not provided.
   */
  createProxy(id: number | null | undefined): T | null {
    if (id === null || id === undefined) {
      return null;
    }
    return Object.assign(
      new this.type(),
      {
        id: id,
        _links: {
          self: {
            href: this.resourceService.getResourceUrl(this.resource) + '/' + id
          }
        }
      }
    );
  }
}
