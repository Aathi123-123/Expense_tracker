import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { formatCurrency } from '../utils/format'

export default function Dashboard({ expenses, settings, totals, selectedMonth, setSelectedMonth }){
  const monthExpenses = totals.monthExpenses || []

  const byCategory = monthExpenses.reduce((acc,e)=>{
    acc[e.category] = (acc[e.category]||0) + Number(e.amount||0)
    return acc
  },{})

  const pieData = Object.keys(byCategory).map(k=>({ name: k, value: byCategory[k]}))

  const [selectedDay, setSelectedDay] = useState(null)

  const daysInMonth = useMemo(()=>{
    const y = selectedMonth?.year ?? new Date().getFullYear()
    const m = selectedMonth?.month ?? new Date().getMonth()
    return new Date(y, m+1, 0).getDate()
  },[selectedMonth])

  const days = useMemo(()=>{
    const arr = Array.from({length: daysInMonth}).map((_,i)=>({ day: i+1, amount: 0 }))
    monthExpenses.forEach(e=>{
      const d = new Date(e.date).getDate()
      if(d >=1 && d <= arr.length) arr[d-1].amount += Number(e.amount||0)
    })
    return arr
  },[monthExpenses, daysInMonth])

  const selectedDayData = useMemo(()=>{
    if(!selectedDay) return []
    const byCat = {}
    monthExpenses.forEach(e=>{
      const d = new Date(e.date).getDate()
      if(d === selectedDay){
        byCat[e.category] = (byCat[e.category] || 0) + Number(e.amount || 0)
      }
    })
    return Object.keys(byCat).map(k=>({ name: k, value: byCat[k] }))
  },[selectedDay, monthExpenses])

  const COLORS = ['#06b6d4', '#8b5cf6', '#fb7185', '#f59e0b', '#34d399']

  const monthTotal = totals.monthTotal || 0
  const monthlyBudget = Number(settings.monthlyBudget) || 0
  const spentPct = monthlyBudget ? Math.min(100, (monthTotal / monthlyBudget) * 100) : 0
  const remaining = monthlyBudget ? (monthlyBudget - monthTotal) : 0
  const remainingPct = monthlyBudget ? Math.max(0, ((monthlyBudget - monthTotal) / monthlyBudget) * 100) : 0
  const overAmount = monthTotal > monthlyBudget ? (monthTotal - monthlyBudget) : 0

  return (
    <div className="space-y-6">
      <div className="card p-4 rounded-lg">
        <h3 className="font-semibold">This month</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="text-sm text-muted">{new Date(selectedMonth.year, selectedMonth.month).toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }} aria-label="Previous month" title="Previous month" onClick={()=> setSelectedMonth(({month,year})=>{ const d = new Date(year, month-1); return { year: d.getFullYear(), month: d.getMonth() } })} className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border bg-white/80 dark:bg-white/5 shadow-sm hover:shadow-md transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }} aria-label="Next month" title="Next month" onClick={()=> setSelectedMonth(({month,year})=>{ const d = new Date(year, month+1); return { year: d.getFullYear(), month: d.getMonth() } })} className="w-9 h-9 flex items-center justify-center rounded-full border bg-white/80 dark:bg-white/5 shadow-sm hover:shadow-md transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.button>
          </div>
        </div>
  <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-sm text-muted">Spent</div>
            <div className="text-2xl font-bold">₹{monthTotal.toFixed(2)}</div>
            <div className="text-sm text-muted">of ₹{monthlyBudget}</div>
            {monthlyBudget > 0 && (
              <div className="text-sm mt-1 text-muted">Remaining: {overAmount > 0 ? <span className="text-red-600">Over by ₹{overAmount.toFixed(2)}</span> : <span>₹{remaining.toFixed(2)} ({remainingPct.toFixed(0)}%)</span>}</div>
            )}
          </div>

          <div style={{width:200}}>
            <div className="w-full bg-slate-100 h-3 rounded overflow-hidden">
              <div style={{width: `${spentPct}%`}} className={`h-3 ${overAmount>0 ? 'bg-red-500' : 'bg-gradient-to-r from-teal-400 to-violet-500'}`}></div>
            </div>
            {overAmount > 0 ? (
              <div className="text-sm text-red-500 mt-2">You're over budget by ₹{overAmount.toFixed(2)} ({((overAmount/monthlyBudget)*100).toFixed(0)}% over)</div>
            ) : (
              <div className="text-sm text-muted mt-2">{spentPct.toFixed(0)}% used • {remainingPct.toFixed(0)}% remaining</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="card p-4 rounded-lg">
          <h4 className="font-semibold">Daily this month</h4>
          <div style={{height:220}} className="mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={days}>
                <XAxis dataKey="day"/>
                <YAxis />
                <Tooltip formatter={(value)=>formatCurrency(value)} />
                <Bar dataKey="amount" fill="#06b6d4">
                  {days.map((d, idx)=>(
                    <Cell key={`cell-${idx}`} fill={d.amount>0 ? COLORS[idx % COLORS.length] : '#e2e8f0'} onClick={()=>setSelectedDay(d.day)} cursor={d.amount>0 ? 'pointer' : 'default'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

