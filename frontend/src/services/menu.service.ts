import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { buildApiUrl } from './api.config';

export interface BackendMenu {
    id: number;
    nama_menu: string;
    slug: string;
    url: string;
    icon: string | null;
    parent_id: number | null;
    urutan: number;
    status: number;
    created_at?: string;
    updated_at?: string;
}

export interface MenuPayload {
    nama_menu: string;
    url: string;
    icon: string | null;
    parent_id: number | null;
    urutan: number;
    status: number;
}

@Injectable({ providedIn: 'root' })
export class MenuService {
    private apiUrl = buildApiUrl('/api/menus');

    constructor(private http: HttpClient) {}

    getMenus(status?: number): Observable<BackendMenu[]> {
        let params = new HttpParams();

        if (status !== undefined) {
            params = params.set('status', status);
        }

        return this.http.get<BackendMenu[]>(this.apiUrl, {
            params
        });
    }

    createMenu(payload: MenuPayload): Observable<{ message: string; menu: BackendMenu }> {
        return this.http.post<{ message: string; menu: BackendMenu }>(this.apiUrl, payload);
    }

    updateMenu(id: number, payload: MenuPayload): Observable<{ message: string; menu: BackendMenu }> {
        return this.http.put<{ message: string; menu: BackendMenu }>(`${this.apiUrl}/${id}`, payload);
    }

    deleteMenu(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}
