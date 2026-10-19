import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ChartCardComponent {
  @Input() title = '';
  @Input() empty = false;
  @Input() emptyMessageKey = '';
}
