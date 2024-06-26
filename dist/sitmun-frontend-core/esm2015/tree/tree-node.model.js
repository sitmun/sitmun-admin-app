/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Resource } from '../angular-hal/src/lib/resource';
/**
 * Tree node model
 */
export class TreeNode extends Resource {
}
if (false) {
    /**
     * name
     * @type {?}
     */
    TreeNode.prototype.name;
    /**
     * tooltip
     * @type {?}
     */
    TreeNode.prototype.tooltip;
    /**
     * description
     * @type {?}
     */
    TreeNode.prototype.description;
    /**
     * datasetURL
     * @type {?}
     */
    TreeNode.prototype.datasetURL;
    /**
     * metadataURL
     * @type {?}
     */
    TreeNode.prototype.metadataURL;
    /**
     * order
     * @type {?}
     */
    TreeNode.prototype.order;
    /**
     * whether tree node is active
     * @type {?}
     */
    TreeNode.prototype.active;
    /**
     * parent tree node
     * @type {?}
     */
    TreeNode.prototype.radio;
    /**
     * parent tree node
     * @type {?}
     */
    TreeNode.prototype.parent;
    /**
     * displayed cartography
     * @type {?}
     */
    TreeNode.prototype.cartography;
    /**
     * tree
     * @type {?}
     */
    TreeNode.prototype.tree;
    /**
     * filterGetFeatureInfo
     * @type {?}
     */
    TreeNode.prototype.filterGetFeatureInfo;
    /**
     * filterGetMap
     * @type {?}
     */
    TreeNode.prototype.filterGetMap;
    /**
     * filterSelectable
     * @type {?}
     */
    TreeNode.prototype.filterSelectable;
    /**
     * style
     * @type {?}
     */
    TreeNode.prototype.style;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ub2RlLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlLyIsInNvdXJjZXMiOlsidHJlZS90cmVlLW5vZGUubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQzs7OztBQU16RCxNQUFNLE9BQU8sUUFBUyxTQUFRLFFBQVE7Q0FpQ3JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHl9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHtUcmVlfSBmcm9tICcuL3RyZWUubW9kZWwnO1xyXG4vKipcclxuICogVHJlZSBub2RlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJlZU5vZGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0b29sdGlwKi9cclxuICBwdWJsaWMgdG9vbHRpcDogc3RyaW5nO1xyXG4gIC8qKiBkZXNjcmlwdGlvbiovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIGRhdGFzZXRVUkwqL1xyXG4gIHB1YmxpYyBkYXRhc2V0VVJMOiBzdHJpbmc7XHJcbiAgLyoqIG1ldGFkYXRhVVJMKi9cclxuICBwdWJsaWMgbWV0YWRhdGFVUkw6IHN0cmluZztcclxuICAvKiogb3JkZXIqL1xyXG4gIHB1YmxpYyBvcmRlciA6IG51bWJlcjtcclxuICAvKiogd2hldGhlciB0cmVlIG5vZGUgaXMgYWN0aXZlKi9cclxuICBwdWJsaWMgYWN0aXZlOiBib29sZWFuO1xyXG4gIC8qKiBwYXJlbnQgdHJlZSBub2RlICovXHJcbiAgcHVibGljIHJhZGlvOiBib29sZWFuO1xyXG4gIC8qKiBwYXJlbnQgdHJlZSBub2RlICovXHJcbiAgcHVibGljIHBhcmVudDogVHJlZU5vZGU7XHJcbiAgLyoqIGRpc3BsYXllZCBjYXJ0b2dyYXBoeSAqLyAgXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuICAvKiogdHJlZSAqLyAgXHJcbiAgcHVibGljIHRyZWU6IFRyZWU7XHJcbiAgLyoqIGZpbHRlckdldEZlYXR1cmVJbmZvICovICBcclxuICBwdWJsaWMgZmlsdGVyR2V0RmVhdHVyZUluZm86IGJvb2xlYW47XHJcbiAgLyoqIGZpbHRlckdldE1hcCAqLyAgXHJcbiAgcHVibGljIGZpbHRlckdldE1hcDogYm9vbGVhbjtcclxuICAvKiogZmlsdGVyU2VsZWN0YWJsZSAqLyAgXHJcbiAgcHVibGljIGZpbHRlclNlbGVjdGFibGU6IGJvb2xlYW47XHJcbiAgLyoqIHN0eWxlICovICBcclxuICBwdWJsaWMgc3R5bGU6IHN0cmluZztcclxuICBcclxuXHJcbn1cclxuIl19