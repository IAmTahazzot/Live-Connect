import React from 'react'
import { UserSidebar } from '@/components/me/user-sidebar'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const profile = await currentProfile()

  if (!profile) {
    return <div>You are not found :) in the database! (Refresh the page)</div>
  }

  // get all the converations for the user and extract the recipients
  const conversations = await db.conversation.findMany({
    where: {
      OR: [
        {
          userOneId: profile.id,
        },
        {
          userTwoId: profile.id,
        },
      ],
    },

    include: {
      userOne: true,
      userTwo: true,
    },
  })

  const transformedConversations = conversations.map(conversation => ({
    id: conversation.id,
    recipient: conversation.userOneId === profile.id ? conversation.userTwo : conversation.userOne,
  }))

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <UserSidebar profile={profile!} conversations={transformedConversations} />
      </div>
      <main className="h-full md:pl-60 bg-white dark:bg-[hsl(var(--background-primary))]">{children}</main>
    </div>
  )
}
