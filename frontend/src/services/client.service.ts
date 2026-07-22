import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api/clients';

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl, { withCredentials: true });
  }

  createClient(payload: ClientPayload): Observable<{ message: string; client: Client }> {
    return this.http.post<{ message: string; client: Client }>(this.apiUrl, payload, {
      withCredentials: true
    });
  }

  updateClient(id: number, payload: ClientPayload): Observable<{ message: string; client: Client }> {
    return this.http.put<{ message: string; client: Client }>(`${this.apiUrl}/${id}`, payload, {
      withCredentials: true
    });
  }

  deleteClient(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }
}
