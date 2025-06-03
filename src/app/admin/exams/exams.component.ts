import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TitleComponent } from '../../shared/components/shared/title/title.component';
// import { LoadingComponent } from '../../shared/components/loading/loading.component';
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
    LoadingComponent
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
      this.exams = this.allExams.filter(exam =>
        exam.subject.toLowerCase().includes(term.toLowerCase())
      );
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


  deleteExam(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this exam?');
    if (confirmDelete) {
      this.examService.deletEexam(id).subscribe({
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
    }
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
    let questionData: any = {
      questionText: this.newQuestion.text,
      questionType: this.newQuestion.type,
      points: this.newQuestion.points,
      difficulty: this.newQuestion.difficulty
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
        questionData.correctAnswer = this.newQuestion.correctAnswer;
        break;
    }

    this.isLoading = true;
    this.questionService.addQuestion(this.selectedExam._id, questionData).subscribe({
      next: (response) => {
        // Create a new array reference to trigger change detection
        const updatedQuestions = this.selectedExam.questions ? [...this.selectedExam.questions] : [];
        
        // Build the question object with consistent structure
        const newQuestion = {
          ...response.data?.question || response,
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

        // Add to array and update
        updatedQuestions.unshift(newQuestion);
        this.selectedExam.questions = updatedQuestions;
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
      options: [],
      correctAnswer: false,
      correctText: '',
      points: 1,
      difficulty: 'easy',
      correctOption: false
    };
  }

  onQuestionTypeChange() {
    if (this.newQuestion.type === 'multiple-choice') {
      this.newQuestion.options = [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ];
    } else {
      this.newQuestion.options = [];
    }
  }

  addOption() {
    this.newQuestion.options.push({ text: '', isCorrect: false });
  }

  removeOption(index: number) {
    this.newQuestion.options.splice(index, 1);
  }


  editQuestion(question: any, index: number) {
    this.questionToEdit = { ...question };
    this.editQuestionIndex = index;
    this.showEditQuestionForm = true;
  }

  deleteQuestion(questionId: string) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questionService.deleteQuestion(this.selectedExam._id, questionId).subscribe({
        next: () => {
          this.selectedExam.questions = this.selectedExam.questions.filter(
            (q: any) => q._id !== questionId
          );
          this.showToastMessage('Question deleted successfully', 'success');
        },
        error: (err) => {
          console.error('Error deleting question:', err);
          this.showToastMessage('Error deleting question', 'error');
        }
      });
    }
  }


  cancelEditQuestion() {
    this.showEditQuestionForm = false;
    this.questionToEdit = null;
    this.editQuestionIndex = -1;
  }
  
  saveEditedQuestion() {
    // if (!this.questionToEdit || this.editQuestionIndex === null) return;
  
    const questionData: any = {
      questionText: this.questionToEdit.questionText,
      questionType: this.questionToEdit.questionType,
      points: this.questionToEdit.points,
      difficulty: this.questionToEdit.difficulty
    };
  
    // حسب نوع السؤال
    switch (this.questionToEdit.questionType) {
      case 'multiple-choice':
        questionData.options = this.questionToEdit.options.map((option: any) => ({
          text: option.text,
          isCorrect: option.text === this.questionToEdit.correctOption
        }));
        break;
  
      case 'fill-blank':
        questionData.correctText = this.questionToEdit.correctText;
        break;
  
      case 'true-false':
        questionData.correctAnswer = this.questionToEdit.correctAnswer;
        break;
    }
  
    this.isLoading = true;
  
    this.questionService.updateQuestion(this.selectedExam._id, this.questionToEdit._id, questionData).subscribe({
      next: (res) => {
        // نحاول ناخد النتيجة من ال API، أو نرجع البيانات اللي بعتناها
        const updatedQuestion = {
          ...res.data?.question || questionData,
          _id: this.questionToEdit._id, 
          text: questionData.questionText,
          type: questionData.questionType,
          questionText: questionData.questionText,
          questionType: questionData.questionType,
          points: questionData.points,
          difficulty: questionData.difficulty,
          options: questionData.options || [],
          correctAnswer: questionData.correctAnswer,
          correctText: questionData.correctText
        };
  
        // تعديل المصفوفة
        const updatedQuestions = [...this.selectedExam.questions];
        updatedQuestions[this.editQuestionIndex] = updatedQuestion;
        this.selectedExam.questions = updatedQuestions;
        this.showToastMessage('Question updated successfully', 'success');
        this.cancelEditQuestion();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error updating question:', err);
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
