import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GridComponent } from '@components/grid/grid.component';
import { Column } from '../movie.interfaces';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-list',
  imports: [GridComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  private readonly _movieService = inject(MovieService);

  displayedColumns: Column[] = [
    { key: 'id', label: 'ID' },
    { key: 'originalTitle', label: 'Título' },
    { key: 'releaseDate', label: 'Fecha de lanzamiento' },
    { key: 'primaryImage', label: 'Imagen' },
    { key: 'action', label: 'Acciones' },
  ];
  data = this._movieService.movies;
  sortables = ['id', 'originalTitle', 'releaseDate'];

  constructor() {
    this._movieService.loadMovies();
  }
}
