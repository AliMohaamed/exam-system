import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../../core/services/exam.service';
import { ExamResult } from '../../../core/models/exam-result.interface';

@Component({
  selector: 'app-student-exams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-exams.component.html',
  styleUrls: ['./student-exams.component.css']
})
export class StudentExamsComponent implements OnInit {
  examResults: ExamResult[] = [];
  isLoading = true;
  error: string | null = null;
  selectedExamDetails: any = null;
  isLoadingDetails = false;

  constructor(private examService: ExamService) {}

  ngOnInit() {
    this.loadExamResults();
  }

  private loadExamResults() {
    this.isLoading = true;
    this.error = null;

    this.examService.getStudentExamResults().subscribe({
      next: (response) => {
        if (response.success) {
          this.examResults = response.data;
        } else {
          this.error = response.message || 'Failed to load exam results';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading exam results:', error);
        this.error = error.error?.message || 'Failed to load exam results';
        this.isLoading = false;
      }
    });
  }

  getFormattedTime(seconds: number): string {
    if (!seconds) return '0m 0s';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  getFormattedDate(dateString: string): string {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }

  getCorrectAnswersRatio(result: ExamResult): string {
    if (!result.answers || !Array.isArray(result.answers)) {
      return '0/0';
    }
    const totalAnswers = result.answers.length;
    const correctAnswers = result.answers.filter(answer => answer.isCorrect).length;
    return `${correctAnswers}/${totalAnswers}`;
  }

  viewExamDetails(attemptId: string) {
    this.isLoadingDetails = true;
    this.examService.getExamAttemptDetails(attemptId).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedExamDetails = response.data;
        } else {
          this.error = response.message;
        }
        this.isLoadingDetails = false;
      },
      error: (error) => {
        console.error('Error loading exam details:', error);
        this.error = error.error?.message || 'Failed to load exam details';
        this.isLoadingDetails = false;
      }
    });
  }

  backToList() {
    this.selectedExamDetails = null;
  }
}
