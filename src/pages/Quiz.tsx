import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { getCategoryById, buildQuestions } from '../data/words'
import clsx from 'clsx'

export default function Quiz() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const { stats, loseHeart, recordQuizResult, markWordMastered } = useStore()

  const category = getCategoryById(categoryId!)
  const [questions] = useState(() => buildQuestions(categoryId!))
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [heartsLeft, setHeartsLeft] = useState(stats.hearts)

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => { return () => clearTimeout(timeoutRef.current) },[])

  if (!category) return null

  const q = questions[current]
  const progress = (current / questions.length) * 100

  function handleAnswer(idx: number) {
    if (selected !== null || feedback !== null) return
    setSelected(idx)
    const isCorrect = idx === q.correctIndex

    if (isCorrect) {
      setFeedback('correct')
      setScore(s => s + 1)
      markWordMastered(q.wordId)
    } else {
      setFeedback('wrong')
      loseHeart()
      setHeartsLeft(h => Math.max(0, h - 1))
    }

    timeoutRef.current = setTimeout(() => {
      setSelected(null); setFeedback(null);
      if (current >= questions.length - 1) {
        recordQuizResult({ categoryId: categoryId!, score: isCorrect ? score + 1 : score, total: questions.length, date: new Date().toISOString(), xpEarned: isCorrect ? score * 15 + 15 : score * 15 })
        setFinished(true)
      } else {
        setCurrent(c => c + 1)
      }
    }, 1500)
  }

  // ЭКРАН ЗАВЕРШЕНИЯ
  if (finished) {
    return (
      <div className="h-[100dvh] pt-[72px] flex items-center justify-center px-6 overflow-hidden">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-10 max-w-sm w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#34C759] to-[#32ADE6]" />
          <h3 className="text-xs font-bold text-[#8e8e93] tracking-widest uppercase mb-4">Нәтиже</h3>
          <h2 className="font-display text-7xl text-[#1c1c1e] mb-2">{score}<span className="text-3xl text-[#8e8e93]">/{questions.length}</span></h2>
          <p className="text-[#8e8e93] font-medium mb-10">Тәжірибе: <span className="text-[#007AFF]">+{score * 15} XP</span></p>
          <div className="flex flex-col gap-3">
            <button onClick={() => window.location.reload()} className="btn-apple-primary">Қайталау</button>
            <Link to="/categories" className="btn-apple-secondary">Каталогқа оралу</Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // ИНТЕРФЕЙС ТЕСТА
  return (
    // Жестко 100dvh, запрет на скролл body
    <div className="h-[100dvh] flex flex-col pt-[88px] pb-8 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-xl mx-auto w-full flex flex-col h-full relative">
        
        {/* Шапка квиза */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <Link to={`/flashcards/${categoryId}`} className="text-[#007AFF] font-semibold flex items-center gap-1">
            <span className="text-xl leading-none -mt-0.5">‹</span> Шығу
          </Link>
          
          {/* Индикаторы "Жизней" (вместо сердечек) */}
          <div className="flex gap-1.5 bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/60">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={clsx("h-2 w-4 rounded-full transition-colors duration-300", i < heartsLeft ? "bg-[#FF2D55] shadow-[0_0_8px_rgba(255,45,85,0.4)]" : "bg-black/10")} />
            ))}
          </div>
        </div>

        {/* Прогресс бар */}
        <div className="h-1.5 w-full bg-black/5 mb-10 rounded-full overflow-hidden shrink-0">
          <motion.div className="h-full bg-[#007AFF] rounded-full" animate={{ width: `${progress}%` }} />
        </div>

        {/* Блок вопроса */}
        <div className="flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mb-auto">
              <span className="text-xs font-bold text-[#8e8e93] uppercase tracking-widest mb-3 block">
                {q.type === 'en_to_kk' ? 'Аудармасын табыңыз' : 'Ағылшыншасын табыңыз'}
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-[#1c1c1e] leading-tight mb-8">
                {q.question}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Варианты ответов */}
          <div className="flex flex-col gap-3 shrink-0 pb-20">
            {q.options.map((opt, idx) => {
              const isSelected = selected === idx
              const isCorrect = idx === q.correctIndex
              const showCorrect = feedback !== null && isCorrect
              const showWrong = isSelected && feedback === 'wrong'

              return (
                <button
                  key={opt} onClick={() => handleAnswer(idx)}
                  disabled={selected !== null}
                  className={clsx(
                    "relative overflow-hidden w-full text-left p-5 rounded-2xl border font-semibold text-lg transition-all duration-300 flex items-center gap-4",
                    isSelected && feedback === null ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-md transform scale-[0.98]' : 'bg-white/60 border-white/80 text-[#1c1c1e] hover:bg-white/80 shadow-sm',
                    showCorrect && 'bg-[#34C759] border-[#34C759] text-white shadow-[0_4px_15px_rgba(52,199,89,0.3)]',
                    showWrong && 'bg-[#FF3B30] border-[#FF3B30] text-white shadow-[0_4px_15px_rgba(255,59,48,0.3)]'
                  )}
                >
                  <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm border",
                    isSelected || showCorrect || showWrong ? "border-white/30 bg-white/20" : "border-black/10 bg-black/5"
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="flex-1">{opt}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Всплывающий Apple Feedback Sheet */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', damping: 20 }}
              className={clsx(
                "absolute bottom-6 left-0 right-0 p-5 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl border flex items-center gap-4",
                feedback === 'correct' ? "bg-white/80 border-[#34C759]/30" : "bg-white/80 border-[#FF3B30]/30"
              )}
            >
              <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-md", feedback === 'correct' ? "bg-[#34C759]" : "bg-[#FF3B30]")}>
                {feedback === 'correct' ? '✓' : '✕'}
              </div>
              <div>
                <h4 className={clsx("font-display text-xl", feedback === 'correct' ? "text-[#34C759]" : "text-[#FF3B30]")}>
                  {feedback === 'correct' ? 'Дұрыс!' : 'Қате'}
                </h4>
                {feedback === 'wrong' && (
                  <p className="text-[#1c1c1e] text-sm font-medium mt-0.5">Дұрыс жауап: {q.options[q.correctIndex]}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}