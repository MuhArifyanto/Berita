import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Article {
  id: string;
  title: string;
  link: string;
  contentSnippet: string;
  isoDate: string;
  image: {
    small: string;
    large: string;
  };
  // Compatibility fields for UI
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: number;
  tags: string[];
}

interface ApiResponse {
  messages: string;
  total: number;
  data: any[];
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly CACHE_KEY = 'berita_kini_cache_v2';
  private readonly CACHE_EXPIRY = 600000; // 10 minutes

  // Category to CNN News endpoint mapping
  private readonly categoryEndpointMap: Record<string, string> = {
    terbaru:        '',          // root → /api/cnn-news
    nasional:       'nasional',
    internasional:  'internasional',
    ekonomi:        'ekonomi',
    olahraga:       'olahraga',
    hiburan:        'hiburan',
    teknologi:      'teknologi',
    // Fallbacks for categories not in CNN API
    politik:        'nasional',
    kesehatan:      'gaya-hidup',
    otomotif:       'ekonomi',
    'gaya-hidup':   'gaya-hidup',
    'gaya hidup':   'gaya-hidup',
  };

  // CNN URL path segments → display labels
  private readonly urlCategoryMap: Record<string, string> = {
    'nasional':       'Nasional',
    'internasional':  'Internasional',
    'ekonomi':        'Ekonomi',
    'olahraga':       'Olahraga',
    'hiburan':        'Hiburan',
    'teknologi':      'Teknologi',
    'gaya-hidup':     'Gaya Hidup',
    'otomotif':       'Otomotif',
    'images':         'Foto',
    'video':          'Video',
  };

  getLatestNews(): Observable<Article[]> {
    return this.getNewsByCategory('terbaru');
  }

  getNewsByCategory(category: string): Observable<Article[]> {
    const normalizedCategory = category.toLowerCase().trim();
    const cacheKey = `${this.CACHE_KEY}_${category}`;
    const cached = this.getCache(cacheKey);
    if (cached) return of(cached);

    // For 'terbaru', always use the main endpoint
    if (normalizedCategory === 'terbaru') {
      return this.fetchFromApi('', 'terbaru');
    }

    const endpoint = this.categoryEndpointMap[normalizedCategory] ?? normalizedCategory;
    const url = `https://berita-indo-api-next.vercel.app/api/cnn-news/${endpoint}`;

    // Try the specific category endpoint first, on error fallback to terbaru + filter
    return this.http.get<ApiResponse>(url).pipe(
      map(res => {
        if (!res || !Array.isArray(res.data) || res.data.length === 0) {
          throw new Error('empty');
        }
        return this.mapArticles(res.data.slice(0, 20), normalizedCategory);
      }),
      tap(articles => this.setCache(articles, cacheKey)),
      catchError(() => this.getFilteredFromTerbaru(normalizedCategory, cacheKey))
    );
  }

  /** Fetch all terbaru and filter by the label matching the slug */
  private getFilteredFromTerbaru(slug: string, cacheKey: string): Observable<Article[]> {
    const label = this.getCategoryLabel(slug);
    return this.fetchFromApi('', 'terbaru').pipe(
      map(articles => {
        if (slug === 'terbaru') return articles;
        const filtered = articles.filter(a => a.category === label);
        return filtered.length > 0 ? filtered : articles; // if no match, show all
      }),
      tap(articles => this.setCache(articles, cacheKey))
    );
  }

  private fetchFromApi(endpoint: string, category: string): Observable<Article[]> {
    const cacheKey = `${this.CACHE_KEY}_${category}`;
    const cached = this.getCache(cacheKey);
    if (cached) return of(cached);

    const url = endpoint === ''
      ? 'https://berita-indo-api-next.vercel.app/api/cnn-news'
      : `https://berita-indo-api-next.vercel.app/api/cnn-news/${endpoint}`;

    return this.http.get<ApiResponse>(url).pipe(
      map(res => {
        if (!res || !Array.isArray(res.data)) return [];
        return this.mapArticles(res.data.slice(0, 20), category);
      }),
      tap(articles => this.setCache(articles, cacheKey)),
      catchError(err => {
        console.error(`Error fetching "${category}":`, err);
        return of([]);
      })
    );
  }


