import React from 'react'
import { UserSidebar } from '@/components/me/user-sidebar'
import { currentProfile } from '@/lib/current-profile'

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const profile = await currentProfile()

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <UserSidebar profile={profile!} />
      </div>
      <main className="h-full md:pl-60 bg-white dark:bg-[hsl(var(--background-primary))]">{children}</main>
    </div>
  )
}
