import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HideSidebarOnClickDirective } from '../../../shared/directives/hide-sidebar-on-click.directive';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, HideSidebarOnClickDirective],
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
