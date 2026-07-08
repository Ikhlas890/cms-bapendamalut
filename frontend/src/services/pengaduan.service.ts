import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pengaduan {
  id: number;
  email: string;
  judul_laporan: string;
  isi_laporan: string;
  tanggal_kejadian: string;
  lokasi_kejadian: string;
  kategori_laporan: string;
  status_pengadu: string;
}

@Injectable({ providedIn: 'root' })
export class PengaduanService {
  private apiUrl = 'https://api-malut-cms.intermatika.id/api/pengaduan'; 

  constructor(private http: HttpClient) {}

  createPengaduan(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  
  getPengaduan(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPengaduanById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
