'use client'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light') {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute(
        'data-theme', 'light'
      )
    }
  }, [])
  
  const toggle = () => {
    const newTheme = isDark ? 'light' : 'dark'
    setIsDark(!isDark)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute(
        'data-theme', 'dark'
      )
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute(
        'data-theme', 'light'
      )
    }
  }
  
  return (
    <button onClick={toggle} style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid #1e2d4a',
      borderRadius: 8,
      padding: '6px 10px',
      cursor: 'pointer',
      fontSize: 16,
      color: '#94a3b8',
    }}>
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
