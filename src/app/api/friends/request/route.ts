import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

// two types of friend Req will happen (two way actually)
// 1. user A sends req will a keywords which is a username, find username and send req
// 2. user A sends req with user A and B id
export const POST = async (req: NextRequest) => {
  const user = await currentUser()

  if (!user) {
    return NextResponse.error()
  }

  const { currentUserId, friendId } = await req.json()
  const searchParams = req.nextUrl.searchParams
  const keywords = searchParams.get('keywords')

  let _friendId = friendId

  if (keywords) {
    // find the friend id by username
    const friend = await db.profile.findUnique({
      where: {
        username: keywords,
      },
    })

    if (!friend) {
      return NextResponse.json({ message: 'Friend not found' }, { status: 404 })
    }

    // if user is trying to add himself or herself
    if (friend.id === currentUserId) {
      return NextResponse.json({ message: "Seriously? bro, You can't add yourself as friend!" }, { status: 400 })
    }

    _friendId = friend.id
  }

  if (!_friendId) {
    return NextResponse.json({ message: 'Friend not found' }, { status: 404 })
  }

  // check if friend exists
  const friendExists = await db.friend.findFirst({
    where: {
      OR: [
        {
          profileId: currentUserId,
          friendId: _friendId,
        },
        {
          profileId: _friendId,
          friendId: currentUserId,
        },
      ],
    },
  })

  if (friendExists) {
    return NextResponse.json({ message: 'Friend already exists' }, { status: 400 })
  }

  // if friend request already exists
  const isRequested = await db.friendRequest.findFirst({
    where: {
      profileId: currentUserId,
      friendId: _friendId,
    },
  })

  if (isRequested) {
    return NextResponse.json({ message: 'Friend request already sent' }, { status: 400 })
  }

  const isPending = await db.friendRequest.findFirst({
    where: {
      profileId: _friendId,
      friendId: currentUserId,
    },

    include: {
      profile: true,
    },
  })

  if (isPending) {
    return NextResponse.json(
      { message: isPending.profile.name + ' already sent you a request! (check pending)' },
      { status: 400 }
    )
  }

  await db.friendRequest.create({
    data: {
      profileId: currentUserId,
      friendId: _friendId,
    },
  })

  return NextResponse.json({ message: 'Friend request sent' }, { status: 200 })
}

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

  // get all where you have sent request
  const pending = await db.friendRequest.findMany({
    where: {
      profileId: user.id,
    },
    include: {
      friend: true,
    },
  })

  // get all where you have received request
  const requester = await db.friendRequest.findMany({
    where: {
      friendId: user.id,
    },
    include: {
      profile: true,
    },
  })

  return NextResponse.json({ pending, requester }, { status: 200 })
}
