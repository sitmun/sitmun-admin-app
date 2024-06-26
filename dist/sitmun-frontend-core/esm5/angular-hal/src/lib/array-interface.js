/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Interface for array of REST resources
 * @record
 * @template T
 */
export function ArrayInterface() { }
if (false) {
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
     * @param {?} el
     * @return {?}
     */
    ArrayInterface.prototype.push = function (el) { };
    /**
     * length of the array
     * @return {?}
     */
    ArrayInterface.prototype.length = function () { };
    /**
     * Load next page
     * @param {?} type
     * @return {?}
     */
    ArrayInterface.prototype.next = function (type) { };
    /**
     * Load previous page
     * @param {?} type
     * @return {?}
     */
    ArrayInterface.prototype.prev = function (type) { };
    /**
     * Load first page
     * @param {?} type
     * @return {?}
     */
    ArrayInterface.prototype.first = function (type) { };
    /**
     * Load last page
     * @param {?} type
     * @return {?}
     */
    ArrayInterface.prototype.last = function (type) { };
    /**
     * Load page with given pageNumber
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    ArrayInterface.prototype.page = function (type, id) { };
    /**
     * Sort collection based on given sort attribute
     * @param {?} type
     * @param {...?} sort
     * @return {?}
     */
    ArrayInterface.prototype.sortElements = function (type, sort) { };
    /**
     * Load page with given size
     * @param {?} type
     * @param {?} size
     * @return {?}
     */
    ArrayInterface.prototype.size = function (type, size) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXktaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlLyIsInNvdXJjZXMiOlsiYW5ndWxhci1oYWwvc3JjL2xpYi9hcnJheS1pbnRlcmZhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBTUEsb0NBaURDOzs7Ozs7SUE5Q0csdUNBQXNCOzs7OztJQUV0QixvQ0FBbUI7Ozs7O0lBRW5CLG9DQUFtQjs7Ozs7SUFFbkIsa0NBQWlCOzs7OztJQUVqQixrQ0FBaUI7Ozs7O0lBRWpCLGtDQUFpQjs7Ozs7SUFFakIsa0NBQWlCOzs7OztJQUVqQixrQ0FBaUI7Ozs7O0lBRWpCLG1DQUFrQjs7Ozs7SUFFbEIsa0NBQWlCOzs7Ozs7SUFHakIsa0RBQVk7Ozs7O0lBR1osa0RBQWlCOzs7Ozs7SUFHakIsb0RBQXVEOzs7Ozs7SUFHdkQsb0RBQXVEOzs7Ozs7SUFHdkQscURBQXdEOzs7Ozs7SUFHeEQsb0RBQXVEOzs7Ozs7O0lBR3ZELHdEQUFtRTs7Ozs7OztJQUduRSxrRUFBZ0Y7Ozs7Ozs7SUFHaEYsMERBQXFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTb3J0fSBmcm9tICcuL3NvcnQnO1xyXG5pbXBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBJbnRlcmZhY2UgZm9yIGFycmF5IG9mIFJFU1QgcmVzb3VyY2VzICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXJyYXlJbnRlcmZhY2U8VCBleHRlbmRzIFJlc291cmNlPiB7XHJcblxyXG4gICAgLyoqIHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIGFycmF5ICovXHJcbiAgICB0b3RhbEVsZW1lbnRzOiBudW1iZXI7XHJcbiAgICAvKiogdG90YWwgbnVtYmVyIG9mIHBhZ2VzIGluIHRoZSByZXNwb25zZSAqL1xyXG4gICAgdG90YWxQYWdlczogbnVtYmVyO1xyXG4gICAgLyoqIHBhZ2UgbnVtYmVyIGluIHRoZSByZXNwb25zZSAqL1xyXG4gICAgcGFnZU51bWJlcjogbnVtYmVyO1xyXG4gICAgLyoqIHBhZ2Ugc2l6ZSAqL1xyXG4gICAgcGFnZVNpemU6IG51bWJlcjtcclxuICAgIC8qKiBzb3J0aW5nIGluZm8gKi9cclxuICAgIHNvcnRJbmZvOiBTb3J0W107XHJcbiAgICAvKiogc2VsZiB1cmwgKi9cclxuICAgIHNlbGZfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogbmV4dCByZXNvdXJjZSB1cmwgKi9cclxuICAgIG5leHRfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogcHJldmlvdXMgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwcmV2X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIGZpcnN0IHJlc291cmNlIHVybCAqL1xyXG4gICAgZmlyc3RfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogbGFzdCByZXNvdXJjZSB1cmwgKi9cclxuICAgIGxhc3RfdXJpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIHB1c2ggYSBuZXcgcmVzb3VyY2UgdG8gdGhlIGFycmF5ICovXHJcbiAgICBwdXNoKGVsOiBUKTtcclxuXHJcbiAgICAvKiogbGVuZ3RoIG9mIHRoZSBhcnJheSAqL1xyXG4gICAgbGVuZ3RoKCk6IG51bWJlcjtcclxuXHJcbiAgICAvKiogTG9hZCBuZXh0IHBhZ2UgKi9cclxuICAgIG5leHQodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PjtcclxuXHJcbiAgICAvKiogTG9hZCBwcmV2aW91cyBwYWdlICovXHJcbiAgICBwcmV2KHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj47XHJcblxyXG4gICAgLyoqIExvYWQgZmlyc3QgcGFnZSAqL1xyXG4gICAgZmlyc3QodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PjtcclxuXHJcbiAgICAvKiogTG9hZCBsYXN0IHBhZ2UgKi9cclxuICAgIGxhc3QodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PjtcclxuXHJcbiAgICAvKiogTG9hZCBwYWdlIHdpdGggZ2l2ZW4gcGFnZU51bWJlciovXHJcbiAgICBwYWdlKHR5cGU6IHsgbmV3KCk6IFQgfSwgaWQ6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj47XHJcblxyXG4gICAgLyoqIFNvcnQgY29sbGVjdGlvbiBiYXNlZCBvbiBnaXZlbiBzb3J0IGF0dHJpYnV0ZSAqL1xyXG4gICAgc29ydEVsZW1lbnRzKHR5cGU6IHsgbmV3KCk6IFQgfSwgLi4uc29ydDogU29ydFtdKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PjtcclxuXHJcbiAgICAvKiogTG9hZCBwYWdlIHdpdGggZ2l2ZW4gc2l6ZSAqL1xyXG4gICAgc2l6ZSh0eXBlOiB7IG5ldygpOiBUIH0sIHNpemU6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj47XHJcbn0iXX0=