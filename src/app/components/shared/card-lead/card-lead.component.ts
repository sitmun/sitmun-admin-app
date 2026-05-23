import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {TranslateModule} from '@ngx-translate/core';

/**
 * Explanatory lead paragraph for a relation-table card header.
 * Shows one or two lines (Viewer and/or Proxy) above an `app-data-grid`.
 *
 * When only `viewerKey` is supplied the line is rendered inline (row).
 * When both `viewerKey` and `proxyKey` are supplied the lines stack (column).
 * Body text is rendered via `[innerHTML]` so i18n values may contain safe HTML
 * (`<em>`, `<code>`, `<strong>`).
 */
@Component({
  selector: 'app-card-lead',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './card-lead.component.html',
  styleUrls: ['./card-lead.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardLeadComponent {
  /** Translation key for the Viewer explanation line. */
  @Input() viewerKey: string | null = null;

  /** Translation key for the Proxy explanation line. */
  @Input() proxyKey: string | null = null;

  /** Override the "Viewer:" prefix key. */
  @Input() viewerPrefixKey = 'common.card.lead.viewerPrefix';

  /** Override the "Proxy:" prefix key. */
  @Input() proxyPrefixKey = 'common.card.lead.proxyPrefix';

  get stacked(): boolean {
    return this.viewerKey != null && this.proxyKey != null;
  }
}
