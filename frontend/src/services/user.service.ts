import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserCms {
  id?: number;
  username: string;
  client_id: number;
  nama_instansi?: string;
  slug?: string;
  status?: number;
}

export interface UserPayload {
  username: string;
  password?: string;
  client_id: number;
  status: number;
}

export interface UserSearchParams {
  username?: string;
  nama_instansi?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/api/auth/users';

  constructor(private http: HttpClient) {}

  getUsers(searchParams: UserSearchParams = {}): Observable<UserCms[]> {
    let params = new HttpParams();

    if (searchParams.username?.trim()) {
      params = params.set('username', searchParams.username.trim());
    }

    if (searchParams.nama_instansi?.trim()) {
      params = params.set('nama_instansi', searchParams.nama_instansi.trim());
    }

    return this.http.get<UserCms[]>(this.apiUrl, { params, withCredentials: true });
  }

  createUser(payload: UserPayload & { password: string }): Observable<{ message: string; user: UserCms }> {
    return this.http.post<{ message: string; user: UserCms }>(this.apiUrl, payload, {
      withCredentials: true
    });
  }

  updateUser(id: number, payload: UserPayload): Observable<{ message: string; user: UserCms }> {
    return this.http.put<{ message: string; user: UserCms }>(`${this.apiUrl}/${id}`, payload, {
      withCredentials: true
    });
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }
}
