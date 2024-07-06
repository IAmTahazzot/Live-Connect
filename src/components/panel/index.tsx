'use client'

import { usePanel } from '@/hooks/use-panel'
import { cn } from '@/lib/utils'
import { KeyboardEvent, useEffect, useState } from 'react'
import { PanelProfile } from './panel-profile'
import { PanelAccount } from './panel-account'

export const Panel = () => {
  const [unmount, setUnmount] = useState(false)
  const { isOpen, close } = usePanel()
  const [activeTab, setActiveTab] = useState<{
    name: string
    component: React.ReactNode
  }>({
    name: 'My Account',
    component: <div></div>,
  })

  const navigations = [
    {
      name: 'My Account',
      component: <PanelAccount setActiveTab={setActiveTab} />,
    },
    {
      name: 'Profile',
      component: <PanelProfile />,
    },
  ]

  useEffect(() => {
    setActiveTab(navigations[0])
  }, [])

  const closePanel = () => {
    setUnmount(true)

    // see if there is any server id
    const serverDOM = document.getElementById('server')
    const body = document.body

    if (serverDOM) {
      serverDOM.classList.remove('anim-push-back')

      // scroll lock
      body.style.overflow = 'hidden'

      serverDOM.classList.add('anim-scale-up')
    }

    setTimeout(() => {
      close()
      setUnmount(false)
    }, 250)

    setTimeout(() => {
      if (serverDOM) {
        // scroll unlock
        serverDOM.classList.remove('anim-scale-up')
        body.style.overflow = 'auto'
      }
    }, 300)
  }

  useEffect(() => {
    const serverDOM = document.getElementById('server')

    if (serverDOM && isOpen) {
      serverDOM.classList.add('anim-push-back')
    }

    // close panel on escape key
    const close = (e: { key: string }) => {
      if (e.key === 'Escape') {
        closePanel()
      }
    }

    if (isOpen) window.addEventListener('keydown', close)

    return () => {
      window.removeEventListener('keydown', close)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={cn(
        'z-[100] fixed top-0 left-0 h-full w-full bg-[hsl(var(--background-deep-dark))]',
        !unmount && 'anim-scale-back',
        unmount && 'anim-scale-up-and-fade'
      )}>
      <div className="flex flex-col md:flex-row h-full">
        <div className="flex-1 md:flex-[1_0_240px] bg-[hsl(var(--background-secondary))]">
          <div className="flex flex-[1_0_auto] justify-end h-full">
            <nav className="flex flex-row md:flex-col w-full md:w-[220px] h-full overflow-y-auto py-3 md:py-16 px-4 gap-2">
              {navigations.map((nav, index) => (
                <button
                  key={index}
                  className={cn(
                    'flex items-center h-8 md:w-full p-2 text-base font-medium text-left rounded-sm hover:bg-[hsl(var(--background-modifier-selected)/.4)] hover:cursor-pointer transition-colors duration-200 ease-in-out',
                    activeTab.name === nav.name &&
                      'text-[hsl(var(--text-primary))] bg-[hsl(var(--background-modifier-selected)/.6)]',
                    activeTab.name !== nav.name && 'text-gray-400'
                  )}
                  onClick={() => setActiveTab(nav)}>
                  {nav.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex-[1_1_800px] bg-[hsl(var(--background-primary))] overflow-y-auto">
          <div
            className="flex h-full flex-col md:flex-row"
            style={{
              overflow: 'hidden auto',
            }}>
            <div className="flex-1 w-full md:max-w-[740px] py-6 md:py-16 px-6 md:px-10">{activeTab.component}</div>
            <div className="py-6 md:py-16 text-center hover:opacity-50 order-[-1] md:order-last w-[32px] ml-auto mr-6">
              <button
                className="flex items-center justify-center border-2 rounded-full h-9 w-9 border-gray-400 border-solid"
                onClick={closePanel}>
                <svg aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path>
                </svg>
              </button>
              <span className="font-medium text-sm block mt-1 text-gray-300 uppercase">Esc</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
