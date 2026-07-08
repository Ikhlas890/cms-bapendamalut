import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { PostService, Post } from 'src/services/post-bapendamaluku.service';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-berita',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    DialogModule,
    FileUploadModule,
    ButtonModule,
    DatePickerModule,
    TextareaModule,
    InputTextModule,
    NgxEditorModule,
    ToolbarModule,
    InputIconModule,
    IconFieldModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './berita.html',
  styleUrl: './berita.scss'
})
export class Berita {

  // Export data (Excel)
  @ViewChild('dt') dt!: Table;

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // Upload File
  @ViewChild('uploader') uploader: any;

  posts: Post[] = [];
  form!: FormGroup;
  dialogVisible = false;
  dialogTitle = 'Tambah Berita';
  selectedId?: number;
  loading = false;
  currentImageUrl: string | null = null; // ✅ tambahkan ini

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['link', 'image'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(
    private postService: PostService,
    private fb: FormBuilder,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadPosts();
    this.initForm();
    this.editor = new Editor();
  }

  /** Ambil semua berita */
  loadPosts() {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: (res) => {
        this.posts = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data' });
      },
    });
  }

  initForm() {
    this.form = this.fb.group({
      judul_berita: ['', Validators.required],
      tanggal_berita: ['', Validators.required],
      isi_berita: ['', Validators.required],
      sumber_berita: ['', Validators.required],
      gambar_berita: [null], // file
    });
  }

  openAdd() {
    this.dialogTitle = 'Tambah Data';
    this.selectedId = undefined;
    this.form.reset();
    this.dialogVisible = true;

    // Reset uploader agar file lama hilang
    if (this.uploader) this.uploader.clear();
  }

  openEdit(post: Post) {
    this.dialogTitle = 'Edit Data';
    this.selectedId = post.id;

    const tanggal = post.tanggal_berita
      ? new Date(post.tanggal_berita)
      : null;

    this.form.patchValue({
      judul_berita: post.judul_berita,
      tanggal_berita: tanggal,
      isi_berita: post.isi_berita,
      sumber_berita: post.sumber_berita,
      gambar_berita: null,
    });

    this.currentImageUrl = post.gambar_berita
      ? `https://api-malut-cms.intermatika.id/uploads/berita/${post.gambar_berita}`
      : null;

    this.dialogVisible = true;

    // Pastikan file lama dihapus dari uploader
    if (this.uploader) this.uploader.clear();
  }

  /** Simpan (tambah/update) */
  save() {
    if (this.form.invalid) return;

    const fd = new FormData();

    // Ambil semua field
    Object.keys(this.form.controls).forEach((key) => {
      let val = this.form.get(key)?.value;
      if (val !== null && val !== undefined) {
        // Jika field adalah tanggal_berita, ubah ke yyyy-MM-dd
        if (key === 'tanggal_berita' && val instanceof Date) {
          const yyyy = val.getFullYear();
          const mm = String(val.getMonth() + 1).padStart(2, '0');
          const dd = String(val.getDate()).padStart(2, '0');
          val = `${yyyy}-${mm}-${dd}`;
        }
        fd.append(key, val);
      }
    });

    const request = this.selectedId
      ? this.postService.updatePost(this.selectedId, fd)
      : this.postService.createPost(fd);

    request.subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Sukses', detail: 'Data disimpan' });
        this.dialogVisible = false;
        this.loadPosts();
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan' });
      },
    });
  }


  /** Hapus berita */
  delete(post: Post) {
    this.confirm.confirm({
      message: `Hapus berita "${post.judul_berita}"?`,
      accept: () => {
        if (!post.id) return;
        this.postService.deletePost(post.id).subscribe({
          next: () => {
            this.msg.add({ severity: 'success', summary: 'Dihapus', detail: 'Berita dihapus' });
            this.loadPosts();
          },
          error: () =>
            this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal menghapus' }),
        });
      },
    });
  }

  /** Handle upload file dari p-fileUpload */
  onFileSelect(event: any) {
    const file = event.files?.[0];
    if (file) this.form.patchValue({ gambar_berita: file });
  }

  ngOnDestroy() {
    this.editor?.destroy();
  }

}
