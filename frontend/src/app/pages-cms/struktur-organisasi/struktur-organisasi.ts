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
import { StrukturOrganisasiService, Data } from 'src/services/stuktur-organisasi.service';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-struktur-organisasi',
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
    IconFieldModule,
    SelectModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './struktur-organisasi.html',
  styleUrl: './struktur-organisasi.scss'
})
export class StrukturOrganisasi {

  // Export data (Excel)
  @ViewChild('dt') dt!: Table;

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  struktur: Data[] = [];
  form!: FormGroup;
  dialogVisible = false;
  dialogTitle = 'Tambah Berita';
  selectedId?: number;
  loading = false;

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['link', 'image'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  parentOptions: { label: string; value: number | null }[] = [];

  statusOptions = [
    { label: 'Aktif', value: '1' },
    { label: 'Tidak Aktif', value: '0' }
  ];

  constructor(
    private strukturService: StrukturOrganisasiService,
    private fb: FormBuilder,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadPosts();
    this.initForm();
    this.editor = new Editor();
  }

  getStatusLabel(value: string): string {
    const found = this.statusOptions.find(opt => opt.value === value);
    return found ? found.label : '-';
  }

  /** Ambil semua berita */
  loadPosts() {
    this.loading = true;
    this.strukturService.getData().subscribe({
      next: (res) => {
        this.struktur = res;
         this.parentOptions = [
          { label: 'Tidak ada induk', value: null },
          ...res.map(item => ({
            label: `${item.nama_jabatan}`,
            value: item.id
          }))
        ];
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
      nama_jabatan: ['', Validators.required],
      nama_pegawai: ['', Validators.required],
      parent_id: [null],
      deskripsi: [''],
      pendidikan: [''],
      pengalaman_jabatan: [''],
      pengalaman_organisasi: [''],
      status: ['', Validators.required],
      foto: [null], // file
    });
  }

  /** Buka dialog tambah */
  openAdd() {
    this.dialogTitle = 'Tambah Data';
    this.selectedId = undefined;
    this.form.reset();
    this.dialogVisible = true;
  }

  /** Buka dialog edit */
  openEdit(struktur: Data) {
    this.dialogTitle = 'Edit Data';
    this.selectedId = struktur.id;

    // Konversi string "yyyy-mm-dd" -> Date
    // const tanggal = struktur.tanggal_berita
    //   ? new Date(struktur.tanggal_berita)
    //   : null;

    this.form.patchValue({
      nama_jabatan: struktur.nama_jabatan,
      nama_pegawai: struktur.nama_pegawai,
      parent_id: struktur.parent_id,
      deskripsi: struktur.deskripsi,
      status: struktur.status,
      pendidikan: struktur.pendidikan,
      pengalaman_jabatan: struktur.pengalaman_jabatan,
      pengalaman_organisasi: struktur.pengalaman_organisasi,
      foto: null,
    });

    this.dialogVisible = true;
  }


  /** Simpan (tambah/update) */
  save() {
    if (this.form.invalid) return;

    const fd = new FormData();

    // Ambil semua field
    Object.keys(this.form.controls).forEach((key) => {
      let val = this.form.get(key)?.value;
      if (val !== null && val !== undefined) {
        // if (key === 'tanggal_berita' && val instanceof Date) {
        //   const yyyy = val.getFullYear();
        //   const mm = String(val.getMonth() + 1).padStart(2, '0');
        //   const dd = String(val.getDate()).padStart(2, '0');
        //   val = `${yyyy}-${mm}-${dd}`;
        // }
        fd.append(key, val);
      }
    });

    const request = this.selectedId
      ? this.strukturService.updateData(this.selectedId, fd)
      : this.strukturService.createData(fd);

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


  /** Hapus data */
  delete(struktur: Data) {
    this.confirm.confirm({
      message: `Hapus jabaran "${struktur.nama_jabatan}"?`,
      accept: () => {
        if (!struktur.id) return;
        this.strukturService.deleteData(struktur.id).subscribe({
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
    if (file) this.form.patchValue({ foto: file });
  }

  ngOnDestroy() {
    this.editor?.destroy();
  }

}
