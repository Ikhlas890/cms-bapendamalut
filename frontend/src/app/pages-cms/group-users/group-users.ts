import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AccessControlService, CrudPermission } from 'src/services/access-control.service';
import { Client, ClientService } from 'src/services/client.service';

@Component({
  selector: 'app-group-users',
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
    InputIconModule,
    IconFieldModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './group-users.html',
  styleUrl: './group-users.scss'
})
export class GroupUsers {
  @ViewChild('dt') dt!: Table;

  clients: Client[] = [];
  form!: FormGroup;
  dialogVisible = false;
  dialogTitle = 'Tambah Group User';
  selectedId?: number;
  loading = false;
  permission: CrudPermission = {
    can_view: false,
    can_create: false,
    can_update: false,
    can_delete: false
  };

  constructor(
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

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  initForm() {
    this.form = this.fb.group({
      nama_instansi: ['', Validators.required]
    });
  }

  loadClients() {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: (res) => {
        this.clients = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat group user' });
      }
    });
  }

  loadPermission() {
    this.loading = true;
    this.accessControl.getPermission('group-users').subscribe({
      next: (permission) => {
        this.permission = permission;

        if (!permission.can_view) {
          this.clients = [];
          this.loading = false;
          this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses melihat group user' });
          return;
        }

        this.loadClients();
      },
      error: () => {
        this.loading = false;
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat hak akses' });
      }
    });
  }

  openAdd() {
    if (!this.permission.can_create) {
      this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses tambah group user' });
      return;
    }

    this.dialogTitle = 'Tambah Group User';
    this.selectedId = undefined;
    this.form.reset();
    this.dialogVisible = true;
  }

  openEdit(client: Client) {
    if (!this.permission.can_update) {
      this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses edit group user' });
      return;
    }

    this.dialogTitle = 'Edit Group User';
    this.selectedId = client.id;
    this.form.patchValue({
      nama_instansi: client.nama_instansi
    });
    this.dialogVisible = true;
  }

  save() {
    if (this.form.invalid) return;

    if (this.selectedId && !this.permission.can_update) return;
    if (!this.selectedId && !this.permission.can_create) return;

    const payload = {
      nama_instansi: this.form.value.nama_instansi
    };

    const request = this.selectedId
      ? this.clientService.updateClient(this.selectedId, payload)
      : this.clientService.createClient(payload);

    request.subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Sukses', detail: 'Group user disimpan' });
        this.dialogVisible = false;
        this.loadClients();
      },
      error: (err) => {
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Gagal menyimpan group user'
        });
      }
    });
  }

  delete(client: Client) {
    if (!this.permission.can_delete) {
      this.msg.add({ severity: 'warn', summary: 'Akses Ditolak', detail: 'Anda tidak memiliki akses hapus group user' });
      return;
    }

    this.confirm.confirm({
      message: `Hapus group user "${client.nama_instansi}"?`,
      accept: () => {
        if (!client.id) return;
        this.clientService.deleteClient(client.id).subscribe({
          next: () => {
            this.msg.add({ severity: 'success', summary: 'Dihapus', detail: 'Group user dihapus' });
            this.loadClients();
          },
          error: (err) => {
            this.msg.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Gagal menghapus group user'
            });
          }
        });
      }
    });
  }
}
