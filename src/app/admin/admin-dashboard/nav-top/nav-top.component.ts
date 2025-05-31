import { Component, EventEmitter, Output } from '@angular/core';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-nav-top',
  imports: [],
  templateUrl: './nav-top.component.html',
  styleUrl: './nav-top.component.css',
})
export class NavTopComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private searchService: SearchService) {}

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onSearchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchService.setSearchTerm(term);
  }
}
