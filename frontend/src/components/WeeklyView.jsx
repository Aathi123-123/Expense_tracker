import React, { useState, useMemo } from 'react'
import { startOfWeek, endOfWeek, eachDayOfInterval, format, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion } from 'framer-motion'

export default function WeeklyView({ expenses, weeklyBudget }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const { weekStart, weekEnd, weekDays, weekExpenses, totalSpent, chartData } = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday start
    const end = endOfWeek(currentDate, { weekStartsOn: 1 })
    
    const days = eachDayOfInterval({ start, end })

    const filtered = expenses.filter(e => {
      const d = new Date(e.date)
      return d >= start && d <= end
    })

    const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0)

    const data = days.map(day => {
      const dayExpenses = filtered.filter(e => isSameDay(new Date(e.date), day))
      const amount = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
      return {
        day: format(day, 'EEE'), // Mon, Tue...
        fullDate: day,
        amount
      }
    })

    return {
      weekStart: start,
      weekEnd: end,
      weekDays: days,
      weekExpenses: filtered,
      totalSpent: total,
      chartData: data
    }
  }, [currentDate, expenses])

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1))
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1))

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <button onClick={prevWeek} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Weekly Overview</p>
        </div>
        <button onClick={nextWeek} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <h3 className="text-blue-100 text-sm font-medium">Total Spent this Week</h3>
          <div className="text-3xl font-bold mt-2">₹{totalSpent.toFixed(2)}</div>
          
          {weeklyBudget > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-blue-100 mb-1">
                <span>Budget: ₹{weeklyBudget}</span>
                <span>{Math.round((totalSpent / weeklyBudget) * 100)}%</span>
              </div>
              <div className="w-full bg-blue-800/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${totalSpent > weeklyBudget ? 'bg-red-400' : 'bg-white'}`} 
                  style={{ width: `${Math.min(100, (totalSpent / weeklyBudget) * 100)}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-blue-100">
                {totalSpent > weeklyBudget 
                  ? `Over budget by ₹${(totalSpent - weeklyBudget).toFixed(2)}` 
                  : `₹${(weeklyBudget - totalSpent).toFixed(2)} remaining`}
              </div>
            </div>
          )}

          <div className="mt-4 text-blue-100 text-xs">
            {weekExpenses.length} transactions
          </div>
        </motion.div>
        
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-4">Daily Spending</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#3b82f6' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-white">Weekly Transactions</h3>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {weekExpenses.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No expenses this week</div>
          ) : (
            weekExpenses.sort((a,b) => new Date(b.date) - new Date(a.date)).map(expense => (
              <div key={expense.id || expense._id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg">
                    {expense.category[0]}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">{expense.title}</div>
                    <div className="text-xs text-slate-500">{format(new Date(expense.date), 'MMM d, h:mm a')} • {expense.category}</div>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  ₹{Number(expense.amount).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
