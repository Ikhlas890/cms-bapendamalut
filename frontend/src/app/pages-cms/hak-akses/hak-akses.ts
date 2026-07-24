import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';
import { AccessControlService, CrudPermission } from 'src/services/access-control.service';
import { Client, ClientService } from 'src/services/client.service';
import { BackendMenu, MenuService } from 'src/services/menu.service';
import { RolePermission, RolePermissionPayload, RolePermissionService } from 'src/services/role-permission.service';

interface AccessMenu extends BackendMenu {
    permission_id?: number;
    can_view: boolean;
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
}

@Component({
    selector: 'app-hak-akses',
    imports: [CommonModule, FormsModule, ToastModule, TableModule, ButtonModule, SelectModule, CheckboxModule],
    providers: [MessageService],
    templateUrl: './hak-akses.html',
    styleUrl: './hak-akses.scss'
})
export class HakAkses {
    clients: Client[] = [];
    clientOptions: { label: string; value: number }[] = [];
    menus: BackendMenu[] = [];
    accessMenus: AccessMenu[] = [];
    selectedClientId?: number;
    loading = false;
    saving = false;
    permission: CrudPermission = {
        can_view: false,
        can_create: false,
        can_update: false,
        can_delete: false
    };

    constructor(
        private clientService: ClientService,
        private menuService: MenuService,
        private rolePermissionService: RolePermissionService,
        private accessControl: AccessControlService,
        private msg: MessageService
    ) {}

    ngOnInit(): void {
        this.loadPermission();
    }

    get canManagePermissions(): boolean {
        return this.permission.can_create || this.permission.can_update;
    }

    loadPermission() {
        this.loading = true;
        this.accessControl.getPermission('hak-akses').subscribe({
            next: (permission) => {
                this.permission = permission;

                if (!permission.can_view) {
                    this.loading = false;
                    this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses melihat hak akses' });
                    return;
                }

                this.loadMasterData();
            },
            error: () => {
                this.loading = false;
                this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat hak akses' });
            }
        });
    }

    loadMasterData() {
        this.loading = true;

        forkJoin({
            clients: this.clientService.getClients(),
            menus: this.menuService.getMenus(1)
        }).subscribe({
            next: ({ clients, menus }) => {
                this.clients = clients;
                this.clientOptions = clients
                    .filter((client): client is Client & { id: number } => client.id !== undefined)
                    .map((client) => ({
                        label: client.nama_instansi,
                        value: client.id
                    }));
                this.menus = this.sortMenus(menus.filter((menu) => menu.status === 1));
                this.accessMenus = this.createAccessRows(this.menus, []);
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat group user atau menu' });
            }
        });
    }

    onClientChange() {
        if (!this.selectedClientId) {
            this.accessMenus = this.createAccessRows(this.menus, []);
            return;
        }

        this.loading = true;
        this.rolePermissionService.getRolePermissions(this.selectedClientId).subscribe({
            next: (permissions) => {
                this.accessMenus = this.createAccessRows(this.menus, permissions);
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat hak akses' });
            }
        });
    }

    savePermissions() {
        if (!this.selectedClientId) {
            this.msg.add({ severity: 'warn', summary: 'Pilih Group User', detail: 'Group user wajib dipilih' });
            return;
        }

        const requests = this.accessMenus
            .map((menu) => {
                const payload = this.createPayload(menu, this.selectedClientId!);
                const hasAccess = payload.can_view || payload.can_create || payload.can_update || payload.can_delete;

                if (menu.permission_id) {
                    if (!this.permission.can_update) return null;
                    return this.rolePermissionService.updateRolePermission(menu.permission_id, payload);
                }

                if (hasAccess) {
                    if (!this.permission.can_create) return null;
                    return this.rolePermissionService.createRolePermission(payload);
                }

                return null;
            })
            .filter((request) => request !== null);

        if (!requests.length) {
            this.msg.add({ severity: 'info', summary: 'Tidak Ada Perubahan', detail: 'Belum ada hak akses yang dipilih' });
            return;
        }

        this.saving = true;
        forkJoin(requests).subscribe({
            next: () => {
                this.saving = false;
                this.msg.add({ severity: 'success', summary: 'Sukses', detail: 'Hak akses disimpan' });
                this.onClientChange();
            },
            error: (err) => {
                this.saving = false;
                this.msg.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'Gagal menyimpan hak akses'
                });
            }
        });
    }

    private createAccessRows(menus: BackendMenu[], permissions: RolePermission[]): AccessMenu[] {
        const permissionByMenuId = new Map(permissions.map((permission) => [permission.menu_id, permission]));

        return menus.map((menu) => {
            const permission = permissionByMenuId.get(menu.id);

            return {
                ...menu,
                permission_id: permission?.id,
                can_view: permission?.can_view === 1,
                can_create: permission?.can_create === 1,
                can_update: permission?.can_update === 1,
                can_delete: permission?.can_delete === 1
            };
        });
    }

    private createPayload(menu: AccessMenu, clientId: number): RolePermissionPayload {
        return {
            client_id: clientId,
            menu_id: menu.id,
            can_view: menu.can_view ? 1 : 0,
            can_create: menu.can_create ? 1 : 0,
            can_update: menu.can_update ? 1 : 0,
            can_delete: menu.can_delete ? 1 : 0
        };
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
