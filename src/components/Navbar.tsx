import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'
import clsx from 'clsx'

// Добавили иконки (SVG) для мобильного меню
const navItems =[
  { 
    page: 'Home', 
    path: '/', 
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> 
  },
  { 
    page: 'Library', 
    path: '/categories', 
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg> 
  },
  { 
    page: 'Analytics', 
    path: '/progress', 
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> 
  },
  { 
    page: 'Awards', 
    path: '/achievements', 
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg> 
  },
]

export function Navbar() {
  const location = useLocation()
  const stats = useStore((s) => s.stats)

  return (
    <>
      {/* ========================================= */}
      {/* 1. ВЕРХНИЙ NAVBAR (Для всех устройств)      */}
      {/* ========================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="text-xl font-bold text-white tracking-wide">CultureLex</span>
          </Link>

          {/* Десктопная Навигация (скрыта на телефонах) */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
              return (
                <Link
                  key={item.page} to={item.path}
                  className={clsx(
                    'px-4 py-2 rounded-xl font-medium transition-all duration-300',
                    active ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  )}
                >
                  {item.page}
                </Link>
              )
            })}
          </nav>

          {/* Статистика пользователя */}
          <div className="flex items-center gap-4 md:border-l md:border-white/10 md:pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">Уровень {stats.level}</p>
              <p className="text-xs text-indigo-400">{stats.xp} XP</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-pink-400 flex items-center justify-center bg-gray-800 text-white font-bold shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                {stats.streak}
              </div>
              <div className="absolute -bottom-1 -right-1 text-xs drop-shadow-lg">🔥</div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================= */}
      {/* 2. НИЖНИЙ TAB BAR (Только для телефонов)  */}
      {/* ========================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/60 backdrop-blur-2xl border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around px-2 pt-3 pb-5">
          {navItems.map((item) => {
            const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.page}
                to={item.path}
                className={clsx(
                  'flex flex-col items-center gap-1.5 transition-all duration-300 w-16',
                  active ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
                )}
              >
                {/* Иконка */}
                <div className={clsx(
                  "p-1.5 rounded-xl transition-all duration-300",
                  active && "bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                )}>
                  {item.icon}
                </div>
                {/* Текст */}
                <span className={clsx(
                  "text-[10px] font-semibold tracking-wide transition-all duration-300",
                  active ? "opacity-100" : "opacity-70"
                )}>
                  {item.page}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
