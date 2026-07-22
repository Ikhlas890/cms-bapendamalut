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
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
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
    InputIconModule,
    IconFieldModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
  @ViewChild('dt') dt!: Table;

  users: UserCms[] = [];
  clients: Client[] = [];
  clientOptions: { label: string; value: number }[] = [];
  form!: FormGroup;
  dialogVisible = false;
  dialogTitle = 'Tambah User';
  selectedId?: number;
  loading = false;

  constructor(
    private userService: UserService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
    this.loadClients();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  initForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      client_id: [null, Validators.required]
    });
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
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
    this.dialogTitle = 'Tambah User';
    this.selectedId = undefined;
    this.form.reset();
    this.form.get('password')?.setValidators(Validators.required);
    this.form.get('password')?.updateValueAndValidity();
    this.dialogVisible = true;
  }

  openEdit(user: UserCms) {
    this.dialogTitle = 'Edit User';
    this.selectedId = user.id;
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.form.patchValue({
      username: user.username,
      password: '',
      client_id: user.client_id
    });
    this.dialogVisible = true;
  }

  save() {
    if (this.form.invalid) return;

    const payload = {
      username: this.form.value.username,
      password: this.form.value.password,
      client_id: this.form.value.client_id
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
