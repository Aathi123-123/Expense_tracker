import React, { useState, useRef, useEffect } from 'react'
import Logo from '../assets/logo.svg'

export default function Header({ onAdd, onRoute, theme, setTheme, onLogout }){
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(()=>{
    function onKey(e){
      if(e.key === 'Escape') setOpen(false)
    }
    function onClick(e){
      if(menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onClick)
    return ()=>{
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onClick)
    }
  },[])

  function handleSelect(route){
    setOpen(false)
    if(route === 'add') return onAdd && onAdd()
    if(route === 'logout') return onLogout && onLogout()
    onRoute && onRoute(route)
  }

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={Logo} alt="Save_Karoo logo" className="w-10 h-10 text-accent rounded-full p-1 bg-white/60 dark:bg-white/6" style={{objectFit:'cover'}} />
        <div>
          <h1 className="text-2xl font-bold">Save_Karoo</h1>
          <p className="text-sm text-muted">Simply_Track your expenses</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <nav className="space-x-2 hidden md:block">
          <button title="Open dashboard" onClick={()=>onRoute('dashboard')} className="px-3 py-1 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition">Dashboard</button>
          <button title="Weekly overview" onClick={()=>onRoute('weekly')} className="px-3 py-1 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition">Weekly</button>
          <button title="Open calendar" onClick={()=>onRoute('calendar')} className="px-3 py-1 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition">Calendar</button>
          <button title="View transactions" onClick={()=>onRoute('transactions')} className="px-3 py-1 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition">Transactions</button>
          <button title="Open settings" onClick={()=>onRoute('settings')} className="px-3 py-1 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition">Settings</button>
          <button title="Logout" onClick={onLogout} className="px-3 py-1 rounded hover:bg-red-100 text-red-600 dark:hover:bg-red-900/20 transition">Logout</button>
        </nav>

        {/* mobile overflow menu */}
        <div className="relative md:hidden" ref={menuRef}>
          <button aria-haspopup="true" aria-expanded={open} aria-label="Open menu" onClick={()=>setOpen(v=>!v)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition">
            {/* simple hamburger / ellipsis icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <div role="menu" className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border rounded shadow-lg z-50 py-1">
              <button role="menuitem" onClick={()=>handleSelect('dashboard')} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5">Dashboard</button>
              <button role="menuitem" onClick={()=>handleSelect('weekly')} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5">Weekly</button>
              <button role="menuitem" onClick={()=>handleSelect('calendar')} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5">Calendar</button>
              <button role="menuitem" onClick={()=>handleSelect('transactions')} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5">Transactions</button>
              <button role="menuitem" onClick={()=>handleSelect('settings')} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5">Settings</button>
              <div className="border-t my-1" />
              <button role="menuitem" onClick={()=>handleSelect('add')} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5">Add Expense</button>
              <button role="menuitem" onClick={()=>handleSelect('logout')} className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20">Logout</button>
            </div>
          )}
        </div>

        <button title="Toggle light/dark theme" onClick={()=>setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme" className="px-3 py-2 rounded-md border hover:bg-slate-100 dark:hover:bg-white/5 transition">{theme === 'dark' ? 'Light' : 'Dark'}</button>
      </div>
    </header>
  )
}
