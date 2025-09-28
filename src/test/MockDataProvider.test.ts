import { describe, it, expect, beforeEach } from 'vitest'
import { MockDataProvider } from '../data/providers/MockDataProvider'

describe('MockDataProvider', () => {
  let provider: MockDataProvider

  beforeEach(() => {
    provider = new MockDataProvider()
  })

  it('returns mock as provider type', () => {
    expect(provider.getProviderType()).toBe('mock')
  })

  it('is configured by default', () => {
    expect(provider.isConfigured()).toBe(true)
  })

  it('loads questions successfully', async () => {
    const questions = await provider.getQuestions()
    expect(Array.isArray(questions)).toBe(true)
    expect(questions.length).toBeGreaterThan(0)
  })

  it('returns current user', async () => {
    const user = await provider.getCurrentUser()
    expect(user).toBeTruthy()
    expect(user?.id).toBe('user-1')
  })

  it('can bookmark questions', async () => {
    const user = await provider.getCurrentUser()
    if (!user) throw new Error('No user found')

    const questions = await provider.getQuestions({ limit: 1 })
    const question = questions[0]

    const initialBookmarks = await provider.listBookmarks(user.id)
    const initialCount = initialBookmarks.length

    // Bookmark the question
    const bookmarked = await provider.toggleBookmark(user.id, question.id)
    expect(bookmarked).toBe(true)

    // Check bookmark exists
    const afterBookmarks = await provider.listBookmarks(user.id)
    expect(afterBookmarks.length).toBe(initialCount + 1)

    // Remove bookmark
    const unbookmarked = await provider.toggleBookmark(user.id, question.id)
    expect(unbookmarked).toBe(false)

    // Check bookmark is removed
    const finalBookmarks = await provider.listBookmarks(user.id)
    expect(finalBookmarks.length).toBe(initialCount)
  })
})
