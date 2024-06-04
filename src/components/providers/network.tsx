'use client'

import { useEffect, useState } from 'react'

export const NetworkProvider = ({ children }: { children?: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true)
  const [spinner, setSpinner] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const timer = setInterval(() => {
      setSpinner(prevSpinner => !prevSpinner)
    }, 3000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(timer)
    }
  }, [])

  if (isOnline) return <>{children}</>

  return (
    <div className={'h-full min-h-screen flex items-center justify-center w-full'}>
      <div className={'text-center mt-8'}>
        <video className={'mx-auto mb-2 w-56'} muted={true} autoPlay={true} loop={true} controls={false}>
          <source src={'/assets/video/spinner.webm'} type={'video/webm'} />
          <source src={'/assets/video/spinner.mp4'} type={'video/mp4'} />
          <img src="/assets/logo.png" alt="brand" />
        </video>

        <p className={'text-[12px] uppercase text-[#f2f3f5] font-semibold mb-2'}>Err: Network issue:</p>
        <p className={'text-[#DBDEE1] font-base leading-[1.35] max-w-[300px] break-words'}>
          Please check your internet connection!
        </p>
      </div>
    </div>
  )
}
