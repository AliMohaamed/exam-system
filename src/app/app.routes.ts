import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { StudentsDashboardComponent } from './admin/students-dashboard/students-dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: '/admin-dashboard', pathMatch: 'full' },
    { path: 'admin-dashboard', component: AdminDashboardComponent },
    // { path: 'exams', component:  },
    { path: 'students', component: StudentsDashboardComponent },
    // { path: 'reports', component:  },
    // { path: 'payment', component: },
    // { path: 'settings', component: },
    // { path: 'sign-out', component: },

    { path: '**', redirectTo: '' }
];
