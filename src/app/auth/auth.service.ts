import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://exam-app-expressjs.vercel.app/api/v1/auth/login';
  private registerUrl =
    'https://exam-app-expressjs.vercel.app/api/v1/auth/register';
  private forgotUrl = 'https://exam-app-expressjs.vercel.app/api/v1';

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('Login successful');
        }
      })
    );
  }

  signup(data: {
    name: string;
    email: string;
    level: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post<any>(this.registerUrl, data);
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post(`${this.forgotUrl}/auth/forgetPassword`, { email });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.forgotUrl}/auth/verifyOtp`, { email, otp });
  }

  resetPassword(email: string, otp: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.forgotUrl}/auth/resetPassword`, {
      email,
      otp,
      password,
      confirmPassword
    });
  }
}
