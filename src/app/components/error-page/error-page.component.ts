import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
  @Input() error?: any;
  @Input() errorType: 'initialization' | 'general' = 'general';
  
  errorMessage = '';
  errorDetails = '';
  showDetails = false;
  loadedData = false;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    this.processError();
    this.loggerService.error('Error page displayed', {
      error: this.error,
      errorType: this.errorType
    });
  }

  private processError(): void {
    if (this.error) {
      if (typeof this.error === 'string') {
        this.errorMessage = this.error;
      } else if (this.error.message) {
        this.errorMessage = this.error.message;
      } else {
        // Use translation key - will be translated in template
        this.errorMessage = 'error.unknown';
      }

      // Create detailed error information for display
      const errorInfo = {
        message: this.errorMessage,
        source: this.error.source || 'unknown',
        timestamp: this.error.timestamp || new Date().toISOString(),
        originalError: this.error.originalError || this.error
      };

      this.errorDetails = JSON.stringify(errorInfo, null, 2);
    } else {
      // Use translation key - will be translated in template
      this.errorMessage = 'error.initialization';
    }
    
    // Mark as loaded after processing
    this.loadedData = true;
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  retry(): void {
    window.location.reload();
  }
} 