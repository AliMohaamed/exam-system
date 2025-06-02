import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './student/dashboard/student-dashboard/student-dashboard.component';
import { ExamComponent } from './exams/exam/exam.component';
import { ExamGuard } from './core/guards/exam.guard';
import { StudentExamsComponent } from './student/dashboard/student-exams/student-exams.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'student-dashboard',
    pathMatch: 'full'
  },
  {
    path: 'student-dashboard',
    component: StudentDashboardComponent
  },
  {
    path: 'exams/:id',
    component: ExamComponent,
    canDeactivate: [ExamGuard]
  },
  {
    path: 'student-exams',
    component: StudentExamsComponent
  }
];
