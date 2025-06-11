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
import { LoadingComponent } from '../../shared/loading/loading.component';
@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    ToastAlertComponent,
    LoadingComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  constructor(private authService: AuthService, private router: Router) {}

  toastMessage = '';
  toastType: 'success' | 'error' | 'warning' | 'info' = 'info';
  showToast = false;
  isLoading = false;

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

  passwordRegex: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  nameRegex: RegExp = /^[A-Za-z\s]{2,50}$/;
  // phoneRegex: RegExp = /^01[0-2,5]{1}[0-9]{8}$/;

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
    ConfirmPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(this.passwordRegex),
    ]),
    fname: new FormControl('', [
      Validators.required,
      Validators.pattern(this.nameRegex),
    ]),
    level: new FormControl('', Validators.required),
  });

  get getFname() {
    return this.productForm.get('fname');
  }

  get getLevel() {
    return this.productForm.get('level');
  }

  get getEmail() {
    return this.productForm.get('email');
  }

  get getPassword() {
    return this.productForm.get('password');
  }

  get getConfirmPassword() {
    return this.productForm.get('ConfirmPassword');
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.showToastMessage('Please fill all required fields correctly!', 'warning');
      return;
    } 

    const formValue = this.productForm.value;

    if (formValue.password !== formValue.ConfirmPassword) {
      this.showToastMessage('Passwords do not match.', 'warning');
      return;
    }

    this.isLoading = true;
    const signupData = {
      name: formValue.fname ?? '',
      email: formValue.email ?? '',
      level: formValue.level ?? '',
      password: formValue.password ?? '',
      confirmPassword: formValue.ConfirmPassword ?? '',
    };

    this.authService.signup(signupData).subscribe({
      next: (res) => {
        if (res?.message && res.message.toLowerCase().includes('already')) {
          this.showToastMessage('User already exists!', 'error');
        } else {
          this.showToastMessage('Check your Email...', 'success');
          this.productForm.reset();
        }
        this.isLoading = false;
      },
      error: (err) => {
        if (err?.error?.message && err.error.message.toLowerCase().includes('already')) {
          this.showToastMessage('User already exists!', 'error');
        } else {
          this.showToastMessage('Invalid input data or server error.', 'error');
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  Login() {
    this.router.navigate(['/auth/login']);
  }
}
