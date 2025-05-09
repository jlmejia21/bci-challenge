import { Column } from '@/features/movies/movie.interfaces';
import { MovieService } from '@/features/movies/movie.service';
import { ConfirmSnackbarComponent } from '@/shared/confirm-snack.component';
import { MOVIES_CONSTANTS } from '@/shared/constants';
import { SnackBarService } from '@/shared/snack-bar.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ModalComponent } from '../modal/modal.component';
import { ModalService } from '../modal/modal.service';
import { FilterComponent } from './components/filter/filter.component';
@Component({
  selector: 'app-grid',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FilterComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent<T> implements OnInit {
  displayedColumns = input.required<Column[]>();
  headersColumns = computed(() =>
    this.displayedColumns().map((column) => column.key)
  );

  data = input.required<T[]>();
  sortableColumns = input<string[]>([]);

  dataSource = new MatTableDataSource<T>();
  filter = signal('');

  @ViewChild('scrollableWrapper') scrollableWrapper!: ElementRef;

  private readonly _sort = viewChild.required<MatSort>(MatSort);
  private readonly _paginator = viewChild.required<MatPaginator>(MatPaginator);
  private readonly _movieService = inject(MovieService);
  private readonly _modalService = inject(ModalService);
  private readonly _snackBarService = inject(SnackBarService);
  private readonly _matSnackBar = inject(MatSnackBar);

  constructor() {
    effect(
      () => {
        if (this.filter()) {
          this.dataSource.filter = this.filter();
        } else {
          this.dataSource.filter = '';
        }
        // update the data source
        this.dataSource.data = this.data();
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.dataSource.data = this.data();
    this.dataSource.sort = this._sort();
    this.dataSource.paginator = this._paginator();
  }

  editMovie(data: T): void {
    this._modalService.openDialog(
      ModalComponent,
      'Editar película',
      data,
      true
    );
  }

  deleteMovie(id: string): void {
    const snackBarRef = this._matSnackBar.openFromComponent(
      ConfirmSnackbarComponent,
      {
        data: { message: '¿Estás seguro de eliminar este ítem?' },
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this._movieService.deleteMovie(id);
      this._snackBarService.showSnackBar(
        MOVIES_CONSTANTS.MESSAGES.MOVIE_DELETED
      );
    });
  }

  scrollTable(direction: 'left' | 'right') {
    const container = this.scrollableWrapper.nativeElement as HTMLElement;
    const scrollAmount = 250;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }
}
