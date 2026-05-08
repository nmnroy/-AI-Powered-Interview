export interface QuestionType {
  id: string
  text: string
  category: 'DSA' | 'HR' | 'SYSTEM_DESIGN' | 'BEHAVIORAL'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  tags: string[]
  userId?: string | null
}

export interface AnswerType {
  id: string
  content: string
  score: number | null
  feedback: string | null
  createdAt: Date
  question: QuestionType
}

export interface StreakType {
  currentStreak: number
  longestStreak: number
  lastPracticeDate: Date | null
}

export interface FeedbackResponse {
  score: number
  clarity: number
  completeness: number
  structure: number
  improvements: string[]
  strengths: string[]
  summary: string
}

export interface DashboardAnswerType {
  id: string
  content: string
  score: number | null
  feedback: string | null
  createdAt: string
  question: QuestionType
}

export interface DashboardDataType {
  currentStreak: number
  longestStreak: number
  totalAnswers: number
  averageScore: number | null
  questionsLeftToday: number
  lastPracticeDate: string | null
  recentAnswers: DashboardAnswerType[]
}
