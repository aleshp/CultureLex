// src/pages/Auth.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import clsx from 'clsx'

const CLASSES =['5А', '5Б', '6А', '6Б', '7А', '7Б', '7В', '7Г', '8А', '8Б', '9А', '9Б', '10А', '10Б', '11А', '11Б']

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const[password, setPassword] = useState('')
  const [selectedClass, setSelectedClass] = useState('7Г')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const { setClassGroup, stats } = useStore()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/')
      } else {
        // Регистрация
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { class_group: selectedClass } // Сохраняем класс в мету
          }
        })
        if (error) throw error

        // Создаем профиль в базе
        if (data.user) {
          await supabase.from('profiles').insert([
            { 
              id: data.user.id, 
              email: data.user.email, 
              class_group: selectedClass,
              stats: stats // Отправляем текущую локальную статистику
            }
          ])
          setClassGroup(selectedClass)
        }
        navigate('/')
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 relative">
      <div className="bg-shape-emerald" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="content-card max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Join CultureLex'}</h1>
          <p className="text-gray-400 text-sm">
            {isLogin ? 'Log in to continue your progress' : 'Create an account to save your progress and compete'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
            <input 
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="student@school.kz"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" required minLength={6}
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Class</label>
              <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {CLASSES.map(cls => (
                  <button
                    key={cls} type="button"
                    onClick={() => setSelectedClass(cls)}
                    className={clsx(
                      "py-2 rounded-lg text-sm font-medium border transition-all duration-300",
                      selectedClass === cls 
                        ? "bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    )}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full btn-primary-glass mt-6 flex justify-center py-3.5"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}