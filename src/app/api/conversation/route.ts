// initializing user-user conversation
// if conversation already exist, return the conversation ID

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

// if not, create a new conversation and return the conversation ID
export const POST = async (req: Request) => {
  const user = await currentUser()

  if (!user) {
    return {
      status: 401,
      body: { error: 'Unauthorized' },
    }
  }

  const { conversationFrom, conversationTo } = (await req.json()) as unknown as {
    conversationFrom: string
    conversationTo: string
  }

  // check if conversation already exist
  const conversation = await db.conversation.findFirst({
    where: {
      OR: [
        {
          userOneId: conversationFrom,
          userTwoId: conversationTo,
        },
        {
          userOneId: conversationTo,
          userTwoId: conversationFrom,
        },
      ],
    },

    select: {
      id: true,
    },
  })

  if (conversation) {
    return NextResponse.json({
      conversationId: conversation.id,
    })
  }

  // create new conversation
  const newConversation = await db.conversation.create({
    data: {
      userOneId: conversationFrom,
      userTwoId: conversationTo,
    },

    select: {
      id: true,
    },
  })

  return NextResponse.json({
    conversationId: newConversation.id,
  })
}
