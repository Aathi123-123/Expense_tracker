import React from 'react'

export default function ExpenseList({ expenses, onEdit, onDelete, selectedMonth }){
  const title = selectedMonth ? new Date(selectedMonth.year, selectedMonth.month).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Transactions'
  return (
    <div className="card p-4 rounded-lg">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 space-y-2">
        {expenses.length === 0 && <div className="text-sm text-muted">No transactions yet</div>}
        {expenses.map(e=> (
          <div key={e.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-muted">{e.category} • {new Date(e.date).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-semibold">₹{Number(e.amount).toFixed(2)}</div>
              <button onClick={()=>onEdit(e)} className="text-sm px-2 py-1 border rounded">Edit</button>
              <button onClick={()=>onDelete(e.id)} className="text-sm px-2 py-1 border rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
