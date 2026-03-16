import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserStats, QuizResult } from '../types'

const MAX_HEARTS = 5

const defaultStats: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  lastStudiedDate: '',
  learnedWordIds: [],
  masteredWordIds: [],
  quizHistory: [],
  earnedBadgeIds: [],
  hearts: MAX_HEARTS,
  totalCorrect: 0,
  totalAnswered: 0,
}

function calcLevel(xp: number): number {
  // Level up every 100 XP
  return Math.floor(xp / 100) + 1
}

function isToday(dateStr: string): boolean {
  if (!dateStr) return false
  return new Date(dateStr).toDateString() === new Date().toDateString()
}

function isYesterday(dateStr: string): boolean {
  if (!dateStr) return false
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return new Date(dateStr).toDateString() === yesterday.toDateString()
}

interface StoreState {
  stats: UserStats
  addXP: (amount: number) => void
  markWordLearned: (wordId: string) => void
  markWordMastered: (wordId: string) => void
  loseHeart: () => void
  refillHearts: () => void
  recordQuizResult: (result: QuizResult) => void
  earnBadge: (badgeId: string) => void
  updateStreak: () => void
  resetProgress: () => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      stats: defaultStats,

      addXP: (amount: number) => {
        set((s) => {
          const newXp = s.stats.xp + amount
          return {
            stats: {
              ...s.stats,
              xp: newXp,
              level: calcLevel(newXp),
            },
          }
        })
      },

      markWordLearned: (wordId: string) => {
        set((s) => {
          if (s.stats.learnedWordIds.includes(wordId)) return s
          const updated = [...s.stats.learnedWordIds, wordId]
          const newXp = s.stats.xp + 10
          return {
            stats: {
              ...s.stats,
              learnedWordIds: updated,
              xp: newXp,
              level: calcLevel(newXp),
            },
          }
        })
        get().updateStreak()
      },

      markWordMastered: (wordId: string) => {
        set((s) => {
          const newMastered = s.stats.masteredWordIds.includes(wordId)
            ? s.stats.masteredWordIds
            : [...s.stats.masteredWordIds, wordId]
          const newLearned = s.stats.learnedWordIds.includes(wordId)
            ? s.stats.learnedWordIds
            : [...s.stats.learnedWordIds, wordId]
          const newXp = s.stats.xp + 20
          return {
            stats: {
              ...s.stats,
              masteredWordIds: newMastered,
              learnedWordIds: newLearned,
              xp: newXp,
              level: calcLevel(newXp),
            },
          }
        })
      },

      loseHeart: () => {
        set((s) => ({
          stats: {
            ...s.stats,
            hearts: Math.max(0, s.stats.hearts - 1),
          },
        }))
      },

      refillHearts: () => {
        set((s) => ({
          stats: { ...s.stats, hearts: MAX_HEARTS },
        }))
      },

      recordQuizResult: (result: QuizResult) => {
        set((s) => {
          const newXp = s.stats.xp + result.xpEarned
          return {
            stats: {
              ...s.stats,
              quizHistory: [...s.stats.quizHistory, result],
              xp: newXp,
              level: calcLevel(newXp),
              totalCorrect: s.stats.totalCorrect + result.score,
              totalAnswered: s.stats.totalAnswered + result.total,
            },
          }
        })
        get().updateStreak()
      },

      earnBadge: (badgeId: string) => {
        set((s) => {
          if (s.stats.earnedBadgeIds.includes(badgeId)) return s
          return {
            stats: {
              ...s.stats,
              earnedBadgeIds: [...s.stats.earnedBadgeIds, badgeId],
            },
          }
        })
      },

      updateStreak: () => {
        set((s) => {
          const today = new Date().toISOString()
          const last = s.stats.lastStudiedDate
          if (isToday(last)) return s // already updated today
          const newStreak = isYesterday(last) ? s.stats.streak + 1 : 1
          return {
            stats: {
              ...s.stats,
              streak: newStreak,
              lastStudiedDate: today,
            },
          }
        })
      },

      resetProgress: () => {
        set({ stats: defaultStats })
      },
    }),
    {
      name: 'culturelex-progress',
    }
  )
)
