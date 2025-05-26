import { Component } from '@angular/core';
import { StudentsService } from '../../services/students.service';
import { RouterModule, Router } from '@angular/router';
import { TitleComponent } from "../../shared/components/shared/title/title.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";

@Component({
  selector: 'app-students-dashboard',
  imports: [RouterModule, TitleComponent, LoadingComponent],
  templateUrl: './students-dashboard.component.html',
  styleUrl: './students-dashboard.component.css'
})
export class StudentsDashboardComponent {
  students: any[] = [];
  numberOfStudents: Number = 0;
  showMessage: boolean = false;
  isLoading: boolean = true;

  constructor(private studentService: StudentsService, private router: Router) { }

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getAllStudentData().subscribe({
      next: (data: any) => {
        this.isLoading = false
        this.students = data.data.students;
        this.numberOfStudents = data.data.results;
        console.log('Students:', this.students);
      },
      error: (err) => {
        this.isLoading = false
        console.error('Error fetching students:', err);
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
