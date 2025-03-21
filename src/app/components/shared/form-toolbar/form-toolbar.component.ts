import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-toolbar',
  templateUrl: './form-toolbar.component.html',
  styleUrls: ['./form-toolbar.component.scss']
})
export class FormToolbarComponent {
  @Input() icon: string = '';
  @Input() entityType: string = '';
  @Input() itemName: string = '';
  @Input() isNew: boolean = true;
  @Input() additionalText: string;
  
  @Output() save = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  constructor(public translate: TranslateService) {}
} 