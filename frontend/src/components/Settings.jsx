import React, { useEffect, useState } from 'react'
import { saveSettings } from '../utils/storage'

export default function Settings({ settings, setSettings, onImport }){
  // keep a local copy and resync when parent settings change
  const [local, setLocal] = useState(() => ({ ...settings }))
  const [message, setMessage] = useState('')

  useEffect(()=>{
    setLocal({ ...settings })
  },[settings])

  function save(){
    // Normalize numeric fields to numbers (empty -> 0)
    const newSettings = {
      ...local,
      dailyBudget: Number(local.dailyBudget) || 0,
      weeklyBudget: Number(local.weeklyBudget) || 0,
      monthlyBudget: Number(local.monthlyBudget) || 0,
    }

    // Update parent state and persist to localStorage
    if(typeof setSettings === 'function') setSettings(newSettings)
    saveSettings(newSettings)

    setMessage('Settings saved')
    setTimeout(()=>setMessage(''), 2000)
  }

  function exportJSON(){
    const data = localStorage.getItem('savekaro_expenses_v1') || '[]'
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'savekaro-expenses.json'
    a.click()
    URL.revokeObjectURL(url)
  }
  // export/import removed per user request

  return (
    <div className="card p-4 rounded-lg">
      <h3 className="font-semibold">Settings</h3>
      <div className="mt-3 space-y-3">
        <div>
          <label className="block text-sm">Daily budget</label>
          <input type="number" className="w-full p-2 border rounded" value={local.dailyBudget ?? ''} onChange={e=>setLocal({...local, dailyBudget: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm">Weekly budget</label>
          <input type="number" className="w-full p-2 border rounded" value={local.weeklyBudget ?? ''} onChange={e=>setLocal({...local, weeklyBudget: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm">Monthly budget</label>
          <input type="number" className="w-full p-2 border rounded" value={local.monthlyBudget ?? ''} onChange={e=>setLocal({...local, monthlyBudget: e.target.value})} />
        </div>

        {/* Backup / Restore removed per user request */}

       

        <div className="flex items-center justify-between">
          <div className="text-sm text-green-600">{message}</div>
          <div className="flex justify-end">
            <button onClick={save} className="px-3 py-1 rounded btn-accent">Save settings</button>
          </div>
        </div>
      </div>
    </div>
  )
}
