import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type PanduanTipe = 'video' | 'teks' | 'link' | 'file';

export interface Panduan {
    id: number;
    judul: string;
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
    tipe: PanduanTipe;
    konten: string;
    status: number;
}

@Injectable({ providedIn: 'root' })
export class PanduanService {
    private apiUrl = 'http://localhost:3000/api/panduan';

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
            params,
            withCredentials: true
        });
    }

    getPanduanById(id: number): Observable<Panduan> {
        return this.http.get<Panduan>(`${this.apiUrl}/${id}`, {
            withCredentials: true
        });
    }

    createPanduan(payload: PanduanPayload): Observable<{ message: string; panduan: Panduan }> {
        return this.http.post<{ message: string; panduan: Panduan }>(this.apiUrl, payload, {
            withCredentials: true
        });
    }

    updatePanduan(id: number, payload: PanduanPayload): Observable<{ message: string; panduan: Panduan }> {
        return this.http.put<{ message: string; panduan: Panduan }>(`${this.apiUrl}/${id}`, payload, {
            withCredentials: true
        });
    }

    deletePanduan(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
            withCredentials: true
        });
    }
}
