import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl, { withCredentials: true });
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  createPost(postData: FormData) {
    return this.http.post(`${this.apiUrl}`, postData, { withCredentials: true });
  }

  updatePost(id: number, postData: FormData) {
    return this.http.put(`${this.apiUrl}/${id}`, postData, { withCredentials: true });
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
