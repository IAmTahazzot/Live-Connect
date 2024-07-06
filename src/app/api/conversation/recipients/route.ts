import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const profile = await currentProfile()

  if (!profile) {
    return NextResponse.json({ error: 'You must be logged in to view this page' }, { status: 401 })
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

  return NextResponse.json(transformedConversations, { status: 200 })
}
