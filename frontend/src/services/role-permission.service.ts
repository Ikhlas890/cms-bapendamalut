import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RolePermission {
    id: number;
    client_id: number;
    nama_instansi?: string;
    client_slug?: string;
    menu_id: number;
    nama_menu?: string;
    menu_slug?: string;
    url?: string;
    icon?: string | null;
    parent_id?: number | null;
    urutan?: number;
    can_view: number;
    can_create: number;
    can_update: number;
    can_delete: number;
    created_at?: string;
    updated_at?: string;
}

export interface RolePermissionPayload {
    client_id: number;
    menu_id: number;
    can_view: number;
    can_create: number;
    can_update: number;
    can_delete: number;
}

@Injectable({ providedIn: 'root' })
export class RolePermissionService {
    private apiUrl = 'http://localhost:3000/api/role-permissions';

    constructor(private http: HttpClient) {}

    getRolePermissions(clientId?: number, menuId?: number): Observable<RolePermission[]> {
        let params = new HttpParams();

        if (clientId !== undefined) {
            params = params.set('client_id', clientId);
        }

        if (menuId !== undefined) {
            params = params.set('menu_id', menuId);
        }

        return this.http.get<RolePermission[]>(this.apiUrl, {
            params,
            withCredentials: true
        });
    }

    createRolePermission(payload: RolePermissionPayload): Observable<{ message: string; permission: RolePermission }> {
        return this.http.post<{ message: string; permission: RolePermission }>(this.apiUrl, payload, {
            withCredentials: true
        });
    }

    updateRolePermission(id: number, payload: RolePermissionPayload): Observable<{ message: string; permission: RolePermission }> {
        return this.http.put<{ message: string; permission: RolePermission }>(`${this.apiUrl}/${id}`, payload, {
            withCredentials: true
        });
    }
}
