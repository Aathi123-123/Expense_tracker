import { useEffect, useState } from 'react'
import { loadSettings, saveSettings } from '../utils/storage'

export default function useTheme(){
  const s = loadSettings()
  const [theme, setTheme] = useState(s.theme || 'system')

  useEffect(()=>{
    const root = document.documentElement
    if(theme === 'dark') root.classList.add('dark')
    else if(theme === 'light') root.classList.remove('dark')
    else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      if(prefersDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }
    saveSettings({...s, theme})
  },[theme])

  return [theme, setTheme]
}
