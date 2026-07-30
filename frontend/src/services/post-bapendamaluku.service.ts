import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { buildApiUrl } from './api.config';

export interface Post {
  id?: number;
  judul_berita: string;
  tanggal_berita: string;
  isi_berita: string;
  sumber_berita: string;
  gambar_berita?: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private apiUrl = buildApiUrl('/api/posts');

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(postData: FormData) {
    return this.http.post(`${this.apiUrl}`, postData);
  }

  updatePost(id: number, postData: FormData) {
    return this.http.put(`${this.apiUrl}/${id}`, postData);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
