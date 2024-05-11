'use client'

import { Panel } from '@/components/panel'
import { useEffect, useState } from 'react'

export const PanelProvider = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <Panel />
}
