import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ResultsService } from '../../services/results.service';
import { SearchService } from '../../services/search.service';
import { LoadingComponent } from "../../shared/loading/loading.component";
import { SmallCardComponent } from "../../shared/components/small-card/small-card.component";
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from "../../shared/not-found/not-found.component";

@Component({
  selector: 'app-reports',
  imports: [LoadingComponent, SmallCardComponent, CommonModule, NotFoundComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  data: any;
  Results: any[] = []
  allResults: any[] = []
  isLoading: boolean = true;
  avgScore: number = 0;
  totalExams: number = 0
  totalStudents: number = 0
  currentPage: number = 1;
  totalPages: number = 1;
  pagesArray: number[] = [];
  noResultsFound: boolean = false;
  attempts:number=0


  private searchSubscription!: Subscription;
  constructor(private ResultsService: ResultsService, private router: Router, private searchService: SearchService, private route: ActivatedRoute) { }

  // ngOnInit() {
  //   this.route.queryParams.subscribe(params => {
  //     this.loadResults();
  //   });

  //   this.searchSubscription = this.searchService.searchTerm$.subscribe(term => {
  //     this.filterResults(term);
  //   });
  // }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const page = +params['page'] || 1;
      const q = params['q']?.trim();

      this.currentPage = page;

      if (q) {
        this.filterResults(q);
      } else {
        this.loadResults(page);
      }
    });

    this.searchSubscription = this.searchService.searchTerm$.subscribe(term => {
      this.filterResults(term);
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  loadResults(page: number = 1) {
    this.isLoading = true;
    this.ResultsService.getAllResultsData(page).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.data = res.data.totalAttempts;
        this.totalExams = res.data.totalExams;
        this.totalStudents = res.data.totalStudents;
        this.attempts=res.data.totalResultsAttemptsInPage
        this.Results = res.data.attempts;
        this.allResults = [...this.Results];
        this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.currentPage = page;
        this.totalPages = res.data.totalPages;
        this.avgScore = res.data.avgScore
        console.log(res.data)
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching students:', err);
      }
    });
  }


  // filterResults(term: string) {
  //   const searchTerm = term.toLowerCase();
  //   this.Results = this.allResults.filter(result =>
  //     result.student.name.toLowerCase().includes(searchTerm)
  //   );
  // }

  filterResults(term: string) {
    const trimmedTerm = term.trim();

    if (!trimmedTerm) {
      if (this.Results.length === this.allResults.length) return;

      this.loadResults(this.currentPage);
      this.noResultsFound = false; // Reset no results state
      return;
    }

    this.isLoading = true;
    this.searchService.searchResults(trimmedTerm).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.data = res.data.totalAttempts;
        this.Results = res.data.attempts;
        this.totalExams = res.data.totalExams;
        this.totalStudents = res.data.totalStudents;
        this.avgScore = res.data.avgScore
        this.totalPages = res.data.totalPages;
        this.noResultsFound = this.Results.length === 0;
        console.log('noResultsFound:', this.noResultsFound);

        this.totalPages = 1;
        this.pagesArray = [1];
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error?.success === false) {
          this.Results = [];
          this.noResultsFound = true;
        }
        console.error("Search error:", err);
      }
    });
  }


  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.router.navigate([], { queryParams: { page } });
      this.loadResults(page);
    }
  }

  downloadExcel() {
  this.ResultsService.downloadExcelFile().subscribe({
    next: (response) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'exam-attempts.xlsx';
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Error downloading Excel file:', err);
      alert('There is an error through downloading');
    }
  });
}

}
