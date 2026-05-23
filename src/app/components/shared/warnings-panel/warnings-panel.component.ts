import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';

import {TranslateModule} from '@ngx-translate/core';

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

  /** Message keys rendered with an info icon instead of the default warning icon. */
  @Input() infoMessageKeys: readonly string[] = [];

  isInfoMessage(warning: string): boolean {
    return this.infoMessageKeys.includes(warning);
  }
}


