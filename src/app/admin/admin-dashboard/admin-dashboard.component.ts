import { Component } from '@angular/core';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavTopComponent } from "./nav-top/nav-top.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

@Component({
  selector: 'app-admin-dashboard',
  imports: [SidebarComponent, NavTopComponent, DashboardComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
