import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

import { MatCardModule } from '@angular/material/card';
import { ModalComponent } from './components/modal/modal.component';
import { ModalService } from './components/modal/modal.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarComponent, MatCardModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly _modalSvc = inject(ModalService);

  onClickNewMovie(): void {
    this._modalSvc.openDialog(ModalComponent);
  }
}
