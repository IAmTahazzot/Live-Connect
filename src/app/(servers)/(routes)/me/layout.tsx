import React from 'react'
import { UserSidebar } from '@/components/me/user-sidebar'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 dark:bg-[#2B2D31] bg-[#F2F3F5] p-2">
        <UserSidebar />
      </div>
      <main className="h-full md:pl-60 bg-white dark:bg-[hsl(var(--background-primary))]">{children}</main>
    </div>
  )
}
