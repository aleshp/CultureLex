import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Badge, ALL_BADGES } from '../components/Badge'
import { useEffect } from 'react'

export default function Achievements() {
  const { stats, earnBadge } = useStore()

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
    <div className="min-h-screen pt-[100px] pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-display text-4xl sm:text-5xl text-[#1c1c1e] mb-3">Жетістіктер</h1>
          <p className="text-[#8e8e93] font-medium text-lg">Алынды: {earned} из {total}</p>

          <div className="mt-6 h-2 bg-black/5 rounded-full overflow-hidden w-full max-w-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-[#32ADE6] to-[#007AFF] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        >
          {ALL_BADGES.map((badge) => (
            <motion.div key={badge.id} variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}>
              <Badge badge={badge} earned={stats.earnedBadgeIds.includes(badge.id)} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}