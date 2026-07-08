import { Routes } from '@angular/router';
import { Berita } from './berita/berita';
import { StrukturOrganisasi } from './struktur-organisasi/struktur-organisasi';
import { Hierarki } from './hierarki/hierarki';
import { DaftarPengaduan } from './daftar-pengaduan/daftar-pengaduan';
import { HierarkiDetail } from './hierarki-detail/hierarki-detail';

export default [
    { path: 'berita', component: Berita },
    { path: 'daftar-pengaduan', component: DaftarPengaduan },
    { path: 'struktur-organisasi', component: StrukturOrganisasi },
    { path: 'hierarki', component: Hierarki },
    { path: 'hierarki/:id', component: HierarkiDetail },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
