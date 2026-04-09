// src/store/useStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Session } from '@supabase/supabase-js'
import type { QuizResult } from '../types'

interface Stats {
  xp: number
  level: number
  streak: number
  lastActive: string | null
  learnedWordIds: string[]
  masteredWordIds: string[]
  quizHistory: QuizResult[]
  earnedBadgeIds: string[]
  hearts: number
  totalAnswered: number
  totalCorrect: number
}

interface Store {
  stats: Stats
  session: Session | null
  classGroup: string | null
  role: 'student' | 'teacher' | null
  
  setSession: (session: Session | null) => void
  setClassGroup: (classGroup: string | null) => void
  setRole: (role: 'student' | 'teacher' | null) => void
  setStats: (stats: Stats) => void
  
  markWordLearned: (wordId: string) => void
  markWordMastered: (wordId: string) => void
  recordQuizResult: (result: QuizResult) => void
  earnBadge: (badgeId: string) => void
  loseHeart: () => void
  resetProgress: () => void
}

const initialState: Stats = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActive: null,
  learnedWordIds: [],
  masteredWordIds: [],
  quizHistory:[],
  earnedBadgeIds:[],
  hearts: 5,
  totalAnswered: 0,
  totalCorrect: 0,
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      stats: initialState,
      session: null,
      classGroup: null,
      role: null,

      setSession: (session) => set({ session }),
      setClassGroup: (classGroup) => set({ classGroup }),
      setRole: (role) => set({ role }),
      setStats: (stats) => set({ stats }),

      markWordLearned: (wordId) => set((state) => {
        if (state.stats.learnedWordIds.includes(wordId)) return state
        const newXp = state.stats.xp + 10
        return {
          stats: {
            ...state.stats,
            xp: newXp,
            level: Math.floor(newXp / 100) + 1,
            learnedWordIds:[...state.stats.learnedWordIds, wordId],
          }
        }
      }),

      markWordMastered: (wordId) => set((state) => {
        if (state.stats.masteredWordIds.includes(wordId)) return state
        return {
          stats: {
            ...state.stats,
            masteredWordIds:[...state.stats.masteredWordIds, wordId]
          }
        }
      }),

      recordQuizResult: (result) => set((state) => {
        const newXp = state.stats.xp + result.xpEarned
        return {
          stats: {
            ...state.stats,
            xp: newXp,
            level: Math.floor(newXp / 100) + 1,
            quizHistory:[...state.stats.quizHistory, result],
            totalAnswered: state.stats.totalAnswered + result.total,
            totalCorrect: state.stats.totalCorrect + result.score,
            hearts: 5
          }
        }
      }),

      earnBadge: (badgeId) => set((state) => {
        if (state.stats.earnedBadgeIds.includes(badgeId)) return state
        return {
          stats: {
            ...state.stats,
            earnedBadgeIds:[...state.stats.earnedBadgeIds, badgeId]
          }
        }
      }),

      loseHeart: () => set((state) => ({
        stats: { ...state.stats, hearts: Math.max(0, state.stats.hearts - 1) }
      })),

      resetProgress: () => set({ stats: initialState }),
    }),
    { name: 'culturelex-storage' }
  )
)