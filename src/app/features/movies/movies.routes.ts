import { Routes } from '@angular/router';

const moviesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/list.component').then((m) => m.ListComponent),
  },
];
export default moviesRoutes;
