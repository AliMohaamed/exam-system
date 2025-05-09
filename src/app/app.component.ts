import { Component } from '@angular/core';
import { AdminDashboardComponent } from "./admin/admin-dashboard/admin-dashboard.component";
import { NgApexchartsModule } from "ng-apexcharts";

@Component({
  selector: 'app-root',
  imports: [AdminDashboardComponent,NgApexchartsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'exam-system';
}
