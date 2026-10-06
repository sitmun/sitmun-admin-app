import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: false,
})
export class EmptyStateComponent {
  @Input() icon = 'info';
  @Input() titleKey = '';
  @Input() messageKey = '';
}
