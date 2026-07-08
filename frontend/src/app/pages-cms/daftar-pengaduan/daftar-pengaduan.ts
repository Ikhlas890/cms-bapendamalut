import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { PengaduanService, Pengaduan } from 'src/services/pengaduan.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daftar-pengaduan',
  imports: [
    CommonModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    DialogModule,
    FileUploadModule,
    ButtonModule,
    DatePickerModule,
    TextareaModule,
    InputTextModule,
    ToolbarModule,
    InputIconModule,
    IconFieldModule,
    SelectModule
  ],
  templateUrl: './daftar-pengaduan.html',
  styleUrl: './daftar-pengaduan.scss'
})
export class DaftarPengaduan implements OnInit {

  // Export data (Excel)
  @ViewChild('dt') dt!: Table;

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  pengaduanList: Pengaduan[] = [];
  filteredList: any[] = [];
  loading = false;

  kategoriFilter = '';
  statusPengaduFilter = '';
  searchTerm = '';

  currentPage = 1;
  itemsPerPage = 5;

  selectedPengaduan: Pengaduan | null = null;
  detailDialogVisible = false;

  constructor(private pengaduanService: PengaduanService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.pengaduanService.getPengaduan().subscribe({
      next: (res) => {
        this.pengaduanList = (res as Pengaduan[]).sort(
          (a: Pengaduan, b: Pengaduan) => b.id - a.id
        );
        this.applyFilter();
      },
      error: (err) => {
        console.error('Gagal ambil data inventaris:', err);
      }
    });
  }

  applyFilter() {
    let data = this.pengaduanList;

    if (this.kategoriFilter) {
      data = data.filter(item =>
        item.kategori_laporan.toLowerCase().includes(this.kategoriFilter.toLowerCase())
      );
    }

    if (this.statusPengaduFilter) {
      data = data.filter(item =>
        item.status_pengadu.toLowerCase().includes(this.statusPengaduFilter.toLowerCase())
      );
    }

    if (this.searchTerm) {
      const keyword = this.searchTerm.toLowerCase();

      data = data.filter(item =>
        item.judul_laporan.toLowerCase().includes(keyword) ||
        item.kategori_laporan.toLowerCase().includes(keyword) ||
        item.status_pengadu.toLowerCase().includes(keyword) ||
        item.lokasi_kejadian.toLowerCase().includes(keyword)
      );
    }

    this.filteredList = data;
    this.currentPage = 1;
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredList.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredList.length / this.itemsPerPage);
  }

  changePage(n: number) {
    this.currentPage = n;
  }

  getPageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  showDetail(pengaduan: Pengaduan) {
    this.selectedPengaduan = pengaduan;
    this.detailDialogVisible = true;
  }
}
