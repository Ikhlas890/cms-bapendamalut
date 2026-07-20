import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  isLoggedIn$ = new BehaviorSubject<boolean>(false); // reactive approach
  admin$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(data: { username: string, password: string }) {
    return this.http.post(`${this.apiUrl}/login`, data, { withCredentials: true }).pipe(
      tap(() => this.isLoggedIn$.next(true))
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.isLoggedIn$.next(false);
        this.router.navigate(['/auth/login']);
      })
    );
  }

    checkAuthFromServer() {
    return this.http
      .get<{ loggedIn: boolean; admin?: any }>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.isLoggedIn$.next(response.loggedIn);
          this.admin$.next(response.admin || null); // ← simpan data admin
        })
      );
  }
}
