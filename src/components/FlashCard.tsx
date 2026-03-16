import { useState } from 'react'
import { useSpeech } from '../hooks/useSpeech'
import type { Word } from '../types'
import clsx from 'clsx'

interface Props { word: Word; onLearned?: () => void; onNext?: () => void }

export function FlashCard({ word, onLearned, onNext }: Props) {
  const[flipped, setFlipped] = useState(false)
  const { speak, isSpeaking, isSupported } = useSpeech()

  return (
    <div className="scene w-full h-full max-h-[550px] mx-auto">
      <div className={clsx('flashcard-inner w-full h-full cursor-pointer', { flipped })} onClick={() => setFlipped(true)}>
        
        {/* ЛИЦЕВАЯ СТОРОНА */}
        <div className="flashcard-face content-card flex flex-col justify-center items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-6 left-6 text-xs text-indigo-400 font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">New Term</div>
          
          <div className="flex-1 flex flex-col justify-center w-full">
            <h2 className="font-bold text-5xl md:text-6xl text-white mb-4 tracking-tight drop-shadow-lg">{word.english}</h2>
            <p className="text-gray-400 text-lg font-mono">[{word.phonetic}]</p>
          </div>

          <div className="w-full mt-auto shrink-0 flex flex-col items-center gap-4">
            {isSupported && (
              <button
                onClick={(e) => { e.stopPropagation(); speak(word.english); }}
                className={clsx('btn-glass', isSpeaking && 'border-indigo-500 text-indigo-400')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2.586l3.707 3.707A.996.996 0 0015 21V3a.996.996 0 00-1.707-.707L9.586 6H7a2 2 0 00-2 2z" /></svg>
                {isSpeaking ? 'Playing...' : 'Pronounce'}
              </button>
            )}
            <p className="text-gray-500 text-xs uppercase tracking-widest">Click to reveal translation</p>
          </div>
        </div>

        {/* ОБРАТНАЯ СТОРОНА */}
        <div className="flashcard-back content-card flex flex-col text-left shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6 pb-6">
            <div>
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Translation</span>
              <p className="text-3xl font-bold text-white mt-1">{word.description}</p>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-pink-400 text-xs font-bold uppercase tracking-wider">Context</span>
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">{word.culturalContext}</p>
            </div>

            <div className="pl-4 border-l-2 border-emerald-400">
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Example</span>
              <p className="text-white text-base mt-2 font-medium italic">"{word.example}"</p>
              <p className="text-gray-400 text-sm mt-1">{word.exampleTranslation}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10 shrink-0">
            <button onClick={(e) => { e.stopPropagation(); onLearned?.(); setFlipped(false); onNext?.(); }} className="flex-1 btn-primary-glass">
              Mastered
            </button>
            <button onClick={(e) => { e.stopPropagation(); setFlipped(false); setTimeout(() => onNext?.(), 200); }} className="flex-1 btn-glass">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}