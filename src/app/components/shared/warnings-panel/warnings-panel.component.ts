import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatBadgeModule} from '@angular/material/badge';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-warnings-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatDividerModule,
    MatBadgeModule,
    TranslateModule,
  ],
  templateUrl: './warnings-panel.component.html',
  styleUrls: ['./warnings-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarningsPanelComponent {
  @Input() warnings: string[] | null = [];

  @Input() titleKey = 'common.warnings.title';

  @Input() expanded = true;
}


