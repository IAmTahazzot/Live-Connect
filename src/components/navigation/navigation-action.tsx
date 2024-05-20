'use client'

import { Plus } from 'lucide-react'
import { ActionTooltip } from '@/components/action-tooltip'
import { MODAL_TYPES, useModal } from '@/hooks/use-modal-store'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const NavigationAction = () => {
  const { onOpen } = useModal()
  const path = usePathname()

  const isMe = path === '/me'
  const isExplore = path === '/explore'

  return (
    <div className="flex flex-col gap-2">
      <ActionTooltip side={'right'} align={'center'} label={'Direct messages'}>
        <Link href="/me" className={'group flex items-center'}>
          <div
            className={cn(
              'flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-[--background-chat] group-hover:bg-[var(--color-primary)]',
              isMe && 'dark:bg-[var(--color-primary)] rounded-[16px]'
            )}>
            <div
              className={cn(
                'absolute left-0 bg-slate-200 rounded-r-full transition-all w-[4px]',
                !isMe && 'group-hover:h-[20px]',
                isMe ? 'h-[40px]' : 'h-[0px]'
              )}
            />
            <svg
              aria-hidden="true"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="none"
              viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19.73 4.87a18.2 18.2 0 0 0-4.6-1.44c-.21.4-.4.8-.58 1.21-1.69-.25-3.4-.25-5.1 0-.18-.41-.37-.82-.59-1.2-1.6.27-3.14.75-4.6 1.43A19.04 19.04 0 0 0 .96 17.7a18.43 18.43 0 0 0 5.63 2.87c.46-.62.86-1.28 1.2-1.98-.65-.25-1.29-.55-1.9-.92.17-.12.32-.24.47-.37 3.58 1.7 7.7 1.7 11.28 0l.46.37c-.6.36-1.25.67-1.9.92.35.7.75 1.35 1.2 1.98 2.03-.63 3.94-1.6 5.64-2.87.47-4.87-.78-9.09-3.3-12.83ZM8.3 15.12c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.89 2.27-2 2.27Zm7.4 0c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.88 2.27-2 2.27Z"></path>
            </svg>
          </div>
        </Link>
      </ActionTooltip>

      <ActionTooltip side={'right'} align={'center'} label={'Explore public servers'}>
        <Link href="/explore" className={'group flex items-center'}>
          <div
            className={cn(
              'flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-[--background-chat] group-hover:bg-emerald-500',
              isExplore && 'dark:bg-emerald-500 rounded-[16px]'
            )}>
            <div
              className={cn(
                'absolute left-0 bg-slate-200 rounded-r-full transition-all w-[4px]',
                !isExplore && 'group-hover:h-[20px]',
                isExplore ? 'h-[40px]' : 'h-[0px]'
              )}
            />
            <svg
              aria-hidden="true"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0ZM7.74 9.3A2 2 0 0 1 9.3 7.75l7.22-1.45a1 1 0 0 1 1.18 1.18l-1.45 7.22a2 2 0 0 1-1.57 1.57l-7.22 1.45a1 1 0 0 1-1.18-1.18L7.74 9.3Z"
                clip-rule="evenodd"></path>
            </svg>
          </div>
        </Link>
      </ActionTooltip>

      <ActionTooltip side={'right'} align={'center'} label={'Add a server'}>
        <button onClick={() => onOpen(MODAL_TYPES.CREATE_SERVER)} className={'group flex items-center'}>
          <div
            className={
              'flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-[--background-chat] group-hover:bg-emerald-500'
            }>
            <Plus className={'group-hover:text-white transition text-emerald-500'} size={24} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}

export default NavigationAction
