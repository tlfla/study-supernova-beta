import { IDataProvider, Question, UserResponse, Bookmark, StudySession, User, Campus, Class, ClassEnrollment, Benchmark, UserProgress, DailyGoal, Achievement } from './DataProvider'

// Mock data storage
class MockStorage {
  private data: Record<string, any[]> = {}

  get<T>(key: string): T[] {
    return this.data[key] || []
  }

  set<T>(key: string, value: T[]): void {
    this.data[key] = value
  }

  add<T extends { id: string }>(key: string, item: T): T {
    const items = this.get<T>(key)
    items.push(item)
    this.set(key, items)
    return item
  }

  update<T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | null {
    const items = this.get<T>(key)
    const index = items.findIndex(item => item.id === id)
    if (index === -1) return null

    items[index] = { ...items[index], ...updates }
    this.set(key, items)
    return items[index]
  }

  remove(key: string, id: string): boolean {
    const items = this.get(key)
    const index = items.findIndex((item: any) => item.id === id)
    if (index === -1) return false

    items.splice(index, 1)
    this.set(key, items)
    return true
  }
}

export class MockDataProvider implements IDataProvider {
  private storage = new MockStorage()
  private currentUser: User | null = null

  constructor() {
    this.initializeMockData()
  }

  getProviderType(): 'mock' | 'd1' | 'supabase' {
    return 'mock'
  }

  isConfigured(): boolean {
    return true
  }

  private initializeMockData(): void {
    // Initialize with mock data - load questions synchronously for tests
    this.loadQuestionsSync()
    this.setupMockData()
  }

  private loadQuestionsSync(): void {
    try {
      // For testing, we'll create a simple question
      // In production, this would load from the JSON file
      const sampleQuestions: Question[] = [
        {
          id: 'question-1',
          category: 'Anatomy & Physiology',
          question: 'What is the primary function of the heart?',
          options: {
            A: 'Pump blood',
            B: 'Filter toxins',
            C: 'Store oxygen',
            D: 'Digest food'
          },
          correct: 'A',
          rationale: 'The heart is responsible for pumping blood throughout the body.',
          difficulty: 'easy',
          tags: ['cardiovascular', 'basic']
        }
      ]
      this.storage.set('questions', sampleQuestions)
    } catch (error) {
      console.error('Failed to load questions:', error)
      this.storage.set('questions', [])
    }
  }

  private setupMockData(): void {
    const mockUsers: User[] = [
      {
        id: 'user-1',
        email: 'student@example.com',
        name: 'John Doe',
        campus_id: 'campus-1',
        class_code: 'ST-101',
        role: 'student'
      }
    ]
    const mockCampuses: Campus[] = [
      {
        id: 'campus-1',
        name: 'Main Campus',
        location: 'Springfield, IL'
      }
    ]

    this.storage.set('users', mockUsers)
    this.storage.set('campuses', mockCampuses)
    this.storage.set('user_responses', [])
    this.storage.set('bookmarks', [])
    this.storage.set('study_sessions', [])
    this.storage.set('classes', [])
    this.storage.set('class_enrollments', [])
    this.storage.set('benchmarks', [])
    this.storage.set('user_progress', [])
    this.storage.set('daily_goals', [])
    this.storage.set('achievements', [])

    this.currentUser = mockUsers[0]
  }

  // Question operations
  async getQuestions(filters?: {
    category?: string
    difficulty?: string
    tags?: string[]
    limit?: number
  }): Promise<Question[]> {
    let questions = this.storage.get<Question>('questions')

    if (filters?.category) {
      questions = questions.filter(q => q.category === filters.category)
    }

    if (filters?.difficulty) {
      questions = questions.filter(q => q.difficulty === filters.difficulty)
    }

    if (filters?.tags && filters.tags.length > 0) {
      questions = questions.filter(q =>
        filters.tags!.some(tag => q.tags.includes(tag))
      )
    }

    if (filters?.limit) {
      questions = questions.slice(0, filters.limit)
    }

    return questions
  }

  async getQuestionById(id: string): Promise<Question | null> {
    const questions = this.storage.get<Question>('questions')
    return questions.find(q => q.id === id) || null
  }

