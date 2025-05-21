import { Component } from '@angular/core';
import { NgApexchartsModule } from "ng-apexcharts";
import { SidebarComponent } from "./admin/admin-dashboard/sidebar/sidebar.component";
import { NavTopComponent } from "./admin/admin-dashboard/nav-top/nav-top.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [NgApexchartsModule, SidebarComponent, NavTopComponent,RouterModule],
templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'exam-system';
}
