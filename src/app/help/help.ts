import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

type HelpSection = 'kontak' | 'laporan' | 'kebijakan';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './help.html',
  styleUrl: './help.css',
})
export class HelpComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  
  readonly year = new Date().getFullYear();
  readonly currentSection = signal<HelpSection>('kontak');

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

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id === 'kontak' || id === 'laporan' || id === 'kebijakan') {
        this.currentSection.set(id);
      } else {
        // Default
        this.currentSection.set('kontak');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  submitAction(event: Event) {
    event.preventDefault();
    alert("Terima kasih, pesan Anda telah dikirim ke tim Berita Kini.");
  }
}
