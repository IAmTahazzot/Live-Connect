'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { ActionTooltip } from '@/components/action-tooltip'

interface NavigationItemProps {
  id: string
  imageUrl: string
  name: string
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/servers/${id}`)
  }

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            'absolute left-0 bg-slate-200 rounded-r-full transition-all w-[4px]',
            params?.serverId !== id && 'group-hover:h-[20px]',
            params?.serverId === id ? 'h-[40px]' : 'h-[0px]'
          )}
        />
        <div
          className={cn(
            'relative group flex items-center justify-center mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden bg-white dark:bg-[--background-chat] group-hover:bg-[--background-hover] group-hover:text-white',
            params?.serverId === id && 'rounded-[16px] bg-[--background-hover] dark:bg-[--background-hover] text-white'
          )}>
          {!imageUrl ? (
            <span className={'font-medium'}>
              {name
                .split(' ')
                .slice(0, 2)
                .map(word => word.charAt(0).toUpperCase())
                .join('')}
            </span>
          ) : (
            <Image fill src={imageUrl} alt="Channel" sizes={'(max-width: 768px) 32px'} priority={true} />
          )}
        </div>
      </button>
    </ActionTooltip>
  )
}
