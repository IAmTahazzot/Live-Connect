import { currentProfile } from '@/lib/current-profile'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ServerHeader } from '@/components/server/server-header'
import { ScrollArea } from '@/components/ui/scroll-area'
import ServerSection from '@/components/server/server-section'
import { ServerChannel } from '@/components/server/server-channel'
import { ServerFooter } from './server-footer'
import { ChannelType } from '@prisma/client'

interface ServerSidebarProps {
  serverId: string
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })

  if (!server) {
    return redirect('/')
  }

  const textChannels = server.channels.filter(channel => channel.type === ChannelType.TEXT)
  const audioChannels = server.channels.filter(channel => channel.type === ChannelType.AUDIO)
  const videoChannels = server.channels.filter(channel => channel.type === ChannelType.VIDEO)
  const role = server.members.find(member => member.profileId === profile.id)?.role

  return (
    <div className={'self-end flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'}>
      <ServerHeader server={server} role={role} />

      <ScrollArea className={'p-2 flex-1'}>
        {!!textChannels.length && (
          <div className={'mb-2'}>
            <ServerSection
              channelType={ChannelType.TEXT}
              sectionType={'channels'}
              label={'Text channels'}
              role={role}
            />

            <div className="space-y-[2px]">
              {textChannels.map(channel => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}

        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection sectionType="channels" channelType={ChannelType.AUDIO} role={role} label="Voice Channels" />
            <div className="space-y-[2px]">
              {audioChannels.map(channel => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection sectionType="channels" channelType={ChannelType.VIDEO} role={role} label="Video Channels" />
            <div className="space-y-[2px]">
              {videoChannels.map(channel => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      <ServerFooter profile={profile} />
    </div>
  )
}
