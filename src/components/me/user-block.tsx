'use client'

import { Profile } from '@prisma/client'
import Image from 'next/image'
import { MODAL_TYPES, useModal } from '@/hooks/use-modal-store'
import { Check, X } from 'lucide-react'
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type UserBlockProps = {
  action?: React.ReactNode
  profile: Profile
  currentUserId: string
  requestForbidden?: boolean
}

export const UserBlock = ({ action, profile, currentUserId, requestForbidden }: UserBlockProps) => {
  const { onOpen } = useModal()

  return (
    <div className="grid grid-cols-[32px_1fr_auto] gap-3 items-center rounded-sm bg p-1 md:p-3 hover:bg-[hsl(var(--background-modifier-selected)/.3)] group">
      <div className="relative w-8 h-8 rounded-full bg-gray-300">
        <Image
          src={profile.imageUrl!}
          alt={'Profile Picture'}
          fill
          className="rounded-full object-cover"
          sizes="(max-width: 640px) 50px, 100px"
        />
      </div>
      <span
        className="hover:underline cursor-pointer font-medium"
        onClick={() => {
          onOpen(MODAL_TYPES.PROFILE, { profile, currentUserId, requestForbidden })
        }}>
        {profile.name}
      </span>
      <div className="flex items-center gap-x-2 transition-opacity duration-300">{action}</div>
    </div>
  )
}

export enum BlockIcons {
  ADD = 'add',
  ACCEPT = 'accept',
  REJECT = 'reject',
  MESSAGE = 'message',
}

const Icons = ({ name }: { name: BlockIcons }) => {
  const ICONS = {
    [BlockIcons.ADD]: (
      <svg
        aria-hidden="true"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24">
        <path
          d="M19 14a1 1 0 0 1 1 1v3h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3h-3a1 1 0 1 1 0-2h3v-3a1 1 0 0 1 1-1Z"
          fill="currentColor"></path>
        <path
          d="M16.83 12.93c.26-.27.26-.75-.08-.92A9.5 9.5 0 0 0 12.47 11h-.94A9.53 9.53 0 0 0 2 20.53c0 .81.66 1.47 1.47 1.47h.22c.24 0 .44-.17.5-.4.29-1.12.84-2.17 1.32-2.91.14-.21.43-.1.4.15l-.26 2.61c-.02.3.2.55.5.55h7.64c.12 0 .17-.31.06-.36C12.82 21.14 12 20.22 12 19a3 3 0 0 1 3-3h.5a.5.5 0 0 0 .5-.5V15c0-.8.31-1.53.83-2.07ZM12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          fill="currentColor"></path>
      </svg>
    ),
    [BlockIcons.ACCEPT]: <Check size={24} />,
    [BlockIcons.REJECT]: <X size={24} />,
    [BlockIcons.MESSAGE]: (
      <svg
        aria-hidden="true"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 22a10 10 0 1 0-8.45-4.64c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12Z"></path>
      </svg>
    ),
  }

  return ICONS[name]
}

export const UserBlockButton = ({ icon, label, onClick }: { icon: BlockIcons; label: string; onClick: () => void }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className="w-10 h-10 text-gray-400 hover:bg-[hsl(var(--background-deep-dark),.8)] rounded-full grid place-items-center cursor-pointer"
            onClick={onClick}>
            <Icons name={icon} />
          </div>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
