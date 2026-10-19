import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class KpiCardComponent {
  @Input() icon = 'info';
  @Input() title = '';
  @Input() value: string | number | null = null;
  @Input() tooltip = '';
  @Input() link: string | any[] | null = null;
}
