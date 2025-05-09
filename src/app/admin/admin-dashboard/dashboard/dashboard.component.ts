import { Component } from '@angular/core';
import { StatsticisComponent } from "./statsticis/statsticis.component";

@Component({
  selector: 'app-dashboard',
  imports: [StatsticisComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
