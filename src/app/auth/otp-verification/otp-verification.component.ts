import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastAlertComponent } from '../../shared/toast-alert/toast-alert.component';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastAlertComponent],
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('digit1') firstInput!: ElementRef;
  
  otpForm: FormGroup;
  isSubmitting = false;
  email: string = '';
  timeLeft: number = 300;
  showTimer: boolean = true;
  private timerSubscription?: Subscription;

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

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

  loginNow() {
    this.router.navigate(['/auth/login']);
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit2: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit3: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit4: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit5: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit6: ['', [Validators.required, Validators.pattern('^[0-9]$')]]
    });
  }

  ngOnInit(): void {
    this.startTimer();
    // Get email from localStorage or state management
    this.email = localStorage.getItem('resetEmail') || '';
    if (!this.email) {
      this.showToastMessage('Email not found. Please try again.', 'error');
      setTimeout(() => {
        this.router.navigate(['/auth/forgot-password']);
      }, 2000);
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    // Add a small delay to ensure the view is fully rendered
    setTimeout(() => {
      this.firstInput.nativeElement.focus();
    }, 100);
  }

  startTimer() {
    this.timeLeft = 300;
    this.showTimer = true;
    
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.showTimer = false;
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }
      }
    });
  }

  resendCode() {
    const email = localStorage.getItem('resetEmail');
    if (!email) {
      this.showToastMessage('Email not found. Please try again.', 'error');
      this.router.navigate(['/auth/forgot-password']);
      return;
    }

    this.authService.forgetPassword(email).subscribe({
      next: (response) => {
        this.showToastMessage('New OTP has been sent to your email.', 'success');
        this.startTimer(); // Start the timer again
        this.otpForm.reset(); // Clear the OTP inputs
      },
      error: (error) => {
        this.showToastMessage(error.error?.message || 'Failed to resend OTP. Please try again.', 'error');
      }
    });
  }

  onDigitInput(event: any, nextInput: HTMLInputElement | null) {
    const input = event.target;
    const value = input.value;

    if (value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, currentInput: HTMLInputElement, prevInput: HTMLInputElement | null) {
    if (event.key === 'Backspace' && !currentInput.value && prevInput) {
      prevInput.focus();
    }
  }

  onSubmit() {
    if (this.otpForm.valid) {
      this.isSubmitting = true;
      const otp = Object.values(this.otpForm.value).join('');
      
      this.authService.verifyOtp(this.email, otp).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.showToastMessage('OTP verified successfully!', 'success');
          localStorage.setItem('resetOtp', otp);
          setTimeout(() => {
            this.router.navigate(['/auth/createPasssword']);
          }, 1500);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showToastMessage(error.error?.message || 'Invalid OTP. Please try again.', 'error');
        }
      });
    }
  }
} 