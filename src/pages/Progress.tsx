import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { categories, words } from '../data/words'

export default function Progress() {
  const { stats, resetProgress } = useStore()
  const accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0
  const xpInLevel = stats.xp % 100

  return (
    <div className="min-h-[100dvh] pt-28 pb-12 px-6 relative">
      <div className="bg-shape-emerald" />
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-2">Detailed insights and metrics for your learning progress.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="content-card lg:col-span-2 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white">Level Progress</h2>
              <span className="text-indigo-400 font-bold">Lvl {stats.level}</span>
            </div>
            <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
              <motion.div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" initial={{ width: 0 }} animate={{ width: `${xpInLevel}%` }} transition={{ duration: 1 }} />
            </div>
            <p className="text-sm text-gray-500 mt-3 text-right">{xpInLevel} / 100 XP to next level</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="content-card flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-white">Accuracy Rate</h2>
            <p className="text-4xl font-bold mt-2 text-emerald-400">{accuracy}%</p>
            <p className="text-sm text-gray-500 mt-2">Based on quiz history</p>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Module Completion</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {categories.map((cat, idx) => {
            const catWords = words.filter((w) => w.categoryId === cat.id)
            const catLearned = catWords.filter((w) => stats.learnedWordIds.includes(w.id)).length
            const pct = Math.round((catLearned / catWords.length) * 100) || 0
            
            return (
              <div key={cat.id} className="content-card">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-medium">{cat.nameKk}</span>
                  <span className="text-pink-400 font-bold">{pct}%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: idx * 0.1 }}/>
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t border-white/10 pt-6">
          <button onClick={() => window.confirm('Reset all data?') && resetProgress()} className="text-sm text-red-400 hover:text-red-300 transition-colors">
            Reset Progress Data
          </button>
        </div>
      </div>
    </div>
  )
}
