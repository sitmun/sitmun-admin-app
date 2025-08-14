import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

export interface NotificationData {
  title: string;

  message: string;

  type: 'success' | 'error' | 'info' | 'warning';

  duration?: number;

  showAction?: boolean;

  actionText?: string;
}

@Component({
  selector: 'app-notification',
  template: `
    <div class="notification-content mat-elevation-z6">
      <div class="notification-icon">
        <mat-icon>{{ getIcon() }}</mat-icon>
      </div>
      <div class="notification-text">
        <div class="notification-title">{{ data.title }}</div>
        <div class="notification-message" *ngIf="data.message">{{ data.message }}</div>
      </div>
      <div class="notification-action" *ngIf="data.showAction">
        <button mat-button color="warn" (click)="close()">
          {{ data.actionText || 'common.button.close' | translate }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: NotificationData,
    private snackBarRef: MatSnackBarRef<NotificationComponent>
  ) {
  }

  getIcon(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  }

  close(): void {
    this.snackBarRef.dismiss();
  }
}
