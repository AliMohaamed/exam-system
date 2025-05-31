import { Directive, HostListener } from '@angular/core';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';

@Directive({
  selector: '[appHideSidebarOnClick]',
})
export class HideSidebarOnClickDirective {
  constructor(private appComponent: MainLayoutComponent) {}

  @HostListener('click')
  onclick() {
    if (window.innerWidth < 1200) {
      this.appComponent.showSidebar = false;
    }
  }
}
