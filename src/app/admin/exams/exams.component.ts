import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TitleComponent } from '../../shared/components/title/title.component';
import { ExamService } from '../../services/exam.service';
import { AddExamFormComponent } from './add-exam-form/add-exam-form.component';
import { CommonModule } from '@angular/common';
import { EditExamFormComponent } from './edit-exam-form/edit-exam-form.component';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../services/question.service';
import { ToastAlertComponent } from "../../shared/toast-alert/toast-alert.component";
import { Subscription } from 'rxjs';
import { SearchService } from '../../services/search.service';
import {LoadingComponent} from '../../shared/loading/loading.component';
import { ExamCardComponent } from "../students-dashboard/students-details/exam-card/exam-card.component";
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-exams',
  imports: [
    RouterModule,
    // LoadingComponent,
    AddExamFormComponent,
    CommonModule,
    EditExamFormComponent,
    FormsModule,
    ToastAlertComponent,
    LoadingComponent,
    ExamCardComponent,
    ConfirmDialogComponent
],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent {
  exams: any[] = [];
  allQuestions: any[] = [];
  allExams: any[] = [];
  searchSub!: Subscription;
  questionsPerPage: number = 10;
  numberOfExam: Number = 0;
  // showMessage: boolean = false;
  isLoading: boolean = true;
  showAddExamForm = false;
  showEditExamForm = false;
  showViewExamModal = false;
  selectedExam: any = null;
  showAddQuestionForm = false;
  newQuestion: any = {
    text: '',
    type: 'multiple-choice',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
    correctAnswer: false,
    correctText: '',
    points: 1,
    difficulty: 'easy',
    correctOption: false
  };

  // Pagination state
  currentPage: number = 1;
  totalPages: number = 1;


  questionToEdit: any = null;
  editQuestionIndex: number = -1;
  showEditQuestionForm: boolean = false;


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

  onAddExam(examData: any) {
    this.loadExams(this.currentPage);
    this.showToastMessage('Exam added successfully', 'success');
    this.showAddExamForm = false;
  }

  constructor(
    private examService: ExamService,
    private questionService: QuestionService, // Add QuestionService
    private router: Router,
    private searchService: SearchService
  ) {}

  getLevelClass(level: string): string {
  switch (level) {
    case 'beginner':
      return 'beginner';
    case 'intermediate':
      return 'intermediate';
    case 'advanced':
      return 'advanced';
    default:
      return '';
  }
}

  ngOnInit() {
    this.loadExams(this.currentPage);
    this.searchSub = this.searchService.searchTerm$.subscribe(term => {
      if (term.trim() === '') {
        this.exams = this.allExams;
      } else {
        this.isLoading = true;
        this.searchService.searchExamsBySubject(term).subscribe({
          next: (response) => {
            this.exams = response.data.exams;
            this.numberOfExam = response.data.total;
            this.currentPage = response.data.currentPage;
            this.totalPages = response.data.totalPages;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error searching exams:', error);
            this.showToastMessage('Error searching exams', 'error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  loadExams(page: number = 1) {
    this.isLoading = true;
    this.examService.getAllExamsData(page).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        this.exams = data.data.exams;
        this.allExams = data.data.exams;
        this.numberOfExam = data.data.total;
        this.currentPage = data.data.currentPage;
        this.totalPages = data.data.totalPages;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching exams:', err);
      },
    });
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe();
  }

  // Call this when user clicks a page number
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadExams(page);
    }
  }

  GotoPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      const startIndex = (page - 1) * this.questionsPerPage;
      const endIndex = startIndex + this.questionsPerPage;
      this.selectedExam.questions = this.allQuestions.slice(startIndex, endIndex);
    }
  }

  // Add new properties for confirm dialog
  showConfirmDialog = false;
  confirmDialogTitle = '';
  confirmDialogMessage = '';
  confirmDialogAction: 'deleteExam' | 'deleteQuestion' | null = null;
  itemToDelete: string | null = null;

  deleteExam(id: string) {
    this.confirmDialogTitle = 'Delete Exam';
    this.confirmDialogMessage = 'Are you sure you want to delete this exam? This action cannot be undone.';
    this.confirmDialogAction = 'deleteExam';
    this.itemToDelete = id;
    this.showConfirmDialog = true;
  }

  deleteQuestion(questionId: string) {
    if (!this.selectedExam?._id || !questionId) {
      console.log('Delete Question Debug:', { examId: this.selectedExam?._id, questionId });
      this.showToastMessage('Invalid question data', 'error');
      return;
    }

    this.confirmDialogTitle = 'Delete Question';
    this.confirmDialogMessage = 'Are you sure you want to delete this question? This action cannot be undone.';
    this.confirmDialogAction = 'deleteQuestion';
    this.itemToDelete = questionId;
    this.showConfirmDialog = true;
  }

  onConfirmDialogConfirm() {
    if (!this.itemToDelete || !this.confirmDialogAction) return;

    if (this.confirmDialogAction === 'deleteExam') {
      this.examService.deletEexam(this.itemToDelete).subscribe({
        next: (res) => {
          console.log('Exam deleted successfully:', res);
          this.showToastMessage('Exam deleted successfully', 'success');
          this.loadExams();
        },
        error: (err) => {
          console.error('Error deleting exam:', err);
          this.showToastMessage('Error deleting exam', 'error');
        },
      });
    } else if (this.confirmDialogAction === 'deleteQuestion') {
      this.isLoading = true;
      this.questionService.deleteQuestion(this.selectedExam._id, this.itemToDelete).subscribe({
        next: () => {
          // Remove the question from the array
          this.selectedExam.questions = this.selectedExam.questions.filter(
            (q: any) => q._id !== this.itemToDelete
          );

          // Force change detection
          this.selectedExam = { ...this.selectedExam };

          this.showToastMessage('Question deleted successfully', 'success');
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting question:', err);
          this.isLoading = false;
          this.showToastMessage('Error deleting question', 'error');
        }
      });
    }

    this.closeConfirmDialog();
  }

  onConfirmDialogCancel() {
    this.closeConfirmDialog();
  }

  private closeConfirmDialog() {
    this.showConfirmDialog = false;
    this.confirmDialogTitle = '';
    this.confirmDialogMessage = '';
    this.confirmDialogAction = null;
    this.itemToDelete = null;
  }

  onEditExam(examData: any) {
    this.examService.editExam(this.selectedExam._id, examData).subscribe({
      next: (response) => {
        this.loadExams(this.currentPage);
        this.showEditExamForm = false;
        this.selectedExam = null;
      },
      error: (error) => {
        console.error('Error updating exam:', error);
      },
    });
  }

  openEditForm(exam: any) {
    this.selectedExam = exam;
    this.showEditExamForm = true;
  }

  openViewExam(exam: any) {
    this.selectedExam = exam;
    this.isLoading = true;
    this.selectedExam.questions = [];
  
    const allQuestions: any[] = [];
  
    const fetchPage = (page: number = 1) => {
      this.questionService.getExamQuestions(exam._id, page).subscribe({
        next: (res) => {
          const questions = res.data.questions;
          allQuestions.push(...questions);
  
          if (page < res.data.totalPages) {
            fetchPage(page + 1); // تحميل الصفحة التالية
          } else {
            // بعد تحميل كل الصفحات
            this.selectedExam.questions = allQuestions.slice(0, this.questionsPerPage);
            this.totalPages = Math.ceil(allQuestions.length / this.questionsPerPage);
            this.currentPage = 1;
            this.allQuestions = allQuestions;
            this.showViewExamModal = true;
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Error fetching all questions:', err);
          this.isLoading = false;
        }
      });
    };
  
    fetchPage(1);
  }



  addQuestion() {
    if (!this.selectedExam?._id) {
      this.showToastMessage('No exam selected', 'error');
      return;
    }

    // Validate required fields
    if (!this.newQuestion.text || !this.newQuestion.type || !this.newQuestion.points) {
      this.showToastMessage('Please fill in all required fields', 'error');
      return;
    }

    // Validate question type specific fields
    if (this.newQuestion.type === 'multiple-choice' && (!this.newQuestion.options || this.newQuestion.options.length < 2)) {
      this.showToastMessage('Multiple choice questions must have at least 2 options', 'error');
      return;
    }

    if (this.newQuestion.type === 'multiple-choice' && !this.newQuestion.correctOption) {
      this.showToastMessage('Please select a correct option', 'error');
      return;
    }

    if (this.newQuestion.type === 'fill-blank' && !this.newQuestion.correctText) {
      this.showToastMessage('Please provide the correct answer', 'error');
      return;
    }

    if (this.newQuestion.type === 'true-false' && this.newQuestion.correctAnswer === undefined) {
      this.showToastMessage('Please select true or false', 'error');
      return;
    }

    const questionData: any = {
      questionText: this.newQuestion.text,
      questionType: this.newQuestion.type,
      points: this.newQuestion.points,
      difficulty: this.newQuestion.difficulty || 'medium'
    };

    // Handle different question types
    switch(this.newQuestion.type) {
      case 'multiple-choice':
        questionData.options = this.newQuestion.options.map((option: any) => ({
          text: option.text,
          isCorrect: option.text === this.newQuestion.correctOption
        }));
        break;
        
      case 'fill-blank':
        questionData.correctText = this.newQuestion.correctText;
        break;
        
      case 'true-false':
        questionData.correctAnswer = this.newQuestion.correctAnswer === 'true';
        break;
    }

    this.isLoading = true;
    this.questionService.addQuestion(this.selectedExam._id, questionData).subscribe({
      next: (response) => {
        // Ensure we have the correct question data with ID
        const newQuestion = {
          _id: response.data?.question?._id || response._id,
          questionText: this.newQuestion.text,
          text: this.newQuestion.text,
          questionType: this.newQuestion.type,
          type: this.newQuestion.type,
          points: this.newQuestion.points,
          difficulty: this.newQuestion.difficulty,
          options: questionData.options || [],
          correctAnswer: questionData.correctAnswer,
          correctText: questionData.correctText
        };

        // Update the questions array with the new question
        if (!this.selectedExam.questions) {
          this.selectedExam.questions = [];
        }
        this.selectedExam.questions = [newQuestion, ...this.selectedExam.questions];

        // Force change detection
        this.selectedExam = { ...this.selectedExam };

        this.showToastMessage('Question added successfully', 'success');
        this.resetQuestionForm();
        this.showAddQuestionForm = false;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error adding question:', err);
        this.isLoading = false;
        this.showToastMessage('Error adding question', 'error');
      }
    });
  }

  private resetQuestionForm() {
    this.newQuestion = {
      text: '',
      type: 'multiple-choice',
      points: 1,
      difficulty: 'medium',
      options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
      correctOption: '',
      correctText: '',
      correctAnswer: undefined
    };
  }

  onQuestionTypeChange() {
    // Reset type-specific fields when question type changes
    this.newQuestion.correctOption = '';
    this.newQuestion.correctText = '';
    this.newQuestion.correctAnswer = undefined;
    
    if (this.newQuestion.type === 'multiple-choice') {
      this.newQuestion.options = [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ];
    }
  }

  addOption() {
    if (!this.newQuestion.options) {
      this.newQuestion.options = [];
    }
    this.newQuestion.options.push({ text: '', isCorrect: false });
  }

  removeOption(index: number) {
    if (this.newQuestion.options && this.newQuestion.options.length > 2) {
      this.newQuestion.options.splice(index, 1);
      // If the removed option was the correct one, reset correctOption
      if (this.newQuestion.correctOption === this.newQuestion.options[index]?.text) {
        this.newQuestion.correctOption = '';
      }
    } else {
      this.showToastMessage('Question must have at least 2 options', 'error');
    }
  }


  editQuestion(question: any, index: number) {
    this.questionToEdit = { ...question };
    this.editQuestionIndex = index;
    this.showEditQuestionForm = true;
  }

  cancelEditQuestion() {
    this.showEditQuestionForm = false;
    this.questionToEdit = null;
    this.editQuestionIndex = -1;
  }
  
  saveEditedQuestion() {
    if (!this.questionToEdit || !this.questionToEdit._id || this.editQuestionIndex === null) {
      this.showToastMessage('Invalid question data', 'error');
      return;
    }

    // Validate required fields
    if (!this.questionToEdit.questionText || !this.questionToEdit.questionType || !this.questionToEdit.points) {
      this.showToastMessage('Please fill in all required fields', 'error');
      return;
    }

    const questionData: any = {
      questionText: this.questionToEdit.questionText,
      questionType: this.questionToEdit.questionType,
      points: this.questionToEdit.points,
      difficulty: this.questionToEdit.difficulty || 'medium'
    };

    // Handle different question types
    switch (this.questionToEdit.questionType) {
      case 'multiple-choice':
        if (!this.questionToEdit.options || this.questionToEdit.options.length < 2) {
          this.showToastMessage('Multiple choice questions must have at least 2 options', 'error');
          return;
        }
        if (!this.questionToEdit.correctOption) {
          this.showToastMessage('Please select a correct option', 'error');
          return;
        }
        questionData.options = this.questionToEdit.options.map((option: any) => ({
          text: option.text,
          isCorrect: option.text === this.questionToEdit.correctOption
        }));
        break;

      case 'fill-blank':
        if (!this.questionToEdit.correctText) {
          this.showToastMessage('Please provide the correct answer', 'error');
          return;
        }
        questionData.correctText = this.questionToEdit.correctText;
        break;

      case 'true-false':
        if (this.questionToEdit.correctAnswer === undefined) {
          this.showToastMessage('Please select true or false', 'error');
          return;
        }
        questionData.correctAnswer = this.questionToEdit.correctAnswer === 'true';
        break;
    }

    this.isLoading = true;
    this.questionService.updateQuestion(this.selectedExam._id, this.questionToEdit._id, questionData).subscribe({
      next: (res) => {
        const updatedQuestion = {
          _id: this.questionToEdit._id,
          questionText: questionData.questionText,
          text: questionData.questionText,
          questionType: questionData.questionType,
          type: questionData.questionType,
          points: questionData.points,
          difficulty: questionData.difficulty,
          options: questionData.options || [],
          correctAnswer: questionData.correctAnswer,
          correctText: questionData.correctText
        };

        // Update the question in the array
        const updatedQuestions = [...this.selectedExam.questions];
        updatedQuestions[this.editQuestionIndex] = updatedQuestion;
        this.selectedExam.questions = updatedQuestions;

        // Force change detection
        this.selectedExam = { ...this.selectedExam };

        this.showToastMessage('Question updated successfully', 'success');
        this.cancelEditQuestion();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating question:', err);
        this.isLoading = false;
        this.showToastMessage('Error updating question', 'error');
      }
    });
  }
  
  
  
  onEditQuestionTypeChange() {
    if (!this.questionToEdit) return;
  
    if (this.questionToEdit.questionType === 'multiple-choice') {
      this.questionToEdit.options = [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ];
      this.questionToEdit.correctOption = '';
    } else if (this.questionToEdit.questionType === 'fill-blank') {
      this.questionToEdit.correctText = '';
    } else if (this.questionToEdit.questionType === 'true-false') {
      this.questionToEdit.correctAnswer = true;
    }
  }

}
