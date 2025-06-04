import { Directive, HostListener } from '@angular/core';
import { StudentLayoutComponent } from '../../layouts/student-layout/student-layout.component';

@Directive({
  selector: '[appHideSidebar]'
})
export class HideSidebarDirective {

  constructor(private appComponent: StudentLayoutComponent) {}

  @HostListener('click')
  onclick() {
    if (window.innerWidth < 1200) {
      this.appComponent.showSidebar = false;
    }
  }

}
