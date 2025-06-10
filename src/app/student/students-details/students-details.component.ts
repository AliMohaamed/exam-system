import { Component, OnInit } from '@angular/core';
import { Student } from '../../models/student';
import { StudentsService } from '../../services/students.service';
import { ActivatedRoute } from '@angular/router';
import { StudentCardComponent } from "./student-card/student-card.component";
import { SmallCardComponent } from "../../shared/components/small-card/small-card.component";
import { CommonModule } from '@angular/common';
import { ExamCardComponent } from "./exam-card/exam-card.component";
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-students-details',
  standalone: true,
  imports: [StudentCardComponent, LoadingComponent, SmallCardComponent, CommonModule, ExamCardComponent],
  templateUrl: './students-details.component.html',
  styleUrl: './students-details.component.css'
})
export class StudentDetailsComponent implements OnInit {
  student?: Student;
  isLoading: boolean = true;
  hasAttempts: boolean = false;
  averageScore: number = 0;
  sumOfPercentage: number = 0;
  sumOfTime: number = 0;
  totalMinutes: number = 0;
  totalSeconds: number = 0;
  latestExam: any = null; // Consider creating an interface/type instead of using 'any'
  bestScore: number = 0
  avgTime: number = 0


  constructor(
    private route: ActivatedRoute,
    private studentService: StudentsService
  ) { }
  ngOnInit(): void {
        this.studentService.getStudentDetails().subscribe({
          next: res => {
            this.isLoading = false
            this.student = res.data;
            this.student?.attempts?.forEach(attempt => {
              this.sumOfPercentage += attempt.percentage * 100;
              this.sumOfTime += attempt.timeSpent / 60
            });
            this.bestScore = Math.max(...(this.student?.attempts?.map(a => a.percentage) || [0])) / 100;
            this.totalMinutes = Math.floor(this.sumOfTime);
            this.totalSeconds = Math.round((this.sumOfTime - this.totalMinutes) * 60);
            if (this.student?.attempts?.length && this.student.attempts.length > 0) {
              this.avgTime = +(this.sumOfTime / this.student?.attempts?.length).toFixed(2);

              this.averageScore = this.sumOfPercentage / (this.student.attempts.length * 100);
              const sortedAttempts = [...this.student.attempts].sort((a, b) => {
                return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
              });
              this.latestExam = sortedAttempts[0];
            } else {
              this.averageScore = 0;
            }
            console.log(this.student);
            if (this.student!.attempts!.length > 0) {
              this.hasAttempts = true;
            }
          },
          error: err => {
            this.isLoading = false
            console.error(err)
          }
        });
  }
}
