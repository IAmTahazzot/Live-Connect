'use client'

import Image from 'next/image'
import { Profile } from '@prisma/client'
import { usePanel, PANEL_TYPES } from '@/hooks/use-panel'
import { Cogs } from '../icons'
import { SignOutButton } from '@clerk/nextjs'
import { LiaSignOutAltSolid } from 'react-icons/lia'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type ServerFooterProps = {
  profile: Profile
}

export const ServerFooter = ({ profile }: ServerFooterProps) => {
  const { onOpen } = usePanel()

  return (
    <div className="grid grid-cols-[minmax(100px,130px)_auto] items-center justify-between dark:bg-[hsla(var(--background-deep-dark),.8)] px-2 py-[6px] group">
      <div className="flex items-center gap-2 dark:hover:bg-[hsla(var(--background-modifier-selected)/.5)] rounded-sm p-[2px] select-none cursor-pointer overflow-hidden">
        <div className="w-8 h-8 relative rounded-full shrink-0">
          <Image
            src={profile.imageUrl}
            fill
            className="rounded-full"
            alt="user profile picture"
            priority={true}
            sizes="(max-width: 640px) 50px, 100px"
          />
          <div className=" box-content absolute h-[10px] w-[10px] rounded-full bg-emerald-500 -bottom-[2px] -right-1 z-10 border-solid border-[4px] dark:border-[#212226]"></div>
        </div>
        <div className="flex flex-col gap-0">
          <h4 className="text-sm mb-0 text-ellipsis whitespace-nowrap w-[90px] overflow-hidden">{profile.name}</h4>
          <div className="relative h-4 overflow-hidden">
            <p className="text-[12px] text-gray-400 m-0 transition-transform duration-200 group-hover:-translate-y-4">
              Online
            </p>
            <p className="text-[12px] text-gray-400 m-0 transition-transform duration-200 group-hover:-translate-y-5">
              {profile.username}
            </p>
        </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <SignOutButton>
                <div className="rounded-sm dark:hover:bg-[hsla(var(--background-modifier-selected)/.3)] p-[2px] h-8 w-8 flex items-center justify-center cursor-pointer">
                  <LiaSignOutAltSolid size={24} className="text-gray-300" />
                </div>
              </SignOutButton>
            </TooltipTrigger>
            <TooltipContent>Sign out</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="rounded-sm dark:hover:bg-[hsla(var(--background-modifier-selected)/.3)] p-[2px] h-8 w-8 flex items-center justify-center group/cog cursor-pointer">
                <button
                  className="group-hover/cog:rotate-180 duration-1000 delay-300"
                  onClick={() => {
                    onOpen(PANEL_TYPES.PROFILE)
                  }}>
                  <Cogs />
                </button>
              </div>
            </TooltipTrigger>
            <TooltipContent>Open settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
