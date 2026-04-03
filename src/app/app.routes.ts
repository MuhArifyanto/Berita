import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'berita/:id',
    loadComponent: () =>
      import('./news-detail/news-detail').then((m) => m.NewsDetailComponent),
  },
  {
    path: 'kategori/:slug',
    loadComponent: () =>
      import('./category/category').then((m) => m.CategoryComponent),
  },
  {
    path: 'bantuan/:id',
    loadComponent: () =>
      import('./help/help').then((m) => m.HelpComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
