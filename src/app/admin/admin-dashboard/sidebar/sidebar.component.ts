import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  dashboardLinks: { icon: string; text: string }[] = [
    { icon: "bi bi-house-door", text: "Dashboard" },
    { icon: "bi bi-people-fill", text: "Exams" },
    { icon: "bi bi-card-image", text: "Register" },
    { icon: "bi bi-file-earmark-text", text: "Reports" },
    { icon: "bi bi-paypal", text: "Payment" },
  ];
}
