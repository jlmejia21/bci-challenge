import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Movie } from './movie.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly LOCAL_STORAGE_KEY = 'movies_cache';
  private readonly API_URL = environment.apiUrl;
  private readonly HEADERS = new HttpHeaders({
    'x-rapidapi-host': environment.apiHost,
    'x-rapidapi-key': environment.apiKey,
  });

  private readonly _http = inject(HttpClient);

  private moviesSignal = signal<Movie[] | null>(null);
  readonly movies = computed(() => this.moviesSignal() ?? []);

  loadMovies(): void {
    if (!this.moviesSignal()) {
      const cachedMovies = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (cachedMovies) {
        this.moviesSignal.set(JSON.parse(cachedMovies));
        return;
      }

      this._http
        .get<Movie[]>(this.API_URL, { headers: this.HEADERS })
        .subscribe({
          next: (response) => {
            this.moviesSignal.set(response);
            localStorage.setItem(
              this.LOCAL_STORAGE_KEY,
              JSON.stringify(response)
            );
          },
          error: (err) => {
            this.moviesSignal.set([]);
          },
        });
    }
  }

  addMovie(movie: Movie): void {
    this.moviesSignal.update((movies) => {
      const current = movies ?? [];
      return [...current, movie];
    });
  }

  updateMovie(id: string, changes: Partial<Movie>): void {
    this.moviesSignal.update((movies) => {
      const current = movies ?? [];
      return current.map((m) => (m.id === id ? { ...m, ...changes } : m));
    });
  }

  deleteMovie(id: string): void {
    this.moviesSignal.update((movies) => {
      const current = movies ?? [];
      return current.filter((m) => m.id !== id);
    });
  }
}