  async getQuestionCount(filters?: { category?: string; difficulty?: string }): Promise<number> {
    let questions = this.storage.get<Question>('questions')

    if (filters?.category) {
      questions = questions.filter(q => q.category === filters.category)
    }

    if (filters?.difficulty) {
      questions = questions.filter(q => q.difficulty === filters.difficulty)
    }

    return questions.length
  }

  // User response operations
  async saveUserResponse(response: Omit<UserResponse, 'timestamp'>): Promise<void> {
    const fullResponse: UserResponse = {
      ...response,
      timestamp: new Date().toISOString()
    }
    this.storage.add('user_responses', fullResponse)
  }

  async getUserResponses(userId: string, filters?: {
    category?: string
    limit?: number
    since?: string
  }): Promise<UserResponse[]> {
    let responses = this.storage.get<UserResponse>('user_responses')
      .filter(r => r.user_id === userId)

    if (filters?.category) {
      // This would require joining with questions table in a real implementation
      // For mock, we'll just return all responses
    }

    if (filters?.since) {
      responses = responses.filter(r => r.timestamp >= filters.since!)
    }

    if (filters?.limit) {
      responses = responses.slice(0, filters.limit)
    }

    return responses
  }

  async getUserStats(userId: string): Promise<{
    totalQuestions: number
    correctAnswers: number
    averageScore: number
    totalTime: number
  }> {
    const responses = this.storage.get<UserResponse>('user_responses')
      .filter(r => r.user_id === userId)

    const totalQuestions = responses.length
    const correctAnswers = responses.filter(r => r.is_correct).length
    const averageScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
    const totalTime = responses.reduce((sum, r) => sum + r.time_spent, 0)

    return {
      totalQuestions,
      correctAnswers,
      averageScore,
      totalTime
    }
  }

  // Bookmark operations
  async listBookmarks(userId: string): Promise<Bookmark[]> {
    return this.storage.get<Bookmark>('bookmarks')
      .filter(b => b.user_id === userId)
  }

  async toggleBookmark(userId: string, questionId: string, notes?: string): Promise<boolean> {
    const bookmarks = this.storage.get<Bookmark>('bookmarks')
    const existingIndex = bookmarks.findIndex(b => b.user_id === userId && b.question_id === questionId)

    if (existingIndex >= 0) {
      bookmarks.splice(existingIndex, 1)
      this.storage.set('bookmarks', bookmarks)
      return false
    } else {
      const bookmark: Bookmark = {
        user_id: userId,
        question_id: questionId,
        notes: notes || '',
        created_at: new Date().toISOString()
      }
      this.storage.add('bookmarks', bookmark)
      return true
    }
  }

  async isBookmarked(userId: string, questionId: string): Promise<boolean> {
    const bookmarks = this.storage.get<Bookmark>('bookmarks')
    return bookmarks.some(b => b.user_id === userId && b.question_id === questionId)
  }

  // Progress operations
  async getUserProgress(userId: string, category?: string): Promise<UserProgress[]> {
    let progress = this.storage.get<UserProgress>('user_progress')
      .filter(p => p.user_id === userId)

    if (category) {
      progress = progress.filter(p => p.category === category)
    }

    return progress
  }

  async updateUserProgress(userId: string, category: string, correct: boolean, timeSpent: number): Promise<void> {
    const progress = this.storage.get<UserProgress>('user_progress')
    const existingIndex = progress.findIndex(p => p.user_id === userId && p.category === category)

    if (existingIndex >= 0) {
      const current = progress[existingIndex]
      progress[existingIndex] = {
        ...current,
        questions_attempted: current.questions_attempted + 1,
        questions_correct: current.questions_correct + (correct ? 1 : 0),
        best_score: Math.max(current.best_score, correct ? 100 : 0),
        last_practiced: new Date().toISOString()
      }
    } else {
      progress.push({
        user_id: userId,
        category,
        questions_attempted: 1,
        questions_correct: correct ? 1 : 0,
        best_score: correct ? 100 : 0,
        last_practiced: new Date().toISOString()
      })
    }

    this.storage.set('user_progress', progress)
  }

