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

// Убраны эмодзи, добавлены короткие буквенно-цифровые коды (label)
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

interface Props {
  badge: BadgeDef
  earned: boolean
}

export function Badge({ badge, earned }: Props) {
  return (
    <div className={clsx(
      'content-card relative overflow-hidden flex flex-col justify-between min-h-[160px] transition-all duration-500',
      earned ? 'border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'opacity-50 grayscale'
    )}>
      {/* Декоративный неоновый блик для полученных ачивок */}
      {earned && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      )}
      
      <div className={clsx(
        "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mb-4 border",
        earned 
          ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
          : "bg-white/5 text-gray-500 border-white/10"
      )}>
        {badge.label}
      </div>
      
      <div className="relative z-10">
        <h4 className="text-white font-semibold text-lg leading-tight mb-1">{badge.nameKk}</h4>
        <p className="text-gray-400 text-xs font-medium leading-relaxed">{badge.descriptionKk}</p>
      </div>

      {/* Индикатор получения (зеленая точка) */}
      {earned && (
        <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
      )}
    </div>
  )
}
