import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { StudentsDashboardComponent } from './admin/students-dashboard/students-dashboard.component';
import { StudentsDetailsComponent } from './admin/students-dashboard/students-details/students-details.component';
import { StudentFormComponent } from './admin/students-dashboard/student-form/student-form.component';
import { ExamsComponent } from './admin/exams/exams.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { OtpVerificationComponent } from './auth/otp-verification/otp-verification.component';
import { CreateNewPasswordComponent } from './auth/create-new-password/create-new-password.component';
import { ConfirmPasswordComponent } from './auth/confirm-password/confirm-password.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'exams', component: ExamsComponent },
      { path: 'students', component: StudentsDashboardComponent },
      { path: 'students/:id', component: StudentsDetailsComponent },
      { path: 'students/edit/:id', component: StudentFormComponent },
      // TODO: Add routes like /reports, /payment, etc.
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: SignUpComponent },
      { path: 'forgot', component: ForgotPasswordComponent },
      { path: 'otp', component: OtpVerificationComponent },
      { path: 'createPasssword', component: CreateNewPasswordComponent },
      { path: 'confirmEmail/:activationCode', component: ConfirmPasswordComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];
