import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'
import clsx from 'clsx'

const navItems =[
  { page: 'Dashboard', path: '/' },
  { page: 'Library', path: '/categories' },
  { page: 'Analytics', path: '/progress' },
  { page: 'Awards', path: '/achievements' },
]

export function Navbar() {
  const location = useLocation()
  const stats = useStore((s) => s.stats)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          <span className="text-xl font-bold text-white tracking-wide">CultureLex</span>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.page} to={item.path}
                className={clsx(
                  'px-4 py-2 rounded-lg font-medium transition-all duration-300',
                  active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                )}
              >
                {item.page}
              </Link>
            )
          })}
        </nav>

        {/* Статистика пользователя */}
        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">Уровень {stats.level}</p>
            <p className="text-xs text-indigo-400">{stats.xp} XP</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-pink-400 flex items-center justify-center bg-gray-800 text-white font-bold">
              {stats.streak}
            </div>
            <div className="absolute -bottom-1 -right-1 text-xs">🔥</div>
          </div>
        </div>
      </div>
    </header>
  )
}