  searchNews(query: string): Observable<Article[]> {
    if (!query || query.trim().length < 2) return of([]);
    return this.getLatestNews().pipe(
      map(articles => articles.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.contentSnippet.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  getArticleById(id: string): Observable<Article | undefined> {
    const cached = this.getCache(`${this.CACHE_KEY}_terbaru`);
    if (cached) {
      return of(cached.find(a => a.id === id));
    }
    return this.getLatestNews().pipe(
      map(articles => articles.find(a => a.id === id))
    );
  }

  private mapArticles(data: any[], category: string = 'terbaru'): Article[] {
    const fallbackLabel = this.getCategoryLabel(category);
    return data
      .filter(item => item && item.title && item.link)
      .map(item => {
        // Auto-detect category from the article's own URL
        const detectedLabel = this.detectCategoryFromUrl(item.link) ?? fallbackLabel;
        return {
          id: this.makeId(item.link),
          title: item.title || '',
          link: item.link || '',
          contentSnippet: item.contentSnippet || '',
          isoDate: item.isoDate || new Date().toISOString(),
          image: item.image || { small: '', large: '' },
          // Compatibility fields
          excerpt: item.contentSnippet || '',
          category: detectedLabel,
          date: item.isoDate
            ? new Date(item.isoDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            : '',
          author: 'CNN Indonesia',
          readTime: item.contentSnippet
            ? Math.max(1, Math.ceil(item.contentSnippet.length / 200))
            : 2,
          tags: ['CNN', detectedLabel],
        };
      });
  }

  /** Detect category label by inspecting the CNN article URL path segments */
  private detectCategoryFromUrl(link: string): string | null {
    try {
      const url = new URL(link);
      const segments = url.pathname.split('/').filter(Boolean);
      // CNN URL pattern: /category/sub-category/article-slug
      for (const seg of segments) {
        if (this.urlCategoryMap[seg]) {
          return this.urlCategoryMap[seg];
        }
      }
    } catch {
      // ignore invalid URLs
    }
    return null;
  }

  /** Generate a short, URL-safe, consistent ID from a link string */
  private makeId(link: string): string {
    // Simple numeric hash → base36 string, always consistent across SSR and browser
    let hash = 0;
    for (let i = 0; i < link.length; i++) {
      const char = link.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32-bit integer
    }
    // Make it always positive and pad to fixed length
    const positive = (hash >>> 0).toString(36).padStart(7, '0');
    return positive;
  }

  private getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      terbaru: 'Terbaru',
      nasional: 'Nasional',
      internasional: 'Internasional',
      ekonomi: 'Ekonomi',
      olahraga: 'Olahraga',
      hiburan: 'Hiburan',
      teknologi: 'Teknologi',
      politik: 'Politik',
      kesehatan: 'Kesehatan',
      otomotif: 'Otomotif',
      'gaya-hidup': 'Gaya Hidup',
      'gaya hidup': 'Gaya Hidup',
    };
    return labels[category] ?? 'Terbaru';
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getCache(key: string): Article[] | null {
    if (!this.isBrowser()) return null;
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (Date.now() - parsed.timestamp > this.CACHE_EXPIRY) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.articles;
    } catch {
      return null;
    }
  }

  private setCache(articles: Article[], key: string): void {
    if (!this.isBrowser() || articles.length === 0) return;
    try {
      localStorage.setItem(key, JSON.stringify({
        timestamp: Date.now(),
        articles,
      }));
    } catch {
      // Ignore localStorage errors (e.g., storage full)
    }
  }
}
