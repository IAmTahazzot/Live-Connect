import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

// two types of friend Req will happen (two way actually)
// 1. user A sends req will a keywords which is a username, find username and send req
// 2. user A sends req with user A and B id
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
    return friend.profileId === user.id ? friend.friend : friend.profile
  })

  // get all friend requests
  const friendRequests = await db.friendRequest.findMany({
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

  const friendRequestProfiles = friendRequests.map(friendRequest => {
    return friendRequest.profileId === user.id ? friendRequest.friend : friendRequest.profile
  })

  return NextResponse.json([...friendProfiles, ...friendRequestProfiles], { status: 200 })
}
