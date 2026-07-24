import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { AccessControlService, CrudPermission } from 'src/services/access-control.service';
import { Panduan, PanduanPayload, PanduanService, PanduanTipe } from 'src/services/panduan.service';

interface SelectOption<T> {
    label: string;
    value: T;
}

@Component({
    selector: 'app-panduan-layanan',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        ConfirmDialogModule,
        TableModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        ToggleSwitchModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        NgxEditorModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './panduan-layanan.html',
    styleUrl: './panduan-layanan.scss'
})
export class PanduanLayanan implements OnDestroy {
    @ViewChild('dt') dt!: Table;

    panduan: Panduan[] = [];
    tipeOptions: SelectOption<PanduanTipe>[] = [
        { label: 'Video', value: 'video' },
        { label: 'Teks', value: 'teks' },
        { label: 'Link', value: 'link' },
        { label: 'File', value: 'file' }
    ];
    form!: FormGroup;
    dialogVisible = false;
    dialogTitle = 'Tambah Panduan';
    selectedId?: number;
    loading = false;
    permission: CrudPermission = {
        can_view: false,
        can_create: false,
        can_update: false,
        can_delete: false
    };

    editor!: Editor;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3'] }],
        ['link', 'image'],
        ['align_left', 'align_center', 'align_right', 'align_justify']
    ];

    constructor(
        private panduanService: PanduanService,
        private accessControl: AccessControlService,
        private fb: FormBuilder,
        private msg: MessageService,
        private confirm: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.editor = new Editor();
        this.loadPermission();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    initForm() {
        this.form = this.fb.group({
            judul: ['', Validators.required],
            tipe: [null, Validators.required],
            konten: ['', Validators.required],
            status: [true, Validators.required]
        });
    }

    loadPanduan() {
        this.loading = true;
        this.panduanService.getPanduan().subscribe({
            next: (res) => {
                this.panduan = res;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat panduan layanan' });
            }
        });
    }

    loadPermission() {
        this.loading = true;
        this.accessControl.getPermission('panduan-layanan').subscribe({
            next: (permission) => {
                this.permission = permission;

                if (!permission.can_view) {
                    this.panduan = [];
                    this.loading = false;
                    this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses melihat panduan layanan' });
                    return;
                }

                this.loadPanduan();
            },
            error: () => {
                this.loading = false;
                this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat hak akses' });
            }
        });
    }

    openAdd() {
        if (!this.permission.can_create) {
            this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses tambah panduan layanan' });
            return;
        }

        this.dialogTitle = 'Tambah Panduan';
        this.selectedId = undefined;
        this.form.reset({
            judul: '',
            tipe: null,
            konten: '',
            status: true
        });
        this.dialogVisible = true;
    }

    openEdit(item: Panduan) {
        if (!this.permission.can_update) {
            this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses edit panduan layanan' });
            return;
        }

        this.dialogTitle = 'Edit Panduan';
        this.selectedId = item.id;
        this.form.patchValue({
            judul: item.judul,
            tipe: item.tipe,
            konten: item.konten || '',
            status: item.status === 1
        });
        this.dialogVisible = true;
    }

    save() {
        if (this.form.invalid) return;
        if (this.selectedId && !this.permission.can_update) return;
        if (!this.selectedId && !this.permission.can_create) return;

        const payload = this.createPayload();
        const request = this.selectedId
            ? this.panduanService.updatePanduan(this.selectedId, payload)
            : this.panduanService.createPanduan(payload);

        request.subscribe({
            next: () => {
                this.msg.add({ severity: 'success', summary: 'Sukses', detail: 'Panduan layanan disimpan' });
                this.dialogVisible = false;
                this.loadPanduan();
            },
            error: (err) => {
                this.msg.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'Gagal menyimpan panduan layanan'
                });
            }
        });
    }

    delete(item: Panduan) {
        if (!this.permission.can_delete) {
            this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses hapus panduan layanan' });
            return;
        }

        this.confirm.confirm({
            message: `Hapus panduan "${item.judul}"?`,
            accept: () => {
                this.panduanService.deletePanduan(item.id).subscribe({
                    next: () => {
                        this.msg.add({ severity: 'success', summary: 'Dihapus', detail: 'Panduan layanan dihapus' });
                        this.loadPanduan();
                    },
                    error: (err) => {
                        this.msg.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: err.error?.message || 'Gagal menghapus panduan layanan'
                        });
                    }
                });
            }
        });
    }

    getTipeLabel(tipe: PanduanTipe): string {
        return this.tipeOptions.find((option) => option.value === tipe)?.label || tipe;
    }

    getTipeSeverity(tipe: PanduanTipe): 'info' | 'success' | 'warn' | 'secondary' {
        const severityMap: Record<PanduanTipe, 'info' | 'success' | 'warn' | 'secondary'> = {
            video: 'info',
            teks: 'success',
            link: 'warn',
            file: 'secondary'
        };

        return severityMap[tipe];
    }

    getStatusLabel(status: number): string {
        return status === 1 ? 'Aktif' : 'Nonaktif';
    }

    getStatusSeverity(status: number): 'success' | 'secondary' {
        return status === 1 ? 'success' : 'secondary';
    }

    private createPayload(): PanduanPayload {
        return {
            judul: this.form.value.judul,
            tipe: this.form.value.tipe,
            konten: this.form.value.konten,
            status: this.form.value.status ? 1 : 0
        };
    }

    ngOnDestroy() {
        this.editor?.destroy();
    }
}
