import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { FeedbackUser, MpadService } from 'src/services/mpad.service';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    TagModule,
    TextareaModule,
    RatingModule,
    DialogModule
  ],
  providers: [MessageService],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss'
})
export class Feedback implements OnInit {
  public feedbackList: FeedbackUser[] = [];
  public loading = false;
  public searchKeyword = '';
  public statusFilter = '';
  public jenisFeedbackFilter = '';
  public rows = 10;
  public first = 0;
  public totalRecords = 0;
  public sortField = 'TglFeedback';
  public sortOrder: 1 | -1 = -1;
  public selectedFeedback: FeedbackUser | null = null;
  public detailDialogVisible = false;
  public replyDialogVisible = false;
  public replyLoading = false;
  public replyStatus = 'SELESAI';
  public replyText = '';

  public readonly statusOptions: SelectOption[] = [
    { label: 'Semua Status', value: '' },
    { label: 'BARU', value: 'BARU' },
    { label: 'DIPROSES', value: 'DIPROSES' },
    { label: 'DITANGGAPI', value: 'DITANGGAPI' },
    { label: 'SELESAI', value: 'SELESAI' },
    { label: 'DITUTUP', value: 'DITUTUP' }
  ];

  public readonly replyStatusOptions: SelectOption[] = [
    { label: 'BARU', value: 'BARU' },
    { label: 'DIPROSES', value: 'DIPROSES' },
    { label: 'DITANGGAPI', value: 'DITANGGAPI' },
    { label: 'SELESAI', value: 'SELESAI' },
    { label: 'DITUTUP', value: 'DITUTUP' }
  ];

  public readonly jenisFeedbackOptions: SelectOption[] = [
    { label: 'Semua Jenis', value: '' },
    { label: 'Saran', value: 'saran' },
    { label: 'Keluhan', value: 'keluhan' },
    { label: 'Pertanyaan', value: 'pertanyaan' }
  ];

  constructor(
    private mpadService: MpadService,
    private msg: MessageService
  ) {}

  ngOnInit(): void {
    this.loadFeedback();
  }

  loadFeedback() {
    this.loading = true;
    const page = Math.floor(this.first / this.rows) + 1;

    this.mpadService.getFeedbackUsers({
      page,
      length: this.rows,
      sort: this.sortField,
      sort_dir: this.sortOrder === 1 ? 'asc' : 'desc',
      search: this.searchKeyword.trim(),
      status: this.statusFilter,
      jenis_feedback: this.jenisFeedbackFilter
    }).subscribe({
      next: (response) => {
        this.feedbackList = response.data || [];
        this.totalRecords = response.records_total ?? response.total ?? this.feedbackList.length;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Gagal memuat data feedback MPAD'
        });
      }
    });
  }

  onLazyLoad(event: any) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;
    this.sortField = event.sortField || this.sortField;
    this.sortOrder = event.sortOrder === 1 ? 1 : -1;
    this.loadFeedback();
  }

  onSearch() {
    this.first = 0;
    this.loadFeedback();
  }

  clearSearch() {
    this.searchKeyword = '';
    this.statusFilter = '';
    this.jenisFeedbackFilter = '';
    this.first = 0;
    this.loadFeedback();
  }

  showDetail(feedback: FeedbackUser) {
    this.selectedFeedback = feedback;
    this.detailDialogVisible = true;
  }

  openReply(feedback: FeedbackUser) {
    this.selectedFeedback = feedback;
    this.replyStatus = 'SELESAI';
    this.replyText = '';
    this.replyDialogVisible = true;
  }

  submitReply() {
    if (!this.selectedFeedback || !this.replyText.trim()) {
      this.msg.add({ severity: 'warn', summary: 'Validasi', detail: 'Tanggapan admin wajib diisi' });
      return;
    }

    this.replyLoading = true;
    this.mpadService.replyFeedback(this.selectedFeedback.FeedbackID, {
      Status: this.replyStatus,
      TanggapanAdmin: this.replyText.trim()
    }).subscribe({
      next: () => {
        this.replyLoading = false;
        this.replyDialogVisible = false;
        this.msg.add({ severity: 'success', summary: 'Sukses', detail: 'Tanggapan feedback berhasil dikirim' });
        this.loadFeedback();
      },
      error: (err) => {
        this.replyLoading = false;
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Gagal mengirim tanggapan feedback'
        });
      }
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'secondary' {
    const normalizedStatus = (status || '').toLowerCase();
    if (normalizedStatus === 'selesai') return 'success';
    if (normalizedStatus === 'ditutup') return 'secondary';
    if (normalizedStatus === 'ditanggapi') return 'info';
    if (normalizedStatus === 'diproses') return 'info';
    if (normalizedStatus === 'baru') return 'warn';
    return 'secondary';
  }
}
