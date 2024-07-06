'use client'

import { Hash, Menu } from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'
import { MobileToggle } from '@/components/mobile-toggle'
import SocketIndicator from '@/components/socket-indicator'
import { useState } from 'react'
import { Button } from '../ui/button'
import { SidebarForMe } from '../sm-sidebar/sidebar-for-me'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  imageUrl?: string
}

export const ChatHeaderForMe = ({ serverId, name, type, imageUrl = '' }: ChatHeaderProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu />
        </Button>
        {isSidebarOpen && <SidebarForMe updateSidebarStatus={setIsSidebarOpen} />}
      </div>
      <UserAvatar src={imageUrl} className="h-6 w-6 md:h-8 md:w-8 mr-2" />
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  )
}
