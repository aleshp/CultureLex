import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'
import clsx from 'clsx'
import { supabase } from '../lib/supabase'

// Базовые иконки для меню
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
  
  // Достаем нужные данные из хранилища (включая role)
  const { stats, session, classGroup, role, setSession } = useStore()

  // Динамически меняем навигацию в зависимости от роли (добавляем кабинет учителя)
  const renderNavItems = role === 'teacher' 
    ?[
        { 
          page: 'Classroom', 
          path: '/teacher', 
          icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> 
        },
        ...navItems 
      ] 
    : navItems;

  // Функция выхода
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <>
      {/* ========================================= */}
      {/* 1. ВЕРХНИЙ NAVBAR (Для всех устройств)      */}
      {/* ========================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Логотип */}
          <Link to="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="text-xl font-bold text-white tracking-wide hidden sm:block">CultureLex</span>
          </Link>

          {/* Десктопная Навигация */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {renderNavItems.map((item) => {
              const active = item.path === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(item.path)
              
              return (
                <Link
                  key={item.page} to={item.path}
                  className={clsx(
                    'px-3 lg:px-4 py-2 rounded-xl font-medium transition-all duration-300',
                    active 
                      ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  )}
                >
                  {item.page}
                </Link>
              )
            })}
          </nav>

          {/* Правый блок: Статистика и Авторизация */}
          <div className="flex items-center gap-3 sm:gap-4 md:border-l md:border-white/10 md:pl-6">
            
            {/* Блок Уровня и Класса (Скрываем на маленьких экранах) */}
            <div className="flex flex-col items-end hidden sm:flex">
              <div className="flex gap-2 items-center">
                <p className="text-sm font-semibold text-white">Уровень {stats.level}</p>
                
                {/* Бейдж Учителя */}
                {role === 'teacher' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">
                    Мұғалім
                  </span>
                )}
                
                {/* Бейдж Класса для учеников */}
                {role === 'student' && classGroup && (
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                     {classGroup}
                   </span>
                )}
              </div>
              <p className="text-xs text-indigo-400">{stats.xp} XP</p>
            </div>
            
            {/* Иконка Огня (Дни подряд) */}
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-pink-400 flex items-center justify-center bg-gray-800 text-white text-sm sm:text-base font-bold shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                {stats.streak}
              </div>
              <div className="absolute -bottom-1 -right-1 text-xs drop-shadow-lg">🔥</div>
            </div>

            {/* Кнопка Входа / Выхода */}
            <div className="ml-1 sm:ml-2 border-l border-white/10 pl-3 sm:pl-4">
              {session ? (
                <button 
                  onClick={handleLogout} 
                  className="text-xs sm:text-sm text-gray-400 hover:text-red-400 transition-colors"
                >
                  Выйти
                </button>
              ) : (
                <Link 
                  to="/auth" 
                  className="text-xs sm:text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-3 sm:px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                >
                  Войти
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ========================================= */}
      {/* 2. НИЖНИЙ TAB BAR (Только для телефонов)  */}
      {/* ========================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/60 backdrop-blur-2xl border-t border-white/10 pb-safe">
        <div className="flex items-center justify-evenly px-1 pt-3 pb-5">
          {renderNavItems.map((item) => {
            const active = item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path)
            
            return (
              <Link
                key={item.page}
                to={item.path}
                className={clsx(
                  'flex flex-col items-center gap-1.5 transition-all duration-300 w-14 sm:w-16',
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
                  "text-[9px] sm:text-[10px] font-semibold tracking-wide transition-all duration-300 text-center w-full truncate px-1",
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