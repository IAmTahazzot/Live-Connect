'use client'

import { Channel, ChannelType, MemberRole, Server } from '@prisma/client'
import { Edit, Hash, Mic, Trash, Video, Lock } from 'lucide-react'
import { MODAL_TYPES, ModalType, useModal } from '@/hooks/use-modal-store'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ActionTooltip } from '@/components/action-tooltip'

interface ServerChannelProps {
  channel: Channel
  server: Server
  role?: MemberRole
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
}

export const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal()
  const params = useParams()
  const router = useRouter()

  const Icon = iconMap[channel.type]

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
  }

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()
    onOpen(action, { channel, server })
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'grid grid-cols-[24px_auto_auto] items-center group px-2 py-1 rounded-sm gap-x-1 w-full hover:bg-gray-700/10 dark:hover:bg-[hsl(var(--background-modifier-selected)/.3)] transition mb-1',
        params?.channelId === channel.id && 'bg-gray-700/20 dark:bg-[hsl(var(--background-modifier-selected)/.6)]'
      )}>
      <Icon className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
      <p
        className={cn(
          'text-ellipsis whitespace-nowrap overflow-hidden font-normal text-base text-left text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300 transition',
          params?.channelId === channel.id && 'text-primary dark:text-white dark:group-hover:text-white font-semibold'
        )}>
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={e => onAction(e, MODAL_TYPES.EDIT_CHANNEL)}
              className="hidden group-hover:block w-4 h-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={e => onAction(e, MODAL_TYPES.DELETE_CHANNEL)}
              className="hidden group-hover:block w-4 h-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && <Lock className="ml-auto w-4 h-4 text-gray-500 dark:text-gray-400" />}
    </button>
  )
}
