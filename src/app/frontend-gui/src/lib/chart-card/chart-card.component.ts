import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
  standalone: false,
})
export class ChartCardComponent {
  @Input() title = '';
  @Input() empty = false;
  @Input() emptyMessageKey = '';
}
