'use client'

import { ChannelType, Member, MemberRole, Profile, Server } from '@prisma/client'
import { ActionTooltip } from '@/components/action-tooltip'
import { Plus, Settings } from 'lucide-react'
import { MODAL_TYPES, useModal } from '@/hooks/use-modal-store'

interface ServerSectionProps {
  label: string
  role?: MemberRole
  sectionType: 'channels' | 'members'
  channelType?: ChannelType
  server?: Server & {
    members: (Member & { profile: Profile })[]
  }
}

const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
  const { onOpen } = useModal()

  return (
    <div className={'flex items-center justify-between py-2'}>
      <p className="font-sans tracking-[.5px] text-[11px] uppercase font-semibold text-zinc-500 dark:text-[#949BA4]">{label}</p>

      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen(MODAL_TYPES.CREATE_CHANNEL, { channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}

      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen(MODAL_TYPES.MEMBERS, { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}

export default ServerSection
