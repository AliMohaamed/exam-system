import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { StudentExam } from '../../../core/models/student-exam.interface';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html'
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
}
