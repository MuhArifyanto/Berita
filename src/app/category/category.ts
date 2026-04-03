import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewsService, Article } from '../news.service';
import { NavbarComponent } from '../navbar/navbar';

interface NavItem {
  label: string;
  slug: string;
  category: string | null; // null = semua (terbaru)
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Terbaru',       slug: 'terbaru',       category: null },
  { label: 'Nasional',      slug: 'nasional',      category: 'Nasional' },
  { label: 'Internasional', slug: 'internasional', category: 'Internasional' },
  { label: 'Ekonomi',       slug: 'ekonomi',       category: 'Ekonomi' },
  { label: 'Olahraga',      slug: 'olahraga',      category: 'Olahraga' },
  { label: 'Hiburan',       slug: 'hiburan',       category: 'Hiburan' },
  { label: 'Teknologi',     slug: 'teknologi',     category: 'Teknologi' },
  { label: 'Gaya Hidup',    slug: 'gaya-hidup',    category: 'Gaya Hidup' },
  { label: 'Otomotif',      slug: 'otomotif',      category: 'Otomotif' },
  { label: 'Politik',       slug: 'politik',       category: 'Politik' },
  { label: 'Kesehatan',     slug: 'kesehatan',     category: 'Kesehatan' },
];

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class CategoryComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly newsService = inject(NewsService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentSlug = signal('terbaru');
  readonly searchQuery = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = 9;

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly year = new Date().getFullYear();

  readonly navItems = NAV_ITEMS;

  readonly navLinks = [
    { label: 'Beranda', href: '/' },
    ...NAV_ITEMS.map((n) => ({ label: n.label, href: `/kategori/${n.slug}` })),
  ];

  readonly currentNav = computed(() =>
    NAV_ITEMS.find((n) => n.slug === this.currentSlug()) ?? NAV_ITEMS[0],
  );

  readonly allArticles = signal<Article[]>([]); // To be populated via API later


  readonly filtered = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const articles = this.allArticles();
    if (!q) return articles;
    return articles.filter(
      (a) => a.title.toLowerCase().includes(q) || a.contentSnippet.toLowerCase().includes(q),
    );
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / this.pageSize)),
  );

  readonly paged = computed(() => {
    const list = this.filtered();
    const start = (this.currentPage() - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? 'terbaru';
      this.currentSlug.set(slug);
      this.currentPage.set(1);
      this.searchQuery.set('');
      this.fetchNews(slug);
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  fetchNews(slug: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.newsService.getNewsByCategory(slug).subscribe({
      next: (data) => {
        this.allArticles.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Gagal memuat berita kategori ini.');
        this.loading.set(false);
      }
    });
  }

  onSearch(ev: Event): void {
    this.searchQuery.set((ev.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  setPage(p: number): void {
    if (p >= 1 && p <= this.totalPages()) {
      this.currentPage.set(p);
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 140, behavior: 'smooth' });
      }
    }
  }

  navigateToArticle(id: string): void {
    this.router.navigate(['/berita', id]);
  }

  navigateToCategory(slug: string): void {
    this.router.navigate(['/kategori', slug]);
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

  getCategoryEmoji(slug: string): string {
    const map: Record<string, string> = {
      terbaru:       '🔥',
      nasional:      '🇮🇩',
      internasional: '🌍',
      ekonomi:       '📈',
      olahraga:      '⚽',
      hiburan:       '🎬',
      teknologi:     '💻',
      'gaya-hidup':  '✨',
      otomotif:      '🚗',
      politik:       '🏛️',
      kesehatan:     '🏥',
    };
    return map[slug] ?? '📰';
  }
}
