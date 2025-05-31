import { Component } from '@angular/core';
import { StatsticisComponent } from "./statsticis/statsticis.component";
import { Student } from '../../../models/student';
import { StudentsService } from '../../../services/students.service';
import { Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { LoadingComponent } from "../../../shared/loading/loading.component";


@Component({
  selector: 'app-dashboard',
  imports: [StatsticisComponent, LoadingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  students?: Student
  numberOfStudents: number = 0;
  numberOfExams: number = 0;
  isLoadingStudents: boolean = true;
  isLoadingExams: boolean = true;

  constructor(private studentService: StudentsService, private examService: ExamService, private router: Router) { }

  ngOnInit(): void {
    this.studentService.getAllStudentData().subscribe({
      next: (res: any) => {
        this.isLoadingStudents = false
        this.numberOfStudents = parseInt(res.data.results);
        console.log('Students:', this.numberOfStudents);
        console.log(res.data.students)
      },
      error: (err) => {
        this.isLoadingStudents = false
        console.error('Error fetching students:', err);
      }
    });
    this.examService.getAllExamsData().subscribe({
      next: (res: any) => {
        this.isLoadingExams = false
        this.numberOfExams = res.data.total
        console.log(this.numberOfExams)
        console.log(res.data)
      },
      error: (err) => {
        this.isLoadingExams = false
        console.error('Error fetching students:', err);
      }
    })
  }
}
