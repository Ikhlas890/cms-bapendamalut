import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { buildApiUrl } from './api.config';

export interface Data {
  id: number;
  nama_jabatan: string;
  nama_pegawai: string;
  parent_id: number | null;
  deskripsi: string;
  foto?: string | null;
  status: string;
  pendidikan: string;
  pengalaman_jabatan: string;
  pengalaman_organisasi: string;
}

@Injectable({ providedIn: 'root' })
export class StrukturOrganisasiService {
  private apiUrl = buildApiUrl('/api/struktur-organisasi');

  constructor(private http: HttpClient) { }

  getData(): Observable<Data[]> {
    return this.http.get<Data[]>(this.apiUrl);
  }

  getDataById(id: number): Observable<Data> {
    return this.http.get<Data>(`${this.apiUrl}/${id}`);
  }

  createData(postData: FormData) {
    return this.http.post(`${this.apiUrl}`, postData);
  }

  updateData(id: number, postData: FormData) {
    return this.http.put(`${this.apiUrl}/${id}`, postData);
  }

  deleteData(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
