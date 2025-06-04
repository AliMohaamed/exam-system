import { Component, EventEmitter, Output } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SidebarComponent } from '../../admin/admin-dashboard/sidebar/sidebar.component';
import { NavTopComponent } from '../../admin/admin-dashboard/nav-top/nav-top.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [NgApexchartsModule, SidebarComponent, NavTopComponent,RouterModule, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  
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
    // toggle only for small screens
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
