import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Play } from 'lucide-react'
import { useStore } from '../store/useStore'
import { categories, words } from '../data/words'

export default function Categories() {
  const stats = useStore((s) => s.stats)

  return (
    <div className="min-h-screen ornament-bg pt-20 pb-20 sm:pb-6">
      <div className="max-w-4xl mx-auto px-4 py-6">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display font-black text-3xl text-white mb-2">
            📚 Тақырыптар
          </h1>
          <p className="font-body text-night-100/50">
            Тақырыпты таңда және үйренуді бастай
          </p>
        </motion.div>

        <div className="space-y-4">
          {categories.map((cat, idx) => {
            const catWords = words.filter((w) => w.categoryId === cat.id)
            const catLearned = catWords.filter((w) =>
              stats.learnedWordIds.includes(w.id)
            ).length
            const catPct = Math.round((catLearned / catWords.length) * 100)
            const isDone = catLearned === catWords.length

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`card border-2 transition-all duration-200 bg-gradient-to-r ${cat.bgGradient}`}
                style={{ borderColor: isDone ? cat.color + '60' : 'transparent' }}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="text-4xl shrink-0">{cat.emoji}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-display font-bold text-xl text-white">
                            {cat.nameKk}
                          </h2>
                          {isDone && (
                            <span className="text-xs font-bold text-jade-400 bg-jade-500/15 px-2 py-0.5 rounded-full shrink-0">
                              ✓ Бітірілді
                            </span>
                          )}
                        </div>
                        <p className="font-body text-sm text-night-100/50 leading-relaxed mt-0.5">
                          {cat.descriptionKk}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4 mb-4">
                    <div className="flex justify-between text-xs font-body mb-1.5">
                      <span className="text-night-100/40">Үлгерім</span>
                      <span
                        className="font-bold"
                        style={{ color: cat.color }}
                      >
                        {catLearned}/{catWords.length} сөз
                      </span>
                    </div>
                    <div className="bg-night-500/50 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: cat.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${catPct}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 + 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Word list preview */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {catWords.map((w) => (
                      <span
                        key={w.id}
                        className="text-xs font-body px-2 py-0.5 rounded-full border transition-all duration-200"
                        style={
                          stats.learnedWordIds.includes(w.id)
                            ? {
                                borderColor: cat.color + '60',
                                color: cat.color,
                                background: cat.color + '15',
                              }
                            : {
                                borderColor: 'rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.3)',
                              }
                        }
                      >
                        {stats.learnedWordIds.includes(w.id) ? '✓ ' : ''}
                        {w.english}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <Link
                      to={`/flashcards/${cat.id}`}
                      className="flex items-center gap-2 btn-primary flex-1 justify-center text-sm py-2.5"
                    >
                      <BookOpen size={16} />
                      Флэш карточка
                    </Link>
                    <Link
                      to={`/quiz/${cat.id}`}
                      className="flex items-center gap-2 btn-secondary flex-1 justify-center text-sm py-2.5"
                    >
                      <Play size={16} />
                      Тест тапсыр
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
