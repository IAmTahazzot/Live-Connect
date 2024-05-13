'use client'

import { usePanel } from '@/hooks/use-panel'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export const Panel = () => {
  const [unmount, setUnmount] = useState(false)
  const { isOpen, close } = usePanel()

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
  }, [isOpen])

  useEffect(() => {
    // close panel on escape key
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closePanel()
      }
    })
  }, [])

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
      <div className="flex h-full">
        <div className="flex-[1_0_220px] bg-[hsl(var(--background-secondary))]">
          <div className="flex flex-[1_0_auto] justify-end h-full">
            <nav className="flex flex-col w-[220px] h-full overflow-y-auto py-16 px-4">
              <h3 className="uppercase text-sm">Settings</h3>
            </nav>
          </div>
        </div>
        <div className="flex-[1_1_800px] bg-[hsl(var(--background-primary))]">
          <div className="flex h-full">
            <div className="flex-1 max-w-[740px] py-16 px-10">Hello from the other side</div>
            <div className="py-16">
              <button
                className="flex items-center justify-center border-2 rounded-full h-9 w-9 border-gray-400 border-solid"
                onClick={closePanel}>
                <svg aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
