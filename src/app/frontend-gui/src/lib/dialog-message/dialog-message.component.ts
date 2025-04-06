import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

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
   */
  constructor(private dialogRef: MatDialogRef<DialogMessageComponent>){ }

  ngOnInit() {
  }

  /**
   * Handles the accept action of the dialog.
   * Closes the dialog and returns an object with event type 'Accept'.
   */
  doAccept(){
    this.dialogRef.close({event:'Accept'});
  }

  /**
   * Handles the cancel/close action of the dialog.
   * Closes the dialog and returns an object with event type 'Cancel'.
   */
  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
