import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  baseUrl: string = "https://exam-app-expressjs.vercel.app/api/v1/exam";
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    // const token= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmU4ZGQ4NTI0ODIyNjFlODM2MzQwMSIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ4NzA2MjQ5LCJleHAiOjE3NDg4NzkwNDl9.7Pn1_uo5KPafEp8GzpS6xkJ_-sprCF_SrLTiEGM_07s'
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Get all exams with pagination
  getAllExamsData(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}?page=${page}`, {
      headers: this.getHeaders(),
    });
  }

  //Get exam by id
  getExamById(examId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${examId}`, {
      headers: this.getHeaders(),
    });
  }

  // Add exam
  AddNewExam(examData: {
    subject: string;
    description: string;
    level: string;
    duration: number;
  }): Observable<any> {
    return this.http.post(this.baseUrl, examData, {
      headers: this.getHeaders(),
    });
  }

  // Edit exam by ID
  editExam(
    examId: string,
    examData: {
      subject: string;
      description: string;
      level: string;
      duration: number;
    }
  ): Observable<any> {
    return this.http.put(`${this.baseUrl}/${examId}`, examData, {
      headers: this.getHeaders(),
    });
  }

  // Delete exam by ID
  deletEexam(examId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${examId}`, {
      headers: this.getHeaders(),
    });
  }
}