  // Daily goal operations
  async getDailyGoal(userId: string, date?: string): Promise<DailyGoal | null> {
    const goals = this.storage.get<DailyGoal>('daily_goals')
    const targetDate = date || new Date().toISOString().split('T')[0]

    return goals.find(g => g.user_id === userId && g.date === targetDate) || null
  }

  async updateDailyGoal(userId: string, completedQuestions: number, completedTime: number): Promise<void> {
    const goals = this.storage.get<DailyGoal>('daily_goals')
    const today = new Date().toISOString().split('T')[0]
    const existingIndex = goals.findIndex(g => g.user_id === userId && g.date === today)

    if (existingIndex >= 0) {
      goals[existingIndex] = {
        ...goals[existingIndex],
        completed_questions: completedQuestions,
        completed_time: completedTime
      }
    } else {
      goals.push({
        user_id: userId,
        date: today,
        target_questions: 20, // Default target
        completed_questions: completedQuestions,
        target_time: 30, // 30 minutes default
        completed_time: completedTime
      })
    }

    this.storage.set('daily_goals', goals)
  }

  // Study session operations
  async startStudySession(userId: string): Promise<string> {
    const session: StudySession = {
      user_id: userId,
      start: new Date().toISOString(),
      end: '',
      questions_attempted: 0,
      score: 0
    }

    const savedSession = this.storage.add('study_sessions', session)
    return savedSession.start // Using start time as session ID for simplicity
  }

  async endStudySession(sessionId: string, score: number, questionsAttempted: number): Promise<void> {
    const sessions = this.storage.get<StudySession>('study_sessions')
    const sessionIndex = sessions.findIndex(s => s.start === sessionId)

    if (sessionIndex >= 0) {
      sessions[sessionIndex] = {
        ...sessions[sessionIndex],
        end: new Date().toISOString(),
        score,
        questions_attempted: questionsAttempted
      }
      this.storage.set('study_sessions', sessions)
    }
  }

  async getStudySessions(userId: string, limit?: number): Promise<StudySession[]> {
    let sessions = this.storage.get<StudySession>('study_sessions')
      .filter(s => s.user_id === userId)
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())

    if (limit) {
      sessions = sessions.slice(0, limit)
    }

    return sessions
  }

  // Achievement operations
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return this.storage.get<Achievement>('achievements')
      .filter(a => a.user_id === userId)
      .sort((a, b) => new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime())
  }

  async unlockAchievement(userId: string, type: Achievement['type'], title: string, description: string): Promise<void> {
    const achievement: Achievement = {
      id: `achievement-${Date.now()}`,
      user_id: userId,
      type,
      title,
      description,
      unlocked_at: new Date().toISOString()
    }

    this.storage.add('achievements', achievement)
  }

  // User operations
  async getCurrentUser(): Promise<User | null> {
    return this.currentUser
  }

  async getUsers(campusId?: string): Promise<User[]> {
    let users = this.storage.get<User>('users')

    if (campusId) {
      users = users.filter(u => u.campus_id === campusId)
    }

    return users
  }

  // Campus and class operations
  async getCampuses(): Promise<Campus[]> {
    return this.storage.get<Campus>('campuses')
  }

  async getClasses(campusId?: string): Promise<Class[]> {
    let classes = this.storage.get<Class>('classes')

    if (campusId) {
      classes = classes.filter(c => c.campus_id === campusId)
    }

    return classes
  }

  async getClassEnrollments(userId?: string): Promise<ClassEnrollment[]> {
    let enrollments = this.storage.get<ClassEnrollment>('class_enrollments')

    if (userId) {
      enrollments = enrollments.filter(e => e.user_id === userId)
    }

    return enrollments
  }

  // Benchmark operations
  async getBenchmarks(category?: string): Promise<Benchmark[]> {
    let benchmarks = this.storage.get<Benchmark>('benchmarks')

    if (category) {
      benchmarks = benchmarks.filter(b => b.category === category)
    }

    return benchmarks
  }
}
