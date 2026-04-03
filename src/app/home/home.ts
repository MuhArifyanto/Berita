import { Component, computed, signal } from '@angular/core';

export interface NewsItem {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

export interface HeroSlide extends NewsItem {
  label: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  readonly year = new Date().getFullYear();

  readonly navLinks: { label: string; href: string; active?: boolean }[] = [
    { label: 'Beranda', href: '#', active: true },
    { label: 'Terbaru', href: '#' },
    { label: 'Hiburan', href: '#' },
    { label: 'Gaya Hidup', href: '#' },
    { label: 'Olahraga', href: '#' },
    { label: 'Nasional', href: '#' },
    { label: 'Internasional', href: '#' },
  ];

  readonly heroSlides: HeroSlide[] = [
    {
      label: 'Headline',
      title: 'Respons PSSI Soal Opsi Pindah dari GBK jika Lolos Babak 3 Kualifikasi',
      excerpt:
        'PSSI menanggapi spekulasi mengenai kemungkinan memindahkan laga kandang dari Stadion Gelora Bung Karno jika timnas melaju ke babak berikutnya.',
      category: 'Olahraga',
      date: '22 Januari 2024',
      image:
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&h=600&fit=crop',
    },
    {
      label: 'Headline',
      title: 'Pemerintah Perkuat Program Transisi Energi di Daerah Pesisir',
      excerpt:
        'Langkah strategis untuk mendukung ekonomi hijau dan ketahanan infrastruktur kelistrikan di wilayah terpencil.',
      category: 'Nasional',
      date: '21 Januari 2024',
      image:
        'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900&h=600&fit=crop',
    },
    {
      label: 'Headline',
      title: 'Festival Film Asia Tenggara Hadirkan Karya Independen',
      excerpt:
        'Rangkaian pemutaran dan diskusi dengan sineas muda dari berbagai negara di kawasan.',
      category: 'Hiburan',
      date: '20 Januari 2024',
      image:
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&h=600&fit=crop',
    },
  ];

  readonly popularNews: NewsItem[] = [
    {
      title: 'Debat Capres: Fokus pada Ekonomi dan Ketenagakerjaan',
      category: 'Politik',
      date: '18 Januari 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=200&h=200&fit=crop',
    },
    {
      title: 'Cuaca Ekstrem, BMKG Imbau Warga Waspada Banjir Rob',
      category: 'Nasional',
      date: '17 Januari 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=200&h=200&fit=crop',
    },
    {
      title: 'Startup Lokal Raih Pendanaan Seri B untuk Ekspansi ASEAN',
      category: 'Internasional',
      date: '16 Januari 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=200&fit=crop',
    },
  ];

  readonly recommendations: NewsItem[] = [
    {
      title: 'Kemendikbud Luncurkan Platform Belajar Daring Terpadu',
      category: 'Nasional',
      date: '15 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=260&fit=crop',
    },
    {
      title: 'Tren Gaya Hidup Minimalis di Kalangan Urban Muda',
      category: 'Gaya Hidup',
      date: '14 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=260&fit=crop',
    },
    {
      title: 'Tim Basket Nasional Siap Hadapi Kejuaraan Regional',
      category: 'Olahraga',
      date: '13 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=260&fit=crop',
    },
    {
      title: 'Otomotif Listrik: Pabrikan Umumkan Model Baru Tahun Ini',
      category: 'Otomotif',
      date: '12 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=260&fit=crop',
    },
    {
      title: 'Tips Menjaga Kesehatan Mental di Tengah Kesibukan Kerja',
      category: 'Kesehatan',
      date: '11 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=260&fit=crop',
    },
    {
      title: 'Konser Amal Galang Dana untuk Korban Bencana Alam',
      category: 'Hiburan',
      date: '10 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=260&fit=crop',
    },
    {
      title: 'Diplomasi: Pertemuan Bilateral Bahas Perdagangan Bebas',
      category: 'Internasional',
      date: '9 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?w=400&h=260&fit=crop',
    },
    {
      title: 'Wisata Budaya Nusantara Catat Lonjakan Pengunjung',
      category: 'Nasional',
      date: '8 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=260&fit=crop',
    },
    {
      title: 'Industri Kreatif Dapat Insentif Pajak untuk UKM',
      category: 'Nasional',
      date: '7 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=260&fit=crop',
    },
    {
      title: 'Resep Sehat: Menu Sarapan Tinggi Serat',
      category: 'Kesehatan',
      date: '6 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=260&fit=crop',
    },
    {
      title: 'MotoGP: Jadwal Balapan Musim Depan Dirilis',
      category: 'Olahraga',
      date: '5 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=260&fit=crop',
    },
    {
      title: 'Arsitektur Ramah Lingkungan di Perkotaan',
      category: 'Gaya Hidup',
      date: '4 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&h=260&fit=crop',
    },
    {
      title: 'Pasar Modal Asia Mencatat Penguatan Indeks',
      category: 'Internasional',
      date: '3 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1611974789855-9c974a754e48?w=400&h=260&fit=crop',
    },
    {
      title: 'Inovasi Baterai Mobil Listrik Tahan Jarak Jauh',
      category: 'Otomotif',
      date: '2 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=260&fit=crop',
    },
    {
      title: 'Musim Panen Kopi: Petani Raup Untung',
      category: 'Nasional',
      date: '1 Jan 2024',
      excerpt: '',
      image:
        'https://images.unsplash.com/photo-1447933601403-0c6688cb94f1?w=400&h=260&fit=crop',
    },
  ];

  readonly footerExplore = [
    'Beranda',
    'Kesehatan',
    'Otomotif',
    'Politik',
    'Olahraga',
    'Nasional',
    'Internasional',
  ];

  readonly footerHelp = ['Kontak Kami', 'Laporan Pembajakan', 'Kebijakan'];

  readonly heroIndex = signal(0);
  readonly searchQuery = signal('');
  readonly recPage = signal(1);
  readonly pageSize = 8;

  readonly currentHero = computed(() => this.heroSlides[this.heroIndex()]);

  readonly filteredRecommendations = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.recommendations;
    return this.recommendations.filter(
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

  onSearchEvent(ev: Event): void {
    const el = ev.target as HTMLInputElement;
    this.onSearchInput(el.value);
  }

  prevHero(): void {
    const i = this.heroIndex();
    this.heroIndex.set(i === 0 ? this.heroSlides.length - 1 : i - 1);
  }

  nextHero(): void {
    const i = this.heroIndex();
    this.heroIndex.set(i === this.heroSlides.length - 1 ? 0 : i + 1);
  }

  goHero(i: number): void {
    this.heroIndex.set(i);
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.recPage.set(1);
  }

  setRecPage(p: number): void {
    const max = this.totalRecPages();
    if (p >= 1 && p <= max) this.recPage.set(p);
  }
}
