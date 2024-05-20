'use client'

import React from 'react'
import { ExploreSidebar } from '@/components/explore/explore-sidebar'
import { ExplorePublicServer } from '@/components/explore/explore-public-server'

export default function ExplorePage() {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ExploreSidebar />
      </div>
      <main className="h-full md:pl-60 bg-white dark:bg-[hsl(var(--background-primary))]">
        <ExplorePublicServer />
      </main>
    </div>
  )
}
