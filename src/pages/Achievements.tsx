import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Badge, ALL_BADGES } from '../components/Badge'
import { useEffect } from 'react'

export default function Achievements() {
  const { stats, earnBadge } = useStore()

  // Логика автоматической выдачи ачивок при входе на страницу
  useEffect(() => {
    const learned = stats.learnedWordIds.length
    const quizzes = stats.quizHistory.length
    const xp = stats.xp
    const streak = stats.streak

    if (learned >= 1) earnBadge('first_word')
    if (learned >= 5) earnBadge('five_words')
    if (learned >= 10) earnBadge('ten_words')
    if (learned >= 30) earnBadge('all_words')
    if (quizzes >= 1) earnBadge('first_quiz')
    if (xp >= 100) earnBadge('xp_100')
    if (xp >= 500) earnBadge('xp_500')
    if (streak >= 3) earnBadge('streak_3')

    const hasPerfect = stats.quizHistory.some((q) => q.score === q.total && q.total > 0)
    if (hasPerfect) earnBadge('perfect_quiz')
  },[stats.learnedWordIds.length, stats.quizHistory.length, stats.xp, stats.streak])

  const earned = stats.earnedBadgeIds.length
  const total = ALL_BADGES.length
  const progressPct = Math.round((earned / total) * 100) || 0

  return (
    <div className="min-h-[100dvh] pt-28 pb-12 px-6 relative">
      {/* Если в App.tsx уже есть сфера, эту можно убрать, но для полноты картины оставим */}
      <div className="bg-shape-emerald" /> 
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl font-bold text-white"
          >
            Awards & Achievements
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-2"
          >
            Unlock badges by mastering words, scoring perfect quizzes, and keeping your streak alive.
          </motion.p>

          {/* Неоновый прогресс-бар достижений */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-md"
          >
            <div className="flex justify-between text-sm font-medium text-gray-300 mb-2">
              <span>Collection Progress</span>
              <span className="text-emerald-400 font-bold">{earned} / {total}</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <motion.div
                className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </header>

        {/* Сетка ачивок */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden" 
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        >
          {ALL_BADGES.map((badge) => (
            <motion.div 
              key={badge.id} 
              variants={{ 
                hidden: { opacity: 0, scale: 0.9, y: 10 }, 
                show: { opacity: 1, scale: 1, y: 0 } 
              }}
            >
              <Badge 
                badge={badge} 
                earned={stats.earnedBadgeIds.includes(badge.id)} 
              />
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </div>
  )
}
