import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly _dialog = inject(MatDialog);

  openDialog<T>(
    component: any,
    title: string,
    data?: T,
    isEditing = false
  ): Observable<any> {
    const config = { title, data, isEditing };

    const dialogRef = this._dialog.open(component, {
      width: '600px',
      data: config,
    });

    return dialogRef.afterClosed();
  }

  closeModal(): void {
    this._dialog.closeAll();
  }
}
