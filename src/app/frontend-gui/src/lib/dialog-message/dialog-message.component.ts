import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {TranslateService} from '@ngx-translate/core';

/**
 * Dialog event constants for consistent usage across the application.
 */
export const DIALOG_EVENTS = {
  ACCEPT: 'Accept',
  CANCEL: 'Cancel'
} as const;

/**
 * A reusable dialog component for displaying messages with accept/cancel actions.
 * This component can be used to show confirmation dialogs, alerts, or any message that requires user interaction.
 */
@Component({
    selector: 'app-dialog-message',
    templateUrl: './dialog-message.component.html',
    styles: [],
    standalone: false
})
export class DialogMessageComponent implements OnInit {

  /** The title text to be displayed in the dialog header */
  title: string;

  /** The main message content to be displayed in the dialog body */
  message: string;

  /** Controls the visibility of the cancel button. When true, the cancel button will be hidden */
  hideCancelButton = false;

  /**
   * Creates an instance of DialogMessageComponent.
   * @param dialogRef - Reference to the dialog opened via the Material Dialog service
   * @param data - Data passed to the dialog containing title and message
   * @param translateService
   */
  constructor(
    private dialogRef: MatDialogRef<DialogMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    // Set the title and message from the injected data
    if (this.data) {
      this.title = this.data.title || '';
      this.message = this.data.message || '';
      this.hideCancelButton = this.data.hideCancelButton || false;
    }
  }

  /**
   * Handles the accept action of the dialog.
   * Closes the dialog and returns an object with event type 'Accept'.
   */
  doAccept(){
    this.dialogRef.close({event: DIALOG_EVENTS.ACCEPT});
  }

  /**
   * Handles the cancel/close action of the dialog.
   * Closes the dialog and returns an object with event type 'Cancel'.
   */
  closeDialog(){
    this.dialogRef.close({event: DIALOG_EVENTS.CANCEL});
  }

  /**
   * Formats the message to preserve line breaks for HTML display
   * Translates the message if it's a translation key, otherwise uses it as-is
   */
  getFormattedMessage(): string {
    if (!this.message) {
      return '';
    }

    // Only treat as translation key if it looks like one (contains a dot); otherwise use as-is to avoid recording plain text as missing
    let translatedMessage: string;
    if (this.message.includes('.')) {
      try {
        translatedMessage = this.translateService.instant(this.message);
        if (translatedMessage === this.message) {
          translatedMessage = this.message;
        }
      } catch {
        translatedMessage = this.message;
      }
    } else {
      translatedMessage = this.message;
    }

    // Escape HTML to prevent XSS, then replace newlines with <br> tags
    const escaped = translatedMessage
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    // Replace newlines with <br> tags for HTML display
    return escaped.replace(/\n/g, '<br>');
  }

}
