import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { buildApiUrl } from './api.config';

export type PanduanTipe = 'video' | 'teks' | 'link' | 'file';

export interface Panduan {
    id: number;
    judul: string;
    deskripsi: string | null;
    tipe: PanduanTipe;
    konten: string | null;
    status: number;
    created_by?: number | null;
    updated_by?: number | null;
    created_at?: string;
    updated_at?: string;
}

export interface PanduanPayload {
    judul: string;
    deskripsi: string;
    tipe: PanduanTipe;
    konten: string;
    status: number;
}

export type PanduanRequestPayload = PanduanPayload | FormData;

@Injectable({ providedIn: 'root' })
export class PanduanService {
    private apiUrl = buildApiUrl('/api/panduan');

    constructor(private http: HttpClient) {}

    getPanduan(filters: { status?: number; tipe?: PanduanTipe } = {}): Observable<Panduan[]> {
        let params = new HttpParams();

        if (filters.status !== undefined) {
            params = params.set('status', filters.status);
        }

        if (filters.tipe !== undefined) {
            params = params.set('tipe', filters.tipe);
        }

        return this.http.get<Panduan[]>(this.apiUrl, {
            params
        });
    }

    getPanduanById(id: number): Observable<Panduan> {
        return this.http.get<Panduan>(`${this.apiUrl}/${id}`);
    }

    createPanduan(payload: PanduanRequestPayload): Observable<{ message: string; panduan: Panduan }> {
        return this.http.post<{ message: string; panduan: Panduan }>(this.apiUrl, payload);
    }

    updatePanduan(id: number, payload: PanduanRequestPayload): Observable<{ message: string; panduan: Panduan }> {
        return this.http.put<{ message: string; panduan: Panduan }>(`${this.apiUrl}/${id}`, payload);
    }

    deletePanduan(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}
