import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  baseUrl: string = "https://exam-app-expressjs.vercel.app/api/v1/admin/exams/attempts"
  base2: string = "https://exam-app-expressjs.vercel.app/api/v1/student"
  constructor(private http: HttpClient) { }

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }


  searchResults(query: string): Observable<any> {
    const url = `${this.baseUrl}?q=${encodeURIComponent(query)}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  searchStudents(query: string): Observable<any> {
    const url = `${this.base2}?q=${encodeURIComponent(query)}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }
}
