import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Dynamic routes cannot be prerendered without getPrerenderParams.
    // Use Server render mode so they are rendered on-demand at request time.
    path: 'berita/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'bantuan/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'kategori/:slug',
    renderMode: RenderMode.Server,
  },
  {
    // Static routes and the home page can be prerendered normally.
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
