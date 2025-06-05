import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { StudentExam } from '../../../core/models/student-exam.interface';
import { LoadingComponent } from "../../../shared/loading/loading.component";

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  availableExams: StudentExam[] = [];
  isLoading = true;

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadExams();
  }

  private loadExams() {
    this.studentService.getAvailableExams().subscribe({
      next: (exams) => {
        this.availableExams = exams;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading exams:', error);
        this.isLoading = false;
      }
    });
  }

  startExam(exam: StudentExam) {
    this.router.navigate(['/exams', exam._id], {
      state: { examDetails: exam }
    });
  }

  getLevelClass(level: string): string {
  switch (level) {
    case 'fill-blank':
      return 'fill-blank';
    case 'multiple-choice':
      return 'multiple-choice';
    case 'true-false':
      return 'true-false';
    default:
      return '';
  }
}

  getDiffClass(level: string): string {
  switch (level) {
    case 'easy':
      return 'easy';
    case 'hard':
      return 'hard';
    case 'medium':
      return 'medium';
    default:
      return '';
  }
}
}
