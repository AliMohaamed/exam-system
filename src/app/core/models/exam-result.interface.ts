export interface ExamAnswer {
  question: string;
  answer: string | boolean;
  isCorrect: boolean;
  pointsEarned: number;
  _id: string;
  answeredAt: string;
}

export interface ExamResultData {
  _id: string;
  student: string;
  exam: {
    _id: string;
    subject: string;
    description: string;
    level: string;
    duration: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
  startTime: string;
  endTime: string;
  totalScore: number;
  percentage: number;
  status: string;
  timeSpent: number;
  answers: ExamAnswer[];
  createdAt: string;
  updatedAt: string;
  isPassed: boolean;
}

export interface ExamResultResponse {
  success: boolean;
  message: string;
  data: ExamResultData;
}

export interface ExamAnswer {
  question: string;
  answer: string | boolean;
  isCorrect: boolean;
  pointsEarned: number;
  _id: string;
  answeredAt: string;
}

export interface ExamResult {
  attemptId: string;
  totalScore: number;
  percentage: number;
  status: string;
  timeSpent: number;
  isPassed: boolean;
  exam: {
    subject: string;
  };
  answers: ExamAnswer[];
}
export interface ExamResultsResponse {
  success: boolean;
  message: string;
  data: ExamResult[];
}
