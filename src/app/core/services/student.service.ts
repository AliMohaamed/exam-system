import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StudentExam, ExamsResponse } from '../models/student-exam.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'https://exam-app-expressjs.vercel.app/api/v1/student';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2RmZTk1OGMzOTFmY2Q0YjEzNGZmMiIsImVtYWlsIjoiaGFzc2FuQGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQ4ODkzMzc3LCJleHAiOjE3NDkwNjYxNzd9.KoKelNayklKXbZY6Ixru9W8CeX0gzLrGvB2utcKosUg';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAvailableExams(): Observable<StudentExam[]> {
    return this.http.get<ExamsResponse>(`${this.baseUrl}/exams/available`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data.exams)
    );
  }
}

