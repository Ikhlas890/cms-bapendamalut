import { Routes } from '@angular/router';
import { Berita } from './berita/berita';
import { StrukturOrganisasi } from './struktur-organisasi/struktur-organisasi';
import { Hierarki } from './hierarki/hierarki';
import { DaftarPengaduan } from './daftar-pengaduan/daftar-pengaduan';
import { HierarkiDetail } from './hierarki-detail/hierarki-detail';
import { Users } from './users/users';
import { GroupUsers } from './group-users/group-users';
import { HakAkses } from './hak-akses/hak-akses';
import { Menus } from './menus/menus';
import { PanduanLayanan } from './panduan-layanan/panduan-layanan';

export default [
    { path: 'berita', component: Berita },
    { path: 'users', component: Users },
    { path: 'group-users', component: GroupUsers },
    { path: 'menus', component: Menus },
    { path: 'panduan-layanan', component: PanduanLayanan },
    { path: 'hak-akses', component: HakAkses },
    { path: 'daftar-pengaduan', component: DaftarPengaduan },
    { path: 'struktur-organisasi', component: StrukturOrganisasi },
    { path: 'hierarki', component: Hierarki },
    { path: 'hierarki/:id', component: HierarkiDetail },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
