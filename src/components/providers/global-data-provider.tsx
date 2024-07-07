'use client'

import { useGlobalData } from '@/hooks/use-global-data'
import React, { useEffect } from 'react'

export const GlobalDataProvider = ({ children }: { children?: React.ReactNode }) => {
  const { syncAll } = useGlobalData()

  useEffect(() => {
    syncAll()

    console.log('Fetching global data...')
  }, [])

  return children
}
