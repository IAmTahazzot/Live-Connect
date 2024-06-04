import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 404 })
  }

  const { id } = clerkUser

  // find user id
  const user = await db.profile.findUnique({
    where: {
      userId: id,
    },
  })

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  // get all friends
  const friends = await db.friend.findMany({
    where: {
      OR: [
        {
          profileId: user.id,
        },
        {
          friendId: user.id,
        },
      ],
    },

    include: {
      profile: true,
      friend: true,
    },
  })

  const friendProfiles = friends.map(friend => {
    return {
      id: friend.id,
      profile: friend.profileId === user.id ? friend.friend : friend.profile
    }
  })

  return NextResponse.json(friendProfiles, { status: 200 })
}