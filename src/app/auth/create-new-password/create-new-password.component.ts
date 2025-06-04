import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SuccessAlertComponent } from '../../shared/success-alert/success-alert.component';
import { AuthService } from '../auth.service';
import { ToastAlertComponent } from '../../shared/toast-alert/toast-alert.component';

@Component({
  selector: 'app-create-new-password',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, SuccessAlertComponent, ToastAlertComponent],
  templateUrl: './create-new-password.component.html',
  styleUrl: './create-new-password.component.css'
})
export class CreateNewPasswordComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  hidePassword = true;
  showSuccess = false;
  isSubmitting = false;

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

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  productForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
    ConfirmPassword: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
  });

  get getPassword(){
    return this.productForm.get('password');
  }

  get getConfirmPassword(){
    return this.productForm.get('ConfirmPassword');
  }

  onSubmit(){
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
  
    const formValue = this.productForm.value;
  
    // تحقق من تطابق كلمة المرور
    if (formValue.password !== formValue.ConfirmPassword) {
      this.showToastMessage('Passwords do not match.', 'error');
      return;
    }

    this.isSubmitting = true;

    // Get email and OTP from localStorage
    const email = localStorage.getItem('resetEmail');
    const otp = localStorage.getItem('resetOtp');

    if (!email || !otp) {
      this.showToastMessage('Session expired. Please try again.', 'error');
      this.router.navigate(['/auth/forgot-password']);
      return;
    }

    this.authService.resetPassword(email, otp, formValue.password!, formValue.ConfirmPassword!).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.showSuccess = true;
        // Clear the stored email and OTP
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('resetOtp');
      },
      error: (error) => {
        this.isSubmitting = false;
        this.showToastMessage(error.error?.message || 'Failed to reset password. Please try again.', 'error');
      }
    });
  }

  onSuccessAction() {
    this.showSuccess = false;
    this.router.navigate(['/auth/login']);
  }
}
