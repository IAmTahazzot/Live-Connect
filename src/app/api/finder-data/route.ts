import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { Channel, Profile, Server } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export enum FinderDataType {
  SERVER = 'server',
  FRIEND = 'friend',
  CHANNEL = 'channel',
}

export type FinderData = (
  | {
      type: FinderDataType.CHANNEL
      server: Server
      channel: Channel
    }
  | {
      type: FinderDataType.FRIEND
      friend: Profile
    }
  | {
      type: FinderDataType.SERVER
      server: Server
    }
)

export const GET = async (req: NextRequest) => {
  const loggedInUser = await currentUser()

  if (!loggedInUser) {
    return NextResponse.json({ error: 'You must be logged in to access this route' }, { status: 401 })
  }

  // find user first
  const user = await db.profile.findUnique({
    where: {
      userId: loggedInUser.id,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // 1. all the joined server and their channels
  // 2. all the friends (to open conversation)
  const data: FinderData[] = []

  try {
    // 1. all the joined server and their channels
    const servers = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId: user.id,
          },
        },
      },
      include: {
        channels: true,
      },
    })

    for (const server of servers) {
      data.push({
        type: FinderDataType.SERVER,
        server: {
          id: server.id,
          name: server.name,
          imageUrl: server.imageUrl,
          inviteCode: server.inviteCode,
          profileId: server.profileId,
          createdAt: server.createdAt,
          updatedAt: server.updatedAt,
        },
      })

      for (const channel of server.channels) {
        data.push({
          type: FinderDataType.CHANNEL,
          server: {
            id: server.id,
            name: server.name,
            imageUrl: server.imageUrl,
            inviteCode: server.inviteCode,
            profileId: server.profileId,
            createdAt: server.createdAt,
            updatedAt: server.updatedAt,
          },
          channel,
        })
      }
    }

    // 2. all the friends (to open conversation)
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

    const friendProfiles = friends.map(friend => (friend.profileId === user.id ? friend.friend : friend.profile))

    for (const friend of friendProfiles) {
      data.push({
        type: FinderDataType.FRIEND,
        friend: friend,
      })
    }

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data', details: error }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
}
