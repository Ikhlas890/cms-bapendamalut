import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { RolePermission, RolePermissionService } from 'src/services/role-permission.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit, OnDestroy {
    model: MenuItem[] = [];

    private menuSubscription?: Subscription;

    constructor(
        private authService: AuthService,
        private rolePermissionService: RolePermissionService
    ) {}

    ngOnInit() {
        const admin = this.authService.admin$.value;

        if (admin?.client_id) {
            this.loadMenuByClient(admin.client_id);
            return;
        }

        this.menuSubscription = this.authService.checkAuthFromServer().subscribe({
            next: (response) => {
                const clientId = response.admin?.client_id;
                if (clientId) {
                    this.loadMenuByClient(clientId);
                } else {
                    this.model = [];
                }
            },
            error: () => {
                this.model = this.getFallbackMenu();
            }
        });
    }

    ngOnDestroy() {
        this.menuSubscription?.unsubscribe();
    }

    private loadMenuByClient(clientId: number) {
        this.menuSubscription?.unsubscribe();
        this.menuSubscription = this.rolePermissionService.getRolePermissions(clientId).subscribe({
            next: (permissions) => {
                this.model = this.mapPermissionsToItems(permissions);
            },
            error: () => {
                this.model = this.getFallbackMenu();
            }
        });
    }

    private mapPermissionsToItems(permissions: RolePermission[]): MenuItem[] {
        const viewablePermissions = [...permissions]
            .filter((permission) => permission.can_view === 1)
            .sort((a, b) => {
                const parentA = a.parent_id ?? a.menu_id;
                const parentB = b.parent_id ?? b.menu_id;

                if (parentA !== parentB) return parentA - parentB;
                if ((a.urutan ?? 0) !== (b.urutan ?? 0)) return (a.urutan ?? 0) - (b.urutan ?? 0);
                return a.menu_id - b.menu_id;
            });

        const itemById = new Map<number, MenuItem>();
        const rootItems: Array<{ permission: RolePermission; item: MenuItem }> = [];

        for (const permission of viewablePermissions) {
            itemById.set(permission.menu_id, this.createMenuItem(permission));
        }

        for (const permission of viewablePermissions) {
            const item = itemById.get(permission.menu_id);
            if (!item) continue;

            if (permission.parent_id && itemById.has(permission.parent_id)) {
                const parent = itemById.get(permission.parent_id);
                parent!.items = [...(parent!.items ?? []), item];
            } else {
                rootItems.push({ permission, item });
            }
        }

        const homeItems = rootItems.filter(({ permission }) => permission.menu_slug === 'dashboard').map(({ item }) => item);
        const pageItems = rootItems.filter(({ permission }) => permission.menu_slug !== 'dashboard').map(({ item }) => item);
        const model: MenuItem[] = [];

        if (homeItems.length) {
            model.push({
                label: 'Home',
                items: homeItems
            });
        }

        if (pageItems.length) {
            model.push({
                label: 'Pages',
                items: pageItems
            });
        }

        return model;
    }

    private createMenuItem(permission: RolePermission): MenuItem {
        const normalizedUrl = this.normalizeUrl(permission.url || '');
        const item: MenuItem = {
            label: permission.nama_menu,
            icon: permission.icon || undefined
        };

        if (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')) {
            item.url = normalizedUrl;
            item.target = '_blank';
        } else if (normalizedUrl) {
            item.routerLink = [normalizedUrl];
        }

        return item;
    }

    private normalizeUrl(url: string): string {
        const normalizedUrl = (url || '').trim();
        if (!normalizedUrl || normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')) {
            return normalizedUrl;
        }

        const route = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
        if (route === '/dashboard' || route.startsWith('/pages/')) {
            return route;
        }

        return `/pages${route}`;
    }

    private getFallbackMenu(): MenuItem[] {
        return [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }]
            },
            {
                label: 'Pages',
                items: [
                    { label: 'Berita', icon: 'pi pi-fw pi-book', routerLink: ['/pages/berita'] },
                    { label: 'Users', icon: 'pi pi-fw pi-user', routerLink: ['/pages/users'] },
                    { label: 'Group Users', icon: 'pi pi-fw pi-users', routerLink: ['/pages/group-users'] },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/pages/menus'] },
                    // { label: 'Daftar Pengaduan', icon: 'pi pi-fw pi-envelope', routerLink: ['/pages/daftar-pengaduan'] },
                    // {
                    //     label: 'Struktur Organisasi',
                    //     icon: 'pi pi-fw pi-users',
                    //     items: [
                    //         {
                    //             label: 'Struktur Organisasi (Master)',
                    //             icon: 'pi pi-fw pi-users',
                    //             routerLink: ['/pages/struktur-organisasi']
                    //         },
                    //         { label: 'Hierarki', 
                    //           icon: 'pi pi-fw pi-users', 
                    //           routerLink: ['/pages/hierarki'] 
                    //         },
                    //     ]
                    // },
                ]
            },
            // {
            //     label: 'UI Components',
            //     items: [
            //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
            //         { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
            //         { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
            //         { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
            //         { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
            //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
            //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
            //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
            //         { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
            //         { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
            //         { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
            //         { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
            //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
            //         { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
            //         { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
            //     ]
            // },
            // {
            //     label: 'Pages',
            //     icon: 'pi pi-fw pi-briefcase',
            //     routerLink: ['/pages'],
            //     items: [
            //         {
            //             label: 'Landing',
            //             icon: 'pi pi-fw pi-globe',
            //             routerLink: ['/landing']
            //         },
            //         {
            //             label: 'Auth',
            //             icon: 'pi pi-fw pi-user',
            //             items: [
            //                 {
            //                     label: 'Login',
            //                     icon: 'pi pi-fw pi-sign-in',
            //                     routerLink: ['/auth/login']
            //                 },
            //                 {
            //                     label: 'Error',
            //                     icon: 'pi pi-fw pi-times-circle',
            //                     routerLink: ['/auth/error']
            //                 },
            //                 {
            //                     label: 'Access Denied',
            //                     icon: 'pi pi-fw pi-lock',
            //                     routerLink: ['/auth/access']
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Crud',
            //             icon: 'pi pi-fw pi-pencil',
            //             routerLink: ['/pages/crud']
            //         },
            //         {
            //             label: 'Not Found',
            //             icon: 'pi pi-fw pi-exclamation-circle',
            //             routerLink: ['/pages/notfound']
            //         },
            //         {
            //             label: 'Empty',
            //             icon: 'pi pi-fw pi-circle-off',
            //             routerLink: ['/pages/empty']
            //         }
            //     ]
            // },
            // {
            //     label: 'Hierarchy',
            //     items: [
            //         {
            //             label: 'Submenu 1',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 1.1',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 1.2',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 2.1',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 2.2',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //                 }
            //             ]
            //         }
            //     ]
            // },
            // {
            //     label: 'Get Started',
            //     items: [
            //         {
            //             label: 'Documentation',
            //             icon: 'pi pi-fw pi-book',
            //             routerLink: ['/documentation']
            //         },
            //         {
            //             label: 'View Source',
            //             icon: 'pi pi-fw pi-github',
            //             url: 'https://github.com/primefaces/sakai-ng',
            //             target: '_blank'
            //         }
            //     ]
            // }
        ];
    }
}
