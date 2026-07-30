import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { buildApiUrl } from './api.config';

export interface Client {
  id?: number;
  nama_instansi: string;
  slug: string;
}

export interface ClientPayload {
  nama_instansi: string;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private apiUrl = buildApiUrl('/api/clients');

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  createClient(payload: ClientPayload): Observable<{ message: string; client: Client }> {
    return this.http.post<{ message: string; client: Client }>(this.apiUrl, payload);
  }

  updateClient(id: number, payload: ClientPayload): Observable<{ message: string; client: Client }> {
    return this.http.put<{ message: string; client: Client }>(`${this.apiUrl}/${id}`, payload);
  }

  deleteClient(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
