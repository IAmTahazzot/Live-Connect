'use client'

import { useGlobalData } from '@/hooks/use-global-data'
import { UserSidebar } from '../me/user-sidebar'
import { SmNavigationSidebar } from './sm-navigation-sidebar'

export const SidebarForMe = ({
  updateSidebarStatus,
}: {
  updateSidebarStatus: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { conversations, profile } = useGlobalData()

  return (
    <div className="h-full md:hidden">
      <SmNavigationSidebar />
      <div className="h-full w-[calc(100%-72px)] z-20 flex-col fixed left-[72px] inset-y-0 dark:bg-[#2B2D31] bg-[#F2F3F5]">
        {profile && (
          <UserSidebar profile={profile} conversations={conversations} updateSidebarStatus={updateSidebarStatus} />
        )}
      </div>
    </div>
  )
}
