import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HideSidebarDirective } from '../../shared/directives/hide-sidebar.directive';


@Component({
  selector: 'app-side-barr',
  imports: [RouterModule],
  templateUrl: './side-barr.component.html',
  styleUrl: './side-barr.component.css'
})
export class SideBarrComponent {

  constructor(private router: Router) { }
  // dashboardLinks: { icon: string; text: string }[] = [
  //   { icon: "bi bi-house-door", text: "Dashboard" },
  //   { icon: "bi bi-people-fill", text: "Exams" },
  //   { icon: "bi bi-card-image", text: "Register" },
  //   { icon: "bi bi-file-earmark-text", text: "Reports" },
  //   { icon: "bi bi-paypal", text: "Payment" },
  // ];


  logout() {
  localStorage.removeItem('token');
  this.router.navigate(['/auth/login']);
}

}
