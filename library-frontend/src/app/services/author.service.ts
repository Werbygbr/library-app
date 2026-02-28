import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author } from '../models/author.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private apiUrl = `${environment.apiUrl}/api/authors`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl);
  }

  getById(id: string): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/${id}`);
  }

  create(author: Author): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, author);
  }

  update(id: string, author: Author): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, author);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}