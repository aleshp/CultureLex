import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { categories, words } from '../data/words'

export default function Progress() {
  const { stats, resetProgress } = useStore()

  const accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0
  const xpInLevel = stats.xp % 100

  return (
    <div className="min-h-screen pt-[100px] pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-4xl sm:text-5xl text-[#1c1c1e] mb-10">Үлгерімім</motion.h1>

        {/* Сводка (как кольца активности) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Деңгей', value: stats.level, color: 'text-[#007AFF]' },
            { label: 'Жалпы XP', value: stats.xp, color: 'text-[#FF9500]' },
            { label: 'Серия', value: stats.streak, color: 'text-[#FF2D55]' },
            { label: 'Дәлдік', value: `${accuracy}%`, color: 'text-[#34C759]' },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 flex flex-col justify-center items-center text-center">
              <span className={`font-display text-4xl ${item.color}`}>{item.value}</span>
              <span className="block text-[10px] text-[#8e8e93] font-bold uppercase tracking-widest mt-2">{item.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Уровень */}
        <div className="glass-card p-8 mb-8">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#8e8e93] mb-5">
            <span className="text-[#1c1c1e]">Деңгей {stats.level}</span>
            <span>{xpInLevel} / 100 XP</span>
          </div>
          <div className="h-3 bg-black/5 w-full rounded-full overflow-hidden shadow-inner">
            <motion.div className="h-full bg-[#007AFF] rounded-full" initial={{ width: 0 }} animate={{ width: `${xpInLevel}%` }} transition={{ duration: 1 }} />
          </div>
        </div>

        {/* Категории */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#8e8e93] mb-8">Тақырыптар бойынша үлгерім</h2>
          <div className="space-y-6">
            {categories.map((cat, idx) => {
              const catWords = words.filter((w) => w.categoryId === cat.id)
              const catLearned = catWords.filter((w) => stats.learnedWordIds.includes(w.id)).length
              const pct = Math.round((catLearned / catWords.length) * 100) || 0
              
              return (
                <div key={cat.id}>
                  <div className="flex justify-between text-sm font-semibold text-[#1c1c1e] mb-3">
                    <span>{cat.nameKk}</span>
                    <span className="text-[#8e8e93] font-mono">{pct}%</span>
                  </div>
                  <div className="h-2 bg-black/5 w-full rounded-full overflow-hidden">
                    <motion.div className="h-full bg-[#32ADE6] rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: idx * 0.1 }}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Опасная зона */}
        <div className="mt-12 text-center">
          <button 
            onClick={() => window.confirm('Барлық үлгерімді жою керек пе?') && resetProgress()} 
            className="text-xs font-bold text-[#FF3B30] uppercase tracking-widest px-6 py-3 bg-[#FF3B30]/10 rounded-full hover:bg-[#FF3B30]/20 transition-colors"
          >
            Үлгерімді жою
          </button>
        </div>

      </div>
    </div>
  )
}