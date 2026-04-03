import {
  Component,
  computed,
  signal,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { NewsService, Article } from '../news.service';
import { NavbarComponent } from '../navbar/navbar';
import { finalize } from 'rxjs';

export interface HeroSlide extends Article {
  label: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly newsService = inject(NewsService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly year = new Date().getFullYear();

  // Signals for state management
  readonly articles = signal<Article[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly breakingNews: string[] = [
    '🔴 LIVE: Timnas Indonesia lolos ke babak 3 Kualifikasi Piala Dunia 2026',
    '⚡ BMKG: Waspada cuaca ekstrem di Jabodetabek hari ini',
    '📈 Saham BREN naik 12% di tengah sentimen positif pasar modal',
    '🗳️ KPU umumkan jadwal resmi Pilkada serentak 2025',
    '✈️ Garuda Indonesia buka rute baru Jakarta-Osaka mulai Mei 2024',
  ];

  readonly heroSlides = computed<HeroSlide[]>(() => 
    this.articles().slice(0, 3).map((a) => ({
      ...a,
      label: 'Headline',
    }))
  );

  readonly popularNews = computed(() => this.articles().slice(3, 6));
  readonly recommendations = computed(() => this.articles());

  readonly footerExplore = [
    { label: 'Beranda', link: '/' },
    { label: 'Kesehatan', link: '/kategori/kesehatan' },
    { label: 'Otomotif', link: '/kategori/otomotif' },
    { label: 'Politik', link: '/kategori/politik' },
    { label: 'Olahraga', link: '/kategori/olahraga' },
    { label: 'Nasional', link: '/kategori/nasional' },
    { label: 'Internasional', link: '/kategori/internasional' },
  ];

  readonly footerHelp = [
    { label: 'Kontak Kami', link: '/bantuan/kontak' },
    { label: 'Laporan Pembajakan', link: '/bantuan/laporan' },
    { label: 'Kebijakan', link: '/bantuan/kebijakan' }
  ];

  readonly heroIndex = signal(0);
  readonly heroAnimating = signal(false);
  readonly searchQuery = signal('');
  readonly recPage = signal(1);
  readonly pageSize = 8;

  private autoPlayTimer: any = null;

  readonly currentHero = computed(() => this.heroSlides()[this.heroIndex()]);

  readonly filteredRecommendations = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const list = this.recommendations();
    if (!q) return list;
    return list.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q),
    );
  });

  readonly totalRecPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredRecommendations().length / this.pageSize)),
  );

  readonly pagedRecommendations = computed(() => {
    const list = this.filteredRecommendations();
    const page = this.recPage();
    const start = (page - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });

  readonly recPageNumbers = computed(() =>
    Array.from({ length: this.totalRecPages() }, (_, i) => i + 1),
  );

  ngOnInit(): void {
    this.fetchNews();
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  private fetchNews(): void {
    this.loading.set(true);
    this.error.set(null);

    this.newsService.getLatestNews().pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.error.set('Gagal memuat berita. Silakan coba lagi nanti.');
        } else {
          this.articles.set(data);
        }
      },
      error: (err) => {
        this.error.set('Terjadi kesalahan saat memuat data berita.');
        console.error(err);
      }
    });
  }

  private startAutoPlay(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.stopAutoPlay();
      this.autoPlayTimer = setInterval(() => {
        this.nextHero();
      }, 5000);
    }
  }

  private stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  private changeHero(index: number): void {
    if (this.heroAnimating()) return;
    this.heroAnimating.set(true);
    setTimeout(() => {
      this.heroIndex.set(index);
      setTimeout(() => this.heroAnimating.set(false), 50);
    }, 280);
  }

  prevHero(): void {
    const slides = this.heroSlides();
    if (slides.length === 0) return;
    const i = this.heroIndex();
    const next = i === 0 ? slides.length - 1 : i - 1;
    this.changeHero(next);
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  nextHero(): void {
    const slides = this.heroSlides();
    if (slides.length === 0) return;
    const i = this.heroIndex();
    const next = i === slides.length - 1 ? 0 : i + 1;
    this.changeHero(next);
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  goHero(i: number): void {
    if (i === this.heroIndex()) return;
    this.changeHero(i);
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  pauseAutoPlay(): void {
    this.stopAutoPlay();
  }

  resumeAutoPlay(): void {
    this.startAutoPlay();
  }

  onSearchEvent(ev: Event): void {
    const el = ev.target as HTMLInputElement;
    this.onSearchInput(el.value);
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.recPage.set(1);
  }

  setRecPage(p: number): void {
    const max = this.totalRecPages();
    if (p >= 1 && p <= max) this.recPage.set(p);
  }

  navigateToArticle(id: string): void {
    this.router.navigate(['/berita', id]);
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

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src.includes('data:image')) return; // prevent infinite loop
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%239ca3af'%3EBerita Kini%3C/text%3E%3C/svg%3E";
  }
}
