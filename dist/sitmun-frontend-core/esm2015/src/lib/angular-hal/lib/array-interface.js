/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * Interface for array of REST resources
 * @record
 * @template T
 */
export function ArrayInterface() { }
/**
 * total number of elements in this array
 * @type {?}
 */
ArrayInterface.prototype.totalElements;
/**
 * total number of pages in the response
 * @type {?}
 */
ArrayInterface.prototype.totalPages;
/**
 * page number in the response
 * @type {?}
 */
ArrayInterface.prototype.pageNumber;
/**
 * page size
 * @type {?}
 */
ArrayInterface.prototype.pageSize;
/**
 * sorting info
 * @type {?}
 */
ArrayInterface.prototype.sortInfo;
/**
 * self url
 * @type {?}
 */
ArrayInterface.prototype.self_uri;
/**
 * next resource url
 * @type {?}
 */
ArrayInterface.prototype.next_uri;
/**
 * previous resource url
 * @type {?}
 */
ArrayInterface.prototype.prev_uri;
/**
 * first resource url
 * @type {?}
 */
ArrayInterface.prototype.first_uri;
/**
 * last resource url
 * @type {?}
 */
ArrayInterface.prototype.last_uri;
/**
 * push a new resource to the array
 * @type {?}
 */
ArrayInterface.prototype.push;
/**
 * length of the array
 * @type {?}
 */
ArrayInterface.prototype.length;
/**
 * Load next page
 * @type {?}
 */
ArrayInterface.prototype.next;
/**
 * Load previous page
 * @type {?}
 */
ArrayInterface.prototype.prev;
/**
 * Load first page
 * @type {?}
 */
ArrayInterface.prototype.first;
/**
 * Load last page
 * @type {?}
 */
ArrayInterface.prototype.last;
/**
 * Load page with given pageNumber
 * @type {?}
 */
ArrayInterface.prototype.page;
/**
 * Sort collection based on given sort attribute
 * @type {?}
 */
ArrayInterface.prototype.sortElements;
/**
 * Load page with given size
 * @type {?}
 */
ArrayInterface.prototype.size;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXktaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3NyYy9saWIvYW5ndWxhci1oYWwvIiwic291cmNlcyI6WyJsaWIvYXJyYXktaW50ZXJmYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIEludGVyZmFjZSBmb3IgYXJyYXkgb2YgUkVTVCByZXNvdXJjZXMgKi9cclxuZXhwb3J0IGludGVyZmFjZSBBcnJheUludGVyZmFjZTxUIGV4dGVuZHMgUmVzb3VyY2U+IHtcclxuXHJcbiAgICAvKiogdG90YWwgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgYXJyYXkgKi9cclxuICAgIHRvdGFsRWxlbWVudHM6IG51bWJlcjtcclxuICAgIC8qKiB0b3RhbCBudW1iZXIgb2YgcGFnZXMgaW4gdGhlIHJlc3BvbnNlICovXHJcbiAgICB0b3RhbFBhZ2VzOiBudW1iZXI7XHJcbiAgICAvKiogcGFnZSBudW1iZXIgaW4gdGhlIHJlc3BvbnNlICovXHJcbiAgICBwYWdlTnVtYmVyOiBudW1iZXI7XHJcbiAgICAvKiogcGFnZSBzaXplICovXHJcbiAgICBwYWdlU2l6ZTogbnVtYmVyO1xyXG4gICAgLyoqIHNvcnRpbmcgaW5mbyAqL1xyXG4gICAgc29ydEluZm86IFNvcnRbXTtcclxuICAgIC8qKiBzZWxmIHVybCAqL1xyXG4gICAgc2VsZl91cmk6IHN0cmluZztcclxuICAgIC8qKiBuZXh0IHJlc291cmNlIHVybCAqL1xyXG4gICAgbmV4dF91cmk6IHN0cmluZztcclxuICAgIC8qKiBwcmV2aW91cyByZXNvdXJjZSB1cmwgKi9cclxuICAgIHByZXZfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogZmlyc3QgcmVzb3VyY2UgdXJsICovXHJcbiAgICBmaXJzdF91cmk6IHN0cmluZztcclxuICAgIC8qKiBsYXN0IHJlc291cmNlIHVybCAqL1xyXG4gICAgbGFzdF91cmk6IHN0cmluZztcclxuXHJcbiAgICAvKiogcHVzaCBhIG5ldyByZXNvdXJjZSB0byB0aGUgYXJyYXkgKi9cclxuICAgIHB1c2goZWw6IFQpO1xyXG5cclxuICAgIC8qKiBsZW5ndGggb2YgdGhlIGFycmF5ICovXHJcbiAgICBsZW5ndGgoKTogbnVtYmVyO1xyXG5cclxuICAgIC8qKiBMb2FkIG5leHQgcGFnZSAqL1xyXG4gICAgbmV4dCh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+O1xyXG5cclxuICAgIC8qKiBMb2FkIHByZXZpb3VzIHBhZ2UgKi9cclxuICAgIHByZXYodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PjtcclxuXHJcbiAgICAvKiogTG9hZCBmaXJzdCBwYWdlICovXHJcbiAgICBmaXJzdCh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+O1xyXG5cclxuICAgIC8qKiBMb2FkIGxhc3QgcGFnZSAqL1xyXG4gICAgbGFzdCh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+O1xyXG5cclxuICAgIC8qKiBMb2FkIHBhZ2Ugd2l0aCBnaXZlbiBwYWdlTnVtYmVyKi9cclxuICAgIHBhZ2UodHlwZTogeyBuZXcoKTogVCB9LCBpZDogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PjtcclxuXHJcbiAgICAvKiogU29ydCBjb2xsZWN0aW9uIGJhc2VkIG9uIGdpdmVuIHNvcnQgYXR0cmlidXRlICovXHJcbiAgICBzb3J0RWxlbWVudHModHlwZTogeyBuZXcoKTogVCB9LCAuLi5zb3J0OiBTb3J0W10pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+O1xyXG5cclxuICAgIC8qKiBMb2FkIHBhZ2Ugd2l0aCBnaXZlbiBzaXplICovXHJcbiAgICBzaXplKHR5cGU6IHsgbmV3KCk6IFQgfSwgc2l6ZTogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PjtcclxufSJdfQ==