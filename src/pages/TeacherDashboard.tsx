import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { Navigate } from 'react-router-dom'
import clsx from 'clsx'

export default function TeacherDashboard() {
  const { role, session } = useStore()
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const[selectedClass, setSelectedClass] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (role === 'teacher') fetchStudents()
  }, [role])

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

  // Защита: если не учитель, выкидываем на главную
  if (session && role && role !== 'teacher') {
    return <Navigate to="/" />
  }

  // Уникальные классы для фильтра
  const availableClasses = Array.from(new Set(students.map(s => s.class_group).filter(Boolean))).sort()

  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === 'all' || s.class_group === selectedClass
    const matchesSearch = s.email.toLowerCase().includes(search.toLowerCase())
    return matchesClass && matchesSearch
  })

  return (
    <div className="min-h-[100dvh] pt-28 pb-32 px-6 relative">
      <div className="bg-shape-emerald" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Teacher Dashboard</h1>
          <p className="text-gray-400">Track your students' progress and performance.</p>
        </header>

        {/* Инструменты учителя */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search student by email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="w-full md:w-64">
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-gray-900 text-white">Все классы</option>
              {availableClasses.map(cls => (
                <option key={cls} value={cls} className="bg-gray-900 text-white">Класс {cls}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading students data...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredStudents.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-10">No students found.</div>
            ) : (
              filteredStudents.map((student, idx) => {
                const s = student.stats || {}
                const accuracy = s.totalAnswered > 0 ? Math.round((s.totalCorrect / s.totalAnswered) * 100) : 0
                
                return (
                  <motion.div 
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    className="content-card flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{student.email.split('@')[0]}</h3>
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded border border-indigo-500/30">
                          {student.class_group}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>

                    <div className="flex gap-4 sm:gap-6 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10">
                      <div className="text-center">
                        <div className="text-sm font-bold text-white">Lvl {s.level || 1}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Level</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-pink-400">{s.xp || 0}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">XP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-emerald-400">{accuracy}%</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{s.streak || 0} 🔥</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Streak</div>
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