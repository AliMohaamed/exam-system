import { Component } from '@angular/core';
import { StudentsService } from '../../services/students.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TitleComponent } from "../../shared/components/title/title.component";
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../shared/loading/loading.component";
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import { NotFoundComponent } from "../../shared/not-found/not-found.component";


@Component({
  selector: 'app-students-dashboard',
  imports: [RouterModule, TitleComponent, LoadingComponent, CommonModule, NotFoundComponent],
  templateUrl: './students-dashboard.component.html',
  styleUrl: './students-dashboard.component.css',
})
export class StudentsDashboardComponent {
  students: any[] = [];
  allStudents: any[] = [];
  numberOfStudents: Number = 0;
  showMessage: boolean = false;
  isLoading: boolean = true;
  currentPage: number = 1;
  totalPages: number = 1;
  pagesArray: number[] = [];
  noStudentsFound: boolean = false;

  private searchSubscription!: Subscription;
  constructor(private studentService: StudentsService, private router: Router, private searchService: SearchService, private route: ActivatedRoute) { }

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    const page = +params['page'] || 1;
    const q = params['q'];

    if (q) {
      this.searchService.setSearchTerm(q);  // هيعمل ترجيع للـ search تلقائي
    } else {
      this.loadStudents(page);
    }
  });

  this.searchSubscription = this.searchService.searchTerm$.subscribe(term => {
    this.filterStudents(term);
  });
}



  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  loadStudents(page: number = 1) {
    this.isLoading = true;
    this.studentService.getAllStudentData(page).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        this.allStudents = data.data.students;
        this.students = [...this.allStudents];
        this.numberOfStudents = data.data.results;
        this.totalPages = data.data.totalPages;
        this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.currentPage = page;
        console.log(data.data)
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching students:', err);
      }
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.router.navigate([], { queryParams: { page } });
      this.loadStudents(page);
    }
  }



filterStudents(term: string) {
  const trimmedTerm = term.trim();

    if (!trimmedTerm) {
      if (this.students.length === this.allStudents.length) return;

      this.loadStudents(this.currentPage);
      this.noStudentsFound = false; // Reset no results state
      return;
    }

  this.isLoading = true;
  this.searchService.searchStudents(trimmedTerm).subscribe({
    next: (res: any) => {
      this.isLoading = false;
      this.students = res.data.students;
       this.noStudentsFound = this.students.length === 0;
        console.log('noStudentsFound:', this.noStudentsFound);
      this.totalPages = 1;
      this.pagesArray = [1];
    },
    error: (err) => {
      this.isLoading = false;
          if (err.error?.success === false) {
          this.students = [];
          this.noStudentsFound = true;
        }
      console.error("Search error:", err);
    }
  });
}




  deleteStudent(id: string) {
    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (confirmDelete) {
      this.studentService.deleteStudent(id).subscribe({
        next: res => {
          this.showMessage = true;
          this.showMessageAndNavigate()
          console.log("Student deleted successfully:", res);
          this.loadStudents();
        },
        error: err => {
          console.error("Error deleting student:", err);
          alert("Failed to delete the student. Please try again.");
        }
      });
    }
  }
  showMessageAndNavigate() {
    setTimeout(() => {
      this.showMessage = false;
    }, 2000);
  }
}
