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
import TeacherDashboard from './pages/TeacherDashboard' // <--- ДОБАВИТЬ ИМПОРТ

export default function App() {
  const { session, setSession, setClassGroup, setRole, setStats, stats } = useStore()

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

  useEffect(() => {
    if (!session?.user) return
    const timeoutId = setTimeout(async () => {
      await supabase.from('profiles').update({ 
        stats, 
        updated_at: new Date().toISOString() 
      }).eq('id', session.user.id)
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [stats, session])

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (!error && data) {
      setClassGroup(data.class_group)
      setRole(data.role) // <--- УСТАНАВЛИВАЕМ РОЛЬ
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
        
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/flashcards/:categoryId" element={<Flashcards />} />
        <Route path="/quiz/:categoryId" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/teacher" element={<TeacherDashboard />} /> {/* <--- РОУТ ДЛЯ УЧИТЕЛЯ */}
      </Routes>
    </BrowserRouter>
  )
}