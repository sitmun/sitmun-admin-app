import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  standalone: false,
})
export class KpiCardComponent {
  @Input() icon = 'info';
  @Input() title = '';
  @Input() value: string | number | null = null;
  @Input() tooltip = '';
  @Input() link: string | any[] | null = null;
}
