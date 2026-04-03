# 📰 Berita Kini — Portal Berita Terkini Indonesia

**Berita Kini** adalah aplikasi web portal berita modern berbasis **Angular 21**. Aplikasi ini menyajikan berita terbaru dari berbagai kategori secara real-time dengan antarmuka yang bersih, responsif, dan performa tinggi yang dioptimalkan untuk kecepatan akses dan SEO.

![Uploading {30C909FA-8056-413C-B2A2-4752E0A1D8F8}.png…]

## ✨ Fitur Utama

- **Real-time News Feed**: Menampilkan berita terbaru langsung dari API CNN Indonesia melalui `berita-indo-api-next.vercel.app`.
- **Navigasi Kategori**: Dukungan penuh untuk kategori utama (Nasional, Internasional, Ekonomi, Olahraga, Teknologi, dll) dengan sistem fallback kategori jika endpoint spesifik tidak tersedia.
- **Pencarian Cerdas**:
  - **Global Search**: Modal pencarian di navbar yang memproses seluruh data berita terbaru secara real-time.
  - **Category Search**: Filter instan di dalam setiap kategori untuk memudahkan pembaca menemukan topik spesifik.
- **Halaman Detail Artikel**: Layout premium dengan sidebar "Berita Terkait" yang dinamis berdasarkan konten yang sedang dibaca.
- **Sistem Komentar Interaktif**:
  - **Generated Comments**: Menghasilkan komentar otomatis yang cerdas dan relevan berdasarkan *keyword* judul dan kategori artikel.
  - **User Posting**: Fitur untuk menulis komentar langsung yang akan muncul secara instan di dalam sesi baca pengguna.
- **Breaking News Ticker**: Baris berita berjalan di header untuk update informasi paling kritis.
- **Social Sharing**: Integrasi tombol berbagi ke Facebook, Twitter (X), dan WhatsApp dengan metadata judul & URL yang sudah terenkripsi.
- **Full Responsive & Premium UI**: Desain menggunakan standar estetika modern (glassmorphism, subtle gradients, micro-animations) yang optimal di mobile hingga desktop lebar (max 1280px).

## 🚀 Arsitektur & Teknologi

Proyek ini dibangun dengan pendekatan modern menggunakan fitur-fitur terbaru dari ekosistem Angular:

- **State Management (Signals)**: Menggunakan `signal`, `computed`, dan `effect` untuk manajemen state yang efisien tanpa perlu overhead dari RxJS yang berlebihan untuk data sederhana.
- **Server-Side Rendering (SSR) & Hydration**:
  - Mendukung rendering di sisi server untuk optimasi SEO (Meta Tags, Title).
  - Menggunakan `isPlatformBrowser` guard untuk menangani objek global seperti `window` dan `localStorage` agar tidak menyebabkan error selama proses render di server (Node.js).
- **Service Layer & Caching**:
  - `NewsService` mengelola pengambilan data, pemetaan ID artikel yang konsisten, dan deteksi kategori otomatis dari URL berita.
  - **Local Caching System**: Dilengkapi sistem cache dengan *Time-to-Live* (TTL) selama 10 menit untuk mengurangi beban request ke API dan mempercepat waktu muat halaman.
- **Vanilla CSS Architecture**: Menggunakan sistem variabel CSS kustom untuk memudahkan kustomisasi desain global dan memastikan konsistensi layout di seluruh komponen.

## 📁 Struktur Komponen

Aplikasi ini menggunakan arsitektur **Standalone Components**:

- `src/app/home`: Mengelola tampilan homepage, hero carousel, dan feed rekomendasi utama.
- `src/app/category`: Menangani routing dinamis per kategori dan logika filtering data.
- `src/app/news-detail`: Menangani render konten artikel, sistem komentar, dan sidebar rekomendasi terkait.
- `src/app/navbar`: Komponen navigasi universal dengan integrasi modal pencarian global.
- `src/app/help`: Halaman bantuan (Kontak, Kebijakan, Laporan) dengan antarmuka yang bersih.

## 🛠️ Instalasi & Pengembangan

### Prasyarat
- [Node.js](https://nodejs.org/) (versi terbaru disarankan)
- [Angular CLI](https://angular.dev/tools/cli)

### Langkah-langkah
1. **Clone & Install**:
   ```bash
   git clone https://github.com/username/berita-kini.git
   cd berita-kini
   npm install
   ```

2. **Jalankan Development Server**:
   ```bash
   ng serve
   ```
   Akses di: `http://localhost:4200`

3. **Staging/Production Build**:
   ```bash
   ng build
   ```

## 📄 Lisensi & Kredit

- **API Sumber**: [Berita Indo API](https://github.com/rizkysaputra/berita-indo-api).
- **Icons**: SVG kustom terintegrasi langsung di template.
- **Typography**: [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts.

---
*Proyek ini merupakan demonstrasi portofolio aplikasi portal berita modern dengan performa tinggi dan desain premium.*

Dibuat dengan ❤️ oleh [Nama Anda]
