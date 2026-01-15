import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ErrorTrackingService, ErrorEntry } from '@app/services/error-tracking.service';
import { SidebarManagerService } from '@app/services/sidebar-manager.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-details-sidebar',
  templateUrl: './error-details-sidebar.component.html',
  styleUrls: ['./error-details-sidebar.component.scss']
})
export class ErrorDetailsSidebarComponent implements OnInit, OnDestroy {
  errors: ErrorEntry[] = [];
  private errorsSubscription?: Subscription;
  private sidebarSubscription?: Subscription;

  constructor(
    private errorTrackingService: ErrorTrackingService,
    private translateService: TranslateService,
    private sidebarManager: SidebarManagerService
  ) {}

  ngOnInit(): void {
    // Subscribe to sidebar manager to initialize when sidebar becomes active
    this.sidebarSubscription = this.sidebarManager.activeSidebar$.subscribe(active => {
      if (active === 'error') {
        // Initialize if not already initialized
        if (!this.errorsSubscription) {
          this.initializeSidebar();
        } else {
          // Already initialized, just refresh errors
          this.errors = this.errorTrackingService.getErrors();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.errorsSubscription?.unsubscribe();
    this.sidebarSubscription?.unsubscribe();
  }

  /**
   * Initialize the sidebar when it's first opened
   */
  private initializeSidebar(): void {
    if (this.errorsSubscription) {
      // Already initialized, but refresh errors in case new ones were added
      this.errors = this.errorTrackingService.getErrors();
      return;
    }

    // Subscribe to errors
    this.errorsSubscription = this.errorTrackingService.errors$.subscribe(errors => {
      this.errors = [...errors]; // Create new array reference to trigger change detection
    });

    // Load initial errors
    this.errors = this.errorTrackingService.getErrors();
  }

  /**
   * Open the sidebar
   */
  open(): void {
    this.sidebarManager.openSidebar('error');
  }

  /**
   * Close the sidebar
   */
  close(): void {
    this.sidebarManager.closeSidebar();
  }

  /**
   * Check if sidebar is open
   */
  isOpen(): boolean {
    return this.sidebarManager.getActiveSidebar() === 'error';
  }

  /**
   * Handle ESC key to close sidebar
   */
  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (this.isOpen()) {
      this.close();
    }
  }


  /**
   * Clear all errors
   */
  clearAll(): void {
    this.errorTrackingService.clearErrors();
  }

  /**
   * Copy error details to clipboard
   */
  copyError(error: ErrorEntry): void {
    const errorText = this.formatErrorForCopy(error);
    navigator.clipboard.writeText(errorText).then(() => {
      // Could show a snackbar here
    }).catch(err => {
      console.error('Failed to copy error:', err);
    });
  }

  /**
   * Format error for copying
   */
  private formatErrorForCopy(error: ErrorEntry): string {
    let text = `Error Type: ${error.type}\n`;
    text += `Timestamp: ${error.timestamp.toISOString()}\n`;
    text += `Message: ${error.message}\n`;
    
    if (error.httpStatus) {
      text += `HTTP Status: ${error.httpStatus}\n`;
    }
    
    if (error.url) {
      text += `URL: ${error.url}\n`;
    }
    
    if (error.stackTrace) {
      text += `\nStack Trace:\n${error.stackTrace}\n`;
    }
    
    if (error.details) {
      text += `\nDetails:\n${JSON.stringify(error.details, null, 2)}\n`;
    }
    
    return text;
  }

  /**
   * Get error type badge label
   */
  getErrorTypeLabel(type: string): string {
    const key = `systemInfo.errorType.${type}`;
    const translated = this.translateService.instant(key);
    return translated !== key ? translated : type;
  }

  /**
   * Format timestamp as relative time
   */
  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  }

  /**
   * Format full timestamp
   */
  getFullTimestamp(timestamp: Date): string {
    return timestamp.toLocaleString();
  }
}

