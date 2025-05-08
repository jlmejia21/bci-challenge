import { Column } from '@/features/movies/movie.interfaces';
import { MovieService } from '@/features/movies/movie.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FilterComponent } from './filter/filter.component';
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
  private readonly _sort = viewChild.required<MatSort>(MatSort);
  private readonly _paginator = viewChild.required<MatPaginator>(MatPaginator);
  private readonly _movieService = inject(MovieService);

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

  deleteMovie(id: string): void {
    this._movieService.deleteMovie(id);
  }
}
