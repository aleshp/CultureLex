import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import clsx from 'clsx'

const CLASS_NUMBERS =['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
const CLASS_LETTERS =['А', 'Ә', 'Б', 'В', 'Г', 'Ғ', 'Д', 'Е']

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const[accountType, setAccountType] = useState<'student' | 'teacher'>('student') // <-- НОВОЕ
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const[classNumber, setClassNumber] = useState('7')
  const [classLetter, setClassLetter] = useState('Г')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const { setClassGroup, setRole, stats } = useStore()

const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const combinedClass = accountType === 'student' ? `${classNumber}${classLetter}` : null

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        
        // ВАЖНО: Моментально обновляем Navbar
        setSession(data.session) 
        navigate('/')
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { 
              class_group: combinedClass,
              role: accountType 
            }
          }
        })
        if (error) throw error

        if (data.user) {
          await supabase.from('profiles').insert([
            { 
              id: data.user.id, 
              email: data.user.email, 
              class_group: combinedClass,
              role: accountType,
              stats: stats 
            }
          ])
          
          // ВАЖНО: Моментально обновляем Navbar после регистрации
          setSession(data.session)
          setClassGroup(combinedClass)
          setRole(accountType)
        }
        navigate(accountType === 'teacher' ? '/teacher' : '/')
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
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="content-card max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join CultureLex'}
          </h1>
          <p className="text-gray-400 text-sm">
            {isLogin ? 'Log in to continue your progress' : 'Create an account to save progress'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Переключатель Ученик / Учитель (только при регистрации) */}
        {!isLogin && (
          <div className="flex bg-black/40 p-1 rounded-xl mb-6 border border-white/5">
            <button
              type="button" onClick={() => setAccountType('student')}
              className={clsx("flex-1 py-2 text-sm font-medium rounded-lg transition-all", accountType === 'student' ? "bg-indigo-500 text-white shadow" : "text-gray-400 hover:text-white")}
            >
              Ученик
            </button>
            <button
              type="button" onClick={() => setAccountType('teacher')}
              className={clsx("flex-1 py-2 text-sm font-medium rounded-lg transition-all", accountType === 'teacher' ? "bg-indigo-500 text-white shadow" : "text-gray-400 hover:text-white")}
            >
              Учитель
            </button>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder={accountType === 'student' ? "student@school.kz" : "teacher@school.kz"}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Выбор класса ТОЛЬКО если это Ученик и Регистрация */}
          {!isLogin && accountType === 'student' && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ваш класс</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select value={classNumber} onChange={(e) => setClassNumber(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer">
                    {CLASS_NUMBERS.map(num => <option key={num} value={num} className="bg-gray-900 text-white">{num} сынып</option>)}
                  </select>
                </div>
                <div className="relative">
                  <select value={classLetter} onChange={(e) => setClassLetter(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer">
                    {CLASS_LETTERS.map(letter => <option key={letter} value={letter} className="bg-gray-900 text-white">«{letter}»</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full btn-primary-glass mt-6 flex justify-center py-3.5">
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-400 hover:text-white transition-colors">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}