import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';

import {TranslateModule} from '@ngx-translate/core';

import {
  EntityFormAlert,
  RequiredFieldsEntityFormAlert,
} from '@app/utils/form-field-label.resolver';

@Component({
    selector: 'app-warnings-panel',
  standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatExpansionModule,
        MatDividerModule,
        MatBadgeModule,
        MatIconModule,
        TranslateModule,
    ],
    templateUrl: './warnings-panel.component.html',
    styleUrls: ['./warnings-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarningsPanelComponent {
  @Input() warnings: string[] | null = [];

  /** Typed alerts (required fields, backend warnings, plain info). Preferred over legacy `warnings`. */
  @Input() alerts: EntityFormAlert[] | null = null;

  @Input() titleKey = 'common.warnings.title';

  @Input() expanded = true;

  /** When false, shows a fixed banner (M3-style) instead of a collapsible expansion panel. */
  @Input() collapsible = true;

  /**
   * When true with {@link collapsible} false, renders banner content only (no inner mat-card).
   * Use when the parent already wraps content in mat-card / mat-card-content.
   */
  @Input() bare = false;

  /** Optional hint shown below the warning list (e.g. which tabs to open). */
  @Input() footerHintKey: string | null = null;

  /**
   * Compact banner: no title, no header icon, icon per message (no bullets), no footer hint.
   * Use on forms that already surface context (tab indicators, tab hints).
   */
  @Input() compact = false;

  /** Message keys rendered with an info icon instead of the default warning icon (legacy `warnings` mode). */
  @Input() infoMessageKeys: readonly string[] = [];

  get hasVisibleContent(): boolean {
    if (this.alerts?.length) {
      return true;
    }
    return !!(this.warnings && this.warnings.length > 0);
  }

  get requiredFieldsAlert(): RequiredFieldsEntityFormAlert | null {
    const found = this.alerts?.find(a => a.kind === 'requiredFields');
    return found?.kind === 'requiredFields' ? found : null;
  }

  get messageAlerts(): EntityFormAlert[] {
    return this.alerts?.filter(a => a.kind !== 'requiredFields') ?? [];
  }

  isInfoMessage(warning: string): boolean {
    return this.infoMessageKeys.includes(warning);
  }

  isInfoAlert(alert: EntityFormAlert): boolean {
    return alert.kind === 'infoKey' || alert.kind === 'plainInfo';
  }

  alertTrackBy(index: number, alert: EntityFormAlert): string {
    switch (alert.kind) {
      case 'requiredFields':
        return 'required';
      case 'warningKey':
      case 'infoKey':
        return alert.key;
      case 'plainInfo':
        return `plain:${alert.message}`;
      default:
        return String(index);
    }
  }
}
