import { Component, computed, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NewsService, Article } from '../news.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.css',
})
export class NewsDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly newsService = inject(NewsService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);

  readonly article = signal<Article | undefined>(undefined);
  readonly loading = signal(true);
  readonly loadingRelated = signal(true);
  readonly showToast = signal(false);
  
  readonly userComments = signal<any[]>([]);
  readonly newCommentText = signal('');

  readonly related = signal<Article[]>([]);

  readonly comments = computed(() => {
    const a = this.article();
    if (!a) return [];
    const generated = this.generateComments(a.title, a.category, a.contentSnippet);
    return [...this.userComments(), ...generated];
  });

  private generateComments(title: string, category: string, snippet: string) {
    // Extract a short keyword from the title (first 3 meaningful words)
    const words = title.split(' ').filter(w => w.length > 3);
    const keyword = words.slice(0, 3).join(' ') || title.substring(0, 20);
    const shortTitle = title.length > 40 ? title.substring(0, 40) + '...' : title;

    // Pick 2–4 keywords from snippet for extra context
    const snippetWords = snippet.split(' ').filter(w => w.length > 4).slice(0, 5);
    const snippetHint = snippetWords.length > 0 ? snippetWords[0] : '';

    // Category-specific comment templates
    const commentPool: Record<string, Array<{ name: string; initial: string; color: string; texts: string[] }>> = {
      'Nasional': [
        { name: 'Budi Santoso', initial: 'B', color: '#2563eb', texts: [
          `Berita tentang "${keyword}" harus jadi perhatian pemerintah pusat. Semoga ada tindak lanjut yang nyata.`,
          `Situasi ini membuktikan betapa pentingnya koordinasi antar-lembaga. Harapan saya pemerintah segera bergerak.`,
        ]},
        { name: 'Sari W.', initial: 'S', color: '#7c3aed', texts: [
          `Saya sudah mengikuti perkembangan "${shortTitle}" dari awal. Semoga ada solusi permanen.`,
          `Warga di lapangan merasakan dampaknya langsung. Mohon pemerintah lebih tanggap.`,
        ]},
        { name: 'Arif R.', initial: 'A', color: '#0891b2', texts: [
          `Terima kasih liputan ini. Isu ${snippetHint || 'ini'} memang sudah lama tidak terekspos media.`,
        ]},
      ],
      'Internasional': [
        { name: 'Dian K.', initial: 'D', color: '#7c3aed', texts: [
          `Situasi "${keyword}" di luar negeri menarik untuk dipantau dampaknya ke Indonesia.`,
          `Dinamika global seperti ini selalu berdampak tidak langsung ke kita. Penting untuk melek informasi.`,
        ]},
        { name: 'Rizky F.', initial: 'R', color: '#0f766e', texts: [
          `Media internasional juga banyak yang meliput soal ${snippetHint || 'hal ini'}. Perspektif CNN Indonesia cukup objektif.`,
          `Semoga pemerintah Indonesia bijak merespons situasi "${keyword}" ini.`,
        ]},
        { name: 'Maya S.', initial: 'M', color: '#db2777', texts: [
          `Analisis yang tajam! Isu "${shortTitle}" memang perlu diperhatikan dari berbagai sudut pandang.`,
        ]},
      ],
      'Ekonomi': [
        { name: 'Hendra T.', initial: 'H', color: '#065f46', texts: [
          `Dampak "${keyword}" terhadap daya beli masyarakat perlu diantisipasi sejak dini.`,
          `Sebagai pelaku UMKM, isu ${snippetHint || 'ekonomi'} ini sangat terasa di lapangan.`,
        ]},
        { name: 'Lina P.', initial: 'L', color: '#d97706', texts: [
          `Kondisi "${keyword}" patut menjadi sinyal bagi investor untuk lebih berhati-hati.`,
          `Semoga kebijakan pemerintah bisa segera menstabilkan situasi ini.`,
        ]},
        { name: 'Fauzi M.', initial: 'F', color: '#2563eb', texts: [
          `Data yang disajikan dalam berita "${shortTitle}" cukup mengkhawatirkan. Perlu kebijakan konkret.`,
        ]},
      ],
      'Olahraga': [
        { name: 'Andi P.', initial: 'A', color: '#16a34a', texts: [
          `Mantap! Berita "${keyword}" bikin semangat makin membara. Ayo, kita dukung terus!`,
          `Luar biasa perkembangannya! ${snippetHint || 'Prestasi'} ini bukti kerja keras yang tidak sia-sia.`,
        ]},
        { name: 'Toni Y.', initial: 'T', color: '#ea580c', texts: [
          `Saya nonton langsung dan atmosfernya luar biasa! "${shortTitle}" benar-benar epic.`,
          `Bangga banget sama penampilan mereka. Semoga bisa terus konsisten!`,
        ]},
        { name: 'Citra N.', initial: 'C', color: '#db2777', texts: [
          `Keren! Soal "${keyword}" ini membuktikan Indonesia punya bakat-bakat luar biasa.`,
        ]},
      ],
      'Hiburan': [
        { name: 'Lisa M.', initial: 'L', color: '#ea580c', texts: [
          `Sudah nunggu lama update tentang "${keyword}" ini! Akhirnya ada kabar terbarunya.`,
          `Suka banget sama perkembangan "${shortTitle}". Ditunggu kelanjutannya!`,
        ]},
        { name: 'Vina S.', initial: 'V', color: '#db2777', texts: [
          `Konten ${snippetHint || 'hiburan'} seperti ini yang bikin hari jadi lebih seru. Keep it up!`,
          `Sudah share ke teman-teman, pada suka semua! Berita "${keyword}" emang viral banget.`,
        ]},
        { name: 'Raka D.', initial: 'R', color: '#7c3aed', texts: [
          `As expected! "${shortTitle}" memang tidak pernah mengecewakan.`,
        ]},
      ],
      'Teknologi': [
        { name: 'Kevin A.', initial: 'K', color: '#0f766e', texts: [
          `Inovasi "${keyword}" ini benar-benar game changer. Penasaran bagaimana implementasinya di Indonesia.`,
          `${snippetHint || 'Teknologi'} berkembang sangat cepat. Kita harus adaptif supaya tidak tertinggal.`,
        ]},
        { name: 'Nadia R.', initial: 'N', color: '#2563eb', texts: [
          `Sudah coba riset lebih lanjut tentang "${keyword}" dan hasilnya memang menarik. Thanks liputannya!`,
          `Semoga startup lokal juga bisa memanfaatkan tren ini dengan optimal.`,
        ]},
        { name: 'Doni C.', initial: 'D', color: '#0891b2', texts: [
          `Sebagai developer, berita "${shortTitle}" sangat relevan dengan keseharian saya. Good read!`,
        ]},
      ],
      'Gaya Hidup': [
        { name: 'Tari M.', initial: 'T', color: '#db2777', texts: [
          `Tips tentang "${keyword}" ini langsung saya coba terapkan. Terima kasih!`,
          `Konten ${snippetHint || 'gaya hidup'} seperti ini yang saya cari-cari. Sangat bermanfaat.`,
        ]},
        { name: 'Desi A.', initial: 'D', color: '#ea580c', texts: [
          `"${shortTitle}" — topik ini selalu relevan untuk semua kalangan usia.`,
        ]},
      ],
      'Otomotif': [
        { name: 'Bram S.', initial: 'B', color: '#d97706', texts: [
          `Info tentang "${keyword}" sangat berguna buat saya yang lagi mau beli kendaraan baru!`,
          `Spesifikasi dan harga yang dibahas di "${shortTitle}" memang worth it untuk perbandingan.`,
        ]},
        { name: 'Yudi P.', initial: 'Y', color: '#374151', texts: [
          `Komunitas otomotif Indonesia pasti heboh soal "${keyword}" ini. Sudah viral di grup!`,
        ]},
      ],
    };

    // Default/fallback pool
    const defaultPool = [
      { name: 'Rina H.', initial: 'R', color: '#1e88e5', texts: [
        `Berita "${shortTitle}" cukup informatif dan membuka wawasan. Terima kasih liputannya!`,
        `Isu "${keyword}" memang perlu mendapat perhatian lebih luas. Bagus diangkat oleh media.`,
      ]},
      { name: 'Bagas W.', initial: 'B', color: '#16a34a', texts: [
        `Sudah baca artikel "${shortTitle}" dan setuju dengan poin-poin yang disampaikan.`,
        `Semoga ada perkembangan positif ke depannya soal ${snippetHint || 'hal ini'}.`,
      ]},
      { name: 'Putri L.', initial: 'P', color: '#7c3aed', texts: [
        `Menarik! Langsung share ke grup keluarga. Penting untuk diketahui semua orang.`,
      ]},
    ];

    const pool = commentPool[category] ?? defaultPool;

    // Pick 2-3 commenters (deterministic based on title length so it's consistent)
    const seed = title.length % pool.length;
    const selected = [
      pool[seed % pool.length],
      pool[(seed + 1) % pool.length],
      pool[(seed + 2) % pool.length],
    ].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 3);

    const times = ['5 menit yang lalu', '23 menit yang lalu', '1 jam yang lalu', '2 jam yang lalu', '3 jam yang lalu'];

    return selected.map((commenter, i) => {
      const textIdx = (title.length + i) % commenter.texts.length;
      return {
        name: commenter.name,
        initial: commenter.initial,
        color: commenter.color,
        time: times[i % times.length],
        text: commenter.texts[textIdx],
      };
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.fetchArticle(id);
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  private fetchArticle(id: string): void {
    this.loading.set(true);
    this.loadingRelated.set(true);
    this.related.set([]);

    // Fetch all latest news first, find the current article, then populate related
    this.newsService.getLatestNews().subscribe({
      next: (list) => {
        // Try to find by exact ID match
        let found = list.find(x => x.id === id);

        // If not found by exact ID, try partial match (handles SSR/browser encoding diff)
        if (!found) {
          found = list.find(x => x.id.startsWith(id.substring(0, 10)) || id.startsWith(x.id.substring(0, 10)));
        }

        this.article.set(found);
        this.loading.set(false);

        // Always populate related news from the list (excluding current article if found)
        const others = found
          ? list.filter(x => x.id !== found!.id)
          : list;
        this.related.set(others.slice(0, 5));
        this.loadingRelated.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadingRelated.set(false);
      }
    });
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
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
    if (img.src.includes('data:image')) return;
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%239ca3af'%3EBerita Kini%3C/text%3E%3C/svg%3E";
  }

  copyLink(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.showToast.set(true);
      setTimeout(() => this.showToast.set(false), 2500);
    });
  }

  shareOn(platform: 'fb' | 'tw' | 'wa'): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.article()?.title || '');
    let shareUrl = '';

    if (platform === 'fb') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'tw') {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    } else if (platform === 'wa') {
      shareUrl = `https://wa.me/?text=${title}%20${url}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  }

  submitComment(): void {
    const text = this.newCommentText().trim();
    if (!text) return;

    const newComment = {
      name: 'Anda',
      initial: 'A',
      color: '#1e88e5',
      time: 'Baru saja',
      text: text
    };

    this.userComments.update(prev => [newComment, ...prev]);
    this.newCommentText.set('');
  }
}
