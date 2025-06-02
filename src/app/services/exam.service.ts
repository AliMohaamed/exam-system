import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  baseUrl: string = "https://exam-app-expressjs.vercel.app/api/v1/exam"
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Get all exams
  getAllExamsData(): Observable<any> {
    return this.http.get(this.baseUrl, { headers: this.getHeaders() });
  }

  //Get exam by id
  getExamById(examId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${examId}`, { headers: this.getHeaders() })
  }

  // Add exam
  AddNewExam(examData: any): Observable<any> {
    return this.http.post(this.baseUrl, examData, {
      headers: this.getHeaders()
    });
  }

  // Edit exam by ID
  editExam(examId: string, examData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${examId}`, examData, {
      headers: this.getHeaders()
    });
  }

  // Delete exam by ID
  deletEexam(examId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${examId}`, {
      headers: this.getHeaders()
    });
  }
}
