import React, { useEffect, useState } from 'react'

function readFileAsDataURL(file){
  return new Promise((res, rej)=>{
    const fr = new FileReader()
    fr.onload = ()=>res(fr.result)
    fr.onerror = rej
    fr.readAsDataURL(file)
  })
}

function localInputDate(date = new Date()){
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function ExpenseForm({ open, onClose, onSave, editing }){
  const [form, setForm] = useState({ title:'', amount:'', category:'Misc', date: localInputDate(), notes:'', receipt: null, id: null })
  const [error, setError] = useState('')

  useEffect(()=>{
    if(editing) setForm({ ...editing, date: localInputDate(editing.date) })
    else setForm({ title:'', amount:'', category:'Misc', date: localInputDate(), notes:'', receipt: null, id: null })
  },[editing, open])

  if(!open) return null

  async function onFile(e){
    const f = e.target.files[0]
    if(!f) return
    if(f.size > 1024*1024*2){
      alert('Receipt image is large — consider smaller images as they are stored in localStorage')
    }
    const data = await readFileAsDataURL(f)
    setForm(prev=>({...prev, receipt: data}))
  }

  function submit(e){
    e.preventDefault()
    setError('')
    if(!form.title) return setError('Title required')
    if(!form.amount || Number(form.amount) <= 0) return setError('Amount must be > 0')
    // convert local YYYY-MM-DD (form.date) to ISO string at local midnight
    const d = new Date(form.date + 'T00:00')
    onSave({ ...form, amount: Number(form.amount), date: d.toISOString() })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <form onSubmit={submit} className="w-full max-w-md card p-4 rounded">
        <h3 className="font-semibold">{form.id ? 'Edit' : 'Add'} expense</h3>
        <div className="mt-3 space-y-2">
          <input aria-label="Title" className="w-full p-2 border rounded" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} />
          <input aria-label="Amount" type="number" step="0.01" className="w-full p-2 border rounded" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} />
          <input aria-label="Category" className="w-full p-2 border rounded" placeholder="Category" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} />
          <input aria-label="Date" type="date" className="w-full p-2 border rounded" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} />
          <textarea aria-label="Notes" className="w-full p-2 border rounded" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes: e.target.value})} />
        
        </div>

        {error && <div className="text-red-500 mt-2">{error}</div>}

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
          <button type="submit" className="px-3 py-1 rounded btn-accent">Save</button>
        </div>
      </form>
    </div>
  )
}
