import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-form-toolbar',
  templateUrl: './form-toolbar.component.html',
  styleUrls: ['./form-toolbar.component.scss']
})
export class FormToolbarComponent {
  @Input() font = '';

  @Input() icon = '';

  @Input() entityType = '';

  @Input() itemName = '';

  @Input() isNew = true;
  @Input() additionalText: string;

  @Input() canSave = true;
  @Output() save = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  constructor(public translate: TranslateService) {}
}
