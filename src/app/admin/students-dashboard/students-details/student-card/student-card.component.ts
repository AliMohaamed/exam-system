import { Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { Student } from '../../../../models/student';
import { CommonModule } from '@angular/common';
import { SmallCardComponent } from "../../../../shared/components/small-card/small-card.component";

@Component({
  selector: 'app-student-card',
  imports: [CommonModule, SmallCardComponent],
  templateUrl: './student-card.component.html',
  styleUrl: './student-card.component.css'
})
export class StudentCardComponent {
  @Input() averageScore?: number;
  @Input() totalMinutes?: number;
  @Input() totalSeconds?: number;
  @Input() hasAttempts?: boolean;
  @Input() student?: Student;
  @Input() isLoading: boolean = true;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student']) {
      console.log('Student changed:', this.student);
    }
  }
}
