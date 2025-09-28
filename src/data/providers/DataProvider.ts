import { MockDataProvider } from './MockDataProvider'
import { D1DataProvider } from './D1DataProvider'
import { SupabaseDataProvider } from './SupabaseDataProvider'

// Data types
export interface Question {
  id: string
  category: string
  question: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  correct: 'A' | 'B' | 'C' | 'D'
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

export interface UserResponse {
  id: string
  userId?: string
  questionId: string
  answer: 'A' | 'B' | 'C' | 'D'
  isCorrect: boolean
  timeSpentSec: number
  timestamp: string
}

export interface Bookmark {
  id: string
  userId?: string
  questionId: string
  createdAt: string
}

export interface StudySession {
  id: string
  userId?: string
  start: string
  end: string
  questionsAttempted: number
  correctCount: number
  accuracy: number
}

export interface User {
  id: string
  email: string
  name: string
  campus_id: string
  class_code: string
  role: 'student' | 'instructor' | 'admin'
}

export interface Campus {
  id: string
  name: string
  location: string
}

export interface Class {
  id: string
  code: string
  name: string
  campus_id: string
  instructor_id: string
}

export interface ClassEnrollment {
  id: string
  user_id: string
  class_id: string
  enrolled_at: string
}

export interface Benchmark {
  id: string
  name: string
  description: string
  target_score: number
  category: string
}

export interface UserProgress {
  user_id: string
  category: string
  questions_attempted: number
  questions_correct: number
  best_score: number
  last_practiced: string
}

export interface DailyGoal {
  user_id: string
  date: string
  target_questions: number
  completed_questions: number
  target_time: number
  completed_time: number
}

export interface Achievement {
  id: string
  user_id: string
  type: 'streak' | 'score' | 'completion' | 'speed'
  title: string
  description: string
  unlocked_at: string
}

// Data provider interface
export interface IDataProvider {
  getProviderType(): 'mock' | 'd1' | 'supabase'
  isConfigured(): boolean

  // Question operations
  getQuestions(filters?: {
    category?: string
    difficulty?: string
    tags?: string[]
    limit?: number
  }): Promise<Question[]>
  getQuestionById(id: string): Promise<Question | null>
  getQuestionCount(filters?: { category?: string; difficulty?: string }): Promise<number>

  // User response operations
  saveResponse(response: UserResponse): Promise<void>
  getSessionStats(range?: { start?: string; end?: string }): Promise<{
    totalQuestions: number
    correctAnswers: number
    averageScore: number
    totalTime: number
    categoryBreakdown: Record<string, { attempted: number; correct: number }>
  }>

  // Bookmark operations
  listBookmarks(): Promise<Bookmark[]>
  isBookmarked(questionId: string): Promise<boolean>
  toggleBookmark(questionId: string): Promise<boolean>
  bookmarkAll(questionIds: string[]): Promise<void>
  unbookmarkAll(questionIds: string[]): Promise<void>

  // Progress operations
  getUserProgress(category?: string): Promise<UserProgress[]>
  updateUserProgress(category: string, correct: boolean, timeSpentSec: number): Promise<void>

  // Daily goal operations
  getDailyGoal(date?: string): Promise<DailyGoal | null>
  updateDailyGoal(completedQuestions: number, completedTime: number): Promise<void>

  // Study session operations
  startStudySession(): Promise<string>
  endStudySession(sessionId: string, correctCount: number, questionsAttempted: number): Promise<void>
  getStudySessions(limit?: number): Promise<StudySession[]>

  // Achievement operations
  getUserAchievements(): Promise<Achievement[]>
  unlockAchievement(type: Achievement['type'], title: string, description: string): Promise<void>

  // User operations
  getCurrentUser(): Promise<User | null>
  getUsers(campusId?: string): Promise<User[]>

  // Campus and class operations
  getCampuses(): Promise<Campus[]>
  getClasses(campusId?: string): Promise<Class[]>
  getClassEnrollments(userId?: string): Promise<ClassEnrollment[]>

  // Benchmark operations
  getBenchmarks(category?: string): Promise<Benchmark[]>
}

// Data provider factory
export class DataProvider {
  private static instance: IDataProvider | null = null

  static getInstance(): IDataProvider {
    if (!this.instance) {
      const providerType = (import.meta.env.VITE_DATA_PROVIDER as 'mock' | 'd1' | 'supabase') || 'mock'

      switch (providerType) {
        case 'mock':
          this.instance = new MockDataProvider()
          break
        case 'd1':
          this.instance = new D1DataProvider()
          break
        case 'supabase':
          this.instance = new SupabaseDataProvider()
          break
        default:
          this.instance = new MockDataProvider()
      }
    }

    return this.instance
  }

  static resetInstance(): void {
    this.instance = null
  }
}
