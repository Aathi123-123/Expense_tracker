import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Register service worker (optional) for PWA offline support
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('/service-worker.js').then(reg=>{
      // registration successful
      console.log('SW registered', reg.scope)
    }).catch(err=>{
      console.warn('SW registration failed', err)
    })
  })
}
