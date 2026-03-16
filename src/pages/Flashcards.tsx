import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FlashCard } from '../components/FlashCard'
import { useStore } from '../store/useStore'
import { getCategoryById, getWordsByCategory } from '../data/words'

export default function Flashcards() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const { markWordLearned } = useStore()
  const category = getCategoryById(categoryId!)
  const allWords = getWordsByCategory(categoryId!)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) },[])

  if (!category) return null
  const currentWord = allWords[currentIndex]
  const progress = (currentIndex / allWords.length) * 100

  function goNext() {
    if (currentIndex >= allWords.length - 1) setFinished(true)
    else setCurrentIndex(i => i + 1)
  }

  if (finished) {
    return (
      <div className="h-[100dvh] pt-20 flex items-center justify-center px-6 relative">
        <div className="bg-shape-emerald" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="content-card max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-full mx-auto mb-4 flex items-center justify-center text-emerald-400 text-2xl font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)]">✓</div>
          <h2 className="text-2xl font-bold text-white mb-2">Module Completed</h2>
          <p className="text-gray-400 text-sm mb-8">Ready to test your knowledge?</p>
          <div className="flex flex-col gap-3">
            <Link to={`/quiz/${categoryId}`} className="btn-primary-glass">Start Quiz</Link>
            <Link to="/categories" className="btn-glass">Back to Library</Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-[100dvh] flex flex-col pt-[100px] pb-8 px-4 sm:px-6 overflow-hidden relative">
      <div className="bg-shape-emerald" />
      <div className="max-w-md w-full mx-auto flex flex-col h-full relative z-10">
        
        <div className="flex items-center justify-between mb-4 shrink-0">
          <Link to="/categories" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Library
          </Link>
          <div className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-md border border-indigo-500/20">
            {currentIndex + 1} / {allWords.length}
          </div>
        </div>

        <div className="h-1.5 bg-white/5 rounded-full mb-6 shrink-0 overflow-hidden">
          <motion.div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" animate={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1 w-full relative">
          <AnimatePresence mode="wait">
            <motion.div key={currentWord.id} className="absolute inset-0 flex flex-col justify-center"
              initial={{ opacity: 0, scale: 0.95, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95, x: -20 }} transition={{ duration: 0.3 }}
            >
              <FlashCard word={currentWord} onLearned={() => markWordLearned(currentWord.id)} onNext={goNext} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}