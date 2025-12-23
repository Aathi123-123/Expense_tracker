// LocalStorage keys and helpers
export const LS_KEYS = {
  EXPENSES: 'savekaro_expenses_v1',
  SETTINGS: 'savekaro_settings_v1'
}

export function loadExpenses(){
  try{
    const raw = localStorage.getItem(LS_KEYS.EXPENSES)
    if(!raw) return []
    return JSON.parse(raw)
  }catch(e){
    console.error('Failed to load expenses', e)
    return []
  }
}

export function saveExpenses(list){
  localStorage.setItem(LS_KEYS.EXPENSES, JSON.stringify(list))
}

export function loadSettings(){
  try{
    const raw = localStorage.getItem(LS_KEYS.SETTINGS)
    if(!raw) return { theme: 'system', dailyBudget: 0, monthlyBudget: 0, favorites: [] }
    return JSON.parse(raw)
  }catch(e){
    console.error('Failed to load settings', e)
    return { theme: 'system', dailyBudget: 0, monthlyBudget: 0, favorites: [] }
  }
}

export function saveSettings(s){
  localStorage.setItem(LS_KEYS.SETTINGS, JSON.stringify(s))
}

// seed sample data for dev if empty
export function seedIfEmpty(){
  if(!localStorage.getItem(LS_KEYS.EXPENSES)){
    const now = new Date()
    const sample = [
      { id: '1', title: 'Coffee', amount: 3.5, category: 'Coffee', date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(), notes: '', receipt: null },
      { id: '2', title: 'Groceries', amount: 45.2, category: 'Groceries', date: new Date(now.getFullYear(), now.getMonth(), 2).toISOString(), notes: '', receipt: null },
      { id: '3', title: 'Internet', amount: 30, category: 'Bills', date: new Date(now.getFullYear(), now.getMonth(), 3).toISOString(), notes: '', receipt: null }
    ]
    saveExpenses(sample)
  }
}
