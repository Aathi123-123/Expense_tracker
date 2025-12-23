import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function CalendarView({ expenses, dailyBudget=0, selectedMonth, setSelectedMonth }){
  const [selectedDay, setSelectedDay] = useState(null)
  const year = selectedMonth?.year ?? new Date().getFullYear()
  const month = selectedMonth?.month ?? new Date().getMonth()

  // Filter expenses for the current month
  const monthExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === month && d.getFullYear() === year
    })
  }, [expenses, month, year])

  const daysInMonth = new Date(year, month+1, 0).getDate()

  const days = useMemo(()=>{
    const arr = Array.from({length: daysInMonth}, (_,i)=>({ day: i+1, amount: 0 }))
    monthExpenses.forEach(e=>{
      const d = new Date(e.date).getDate()
      arr[d-1].amount += Number(e.amount||0)
    })
    return arr
  },[monthExpenses, month, year, daysInMonth])

  // Calculate Pie Data
  const pieData = useMemo(() => {
    let targetExpenses = monthExpenses
    if (selectedDay !== null) {
      targetExpenses = monthExpenses.filter(e => new Date(e.date).getDate() === selectedDay)
    }

    const byCategory = targetExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
      return acc
    }, {})

    return Object.keys(byCategory).map(k => ({ name: k, value: byCategory[k] }))
  }, [monthExpenses, selectedDay])

  const COLORS = ['#06b6d4', '#8b5cf6', '#fb7185', '#f59e0b', '#34d399', '#64748b']

  function prevDay(){
    setSelectedDay(curr => {
      if(curr === null) return daysInMonth
      if(curr <= 1) return daysInMonth
      return curr - 1
    })
  }

  function nextDay(){
    setSelectedDay(curr => {
      if(curr === null) return 1
      if(curr >= daysInMonth) return 1
      return curr + 1
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 card p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <div className="flex items-center gap-2">
              <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }} onClick={()=> { setSelectedDay(null); setSelectedMonth(({month,year})=>{ const d = new Date(year, month-1); return { year: d.getFullYear(), month: d.getMonth() } }) }} className="w-9 h-9 flex items-center justify-center rounded-full border bg-white/80 dark:bg-white/5 shadow-sm hover:shadow-md transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </motion.button>
              <button onClick={() => setSelectedDay(null)} className="text-sm px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition">
                Reset View
              </button>
              <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }} onClick={()=> { setSelectedDay(null); setSelectedMonth(({month,year})=>{ const d = new Date(year, month+1); return { year: d.getFullYear(), month: d.getMonth() } }) }} className="w-9 h-9 flex items-center justify-center rounded-full border bg-white/80 dark:bg-white/5 shadow-sm hover:shadow-md transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
              </motion.button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=> <div key={d} className="text-xs font-medium text-muted text-center py-2">{d}</div>)}
            
            {/* Empty cells for start of month padding could be added here, but keeping simple for now */}
            
            {days.map(d=> (
              <motion.div 
                key={d.day} 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDay(d.day)}
                className={`
                  aspect-square p-1 rounded-lg cursor-pointer border transition-colors flex flex-col items-center justify-center
                  ${selectedDay === d.day ? 'ring-2 ring-accent border-accent' : 'border-transparent'}
                  ${d.amount > dailyBudget && dailyBudget > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}
                `}
              >
                <div className="font-semibold text-sm">{d.day}</div>
                {d.amount > 0 && <div className="text-[10px] font-medium">₹{d.amount.toFixed(0)}</div>}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pie Chart Side Panel */}
        <div className="card p-4 rounded-lg flex flex-col h-full min-h-[300px]">
          <div className="flex flex-col items-center mb-4">
            <h3 className="font-semibold text-center mb-2">
              {selectedDay 
                ? `Breakdown: ${new Date(year, month, selectedDay).toLocaleDateString()}` 
                : `Monthly Breakdown`
              }
            </h3>
            
            {/* Day Navigation Controls */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button onClick={prevDay} className="w-8 h-8 flex items-center justify-center rounded hover:bg-white dark:hover:bg-slate-700 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button onClick={()=>setSelectedDay(null)} className={`px-3 py-1 text-sm rounded transition-colors ${selectedDay === null ? 'bg-white dark:bg-slate-700 shadow-sm font-medium' : 'hover:bg-white/50 dark:hover:bg-slate-700/50'}`}>
                {selectedDay ? `Day ${selectedDay}` : 'All Days'}
              </button>
              <button onClick={nextDay} className="w-8 h-8 flex items-center justify-center rounded hover:bg-white dark:hover:bg-slate-700 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-[250px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${Number(value).toFixed(2)}`}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted text-sm">
                No expenses for this period
              </div>
            )}
          </div>
          
          {/* Total Summary */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-center">
            <div className="text-sm text-muted">Total Spent</div>
            <div className="text-2xl font-bold text-accent">
              ₹{pieData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
