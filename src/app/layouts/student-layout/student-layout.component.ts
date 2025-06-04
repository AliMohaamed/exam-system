import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideBarrComponent } from "../../student/side-barr/side-barr.component";
import { NavTopComponent } from "../../admin/admin-dashboard/nav-top/nav-top.component";
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-student-layout',
  imports: [NgApexchartsModule, RouterModule, SideBarrComponent, CommonModule, NavTopComponent],
  templateUrl: './student-layout.component.html',
  styleUrl: './student-layout.component.css'
})
export class StudentLayoutComponent {

  showSidebar = true;

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  checkScreenSize() {
    const isLarge = window.innerWidth >= 1200;
    this.showSidebar = isLarge;
  }

  toggleSidebar() {
    if (window.innerWidth < 1200) {
      this.showSidebar = !this.showSidebar;
    }
  }

  onPageClick() {
    if (window.innerWidth < 1200 && this.showSidebar) {
      this.showSidebar = false;
    }
  }

  onSidebarClick(event: MouseEvent) {
    event.stopPropagation();
  }

}
