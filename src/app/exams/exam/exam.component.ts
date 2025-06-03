import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { StudentExam, Question } from '../../core/models/student-exam.interface';
import { ExamResultData } from '../../core/models/exam-result.interface';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit, OnDestroy {
  examDetails?: StudentExam;
  isLoading = false;
  isExamStarted = false;
  attemptId = '';
  questions: Question[] = [];
  currentQuestionIndex = 0;
  answers: { [key: string]: string | boolean } = {};
  timer: string = '';
  timeLeft: number = 0;
  interval?: number;
  examResult?: any; // Update this with proper type from your interface
  showResult = false;
  showStartModal = false;
  showLeaveModal = false;

  constructor(
    private router: Router,
    private examService: ExamService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.examDetails = navigation?.extras.state?.['examDetails'];
  }
  ngOnDestroy(): void {
    // Clear the timer interval if it exists
    if (this.interval) {
      clearInterval(this.interval);
    }

    // If exam is in progress and not showing result, attempt to submit
    if (this.isExamStarted && !this.showResult && this.attemptId) {
      this.submitExam();
    }
  }

  ngOnInit() {
    if (!this.examDetails) {
      this.router.navigate(['/student-dashboard']);
      return;
    }
  }

  startExam() {
    if (!this.examDetails?._id) {
      console.error('No exam ID available');
      return;
    }

    const message = 'Once you start the exam, you must complete it. If you close the browser or navigate away, the exam will be submitted automatically. Are you ready to begin?';

    if (window.confirm(message)) {
      this.isLoading = true;

      // Debug log
      console.log('Starting exam with ID:', this.examDetails._id);

      this.examService.startExam(this.examDetails._id).subscribe({
        next: (response) => {
          console.log('Start exam response:', response); // Debug log
          if (response.success) {
            this.attemptId = response.data.attemptId;
            this.loadQuestions();
            this.startTimer(response.data.exam.duration); // Use duration from response
            this.isExamStarted = true;
          } else {
            this.isLoading = false;
            window.alert(response.message || 'Failed to start exam');
          }
        },
        error: (error) => {
          console.error('Error starting exam:', error);
          this.isLoading = false;
          window.alert(error.error?.message || 'Failed to start exam. Please try again.');
        }
      });
    }
  }

  private loadQuestions() {
    if (!this.attemptId) {
      this.isLoading = false;
      return;
    }

    this.examService.getExamQuestions(this.attemptId).subscribe({
      next: (response) => {
        console.log('Questions response:', response); // Debug log
        if (response.success && response.data?.questions?.length > 0) {
          this.questions = response.data.questions;
          this.isExamStarted = true;
          console.log('Loaded questions:', this.questions); // Debug log
        } else {
          console.error('No questions received or invalid response:', response);
          this.isExamStarted = false;
          window.alert('Failed to load exam questions. Please try again.');
        }
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.isLoading = false;
        this.isExamStarted = false;
        window.alert('Failed to load exam questions. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  submitAnswer(questionId: string, answer: string | boolean) {
    this.answers[questionId] = answer;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  private startTimer(duration: number) {
    this.timeLeft = duration * 60; // Convert minutes to seconds
    this.interval = window.setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timer = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      } else {
        this.submitExam(); // Auto-submit when time is up
      }
    }, 1000);
  }

  submitExam() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (!this.attemptId) return;

    const answersArray = Object.entries(this.answers).map(([questionId, answer]) => ({
      questionId,
      answer
    }));

    this.examService.submitExamAnswers(this.attemptId, { answers: answersArray }).subscribe({
      next: (response) => {
        this.examResult = response.data;
        this.showResult = true;
      }
    });
  }

  formatTimeSpent(): string {
    if (!this.examResult) return '0m 0s';
    const minutes = Math.floor(this.examResult.timeSpent / 60);
    const seconds = this.examResult.timeSpent % 60;
    return `${minutes}m ${seconds}s`;
  }

  getTimeSpentFormatted(): string {
    if (!this.examResult?.timeSpent) return '0:00';
    const minutes = Math.floor(this.examResult.timeSpent / 60);
    const seconds = this.examResult.timeSpent % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  backToDashboard() {
    this.router.navigate(['/student-dashboard']);
  }


  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.isExamStarted && !this.showResult) {
      const message = 'Warning: If you leave or refresh the page, your exam will be submitted with current answers and you cannot retake it. Are you sure?';
      event.returnValue = message;
      return message;
    }
    return true;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    if (this.isExamStarted && !this.showResult) {
      if (window.confirm('Warning: If you leave now, your exam will be submitted with current answers and you cannot retake it. Do you want to continue?')) {
        this.submitExam();
      } else {
        history.pushState(null, '', window.location.href);
      }
    }
  }

  // Add method to handle navigation attempts
  canDeactivate(): boolean {
    if (this.isExamStarted && !this.showResult) {
      if (window.confirm('Warning: If you leave now, your exam will be submitted with current answers and you cannot retake it. Do you want to continue?')) {
        this.submitExam();
        return true;
      }
      return false;
    }
    return true;
  }

  onLeaveConfirm() {
    this.showLeaveModal = false;
    this.submitExam();
  }
}
