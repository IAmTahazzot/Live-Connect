import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 404 })
  }

  const { id } = clerkUser

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
    return friend.profileId === user.id ? friend.friend : friend.profile
  })

  return NextResponse.json(friendProfiles, { status: 200 })
}

export const DELETE = async (req: NextRequest) => {
  const { id } = await req.json() // friend id

  const clerkUser = await currentUser()

  if (!clerkUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 404 })
  }

  try {
    await db.friend.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: 'Friend removed successfully' }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ message: 'Failed to remove friend', details: e }, { status: 500 })
  }
}
