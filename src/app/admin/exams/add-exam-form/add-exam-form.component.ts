import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { ToastAlertComponent } from "../../../shared/toast-alert/toast-alert.component";

@Component({
  selector: 'app-add-exam-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-exam-form.component.html',
  styleUrl: './add-exam-form.component.css'
})
export class AddExamFormComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitExam = new EventEmitter<any>();

  newExam = {
    subject: '',
    description: '',
    level: '',
    duration: null
  };

  constructor(private examService: ExamService) {}

  onSubmit() {
    if (this.newExam.subject  && this.newExam.level && this.newExam.duration) {
      const examData = {
        subject: this.newExam.subject,
        description: this.newExam.description || undefined,
        level: this.newExam.level,
        duration: this.newExam.duration
      };
      
      this.examService.AddNewExam(examData).subscribe({
        next: (response) => {
          console.log('Exam added successfully:', response);
          
          this.submitExam.emit(response);
          this.resetForm();
          this.closeModal.emit();
        },
        error: (error) => {
          // this.showToastMessage(`Error adding exam`, 'error');
          console.error('Error adding exam:', error);
        }
      });
    }
  }

  onClose() {
    this.closeModal.emit();
    this.resetForm();
  }

  private resetForm() {
    this.newExam = {
      subject: '',
      description: '',
      level: '',
      duration: null
    };
  }
}