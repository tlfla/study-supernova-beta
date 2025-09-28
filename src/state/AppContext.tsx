import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { AppState, AppAction } from './types'
import { DataProvider } from '../data/providers/DataProvider'

const initialState: AppState = {
  currentUser: null,
  dailyGoal: null,
  userProgress: [],
  quizSettings: null,
  quizState: null,
  isLoading: false,
  toast: null
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload }

    case 'SET_DAILY_GOAL':
      return { ...state, dailyGoal: action.payload }

    case 'SET_USER_PROGRESS':
      return { ...state, userProgress: action.payload }

    case 'SET_QUIZ_SETTINGS':
      return { ...state, quizSettings: action.payload }

    case 'START_QUIZ':
      return {
        ...state,
        quizState: {
          questions: action.payload.questions,
          currentQuestionIndex: 0,
          answers: {},
          startTime: Date.now(),
          timeRemaining: action.payload.settings.timeLimit ? action.payload.settings.timeLimit * 60 * 1000 : undefined,
          isComplete: false
        }
      }

    case 'ANSWER_QUESTION':
      if (!state.quizState) return state

      return {
        ...state,
        quizState: {
          ...state.quizState,
          answers: {
            ...state.quizState.answers,
            [action.payload.questionId]: action.payload.answer
          }
        }
      }

    case 'NEXT_QUESTION':
      if (!state.quizState) return state

      const nextIndex = Math.min(
        state.quizState.currentQuestionIndex + 1,
        state.quizState.questions.length - 1
      )

      return {
        ...state,
        quizState: {
          ...state.quizState,
          currentQuestionIndex: nextIndex
        }
      }

    case 'PREVIOUS_QUESTION':
      if (!state.quizState) return state

      return {
        ...state,
        quizState: {
          ...state.quizState,
          currentQuestionIndex: Math.max(state.quizState.currentQuestionIndex - 1, 0)
        }
      }

    case 'SET_TIME_REMAINING':
      if (!state.quizState) return state

      return {
        ...state,
        quizState: {
          ...state.quizState,
          timeRemaining: action.payload
        }
      }

    case 'COMPLETE_QUIZ':
      if (!state.quizState) return state

      return {
        ...state,
        quizState: {
          ...state.quizState,
          isComplete: true
        }
      }

    case 'RESET_QUIZ':
      return {
        ...state,
        quizState: null,
        quizSettings: null
      }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SHOW_TOAST':
      return { ...state, toast: { isVisible: true, ...action.payload } }

    case 'HIDE_TOAST':
      return { ...state, toast: null }

    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  // Helper functions
  loadUserData: () => Promise<void>
  updateDailyGoal: (completedQuestions: number, completedTime: number) => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const dataProvider = DataProvider.getInstance()

  const loadUserData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const [user, dailyGoal, userProgress] = await Promise.all([
        dataProvider.getCurrentUser(),
        dataProvider.getDailyGoal('user-1'), // Hardcoded for now
        dataProvider.getUserProgress('user-1') // Hardcoded for now
      ])

      dispatch({ type: 'SET_USER', payload: user })
      dispatch({ type: 'SET_DAILY_GOAL', payload: dailyGoal })
      dispatch({ type: 'SET_USER_PROGRESS', payload: userProgress })
    } catch (error) {
      console.error('Failed to load user data:', error)
      dispatch({
        type: 'SHOW_TOAST',
        payload: {
          type: 'error',
          title: 'Failed to load data',
          message: 'Please try again later.'
        }
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateDailyGoal = async (completedQuestions: number, completedTime: number) => {
    try {
      await dataProvider.updateDailyGoal('user-1', completedQuestions, completedTime) // Hardcoded for now
      const updatedGoal = await dataProvider.getDailyGoal('user-1')
      dispatch({ type: 'SET_DAILY_GOAL', payload: updatedGoal })
    } catch (error) {
      console.error('Failed to update daily goal:', error)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  const contextValue: AppContextType = {
    state,
    dispatch,
    loadUserData,
    updateDailyGoal
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
