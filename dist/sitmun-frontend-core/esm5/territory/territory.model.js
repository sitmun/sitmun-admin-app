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
    Territory.prototype.comments;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVycml0b3J5Lm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlLyIsInNvdXJjZXMiOlsidGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQzs7OztBQU16RDs7O0FBQUE7SUFBK0IscUNBQVE7Ozs7b0JBTnZDO0VBTStCLFFBQVEsRUFxQ3RDLENBQUE7Ozs7QUFyQ0QscUJBcUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeVR5cGUgfSBmcm9tICcuL3RlcnJpdG9yeS10eXBlLm1vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBUZXJyaXRvcnkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogY29kZSAqL1xyXG4gIHB1YmxpYyBjb2RlOiBzdHJpbmc7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBhZGRyZXNzKi9cclxuICBwdWJsaWMgdGVycml0b3JpYWxBdXRob3JpdHlBZGRyZXNzOiBzdHJpbmc7XHJcbiAgLyoqIGFkbWluICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB3aGV0aGVyIHRlcnJpdG9yeSBpcyBibG9ja2VkKi9cclxuICBwdWJsaWMgYmxvY2tlZDogYm9vbGVhbjtcclxuICAvKiogY29tbWVudHMqL1xyXG4gIHB1YmxpYyBjb21tZW50czogc3RyaW5nO1xyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICAvKiogY29udGFjdCBlbWFpbCAqLyAgXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5RW1haWw6IHN0cmluZztcclxuICAvKiogZXh0ZW5zaW9uICovXHJcbiAgcHVibGljIGV4dGVudDogc3RyaW5nO1xyXG4gIC8qKiBsb2dvIGltYWdlIFVSTCAqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbEF1dGhvcml0eUxvZ286IHN0cmluZztcclxuICAvKiogY29udGFjdCBvcmdhbml6YXRpb24gbmFtZSAqL1xyXG4gIC8vIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHNjb3BlKi9cclxuICBwdWJsaWMgc2NvcGU6IHN0cmluZztcclxuICAvKiogdHlwZSAqLyAgXHJcbiAgcHVibGljIHR5cGU6IFRlcnJpdG9yeVR5cGU7XHJcbiAgLyoqIGdyb3VwIHR5cGUgKi9cclxuICBncm91cFR5cGU6IHtcclxuICAgIGlkOiAwLFxyXG4gICAgbmFtZTogc3RyaW5nXHJcbiAgfTtcclxuICAvKiogdGVycml0b3J5IG1lbWJlcnMqL1xyXG4gIHB1YmxpYyBtZW1iZXJzOiBUZXJyaXRvcnlbXTtcclxuXHJcbn1cclxuIl19