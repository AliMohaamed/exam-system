import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamStartResponse, QuestionsResponse } from '../models/student-exam.interface';
import { ExamResultResponse,ExamResultsResponse } from '../models/exam-result.interface';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private baseUrl = 'https://exam-app-expressjs.vercel.app/api/v1/student';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
   
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2RmZTk1OGMzOTFmY2Q0YjEzNGZmMiIsImVtYWlsIjoiaGFzc2FuQGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQ4ODkzMzc3LCJleHAiOjE3NDkwNjYxNzd9.KoKelNayklKXbZY6Ixru9W8CeX0gzLrGvB2utcKosUg';
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  startExam(examId: string): Observable<ExamStartResponse> {
    return this.http.post<ExamStartResponse>(
      `${this.baseUrl}/exams/${examId}/start`,
      {}, // Empty body but required
      {
        headers: this.getHeaders()
      }
    ).pipe(
      tap(response => console.log('Start exam API response:', response)),
      catchError(error => {
        console.error('Start exam API error:', error);
        throw error;
      })
    );
  }

  getExamQuestions(attemptId: string): Observable<QuestionsResponse> {
    console.log('Fetching questions for attempt:', attemptId); // Debug log
    return this.http.get<QuestionsResponse>(
      `${this.baseUrl}/exams/attempts/${attemptId}/questions`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => console.log('Questions API response:', response)), // Debug log
      catchError(error => {
        console.error('Questions API error:', error);
        throw error;
      })
    );
  }

  submitExamAnswers(attemptId: string, answers: { answers: { questionId: string; answer: string | boolean }[] }): Observable<ExamResultResponse> {
    return this.http.post<ExamResultResponse>(
      `${this.baseUrl}/exams/attempts/${attemptId}/submit`,
      answers,
      { headers: this.getHeaders() }
    );
  }

  getStudentExamResults(): Observable<ExamResultsResponse> {
    return this.http.get<ExamResultsResponse>(
      `${this.baseUrl}/exams/results`,
      { headers: this.getHeaders() }
    );
  }

  getExamAttemptDetails(attemptId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/exams/attempts/${attemptId}/result`,
      { headers: this.getHeaders() }
    );
  }
}
