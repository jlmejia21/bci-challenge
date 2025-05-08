import { Component, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-snackbar',
  template: `
    <div class="confirm-snackbar">
      <span>{{ data.message }}</span>
      <div class="actions">
        <button mat-button color="primary" (click)="confirm()">Sí</button>
        <button mat-button (click)="dismiss()">No</button>
      </div>
    </div>
  `,
  styles: [
    `
      .confirm-snackbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
      .actions {
        display: flex;
        gap: 8px;
      }
    `,
  ],
})
export class ConfirmSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string },
    private snackbarRef: MatSnackBarRef<ConfirmSnackbarComponent>
  ) {}

  confirm() {
    this.snackbarRef.dismissWithAction();
  }

  dismiss() {
    this.snackbarRef.dismiss();
  }
}
