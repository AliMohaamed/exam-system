import { Component, EventEmitter, Output } from '@angular/core';
import { SearchService } from '../../../services/search.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-top',
  imports: [],
  templateUrl: './nav-top.component.html',
  styleUrl: './nav-top.component.css',
})
export class NavTopComponent {
  searchTerm: string = '';
  searchResults: any[] = [];
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private searchService: SearchService, private router: Router) { }

  // get role , if student then don't show search, if admin then show admin search
  role?: string ;
  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    this.role = user?.role;
    console.log('User :', user);
    console.log('User role:', this.role);
  }
  

  onSearchResults() {
    if (this.searchTerm.trim()) {
      this.searchService.searchResults(this.searchTerm).subscribe({
        next: (results) => this.searchResults = results.data.attempts,
        error: (err) => console.error(err)
      });
    }
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.searchService.setSearchTerm(value);

    if (value.trim()) {
      this.router.navigate([], {
        queryParams: { q: value },
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate([], {
        queryParams: { q: null },
        queryParamsHandling: 'merge'
      });
    }
  }


  onSearchStudents() {
    if (this.searchTerm.trim()) {
      this.searchService.searchStudents(this.searchTerm).subscribe({
        next: (results) => this.searchResults = results.data,
        error: (err) => console.error(err)
      });
    }
  }
}
