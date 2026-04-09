import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { Navigate } from 'react-router-dom'
import clsx from 'clsx'

export default function TeacherDashboard() {
  const { role, session } = useStore()
  const[students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (role === 'teacher') fetchStudents()
  },[role])

  const fetchStudents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('class_group', { ascending: true })
    
    if (!error && data) setStudents(data)
    setLoading(false)
  }

  // Защита роута
  if (session && role && role !== 'teacher') {
    return <Navigate to="/" />
  }

  const availableClasses = Array.from(new Set(students.map(s => s.class_group).filter(Boolean))).sort()

  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === 'all' || s.class_group === selectedClass
    const matchesSearch = s.email.toLowerCase().includes(search.toLowerCase())
    return matchesClass && matchesSearch
  })

  // Форматирование даты
  const formatDate = (isoString: string) => {
    if (!isoString) return 'Никогда'
    return new Date(isoString).toLocaleString('ru-RU', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
    })
  }

  return (
    <div className="min-h-[100dvh] pt-28 pb-32 px-4 sm:px-6 relative">
      <div className="bg-shape-emerald" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Teacher Dashboard</h1>
          <p className="text-gray-400">Detailed analytics and progress tracking for all students.</p>
        </header>

        {/* Инструменты поиска и фильтрации */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-black/20 p-4 rounded-2xl border border-white/5">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Search student by email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <svg className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <div className="w-full md:w-64 relative">
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer transition-colors"
            >
              <option value="all" className="bg-gray-900 text-white">Все классы</option>
              {availableClasses.map(cls => (
                <option key={cls} value={cls} className="bg-gray-900 text-white">Класс {cls}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Сетка учеников */}
        {loading ? (
          <div className="text-center text-gray-400 py-10 flex flex-col items-center gap-3">
             <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
             Loading students data...
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredStudents.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-10">No students found.</div>
            ) : (
              filteredStudents.map((student, idx) => {
                const s = student.stats || {}
                
                // Высчитываем подробную статистику
                const accuracy = s.totalAnswered > 0 ? Math.round((s.totalCorrect / s.totalAnswered) * 100) : 0
                const learnedWords = s.learnedWordIds?.length || 0
                const masteredWords = s.masteredWordIds?.length || 0
                const totalQuizzes = s.quizHistory?.length || 0
                const badgesEarned = s.earnedBadgeIds?.length || 0
                
                return (
                  <motion.div 
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    className="content-card flex flex-col overflow-hidden p-0"
                  >
                    {/* Шапка карточки */}
                    <div className="p-5 flex justify-between items-start border-b border-white/5 bg-white/[0.02]">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-white font-bold text-lg">{student.email.split('@')[0]}</h3>
                          <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-md border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                            {student.class_group}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          {student.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Last Active</p>
                        <p className="text-xs text-gray-300 bg-black/30 px-2 py-1 rounded border border-white/5">
                          {formatDate(student.updated_at)}
                        </p>
                      </div>
                    </div>

                    {/* Сетка Метрик */}
                    <div className="grid grid-cols-4 gap-px bg-white/5">
                      {/* Метрика 1 */}
                      <div className="bg-[#070E1A] p-4 text-center">
                        <div className="text-lg font-bold text-white mb-0.5">{s.level || 1}</div>
                        <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Level</div>
                      </div>
                      {/* Метрика 2 */}
                      <div className="bg-[#070E1A] p-4 text-center">
                        <div className="text-lg font-bold text-pink-400 mb-0.5">{s.xp || 0}</div>
                        <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">XP</div>
                      </div>
                      {/* Метрика 3 */}
                      <div className="bg-[#070E1A] p-4 text-center">
                        <div className="text-lg font-bold text-emerald-400 mb-0.5">{accuracy}%</div>
                        <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Accuracy</div>
                      </div>
                      {/* Метрика 4 */}
                      <div className="bg-[#070E1A] p-4 text-center">
                        <div className="text-lg font-bold text-orange-400 mb-0.5">{s.streak || 0} <span className="text-sm">🔥</span></div>
                        <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Streak</div>
                      </div>
                      
                      {/* Метрика 5 */}
                      <div className="bg-[#070E1A] p-4 text-center">
                        <div className="text-lg font-bold text-sky-400 mb-0.5">{learnedWords}</div>
                        <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Words Seen</div>
                      </div>
                      {/* Метрика 6 */}
                      <div className="bg-[#070E1A] p-4 text-center">
                        <div className="text-lg font-bold text-purple-400 mb-0.5">{masteredWords}</div>
                        <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Mastered</div>
                      </div>
                      {/* Метрика 7 */}
                      <div className="bg-[#070E1A] p-4 text-center">
                        <div className="text-lg font-bold text-blue-400 mb-0.5">{totalQuizzes}</div>
                        <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Quizzes</div>
                      </div>
                      {/* Метрика 8 */}
                      <div className="bg-[#070E1A] p-4 text-center">
                        <div className="text-lg font-bold text-gold-400 mb-0.5">{badgesEarned}</div>
                        <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Badges</div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}