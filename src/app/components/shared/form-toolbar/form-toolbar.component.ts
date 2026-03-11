import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-form-toolbar',
    templateUrl: './form-toolbar.component.html',
    styleUrls: ['./form-toolbar.component.scss'],
    standalone: false
})
export class FormToolbarComponent {
  @Input() font = '';

  @Input() icon = '';

  @Input() entityType = '';

  @Input() itemName = '';

  @Input() isNew = true;
  @Input() additionalText: string;

  @Input() canSave = true;
  @Input() form: UntypedFormGroup;
  @Input() entityLabelPrefix: string;
  /**
   * Map of form control name → i18n key for validation banner labels.
   * Required when a field's label key is not entityLabelPrefix.fieldName (e.g. serviceId → 'entity.cartography.serviceName').
   */
  @Input() validationFieldLabelKeys: Record<string, string> | undefined;
  @Input() showValidationBanner = true;
  @Input() dataLoaded = false;
  @Input() customWarningMessage: string;

  @Output() save = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  constructor(public translate: TranslateService) {}
}
