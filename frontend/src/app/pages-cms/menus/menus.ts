import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AccessControlService, CrudPermission } from 'src/services/access-control.service';
import { BackendMenu, MenuPayload, MenuService } from 'src/services/menu.service';

interface SelectOption<T> {
    label: string;
    value: T;
}

@Component({
    selector: 'app-menus',
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
        InputNumberModule,
        SelectModule,
        ToggleSwitchModule,
        TagModule,
        InputIconModule,
        IconFieldModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './menus.html',
    styleUrl: './menus.scss'
})
export class Menus {
    @ViewChild('dt') dt!: Table;

    menus: BackendMenu[] = [];
    parentOptions: SelectOption<number | null>[] = [];
    iconOptions: SelectOption<string | null>[] = [
        { label: 'Tanpa Icon', value: null },
        { label: 'Home', value: 'pi pi-fw pi-home' },
        { label: 'Book', value: 'pi pi-fw pi-book' },
        { label: 'Users', value: 'pi pi-fw pi-users' },
        { label: 'User', value: 'pi pi-fw pi-user' },
        { label: 'Shield', value: 'pi pi-fw pi-shield' },
        { label: 'Cog', value: 'pi pi-fw pi-cog' },
        { label: 'Bars', value: 'pi pi-fw pi-bars' },
        { label: 'Table', value: 'pi pi-fw pi-table' },
        { label: 'Envelope', value: 'pi pi-fw pi-envelope' },
        { label: 'File', value: 'pi pi-fw pi-file' },
        { label: 'Folder', value: 'pi pi-fw pi-folder' },
        { label: 'Sitemap', value: 'pi pi-fw pi-sitemap' },
        { label: 'Chart Bar', value: 'pi pi-fw pi-chart-bar' },
        { label: 'Database', value: 'pi pi-fw pi-database' }
    ];
    form!: FormGroup;
    dialogVisible = false;
    dialogTitle = 'Tambah Menu';
    selectedId?: number;
    loading = false;
    permission: CrudPermission = {
        can_view: false,
        can_create: false,
        can_update: false,
        can_delete: false
    };

    constructor(
        private menuService: MenuService,
        private accessControl: AccessControlService,
        private fb: FormBuilder,
        private msg: MessageService,
        private confirm: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadPermission();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    initForm() {
        this.form = this.fb.group({
            nama_menu: ['', Validators.required],
            url: ['', Validators.required],
            icon: [null],
            parent_id: [null],
            urutan: [0, Validators.required],
            status: [true]
        });
    }

    loadMenus() {
        this.loading = true;
        this.menuService.getMenus().subscribe({
            next: (res) => {
                this.menus = this.sortMenus(res);
                this.setParentOptions();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat menu' });
            }
        });
    }

    loadPermission() {
        this.loading = true;
        this.accessControl.getPermission('menus').subscribe({
            next: (permission) => {
                this.permission = permission;

                if (!permission.can_view) {
                    this.menus = [];
                    this.loading = false;
                    this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses melihat menu' });
                    return;
                }

                this.loadMenus();
            },
            error: () => {
                this.loading = false;
                this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat hak akses' });
            }
        });
    }

    openAdd() {
        if (!this.permission.can_create) {
            this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses tambah menu' });
            return;
        }

        this.dialogTitle = 'Tambah Menu';
        this.selectedId = undefined;
        this.form.reset({
            nama_menu: '',
            url: '',
            icon: null,
            parent_id: null,
            urutan: 0,
            status: true
        });
        this.setParentOptions();
        this.dialogVisible = true;
    }

    openEdit(menu: BackendMenu) {
        if (!this.permission.can_update) {
            this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses edit menu' });
            return;
        }

        this.dialogTitle = 'Edit Menu';
        this.selectedId = menu.id;
        this.form.patchValue({
            nama_menu: menu.nama_menu,
            url: menu.url,
            icon: menu.icon,
            parent_id: menu.parent_id,
            urutan: menu.urutan,
            status: menu.status === 1
        });
        this.setParentOptions(menu.id);
        this.dialogVisible = true;
    }

    save() {
        if (this.form.invalid) return;
        if (this.selectedId && !this.permission.can_update) return;
        if (!this.selectedId && !this.permission.can_create) return;

        const payload = this.createPayload();
        const request = this.selectedId
            ? this.menuService.updateMenu(this.selectedId, payload)
            : this.menuService.createMenu(payload);

        request.subscribe({
            next: () => {
                this.msg.add({ severity: 'success', summary: 'Sukses', detail: 'Menu disimpan' });
                this.dialogVisible = false;
                this.loadMenus();
            },
            error: (err) => {
                this.msg.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'Gagal menyimpan menu'
                });
            }
        });
    }

    delete(menu: BackendMenu) {
        if (!this.permission.can_delete) {
            this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses hapus menu' });
            return;
        }

        this.confirm.confirm({
            message: `Hapus menu "${menu.nama_menu}"?`,
            accept: () => {
                this.menuService.deleteMenu(menu.id).subscribe({
                    next: () => {
                        this.msg.add({ severity: 'success', summary: 'Dihapus', detail: 'Menu dihapus' });
                        this.loadMenus();
                    },
                    error: (err) => {
                        this.msg.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: err.error?.message || 'Gagal menghapus menu'
                        });
                    }
                });
            }
        });
    }

    getParentName(parentId: number | null): string {
        if (!parentId) return '-';
        return this.menus.find((menu) => menu.id === parentId)?.nama_menu || '-';
    }

    getStatusLabel(status: number): string {
        return status === 1 ? 'Aktif' : 'Nonaktif';
    }

    getStatusSeverity(status: number): 'success' | 'secondary' {
        return status === 1 ? 'success' : 'secondary';
    }

    private createPayload(): MenuPayload {
        return {
            nama_menu: this.form.value.nama_menu,
            url: this.form.value.url,
            icon: this.form.value.icon || null,
            parent_id: this.form.value.parent_id ?? null,
            urutan: Number(this.form.value.urutan ?? 0),
            status: this.form.value.status ? 1 : 0
        };
    }

    private setParentOptions(excludeId?: number) {
        this.parentOptions = [
            { label: 'Tidak Ada Parent', value: null },
            ...this.menus
                .filter((menu) => menu.id !== excludeId)
                .map((menu) => ({
                    label: menu.nama_menu,
                    value: menu.id
                }))
        ];
    }

    private sortMenus(menus: BackendMenu[]): BackendMenu[] {
        return [...menus].sort((a, b) => {
            const parentA = a.parent_id ?? a.id;
            const parentB = b.parent_id ?? b.id;

            if (parentA !== parentB) return parentA - parentB;
            if (a.urutan !== b.urutan) return a.urutan - b.urutan;
            return a.id - b.id;
        });
    }
}
