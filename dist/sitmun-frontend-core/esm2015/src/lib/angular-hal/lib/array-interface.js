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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXktaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3NyYy9saWIvYW5ndWxhci1oYWwvIiwic291cmNlcyI6WyJsaWIvYXJyYXktaW50ZXJmYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMvaW50ZXJuYWwvT2JzZXJ2YWJsZSc7XHJcblxyXG4vKiogSW50ZXJmYWNlIGZvciBhcnJheSBvZiBSRVNUIHJlc291cmNlcyAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIEFycmF5SW50ZXJmYWNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ge1xyXG5cclxuICAgIC8qKiB0b3RhbCBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBhcnJheSAqL1xyXG4gICAgdG90YWxFbGVtZW50czogbnVtYmVyO1xyXG4gICAgLyoqIHRvdGFsIG51bWJlciBvZiBwYWdlcyBpbiB0aGUgcmVzcG9uc2UgKi9cclxuICAgIHRvdGFsUGFnZXM6IG51bWJlcjtcclxuICAgIC8qKiBwYWdlIG51bWJlciBpbiB0aGUgcmVzcG9uc2UgKi9cclxuICAgIHBhZ2VOdW1iZXI6IG51bWJlcjtcclxuICAgIC8qKiBwYWdlIHNpemUgKi9cclxuICAgIHBhZ2VTaXplOiBudW1iZXI7XHJcbiAgICAvKiogc29ydGluZyBpbmZvICovXHJcbiAgICBzb3J0SW5mbzogU29ydFtdO1xyXG4gICAgLyoqIHNlbGYgdXJsICovXHJcbiAgICBzZWxmX3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIG5leHQgcmVzb3VyY2UgdXJsICovXHJcbiAgICBuZXh0X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIHByZXZpb3VzIHJlc291cmNlIHVybCAqL1xyXG4gICAgcHJldl91cmk6IHN0cmluZztcclxuICAgIC8qKiBmaXJzdCByZXNvdXJjZSB1cmwgKi9cclxuICAgIGZpcnN0X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIGxhc3QgcmVzb3VyY2UgdXJsICovXHJcbiAgICBsYXN0X3VyaTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBwdXNoIGEgbmV3IHJlc291cmNlIHRvIHRoZSBhcnJheSAqL1xyXG4gICAgcHVzaChlbDogVCk7XHJcblxyXG4gICAgLyoqIGxlbmd0aCBvZiB0aGUgYXJyYXkgKi9cclxuICAgIGxlbmd0aCgpOiBudW1iZXI7XHJcblxyXG4gICAgLyoqIExvYWQgbmV4dCBwYWdlICovXHJcbiAgICBuZXh0KHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj47XHJcblxyXG4gICAgLyoqIExvYWQgcHJldmlvdXMgcGFnZSAqL1xyXG4gICAgcHJldih0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+O1xyXG5cclxuICAgIC8qKiBMb2FkIGZpcnN0IHBhZ2UgKi9cclxuICAgIGZpcnN0KHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj47XHJcblxyXG4gICAgLyoqIExvYWQgbGFzdCBwYWdlICovXHJcbiAgICBsYXN0KHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj47XHJcblxyXG4gICAgLyoqIExvYWQgcGFnZSB3aXRoIGdpdmVuIHBhZ2VOdW1iZXIqL1xyXG4gICAgcGFnZSh0eXBlOiB7IG5ldygpOiBUIH0sIGlkOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+O1xyXG5cclxuICAgIC8qKiBTb3J0IGNvbGxlY3Rpb24gYmFzZWQgb24gZ2l2ZW4gc29ydCBhdHRyaWJ1dGUgKi9cclxuICAgIHNvcnRFbGVtZW50cyh0eXBlOiB7IG5ldygpOiBUIH0sIC4uLnNvcnQ6IFNvcnRbXSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj47XHJcblxyXG4gICAgLyoqIExvYWQgcGFnZSB3aXRoIGdpdmVuIHNpemUgKi9cclxuICAgIHNpemUodHlwZTogeyBuZXcoKTogVCB9LCBzaXplOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+O1xyXG59Il19