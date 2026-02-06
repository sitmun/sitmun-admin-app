import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { firstValueFrom } from 'rxjs';

import { ConfigurationParameter } from '@app/domain';
import { ConfigurationParametersService } from '@app/domain/configuration/services/configuration-parameters.service';

@Component({
    selector: 'app-configuration-parameters-dialog',
    templateUrl: './configuration-parameters-dialog.component.html',
    styleUrls: ['./configuration-parameters-dialog.component.scss'],
    standalone: false
})
export class ConfigurationParametersDialogComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'value'];
  dataSource: ConfigurationParameter[] = [];
  isLoading = false;
  error: string | null = null;

  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly showDelayMs = 150;
  private readonly minDisplayMs = 400;

  constructor(
    public dialogRef: MatDialogRef<ConfigurationParametersDialogComponent>,
    private configurationParametersService: ConfigurationParametersService
  ) {}

  ngOnInit(): void {
    this.loadConfigurationParameters();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private clearTimers(): void {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  async loadConfigurationParameters(): Promise<void> {
    const startTime = Date.now();
    let wasShown = false;

    this.clearTimers();
    this.error = null;

    // Schedule showing loading indicator after delay
    this.showTimer = setTimeout(() => {
      this.showTimer = null;
      this.isLoading = true;
      wasShown = true;
    }, this.showDelayMs);

    try {
      const configParams = await firstValueFrom(this.configurationParametersService.getAll());
      const elapsed = Date.now() - startTime;

      this.clearTimers();

      if (wasShown) {
        // If loading was shown, ensure minimum display time
        const remainingTime = this.minDisplayMs - (elapsed - this.showDelayMs);
        if (remainingTime > 0) {
          await new Promise<void>((resolve) => {
            this.hideTimer = setTimeout(() => {
              this.hideTimer = null;
              this.isLoading = false;
              this.dataSource = configParams || [];
              resolve();
            }, remainingTime);
          });
        } else {
          this.isLoading = false;
          this.dataSource = configParams || [];
        }
      } else {
        // Operation completed before delay, never show loading
        this.isLoading = false;
        this.dataSource = configParams || [];
      }
    } catch (error) {
      this.clearTimers();
      this.isLoading = false;
      this.error = 'Failed to load configuration parameters';
      console.error('Error loading configuration parameters:', error);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}

