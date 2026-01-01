import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfigurationParametersService } from '@app/domain/configuration/services/configuration-parameters.service';
import { ConfigurationParameter } from '@app/domain';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-configuration-parameters-dialog',
  templateUrl: './configuration-parameters-dialog.component.html',
  styleUrls: ['./configuration-parameters-dialog.component.scss']
})
export class ConfigurationParametersDialogComponent implements OnInit {
  displayedColumns: string[] = ['name', 'value'];
  dataSource: ConfigurationParameter[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ConfigurationParametersDialogComponent>,
    private configurationParametersService: ConfigurationParametersService
  ) {}

  ngOnInit(): void {
    this.loadConfigurationParameters();
  }

  async loadConfigurationParameters(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      const configParams = await firstValueFrom(this.configurationParametersService.getAll());
      this.dataSource = configParams || [];
    } catch (error) {
      this.error = 'Failed to load configuration parameters';
      console.error('Error loading configuration parameters:', error);
    } finally {
      this.isLoading = false;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}

