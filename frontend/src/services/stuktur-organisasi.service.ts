import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private apiUrl = 'https://api-malut-cms.intermatika.id/api/struktur-organisasi';

  constructor(private http: HttpClient) { }

  getData(): Observable<Data[]> {
    return this.http.get<Data[]>(this.apiUrl, { withCredentials: true });
  }

  getDataById(id: number): Observable<Data> {
    return this.http.get<Data>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  createData(postData: FormData) {
    return this.http.post(`${this.apiUrl}`, postData, { withCredentials: true });
  }

  updateData(id: number, postData: FormData) {
    return this.http.put(`${this.apiUrl}/${id}`, postData, { withCredentials: true });
  }

  deleteData(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
