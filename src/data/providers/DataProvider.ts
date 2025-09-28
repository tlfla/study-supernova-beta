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
  rationale: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

export interface UserResponse {
  user_id: string
  question_id: string
  answer: 'A' | 'B' | 'C' | 'D'
  is_correct: boolean
  timestamp: string
  time_spent: number
}

export interface Bookmark {
  user_id: string
  question_id: string
  notes: string
  created_at: string
}

export interface StudySession {
  user_id: string
  start: string
  end: string
  questions_attempted: number
  score: number
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
  saveUserResponse(response: Omit<UserResponse, 'timestamp'>): Promise<void>
  getUserResponses(userId: string, filters?: {
    category?: string
    limit?: number
    since?: string
  }): Promise<UserResponse[]>
  getUserStats(userId: string): Promise<{
    totalQuestions: number
    correctAnswers: number
    averageScore: number
    totalTime: number
  }>

  // Bookmark operations
  listBookmarks(userId: string): Promise<Bookmark[]>
  toggleBookmark(userId: string, questionId: string, notes?: string): Promise<boolean>
  isBookmarked(userId: string, questionId: string): Promise<boolean>

  // Progress operations
  getUserProgress(userId: string, category?: string): Promise<UserProgress[]>
  updateUserProgress(userId: string, category: string, correct: boolean, timeSpent: number): Promise<void>

  // Daily goal operations
  getDailyGoal(userId: string, date?: string): Promise<DailyGoal | null>
  updateDailyGoal(userId: string, completedQuestions: number, completedTime: number): Promise<void>

  // Study session operations
  startStudySession(userId: string): Promise<string>
  endStudySession(sessionId: string, score: number, questionsAttempted: number): Promise<void>
  getStudySessions(userId: string, limit?: number): Promise<StudySession[]>

  // Achievement operations
  getUserAchievements(userId: string): Promise<Achievement[]>
  unlockAchievement(userId: string, type: Achievement['type'], title: string, description: string): Promise<void>

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
