import { Component, computed, inject, signal, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NewsService, Article } from '../news.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly newsService = inject(NewsService);

  readonly menuOpen = signal(false);
  readonly searchOpen = signal(false);
  readonly searchQuery = signal('');
  readonly scrolled = signal(false);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  readonly navItems = [
    { label: 'Terbaru', slug: 'terbaru' },
    { label: 'Nasional', slug: 'nasional' },
    { label: 'Internasional', slug: 'internasional' },
    { label: 'Ekonomi', slug: 'ekonomi' },
    { label: 'Olahraga', slug: 'olahraga' },
    { label: 'Hiburan', slug: 'hiburan' },
    { label: 'Teknologi', slug: 'teknologi' },
    { label: 'Gaya Hidup', slug: 'gaya-hidup' },
    { label: 'Otomotif', slug: 'otomotif' },
  ];

  readonly searchResults = signal<Article[]>([]);

  get currentPath(): string {
    return this.router.url;
  }

  isActive(slug: string): boolean {
    return this.currentPath.startsWith('/kategori/' + slug);
  }

  isHomeActive(): boolean {
    return this.currentPath === '/';
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  @HostListener('document:keydown.escape')
  onKeydownHandler(): void {
    if (this.searchOpen()) {
      this.closeSearch();
    }
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }
  
  closeMenu() {
    this.menuOpen.set(false);
  }

  openSearch() {
    this.searchOpen.set(true);
    setTimeout(() => this.searchInput?.nativeElement.focus(), 100);
  }

  closeSearch() {
    this.searchOpen.set(false);
    this.searchQuery.set('');
  }

  onSearchInput(ev: Event) {
    const q = (ev.target as HTMLInputElement).value;
    this.searchQuery.set(q);
    if (q.trim().length > 2) {
      this.newsService.searchNews(q).subscribe(res => this.searchResults.set(res));
    } else {
      this.searchResults.set([]);
    }
  }

  goToArticle(id: string) {
    this.closeSearch();
    this.closeMenu();
    this.router.navigate(['/berita', id]);
  }

  goToCategory(slug: string) {
    this.closeMenu();
    this.router.navigate(['/kategori', slug]);
  }

  goHome() {
    this.closeMenu();
    this.router.navigate(['/']);
  }

  getCategoryColor(category: string): string {
    const map: Record<string, string> = {
      Terbaru:        '#1e88e5',
      Nasional:       '#2563eb',
      Internasional:  '#7c3aed',
      Ekonomi:        '#065f46',
      Olahraga:       '#16a34a',
      Hiburan:        '#ea580c',
      'Gaya Hidup':   '#db2777',
      Kesehatan:      '#0891b2',
      Otomotif:       '#d97706',
      Teknologi:      '#0f766e',
      Politik:        '#dc2626',
      Foto:           '#6d28d9',
      Video:          '#9333ea',
    };
    return map[category] ?? '#1e88e5';
  }
}
