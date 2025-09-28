import { Question, User, DailyGoal, UserProgress } from '../data/providers/DataProvider'

export interface QuizSettings {
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  questionCount: number
  timeLimit?: number // in minutes
}

export interface QuizState {
  questions: Question[]
  currentQuestionIndex: number
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>
  timeRemaining?: number
  startTime: number
  isComplete: boolean
}

export interface AppState {
  currentUser: User | null
  dailyGoal: DailyGoal | null
  userProgress: UserProgress[]
  quizSettings: QuizSettings | null
  quizState: QuizState | null
  isLoading: boolean
  toast: {
    isVisible: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
  } | null
}

export type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_DAILY_GOAL'; payload: DailyGoal | null }
  | { type: 'SET_USER_PROGRESS'; payload: UserProgress[] }
  | { type: 'SET_QUIZ_SETTINGS'; payload: QuizSettings | null }
  | { type: 'START_QUIZ'; payload: { questions: Question[]; settings: QuizSettings } }
  | { type: 'ANSWER_QUESTION'; payload: { questionId: string; answer: 'A' | 'B' | 'C' | 'D' } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'SET_TIME_REMAINING'; payload: number }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SHOW_TOAST'; payload: { type: 'success' | 'error' | 'warning' | 'info'; title: string; message?: string } }
  | { type: 'HIDE_TOAST' }
