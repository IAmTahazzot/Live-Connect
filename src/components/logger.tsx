'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

type LoggerProps = {
  children: React.ReactNode
  title?: string
}

export const Logger = ({ children, title }: LoggerProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    window.addEventListener('keydown', e => {
      if (e.key === 'l') {
        setTheme('light')
      }

      if (e.key === 'd') {
        setTheme('dark')
      }
    })
  }, [])

  return (
    <div
      className={cn(
        'fixed top-0 left-0 w-full h-full p-6 z-[1000] whitespace-pre-wrap box-border',
        theme === 'light' ? 'bg-white text-neutral-800' : 'bg-[hsl(221deg,15%,15%)] text-white'
      )}>
      {title && <div className="bg-black border-b-4 border-b-rose-500 mb-4 p-4 text-xl text-white">{title}</div>}
      <div>{children}</div>
    </div>
  )
}
