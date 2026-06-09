import {Component, EventEmitter, Input, Output} from '@angular/core';

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
  @Input() dataLoaded = false;

  @Output() save = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
}
