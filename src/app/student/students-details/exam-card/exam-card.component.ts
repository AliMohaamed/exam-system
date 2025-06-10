import { CommonModule } from '@angular/common';
import { Component, Input, input, SimpleChanges } from '@angular/core';
import { Student } from '../../../models/student';

@Component({
  selector: 'app-exam-card',
  imports: [CommonModule],
  templateUrl: './exam-card.component.html',
  styleUrl: './exam-card.component.css'
})
export class ExamCardComponent {
  @Input() student?: Student
  showDetails: boolean[] = [];

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins} min ${secs} sec`;
  }
  toggleDetails(index: number) {
    this.showDetails[index] = !this.showDetails[index];
  }
  getCorrectAnswersCount(attempt: any): number {
    return attempt.answers?.filter((ans: any) => ans.isCorrect).length || 0;
  }
}
