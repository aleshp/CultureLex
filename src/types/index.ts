export interface Word {
  id: string
  english: string
  phonetic: string
  categoryId: string
  kazakh: string
  description: string
  culturalContext: string
  example: string
  exampleTranslation: string
  emoji: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface Category {
  id: string
  nameKk: string
  descriptionKk: string
  emoji: string
  color: string
  bgGradient: string
}

export interface QuizQuestion {
  wordId: string
  type: 'en_to_kk' | 'kk_to_en' | 'example'
  question: string
  options: string[]
  correctIndex: number
}

export interface Badge {
  id: string
  nameKk: string
  descriptionKk: string
  emoji: string
  condition: (stats: UserStats) => boolean
}

export interface UserStats {
  xp: number
  level: number
  streak: number
  lastStudiedDate: string
  learnedWordIds: string[]
  masteredWordIds: string[]
  quizHistory: QuizResult[]
  earnedBadgeIds: string[]
  hearts: number
  totalCorrect: number
  totalAnswered: number
}

export interface QuizResult {
  categoryId: string
  score: number
  total: number
  date: string
  xpEarned: number
}
