import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

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
  styles: []
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
   */
  constructor(
    private dialogRef: MatDialogRef<DialogMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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

}
