import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

const MPAD_API_BASE_URL = 'https://mpad-api.usadi.co.id';
const MPAD_API_KEY_STORAGE = 'mpadApiKey';
const MPAD_USER_STORAGE = 'mpadUser';

export interface MpadLoginResponse {
  status_code: number;
  message: string;
  data: {
    Phone: number;
    Avatar: string | null;
    email: string;
    userid: string;
    nama_user: string;
    NIK: string | null;
    APIkey: string;
  };
}

export interface FeedbackUser {
  FeedbackID: number;
  JenisFeedback: string;
  Judul: string;
  Deskripsi: string;
  Rating: number;
  Status: string;
  TglFeedback: string;
  Tanggal: string;
}

export interface FeedbackUserQuery {
  page?: number;
  length?: number;
  sort?: string;
  sort_dir?: string;
  search?: string;
  status?: string;
  jenis_feedback?: string;
}

export interface FeedbackUserResponse {
  status_code: number;
  message: string;
  total?: number;
  page?: number;
  pages?: number;
  page_total?: number;
  page_current?: number;
  records_perpage?: number;
  records_total?: number;
  data: FeedbackUser[];
}

export interface FeedbackReplyPayload {
  Status: string;
  TanggapanAdmin: string;
}

@Injectable({ providedIn: 'root' })
export class MpadService {
  private readonly apiUrl = MPAD_API_BASE_URL;

  constructor(private http: HttpClient) {}

  loginAdmin(): Observable<MpadLoginResponse> {
    return this.http.post<MpadLoginResponse>(`${this.apiUrl}/login`, {
      userid: 'ikhlas',
      password: '123456'
    }).pipe(
      tap((response) => {
        const apiKey = response.data?.APIkey;
        if (response.status_code === 1 && apiKey) {
          localStorage.setItem(MPAD_API_KEY_STORAGE, apiKey);
          localStorage.setItem(MPAD_USER_STORAGE, JSON.stringify(response.data));
        }
      })
    );
  }

  getFeedbackUsers(query: FeedbackUserQuery = {}): Observable<FeedbackUserResponse> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<FeedbackUserResponse>(`${this.apiUrl}/feedback_user`, {
      params,
      headers: this.createApiHeaders()
    });
  }

  replyFeedback(id: number, payload: FeedbackReplyPayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/feedback_reply/${id}`, payload, {
      headers: this.createApiHeaders()
    });
  }

  clearSession() {
    localStorage.removeItem(MPAD_API_KEY_STORAGE);
    localStorage.removeItem(MPAD_USER_STORAGE);
  }

  private createApiHeaders(): HttpHeaders {
    const apiKey = localStorage.getItem(MPAD_API_KEY_STORAGE);
    return apiKey ? new HttpHeaders({ APIkey: apiKey }) : new HttpHeaders();
  }
}
