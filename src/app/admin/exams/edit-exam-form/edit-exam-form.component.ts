import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastAlertComponent } from "../../../shared/toast-alert/toast-alert.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-exam-form',
  standalone: true,
  imports: [FormsModule, ToastAlertComponent, CommonModule],
  templateUrl: './edit-exam-form.component.html',
  styleUrl: './edit-exam-form.component.css'
})
export class EditExamFormComponent {
  @Input() exam: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitExam = new EventEmitter<any>();

    toastMessage = '';
    toastType: 'success' | 'error' | 'warning' | 'info' = 'info';
    showToast = false;

    showToastMessage(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
      this.showToast = false;
      setTimeout(() => {
        this.toastMessage = message;
        this.toastType = type;
        this.showToast = true;
      }, 50);
    }

  editedExam = {
    subject: '',
    description: '',
    level: '',
    duration: null
  };

  ngOnInit() {
    if (this.exam) {
      this.editedExam = {
        subject: this.exam.subject,
        description: this.exam.description,
        level: this.exam.level,
        duration: this.exam.duration
      };
    }
  }

  onSubmit() {
    this.showToastMessage('Edit Exam Successfully', 'success');
    this.submitExam.emit(this.editedExam);

  }

  onClose() {
    this.closeModal.emit();
  }
}