import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { RolePermission, RolePermissionService } from './role-permission.service';

export interface CrudPermission {
    can_view: boolean;
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
}

const emptyPermission: CrudPermission = {
    can_view: false,
    can_create: false,
    can_update: false,
    can_delete: false
};

@Injectable({ providedIn: 'root' })
export class AccessControlService {
    constructor(
        private authService: AuthService,
        private rolePermissionService: RolePermissionService
    ) {}

    getPermission(menuSlug: string): Observable<CrudPermission> {
        const admin = this.authService.admin$.value;

        if (admin?.client_id) {
            return this.getPermissionByClient(admin.client_id, menuSlug);
        }

        return this.authService.checkAuthFromServer().pipe(
            switchMap((response) => {
                const clientId = response.admin?.client_id;
                return clientId ? this.getPermissionByClient(clientId, menuSlug) : of(emptyPermission);
            })
        );
    }

    private getPermissionByClient(clientId: number, menuSlug: string): Observable<CrudPermission> {
        return this.rolePermissionService.getRolePermissions(clientId).pipe(
            map((permissions) => this.toCrudPermission(permissions.find((permission) => permission.menu_slug === menuSlug)))
        );
    }

    private toCrudPermission(permission?: RolePermission): CrudPermission {
        if (!permission) return emptyPermission;

        return {
            can_view: permission.can_view === 1,
            can_create: permission.can_create === 1,
            can_update: permission.can_update === 1,
            can_delete: permission.can_delete === 1
        };
    }
}
