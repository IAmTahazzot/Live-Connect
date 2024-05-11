'use client'

import { usePanel } from '@/hooks/use-panel'

export const Panel = () => {
  const { isOpen, close } = usePanel()

  if (!isOpen) {
    return null
  }

  return (
    <div className="z-[100] fixed top-0 left-0 h-full w-full bg-[hsl(var(--background-deep-dark))]">
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
                onClick={close}>
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
