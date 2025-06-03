import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private baseUrl = 'https://exam-app-expressjs.vercel.app/api/v1/exam';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
     const token = localStorage.getItem('token');
    //  const token= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmU4ZGQ4NTI0ODIyNjFlODM2MzQwMSIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ4NzA2MjQ5LCJleHAiOjE3NDg4NzkwNDl9.7Pn1_uo5KPafEp8GzpS6xkJ_-sprCF_SrLTiEGM_07s'
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getExamQuestions(examId: string, page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/${examId}/question?page=${page}`, {
      headers: this.getHeaders(),
    });
  }

  addQuestion(
    examId: string,
    questionData: {}
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/${examId}/question`, questionData, {
      headers: this.getHeaders(),
    });
  }

  updateQuestion(
    examId: string,
    questionId: string,
    questionData: {}
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${examId}/question/${questionId}`,
      questionData,
      {
        headers: this.getHeaders(),
      }
    );
  }

  deleteQuestion(examId: string, questionId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${examId}/question/${questionId}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}
