import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  admin$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {}

  private setAuthState(isLoggedIn: boolean, admin: any = null) {
    this.isLoggedIn$.next(isLoggedIn);
    this.admin$.next(admin);
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
  }

  login(data: { username: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, data, { withCredentials: true }).pipe(
      tap((response) => this.setAuthState(true, response))
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      finalize(() => {
        this.setAuthState(false);
        this.router.navigate(['/auth/login']);
      })
    );
  }

  checkAuthFromServer() {
    return this.http
      .get<{ loggedIn: boolean; admin?: any }>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(
        tap({
          next: (response) => this.setAuthState(response.loggedIn, response.admin || null),
          error: () => this.setAuthState(false)
        })
      );
  }
}
