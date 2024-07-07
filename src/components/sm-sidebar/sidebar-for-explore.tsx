'use client'

import { SmNavigationSidebar } from './sm-navigation-sidebar'
import { ExploreSidebar } from '../explore/explore-sidebar'

export const SidebarForExplore = ({
  updateSidebarStatus,
}: {
  updateSidebarStatus: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <div className="h-full md:hidden">
      <SmNavigationSidebar />
      <div className="h-full w-[calc(100%-72px)] z-20 flex-col fixed left-[72px] inset-y-0 dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ExploreSidebar updateSidebarStatus={updateSidebarStatus} />
      </div>
    </div>
  )
}
