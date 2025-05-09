import { Movie } from '@/features/movies/movie.interfaces';
import { MovieService } from '@/features/movies/movie.service';
import { MOVIES_CONSTANTS } from '@/shared/constants';
import { SnackBarService } from '@/shared/snack-bar.service';
import { generateImdbLikeId } from '@/shared/utils';
import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  MatFormField,
  MatInput,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatInput,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    NgIf,
  ],
  providers: [provideNativeDateAdapter(), DatePipe],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  movieForm!: FormGroup;

  private readonly _fb = inject(FormBuilder);
  private readonly _matDialog = inject(MAT_DIALOG_DATA);
  private readonly _movieService = inject(MovieService);
  private readonly _modalService = inject(ModalService);
  private readonly _snackBar = inject(SnackBarService);
  private readonly _datePipe = inject(DatePipe);

  title = this._matDialog.title;

  ngOnInit(): void {
    this._buildForm();
    this.loadData(this._matDialog.data);
  }

  private _buildForm(): void {
    this.movieForm = this._fb.nonNullable.group({
      originalTitle: ['', Validators.required],
      releaseDate: ['', Validators.required],
    });
  }

  loadData(data: Movie): void {
    if (data) {
      const [year, month, day] = data.releaseDate.split('-').map(Number);
      this.movieForm.patchValue({
        originalTitle: data.originalTitle,
        releaseDate: new Date(year, month - 1, day),
      });
    }
  }

  onSubmit() {
    let message = MOVIES_CONSTANTS.MESSAGES.MOVIE_UPDATED;

    let movie = this.movieForm.value;
    const date: Date = movie.releaseDate;
    const formatted = this._datePipe.transform(date, 'yyyy-MM-dd');
    if (this._matDialog.data) {
      movie = {
        ...movie,
        releaseDate: formatted,
      };

      this._movieService.updateMovie(this._matDialog.data.id, movie);
    } else {
      movie = {
        ...movie,
        releaseDate: formatted,
        primaryImage:
          'https://cdn.pixabay.com/photo/2019/04/24/21/55/cinema-4153289_960_720.jpg',
        id: generateImdbLikeId(),
      };
      this._movieService.addMovie(movie);
      message = MOVIES_CONSTANTS.MESSAGES.MOVIE_ADDED;
    }
    this._snackBar.showSnackBar(message);
    this._modalService.closeModal();
  }
}
