import {Component, Input} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';

import {ServiceAccessHour} from '@app/domain';

import {accessHourTooltip, accessTrendSlots, bucketStart, hourColor, hourMinute} from './service-access-trend';

const TICK_INDEXES = [0, 36, 72, 108, 143];

@Component({
  selector: 'app-service-access-timeline',
  templateUrl: './service-access-timeline.component.html',
  styleUrls: ['./service-access-timeline.component.scss'],
  standalone: false,
})
export class ServiceAccessTimelineComponent {
  @Input() hours: Array<ServiceAccessHour | null> | null = null;

  constructor(private translate: TranslateService) {}

  get slots(): Array<ServiceAccessHour | null> {
    return accessTrendSlots(this.hours, 'tenMinute');
  }

  color(hour: ServiceAccessHour | null): string {
    return hourColor(hour);
  }

  title(index: number): string {
    return accessHourTooltip(
      this.slots[index],
      index,
      (key) => this.translate.instant(key),
      new Date(),
      undefined,
      'tenMinute',
    );
  }

  trackHour(index: number): number {
    return index;
  }

  get tickLabels(): string[] {
    const now = new Date();
    return TICK_INDEXES.map((index, position) => this.tickLabel(index, now, position === TICK_INDEXES.length - 1));
  }

  private tickLabel(index: number, now: Date, last: boolean): string {
    if (last) {
      return this.translate.instant('entity.service.access.now');
    }
    const start = bucketStart(index, now, 'tenMinute');
    const time = hourMinute(start);
    if (isLocalDayBefore(start, now)) {
      return this.translate.instant('entity.service.access.yesterday', {time});
    }
    return time;
  }
}

function isLocalDayBefore(instant: Date, now: Date): boolean {
  const instantDay = new Date(instant.getFullYear(), instant.getMonth(), instant.getDate()).getTime();
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return instantDay < nowDay;
}
