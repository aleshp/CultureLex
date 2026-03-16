import clsx from 'clsx'

export interface BadgeDef {
  id: string
  label: string
  nameKk: string
  descriptionKk: string
  xpRequired?: number
  wordsRequired?: number
  quizzesRequired?: number
}

// Заметь: я убрал эмодзи и добавил label
export const ALL_BADGES: BadgeDef[] =[
  { id: 'first_word', label: '01', nameKk: 'Алғашқы қадам', descriptionKk: 'Алғашқы сөзді үйрендің', wordsRequired: 1 },
  { id: 'five_words', label: '05', nameKk: 'Оқырман', descriptionKk: '5 сөзді үйрендің', wordsRequired: 5 },
  { id: 'ten_words', label: '10', nameKk: 'Мақсатты', descriptionKk: '10 сөзді үйрендің', wordsRequired: 10 },
  { id: 'all_words', label: 'PRO', nameKk: 'Сөздік шебері', descriptionKk: 'Барлық 30 сөзді үйрендің', wordsRequired: 30 },
  { id: 'streak_3', label: 'S3', nameKk: '3 күн қатарынан', descriptionKk: '3 күн үзіліссіз оқыдың' },
  { id: 'first_quiz', label: 'Q1', nameKk: 'Алғашқы тест', descriptionKk: 'Алғашқы тестті аяқтадың', quizzesRequired: 1 },
  { id: 'perfect_quiz', label: '100', nameKk: 'Мінсіз нәтиже', descriptionKk: 'Барлық сұраққа дұрыс жауап' },
  { id: 'xp_100', label: 'X1', nameKk: '100 XP', descriptionKk: '100 тәжірибе ұпай жинадың' },
  { id: 'xp_500', label: 'X5', nameKk: '500 XP', descriptionKk: '500 тәжірибе ұпай жинадың' },
]

export function Badge({ badge, earned }: { badge: BadgeDef; earned: boolean }) {
  return (
    <div className={clsx(
      'glass-card p-5 flex flex-col justify-between transition-all duration-500 min-h-[160px] relative overflow-hidden',
      earned ? 'border-white/80' : 'opacity-50 grayscale border-transparent bg-white/30'
    )}>
      {/* Декоративный блик для полученных */}
      {earned && <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#007AFF]/10 rounded-full blur-2xl" />}
      
      <div className={clsx(
        "w-12 h-12 rounded-2xl flex items-center justify-center font-display text-xl mb-4 shadow-sm",
        earned ? "bg-gradient-to-br from-[#007AFF] to-[#32ADE6] text-white" : "bg-black/5 text-[#8e8e93]"
      )}>
        {badge.label}
      </div>
      
      <div className="relative z-10">
        <h4 className="font-display text-[#1c1c1e] text-lg leading-tight mb-1">{badge.nameKk}</h4>
        <p className="text-[#8e8e93] text-xs font-medium leading-relaxed">{badge.descriptionKk}</p>
      </div>

      {earned && (
        <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-[#34C759] shadow-[0_0_8px_rgba(52,199,89,0.8)]" />
      )}
    </div>
  )
}