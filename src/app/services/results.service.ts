import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  baseUrl: string = "https://exam-app-expressjs.vercel.app/api/v1/admin/exams/attempts"
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Get all results
  getAllResultsData(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}?page=${page}`, { headers: this.getHeaders() });
  }

  downloadExcelFile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return this.http.get('https://exam-app-expressjs.vercel.app/api/v1/admin/exams/attempts/export-excel', {
      headers,
      responseType: 'blob'
    });
  }
}

