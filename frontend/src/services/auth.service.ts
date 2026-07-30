import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { buildApiUrl } from './api.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = buildApiUrl('/api/auth');
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  admin$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {}

  private setAuthState(isLoggedIn: boolean, admin: any = null) {
    this.isLoggedIn$.next(isLoggedIn);
    this.admin$.next(admin);
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
  }

  private setToken(token?: string) {
    if (token) {
      localStorage.setItem('token', token);
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('mpadApiKey');
    localStorage.removeItem('mpadUser');
  }

  login(data: { username: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.setAuthState(true, response);
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      finalize(() => {
        this.setToken();
        this.setAuthState(false);
        this.router.navigate(['/auth/login']);
      })
    );
  }

  checkAuthFromServer() {
    return this.http
      .get<{ loggedIn: boolean; admin?: any }>(`${this.apiUrl}/me`)
      .pipe(
        tap({
          next: (response) => this.setAuthState(response.loggedIn, response.admin || null),
          error: () => {
            this.setToken();
            this.setAuthState(false);
          }
        })
      );
  }
}
