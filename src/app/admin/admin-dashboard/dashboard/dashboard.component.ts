import { Component } from '@angular/core';
import { StatsticisComponent } from "./statsticis/statsticis.component";
import { Student } from '../../../models/student';
import { StudentsService } from '../../../services/students.service';
import { Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { LoadingComponent } from "../../../shared/loading/loading.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [StatsticisComponent, LoadingComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  students?: Student;
  numberOfStudents: number = 0;
  numberOfExams: number = 0;
  isLoadingStudents: boolean = true;
  isLoadingExams: boolean = true;
  studentName?: String;
  
  // New properties for enhanced dashboard
  recentExams: any[] = [];
  recentStudents: any[] = [];
  totalPassedExams: number = 0;
  totalFailedExams: number = 0;
  averageScore: number = 0;
  isLoadingStats: boolean = true;

  constructor(
    private studentService: StudentsService, 
    private examService: ExamService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load students data
    this.studentService.getAllStudentData().subscribe({
      next: (res: any) => {
        this.isLoadingStudents = false;
        this.numberOfStudents = parseInt(res.data.totalResults);
        this.studentName = res.data.students.name;
        this.recentStudents = res.data.students.slice(0, 5); // Get 5 most recent students
      },
      error: (err) => {
        this.isLoadingStudents = false;
        console.error('Error fetching students:', err);
      }
    });

    // Load exams data
    this.examService.getAllExamsData().subscribe({
      next: (res: any) => {
        this.isLoadingExams = false;
        this.numberOfExams = res.data.total;
        
        // Get recent exams and sort them by date
        if (res.data.exams && Array.isArray(res.data.exams)) {
          this.recentExams = res.data.exams
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
          
          // Calculate exam statistics
          this.calculateExamStats(res.data.exams);
        } else {
          console.error('Invalid exam data format:', res.data);
          this.recentExams = [];
        }
      },
      error: (err) => {
        this.isLoadingExams = false;
        console.error('Error fetching exams:', err);
      }
    });
  }

  calculateExamStats(exams: any[]): void {
    if (!Array.isArray(exams)) {
      console.error('Invalid exams data for statistics calculation');
      return;
    }

    this.totalPassedExams = exams.filter(exam => exam.status === 'passed').length;
    this.totalFailedExams = exams.filter(exam => exam.status === 'failed').length;
    
    const scores = exams
      .filter(exam => typeof exam.score === 'number')
      .map(exam => exam.score);
    
    this.averageScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
