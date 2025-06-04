import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastAlertComponent } from '../../shared/toast-alert/toast-alert.component';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule,ToastAlertComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

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

  isLoading = false;
  errorMessage = '';

  loginNow() {
    this.router.navigate(['/auth/login']);
  }

  productForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      (control) => {
        const regex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(control.value)) {
          return { invalidEmail: true };
        }
        return null;
      },
    ]),
  });

  get getEmail(){
    return this.productForm.get('email')
  }

  onSubmit(){
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const email = this.productForm.get('email')?.value;

    this.authService.forgetPassword(email!).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem('resetEmail', email!);
        this.router.navigate(['/auth/otp']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
        this.showToastMessage(`${this.errorMessage}`, 'error');
      }
    });

    this.productForm.reset();
  }
}
