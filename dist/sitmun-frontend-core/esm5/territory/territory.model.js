/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Resource } from '../angular-hal/src/lib/resource';
/**
 * Territory model
 */
var /**
 * Territory model
 */
Territory = /** @class */ (function (_super) {
    tslib_1.__extends(Territory, _super);
    function Territory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Territory;
}(Resource));
/**
 * Territory model
 */
export { Territory };
if (false) {
    /**
     * id
     * @type {?}
     */
    Territory.prototype.id;
    /**
     * code
     * @type {?}
     */
    Territory.prototype.code;
    /**
     * name
     * @type {?}
     */
    Territory.prototype.name;
    /**
     * address
     * @type {?}
     */
    Territory.prototype.territorialAuthorityAddress;
    /**
     * admin
     * @type {?}
     */
    Territory.prototype.territorialAuthorityName;
    /**
     * whether territory is blocked
     * @type {?}
     */
    Territory.prototype.blocked;
    /**
     * comments
     * @type {?}
     */
    Territory.prototype.note;
    /**
     * system created date
     * @type {?}
     */
    Territory.prototype.createdDate;
    /**
     * contact email
     * @type {?}
     */
    Territory.prototype.territorialAuthorityEmail;
    /**
     * extension
     * @type {?}
     */
    Territory.prototype.extent;
    /**
     * logo image URL
     * @type {?}
     */
    Territory.prototype.territorialAuthorityLogo;
    /**
     * scope
     * @type {?}
     */
    Territory.prototype.scope;
    /**
     * type
     * @type {?}
     */
    Territory.prototype.type;
    /**
     * group type
     * @type {?}
     */
    Territory.prototype.groupType;
    /**
     * territory members
     * @type {?}
     */
    Territory.prototype.members;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVycml0b3J5Lm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlLyIsInNvdXJjZXMiOlsidGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQzs7OztBQU96RDs7O0FBQUE7SUFBK0IscUNBQVE7Ozs7b0JBUHZDO0VBTytCLFFBQVEsRUFrQ3RDLENBQUE7Ozs7QUFsQ0QscUJBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeUdyb3VwVHlwZSB9IGZyb20gJy4vdGVycml0b3J5LWdyb3VwLXR5cGUubW9kZWwnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnlUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktdHlwZS5tb2RlbCc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIGNvZGUgKi9cclxuICBwdWJsaWMgY29kZTogc3RyaW5nO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogYWRkcmVzcyovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5QWRkcmVzczogc3RyaW5nO1xyXG4gIC8qKiBhZG1pbiAqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbEF1dGhvcml0eU5hbWU6IHN0cmluZztcclxuICAvKiogd2hldGhlciB0ZXJyaXRvcnkgaXMgYmxvY2tlZCovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47XHJcbiAgLyoqIGNvbW1lbnRzKi9cclxuICBwdWJsaWMgbm90ZTogc3RyaW5nO1xyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICAvKiogY29udGFjdCBlbWFpbCAqLyAgXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5RW1haWw6IHN0cmluZztcclxuICAvKiogZXh0ZW5zaW9uICovXHJcbiAgcHVibGljIGV4dGVudDogc3RyaW5nO1xyXG4gIC8qKiBsb2dvIGltYWdlIFVSTCAqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbEF1dGhvcml0eUxvZ286IHN0cmluZztcclxuICAvKiogY29udGFjdCBvcmdhbml6YXRpb24gbmFtZSAqL1xyXG4gIC8vIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHNjb3BlKi9cclxuICBwdWJsaWMgc2NvcGU6IHN0cmluZztcclxuICAvKiogdHlwZSAqLyAgXHJcbiAgcHVibGljIHR5cGU6IFRlcnJpdG9yeVR5cGU7XHJcbiAgLyoqIGdyb3VwIHR5cGUgKi9cclxuICBwdWJsaWMgZ3JvdXBUeXBlOiBUZXJyaXRvcnlHcm91cFR5cGU7XHJcbiAgLyoqIHRlcnJpdG9yeSBtZW1iZXJzKi9cclxuICBwdWJsaWMgbWVtYmVyczogVGVycml0b3J5W107XHJcblxyXG59XHJcbiJdfQ==