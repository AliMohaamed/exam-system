export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Option {
  text: string;
  isCorrect: boolean;
  _id: string;
}

export interface Question {
  _id: string;
  questionText: string;
  questionType: 'multiple-choice' | 'fill-blank' | 'true-false';
  options: Option[];
  correctText?: string;
  correctAnswer?: boolean;
  points: number;
  difficulty: string;
  exam: string | ExamData;
  createdAt: string;
  updatedAt: string;
}

// Add interface for answer submission
export interface AnswerSubmission {
  questionId: string;
  answer: string;
}

export interface ExamData {
  _id: string;
  subject: string;
  description: string;
  level: string;
  duration: number;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

export interface ExamResponse {
  success: boolean;
  message: string;
  data: ExamData;
}
