import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AccessControlService, CrudPermission } from 'src/services/access-control.service';
import { Client, ClientService } from 'src/services/client.service';
import { UserCms, UserService } from 'src/services/user.service';

@Component({
  selector: 'app-users',
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
    TagModule,
    ToggleSwitchModule,
    InputIconModule,
    IconFieldModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
  users: UserCms[] = [];
  clients: Client[] = [];
  clientOptions: { label: string; value: number }[] = [];
  searchField: 'username' | 'nama_instansi' = 'username';
  searchFieldOptions = [
    { label: 'Username', value: 'username' },
    { label: 'Nama Instansi', value: 'nama_instansi' }
  ];
  searchKeyword = '';
  form!: FormGroup;
  dialogVisible = false;
  dialogTitle = 'Tambah User';
  selectedId?: number;
  loading = false;
  permission: CrudPermission = {
    can_view: false,
    can_create: false,
    can_update: false,
    can_delete: false
  };

  constructor(
    private userService: UserService,
    private clientService: ClientService,
    private accessControl: AccessControlService,
    private fb: FormBuilder,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPermission();
  }

  initForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      client_id: [null, Validators.required],
      status: [true]
    });
  }

  loadUsers() {
    this.loading = true;
    const keyword = this.searchKeyword.trim();

    this.userService.getUsers({
      username: this.searchField === 'username' ? keyword : '',
      nama_instansi: this.searchField === 'nama_instansi' ? keyword : ''
    }).subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat users' });
      }
    });
  }

  onSearch() {
    this.loadUsers();
  }

  clearSearch() {
    this.searchField = 'username';
    this.searchKeyword = '';
    this.loadUsers();
  }

  loadPermission() {
    this.loading = true;
    this.accessControl.getPermission('users').subscribe({
      next: (permission) => {
        this.permission = permission;

        if (!permission.can_view) {
          this.users = [];
          this.loading = false;
          this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses melihat users' });
          return;
        }

        this.loadUsers();
        this.loadClients();
      },
      error: () => {
        this.loading = false;
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat hak akses' });
      }
    });
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (res) => {
        this.clients = res;
        this.clientOptions = res
          .filter((client): client is Client & { id: number } => client.id !== undefined)
          .map((client) => ({
            label: client.nama_instansi,
            value: client.id
          }));
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat group user' });
      }
    });
  }

  openAdd() {
    if (!this.permission.can_create) {
      this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses tambah user' });
      return;
    }

    this.dialogTitle = 'Tambah User';
    this.selectedId = undefined;
    this.form.reset({ status: true });
    this.form.get('password')?.setValidators(Validators.required);
    this.form.get('password')?.updateValueAndValidity();
    this.dialogVisible = true;
  }

  openEdit(user: UserCms) {
    if (!this.permission.can_update) {
      this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses edit user' });
      return;
    }

    this.dialogTitle = 'Edit User';
    this.selectedId = user.id;
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.form.patchValue({
      username: user.username,
      password: '',
      client_id: user.client_id,
      status: user.status !== 0
    });
    this.dialogVisible = true;
  }

  getStatusLabel(status?: number): string {
    return status === 1 ? 'Aktif' : 'Nonaktif';
  }

  getStatusSeverity(status?: number): 'success' | 'secondary' {
    return status === 1 ? 'success' : 'secondary';
  }

  save() {
    if (this.form.invalid) return;

    if (this.selectedId && !this.permission.can_update) return;
    if (!this.selectedId && !this.permission.can_create) return;

    const payload = {
      username: this.form.value.username,
      password: this.form.value.password,
      client_id: this.form.value.client_id,
      status: this.form.value.status ? 1 : 0
    };

    const request = this.selectedId
      ? this.userService.updateUser(this.selectedId, payload)
      : this.userService.createUser(payload);

    request.subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Sukses', detail: 'User disimpan' });
        this.dialogVisible = false;
        this.loadUsers();
      },
      error: (err) => {
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Gagal menyimpan user'
        });
      }
    });
  }

  delete(user: UserCms) {
    if (!this.permission.can_delete) {
      this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses hapus user' });
      return;
    }

    this.confirm.confirm({
      message: `Hapus user "${user.username}"?`,
      accept: () => {
        if (!user.id) return;
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.msg.add({ severity: 'success', summary: 'Dihapus', detail: 'User dihapus' });
            this.loadUsers();
          },
          error: (err) => {
            this.msg.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Gagal menghapus user'
            });
          }
        });
      }
    });
  }
}
