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
      // Import the questions from JSON file
      import('../mock/questions.json').then((module) => {
        const questionsData = module.default || module
        const questions: Question[] = questionsData.map((q: any) => 
          this.mapQuestionForBackwardCompat(q)
        )
        this.storage.set('questions', questions)
        console.log(`✅ Loaded ${questions.length} questions from questions.json`)
      }).catch((error) => {
        console.error('Failed to load questions.json:', error)
        this.storage.set('questions', [])
      })
    } catch (error) {
      console.error('Failed to load questions:', error)
      this.storage.set('questions', [])
    }
  }

  // Backward compatibility: map rationale to explanation if present
  private mapQuestionForBackwardCompat(question: any): Question {
    return {
      ...question,
      // Map rationale to explanation if explanation is missing
      explanation: question.explanation || question.rationale || 'No explanation available.',
      // Remove rationale field to avoid conflicts
      rationale: undefined
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
    let questions = this.storage.get<any>('questions').map(q => this.mapQuestionForBackwardCompat(q))

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
    const questions = this.storage.get<any>('questions').map(q => this.mapQuestionForBackwardCompat(q))
    return questions.find(q => q.id === id) || null
  }

  async getQuestionCount(filters?: { category?: string; difficulty?: string }): Promise<number> {
    let questions = this.storage.get<any>('questions').map(q => this.mapQuestionForBackwardCompat(q))

    if (filters?.category) {
      questions = questions.filter(q => q.category === filters.category)
    }

    if (filters?.difficulty) {
      questions = questions.filter(q => q.difficulty === filters.difficulty)
    }

    return questions.length
  }

  // User response operations
  async saveResponse(response: UserResponse): Promise<void> {
    this.storage.add('user_responses', response)
  }

  async getSessionStats(range?: { start?: string; end?: string }): Promise<{
    totalQuestions: number
    correctAnswers: number
    averageScore: number
    totalTime: number
    categoryBreakdown: Record<string, { attempted: number; correct: number }>
  }> {
    const responses = this.storage.get<UserResponse>('user_responses')

    let filteredResponses = responses
    if (range?.start) {
      filteredResponses = filteredResponses.filter(r => r.timestamp >= range.start!)
    }
    if (range?.end) {
      filteredResponses = filteredResponses.filter(r => r.timestamp <= range.end!)
    }

    const totalQuestions = filteredResponses.length
    const correctAnswers = filteredResponses.filter(r => r.isCorrect).length
    const averageScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
    const totalTime = filteredResponses.reduce((sum, r) => sum + r.timeSpentSec, 0)

    // Category breakdown
    const categoryBreakdown: Record<string, { attempted: number; correct: number }> = {}
    for (const response of filteredResponses) {
      // This would need to be joined with questions in a real implementation
      // For mock, we'll just group by a placeholder
      const category = 'general'
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { attempted: 0, correct: 0 }
      }
      categoryBreakdown[category].attempted++
      if (response.isCorrect) {
        categoryBreakdown[category].correct++
      }
    }

    return {
      totalQuestions,
      correctAnswers,
      averageScore,
      totalTime,
      categoryBreakdown
    }
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
  async listBookmarks(): Promise<Bookmark[]> {
    return this.storage.get<Bookmark>('bookmarks')
  }

  async isBookmarked(questionId: string): Promise<boolean> {
    const bookmarks = this.storage.get<Bookmark>('bookmarks')
    return bookmarks.some(b => b.questionId === questionId)
  }

  async toggleBookmark(questionId: string): Promise<boolean> {
    const bookmarks = this.storage.get<Bookmark>('bookmarks')
    const existingIndex = bookmarks.findIndex(b => b.questionId === questionId)

    if (existingIndex >= 0) {
      bookmarks.splice(existingIndex, 1)
      this.storage.set('bookmarks', bookmarks)
      return false
    } else {
      const bookmark: Bookmark = {
        id: `bookmark-${Date.now()}`,
        questionId,
        createdAt: new Date().toISOString()
      }
      this.storage.add('bookmarks', bookmark)
      return true
    }
  }

  async bookmarkAll(questionIds: string[]): Promise<void> {
    const bookmarks = this.storage.get<Bookmark>('bookmarks')
    const existingQuestionIds = new Set(bookmarks.map(b => b.questionId))

    for (const questionId of questionIds) {
      if (!existingQuestionIds.has(questionId)) {
        const bookmark: Bookmark = {
          id: `bookmark-${Date.now()}-${questionId}`,
          questionId,
          createdAt: new Date().toISOString()
        }
        this.storage.add('bookmarks', bookmark)
      }
    }
  }

  async unbookmarkAll(questionIds: string[]): Promise<void> {
    const bookmarks = this.storage.get<Bookmark>('bookmarks')
    const filteredBookmarks = bookmarks.filter(b => !questionIds.includes(b.questionId))
    this.storage.set('bookmarks', filteredBookmarks)
  }

  // Progress operations
  async getUserProgress(category?: string): Promise<UserProgress[]> {
    let progress = this.storage.get<UserProgress>('user_progress')

    if (category) {
      progress = progress.filter(p => p.category === category)
    }

    return progress
  }

  async updateUserProgress(category: string, correct: boolean, timeSpentSec: number): Promise<void> {
    const progress = this.storage.get<UserProgress>('user_progress')
    const existingIndex = progress.findIndex(p => p.category === category)

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
        user_id: this.currentUser?.id || 'user-1',
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
  async getDailyGoal(date?: string): Promise<DailyGoal | null> {
    const goals = this.storage.get<DailyGoal>('daily_goals')
    const targetDate = date || new Date().toISOString().split('T')[0]

    return goals.find(g => g.date === targetDate) || null
  }

  async updateDailyGoal(completedQuestions: number, completedTime: number): Promise<void> {
    const goals = this.storage.get<DailyGoal>('daily_goals')
    const today = new Date().toISOString().split('T')[0]
    const existingIndex = goals.findIndex(g => g.date === today)

    if (existingIndex >= 0) {
      goals[existingIndex] = {
        ...goals[existingIndex],
        completed_questions: completedQuestions,
        completed_time: completedTime
      }
    } else {
      goals.push({
        user_id: this.currentUser?.id || 'user-1',
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
  async startStudySession(): Promise<string> {
    const session: StudySession = {
      id: `session-${Date.now()}`,
      userId: this.currentUser?.id,
      start: new Date().toISOString(),
      end: '',
      questionsAttempted: 0,
      correctCount: 0,
      accuracy: 0
    }

    this.storage.add('study_sessions', session)
    return session.id
  }

  async endStudySession(sessionId: string, correctCount: number, questionsAttempted: number): Promise<void> {
    const sessions = this.storage.get<StudySession>('study_sessions')
    const sessionIndex = sessions.findIndex(s => s.id === sessionId)

    if (sessionIndex >= 0) {
      sessions[sessionIndex] = {
        ...sessions[sessionIndex],
        end: new Date().toISOString(),
        correctCount,
        questionsAttempted,
        accuracy: questionsAttempted > 0 ? (correctCount / questionsAttempted) * 100 : 0
      }
      this.storage.set('study_sessions', sessions)
    }
  }

  async getStudySessions(limit?: number): Promise<StudySession[]> {
    let sessions = this.storage.get<StudySession>('study_sessions')
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())

    if (limit) {
      sessions = sessions.slice(0, limit)
    }

    return sessions
  }

  // Achievement operations
  async getUserAchievements(): Promise<Achievement[]> {
    return this.storage.get<Achievement>('achievements')
      .sort((a, b) => new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime())
  }

  async unlockAchievement(type: Achievement['type'], title: string, description: string): Promise<void> {
    const achievement: Achievement = {
      id: `achievement-${Date.now()}`,
      user_id: this.currentUser?.id || 'user-1',
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

  async signOut(): Promise<void> {
    // For mock provider, just clear the current user
    this.currentUser = null
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
