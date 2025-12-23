import React, { useEffect, useMemo, useState } from 'react'
import { seedIfEmpty, loadExpenses, saveExpenses, loadSettings, saveSettings } from './utils/storage'
import useTheme from './hooks/useTheme'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import CalendarView from './components/CalendarView'
import Settings from './components/Settings'
import Login from './components/Login'
import WeeklyView from './components/WeeklyView'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

seedIfEmpty()

export default function App(){
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const [expenses, setExpenses] = useState([]) // Start empty, load based on user
  const [settings, setSettings] = useState(loadSettings())
  const [theme, setTheme] = useTheme()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [route, setRoute] = useState('dashboard')
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState({ year: now.getFullYear(), month: now.getMonth() })

  // Load expenses when user changes
  useEffect(() => {
    if (user && !user.isGuest) {
      // Fetch from Backend
      fetch('http://localhost:5001/api/expenses', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      .then(res => res.json())
      .then(data => {
        // Map _id to id for frontend compatibility
        const formatted = data.map(d => ({ ...d, id: d._id }))
        setExpenses(formatted)
      })
      .catch(err => console.error('Failed to fetch expenses', err))
    } else {
      // Load from LocalStorage (Guest or initial load)
      setExpenses(loadExpenses())
    }
  }, [user])

  // Save to LocalStorage only if Guest
  useEffect(()=>{
    if (!user || user.isGuest) {
      saveExpenses(expenses)
    }
  },[expenses, user])

  useEffect(()=>{
    saveSettings(settings)
  },[settings])

  // PWA beforeinstallprompt handler
  useEffect(()=>{
    function onBeforeInstall(e){
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return ()=> window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  },[])

  async function addOrUpdateExpense(item){
    if (user && !user.isGuest) {
      // Backend API
      try {
        const url = item.id ? `http://localhost:5001/api/expenses/${item.id}` : 'http://localhost:5001/api/expenses'
        const method = item.id ? 'PUT' : 'POST'
        
        const res = await fetch(url, {
          method,
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(item)
        })
        const data = await res.json()
        const savedItem = { ...data, id: data._id }

        if(item.id){
          setExpenses(prev => prev.map(p => p.id === item.id ? savedItem : p))
        }else{
          setExpenses(prev => [savedItem, ...prev])
        }
      } catch (err) {
        console.error('Failed to save expense', err)
        alert('Failed to save to server')
      }
    } else {
      // LocalStorage (Guest)
      if(item.id){
        setExpenses(prev => prev.map(p => p.id === item.id ? item : p))
      }else{
        item.id = Date.now().toString()
        setExpenses(prev => [item, ...prev])
      }
    }
    setShowForm(false)
    setEditing(null)
  }

  async function removeExpense(id){
    if (user && !user.isGuest) {
      try {
        await fetch(`http://localhost:5001/api/expenses/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setExpenses(prev => prev.filter(p => p.id !== id))
      } catch (err) {
        console.error('Failed to delete', err)
      }
    } else {
      setExpenses(prev => prev.filter(p => p.id !== id))
    }
  }

  function onLogout() {
    localStorage.removeItem('user')
    setUser(null)
  }

  const totals = useMemo(()=>{
    const { month, year } = selectedMonth
    const monthExpenses = expenses.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === month && d.getFullYear() === year
    })
    const total = monthExpenses.reduce((s, e) => s + Number(e.amount || 0), 0)
    return { monthTotal: total, monthExpenses }
  },[expenses, selectedMonth])

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login onLogin={setUser} />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Header onAdd={()=>{setEditing(null); setShowForm(true)}} onRoute={setRoute} theme={theme} setTheme={setTheme} onLogout={onLogout} />

      {showInstall && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-auto md:bottom-6 md:right-6 z-50">
          <div className="card p-3 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-semibold">Install Save Karo</div>
              <div className="text-sm text-muted">Add to your home screen for quick access</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded" onClick={()=>{ setShowInstall(false); setDeferredPrompt(null) }}>Dismiss</button>
              <button className="px-3 py-1 rounded btn-accent" onClick={async ()=>{
                setShowInstall(false)
                try{ await deferredPrompt.prompt(); const { outcome } = await deferredPrompt.userChoice; console.log('Install outcome', outcome); setDeferredPrompt(null) }catch(err){ console.warn(err) }
              }}>Install</button>
            </div>
          </div>
        </div>
      )}

      <main className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          {route === 'dashboard' && <Dashboard expenses={expenses} settings={settings} totals={totals} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />}
          {route === 'weekly' && <WeeklyView expenses={expenses} weeklyBudget={settings.weeklyBudget} />}
          {route === 'calendar' && <CalendarView expenses={expenses} dailyBudget={settings.dailyBudget} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />}
          {route === 'transactions' && <ExpenseList expenses={expenses.filter(e=>{
            const d = new Date(e.date); return d.getMonth() === selectedMonth.month && d.getFullYear() === selectedMonth.year
          })} onEdit={(e)=>{setEditing(e); setShowForm(true)}} onDelete={removeExpense} selectedMonth={selectedMonth} />}
          {route === 'settings' && <Settings settings={settings} setSettings={setSettings} onImport={(data)=>{ setExpenses(data); }} />}
        </section>

        <aside className="space-y-4">
          <div className="card p-4 rounded-lg">
            <button className="w-full py-2 rounded-md btn-accent" onClick={()=>{setEditing(null); setShowForm(true)}}>Add expense</button>
          </div>

          <div className="card p-4 rounded-lg">
            <h4 className="font-semibold">Quick Add</h4>
            <div className="mt-3 flex gap-2 flex-wrap">
              {[5,10,20,50].map(a=> (
                <button key={a} onClick={()=>{ setExpenses(prev=>[{ id: Date.now().toString(), title: 'Quick', amount: a, category: 'Quick', date: new Date().toISOString(), notes: '' }, ...prev]) }} className="px-3 py-1 rounded bg-slate-100">+ {a}</button>
              ))}
            </div>
          </div>

          <div className="card p-4 rounded-lg">
            <h4 className="font-semibold">Summary</h4>
            <p className="text-sm mt-2">This month: <strong>{String(totals.monthTotal ? `₹${totals.monthTotal.toFixed(2)}` : '₹0.00')}</strong></p>
              <p className="text-sm mt-1">Monthly budget: <strong>{`₹${(settings.monthlyBudget || 0)}`}</strong></p>
          </div>
        </aside>
      </main>

      <ExpenseForm open={showForm} onClose={()=>setShowForm(false)} onSave={addOrUpdateExpense} editing={editing} />
      {/* Mobile floating add button */}
      <button aria-label="Add expense" title="Add expense" onClick={()=>{setEditing(null); setShowForm(true)}} className="fixed bottom-6 right-6 md:hidden w-14 h-14 rounded-full btn-accent flex items-center justify-center shadow-lg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  )
}
