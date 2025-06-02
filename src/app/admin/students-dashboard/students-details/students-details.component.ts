import { Component, OnInit } from '@angular/core';
import { Student } from '../../../models/student';
import { StudentsService } from '../../../services/students.service';
import { ActivatedRoute } from '@angular/router';
import { StudentCardComponent } from "./student-card/student-card.component";
import { LoadingComponent } from "../../../shared/components/loading/loading.component";
import { SmallCardComponent } from "../../../shared/components/small-card/small-card.component";
import { CommonModule } from '@angular/common';
import { ExamCardComponent } from "./exam-card/exam-card.component";

@Component({
  selector: 'app-students-details',
  imports: [StudentCardComponent, LoadingComponent, SmallCardComponent, CommonModule, ExamCardComponent],
  templateUrl: './students-details.component.html',
  styleUrl: './students-details.component.css'
})
export class StudentsDetailsComponent {
  student?: Student
  isLoading: boolean = true;
  hasAttempts: boolean = false;
  averageScore?: number;
  sumOfPercentage: number = 0;
  sumOfTime: number = 0;
  totalMinutes: number = 0;
  totalSeconds: number = 0;
  latestExam: any;
  bestScore: number = 0
  avgTime: number = 0


  constructor(
    private route: ActivatedRoute,
    private studentService: StudentsService
  ) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.studentService.getStudentById(id).subscribe({
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
              this.avgTime = Math.round(this.sumOfTime / this.student?.attempts?.length)
              this.averageScore = this.sumOfPercentage / (this.student.attempts.length * 100);
              const sortedAttempts = [...this.student.attempts].sort((a, b) => {
                return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
              });
              this.latestExam = sortedAttempts[0];
            } else {
              this.averageScore = 0;
            }
            console.log(this.student);
            if (this.student?.attempts && this.student.attempts.length > 0) {
              this.hasAttempts = true;
            }
          },
          error: err => {
            this.isLoading = false
            console.error(err)
          }
        });
      }
    });
  }
}
