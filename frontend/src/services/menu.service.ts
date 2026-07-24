import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    private apiUrl = 'http://localhost:3000/api/menus';

    constructor(private http: HttpClient) {}

    getMenus(status?: number): Observable<BackendMenu[]> {
        let params = new HttpParams();

        if (status !== undefined) {
            params = params.set('status', status);
        }

        return this.http.get<BackendMenu[]>(this.apiUrl, {
            params,
            withCredentials: true
        });
    }

    createMenu(payload: MenuPayload): Observable<{ message: string; menu: BackendMenu }> {
        return this.http.post<{ message: string; menu: BackendMenu }>(this.apiUrl, payload, {
            withCredentials: true
        });
    }

    updateMenu(id: number, payload: MenuPayload): Observable<{ message: string; menu: BackendMenu }> {
        return this.http.put<{ message: string; menu: BackendMenu }>(`${this.apiUrl}/${id}`, payload, {
            withCredentials: true
        });
    }

    deleteMenu(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
            withCredentials: true
        });
    }
}
