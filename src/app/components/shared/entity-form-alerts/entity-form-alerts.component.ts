import {CommonModule} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {UntypedFormGroup} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';

import {TranslateService} from '@ngx-translate/core';
import {merge, Subscription} from 'rxjs';

import {WarningsPanelComponent} from '@app/components/shared/warnings-panel/warnings-panel.component';
import {
  EntityFormAlert,
  buildEntityFormAlerts,
  hasEntityFormAlerts,
} from '@app/utils/form-field-label.resolver';

@Component({
  selector: 'app-entity-form-alerts',
  standalone: true,
  imports: [CommonModule, MatCardModule, WarningsPanelComponent],
  templateUrl: './entity-form-alerts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityFormAlertsComponent implements OnChanges, OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly translateService = inject(TranslateService);

  @Input() form: UntypedFormGroup | null = null;

  @Input() entityLabelPrefix: string | undefined;

  @Input() fieldLabelKeys: Record<string, string> | undefined;

  @Input() warnings: string[] | null = null;

  @Input() infoMessageKeys: readonly string[] = [];

  @Input() customAlertMessage: string | null = null;

  @Input() footerHintKey: string | null = null;

  /** Blue info card when all visible alerts are informational. */
  @Input() infoStyle = false;

  alerts: EntityFormAlert[] = [];

  private formStatusSubscription?: Subscription;

  ngOnInit(): void {
    this.rebuildAlerts();
    this.subscribeToForm(this.form);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']) {
      this.subscribeToForm(changes['form'].currentValue);
    }
    if (
      changes['form'] ||
      changes['entityLabelPrefix'] ||
      changes['fieldLabelKeys'] ||
      changes['warnings'] ||
      changes['infoMessageKeys'] ||
      changes['customAlertMessage']
    ) {
    this.rebuildAlerts();
    this.cdr.markForCheck();
  }
  }

  get visible(): boolean {
    return hasEntityFormAlerts(this.alerts);
  }

  private subscribeToForm(form: UntypedFormGroup | null): void {
    this.formStatusSubscription?.unsubscribe();
    this.formStatusSubscription = undefined;
    if (!form) {
      return;
    }
    this.formStatusSubscription = merge(form.statusChanges, form.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.rebuildAlerts();
        this.cdr.markForCheck();
      });
  }

  private rebuildAlerts(): void {
    this.alerts = buildEntityFormAlerts({
      form: this.form,
      entityLabelPrefix: this.entityLabelPrefix,
      fieldLabelKeys: this.fieldLabelKeys,
      translateService: this.translateService,
      warnings: this.warnings,
      infoMessageKeys: this.infoMessageKeys,
      customAlertMessage: this.customAlertMessage,
    });
    this.cdr.markForCheck();
  }
}
