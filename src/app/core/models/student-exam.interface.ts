export interface QuestionStats {
  [key: string]: number;
}

export interface StudentExam {
  _id: string;
  subject: string;
  description?: string;
  level: string;
  duration: number;
  createdBy: {
    name: string;
  };
  id: string;
  totalQuestions: number;
  questionsByType: QuestionStats;
  questionsByDifficulty: QuestionStats;
  totalPoints: number;
}

export interface ExamsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    exams: StudentExam[];
  };
}

export interface ExamStartData {
  attemptId: string;
  exam: {
    subject: string;
    duration: number;
    level: string;
    questionsCount: number;
    totalMarks: number;
    startTime: string;
    endTime: string;
  };
}

export interface ExamStartResponse {
  success: boolean;
  message: string;
  data: {
    attemptId: string;
    exam: {
      duration: number;
      startTime: string;
      endTime: string;
    };
  };
}

export interface QuestionOption {
  _id: string;
  text: string;
}

export interface Question {
  _id: string;
  questionText: string;
  questionType: 'multiple-choice' | 'true-false' | 'fill-blank';
  points: number;
  difficulty: string;
  options?: QuestionOption[];
}

export interface ExamDetails {
  subject: string;
  duration: number;
  startTime: string;
  endTime: string;
}

export interface QuestionsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    attemptId: string;
    questions: Question[];
    exam: ExamDetails;
  };
}

export interface ExamAnswer {
  questionId: string;
  answer: string | boolean;
}

export interface SubmitAnswersRequest {
  answers: ExamAnswer[];
}

export interface SubmitAnswersResponse {
  success: boolean;
  message: string;
  data: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    submittedAt: string;
  };
}
