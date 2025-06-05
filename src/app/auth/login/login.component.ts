import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastAlertComponent } from '../../shared/toast-alert/toast-alert.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, ToastAlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  toastMessage = '';
  toastType: 'success' | 'error' | 'warning' | 'info' = 'info';
  showToast = false;

  showToastMessage(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    this.showToast = false;
    setTimeout(() => {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
    }, 50);
  }

  hidePassword = true;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  forgotPassword() {
    this.router.navigate(['/auth/forgot']);
  }

  registerNow() {
    this.router.navigate(['/auth/register']);
  }

  passwordRegex: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  productForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      (control) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(control.value)) {
          return { invalidEmail: true };
        }
        return null;
      },
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(this.passwordRegex),
    ]),
  });

  get getEmail() {
    return this.productForm.get('email');
  }

  get getPassword() {
    return this.productForm.get('password');
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    } else {
      
      const email = this.productForm.get('email')?.value;
      const password = this.productForm.get('password')?.value;
      if (typeof email === 'string' && typeof password === 'string') {
        this.authService.login({ email, password }).subscribe(
          (response) => {
            console.log('Login successful', response);
            this.showToastMessage('Login successful!', 'success');
            this.productForm.reset();

            const user = {
              name: response.user.name,
              role: response.user.role // 'admin' أو 'student'
            };

            localStorage.setItem('user', JSON.stringify(user));

            if(response.user.role === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else if(response.user.role === 'student') {
              this.router.navigate(['/student-dashboard']);
            }
            else {
              this.router.navigate(['/']);
            }
          },
          (error) => {
            console.error('Login failed', error);
            this.showToastMessage('Invaild your Email or Password', 'error');
          }
        );
      }
      
    }

  }
}
