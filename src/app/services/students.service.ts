import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  baseUrl: string = "https://exam-app-expressjs.vercel.app/api/v1/student"
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Get all students
  getAllStudentData(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}?page=${page}`, { headers: this.getHeaders() });
  }

  //Get student by id
  getStudentById(studentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${studentId}`, { headers: this.getHeaders() })
  }

  // Add student
  AddNewStudent(studentData: any): Observable<any> {
    return this.http.post(this.baseUrl, studentData, {
      headers: this.getHeaders()
    });
  }

  // Edit student by ID
  editStudent(studentId: string, studentData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${studentId}`, studentData, {
      headers: this.getHeaders()
    });
  }

  // Delete student by ID
  deleteStudent(studentId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${studentId}`, {
      headers: this.getHeaders()
    });
  }
  getStudentDetails(): Observable<any> {
     return this.http.get(`${this.baseUrl}/profile`, { headers: this.getHeaders() })
   }
}

