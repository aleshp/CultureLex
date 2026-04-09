import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

// Варианты цифр классов и букв (включая казахские до "Е")
const CLASS_NUMBERS =['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
const CLASS_LETTERS = ['А', 'Ә', 'Б', 'В', 'Г', 'Ғ', 'Д', 'Е']

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Состояния для дропдаунов
  const [classNumber, setClassNumber] = useState('7')
  const [classLetter, setClassLetter] = useState('Г')
  
  const[loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const { setClassGroup, stats } = useStore()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Объединяем цифру и букву (например: "7Г" или "5Ә")
    const combinedClass = `${classNumber}${classLetter}`

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
            data: { class_group: combinedClass } // Сохраняем объединенный класс
          }
        })
        if (error) throw error

        // Создаем профиль в базе
        if (data.user) {
          await supabase.from('profiles').insert([
            { 
              id: data.user.id, 
              email: data.user.email, 
              class_group: combinedClass,
              stats: stats // Отправляем текущую локальную статистику
            }
          ])
          setClassGroup(combinedClass)
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
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join CultureLex'}
          </h1>
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
              
              {/* Два дропдауна (Цифра и Буква) */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Дропдаун Цифры */}
                <div className="relative">
                  <select
                    value={classNumber}
                    onChange={(e) => setClassNumber(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {CLASS_NUMBERS.map(num => (
                      <option key={num} value={num} className="bg-gray-900 text-white">
                        {num} сынып
                      </option>
                    ))}
                  </select>
                  {/* Иконка стрелочки для селекта */}
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                {/* Дропдаун Буквы */}
                <div className="relative">
                  <select
                    value={classLetter}
                    onChange={(e) => setClassLetter(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {CLASS_LETTERS.map(letter => (
                      <option key={letter} value={letter} className="bg-gray-900 text-white">
                        «{letter}»
                      </option>
                    ))}
                  </select>
                  {/* Иконка стрелочки для селекта */}
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

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