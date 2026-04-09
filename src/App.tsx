// src/App.tsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useStore } from './store/useStore'
import { Navbar } from './components/Navbar'
import Home from './pages/Home'
import Categories from './pages/Categories'
import Flashcards from './pages/Flashcards'
import Quiz from './pages/Quiz'
import Progress from './pages/Progress'
import Achievements from './pages/Achievements'
import Auth from './pages/Auth'

export default function App() {
  const { session, setSession, setClassGroup, setStats, stats } = useStore()

  // Инициализация и прослушивание Auth состояния
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
    })

    return () => subscription.unsubscribe()
  },[])

  // Синхронизация: если stats изменились, отправляем их в Supabase с задержкой (Debounce)
  useEffect(() => {
    if (!session?.user) return
    
    const timeoutId = setTimeout(async () => {
      await supabase.from('profiles').update({ 
        stats, 
        updated_at: new Date().toISOString() 
      }).eq('id', session.user.id)
    }, 2000) // Задержка в 2 секунды, чтобы не спамить базу

    return () => clearTimeout(timeoutId)
  }, [stats, session])

  // Загрузка данных профиля при входе
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (!error && data) {
      setClassGroup(data.class_group)
      // Если в базе есть сохраненная стата и у неё больше XP чем локально — берем из базы
      if (data.stats && data.stats.xp > stats.xp) {
         setStats(data.stats)
      }
    }
  }

  return (
    <BrowserRouter>
      <div className="bg-shape-emerald" />
      
      <Navbar />
      
      <Routes>
        <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" />} />
        
        {/* Защищенные или общие пути */}
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/flashcards/:categoryId" element={<Flashcards />} />
        <Route path="/quiz/:categoryId" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/achievements" element={<Achievements />} />
      </Routes>
    </BrowserRouter>
  )
}