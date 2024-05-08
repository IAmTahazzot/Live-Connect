import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
  const { searchParams } = new URL(req.url)
  const { name, type } = await req.json()

  const profile = await currentProfile()
  const channelId = params.channelId
  const serverId = searchParams.get('serverId')

  if (!profile) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!serverId) {
    return new Response('Bad Request', { status: 400 })
  }

  if (!channelId) {
    return new Response('Bad Request', { status: 400 })
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
          role: {
            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
          },
        },
      },
    },

    data: {
      channels: {
        update: {
          where: {
            id: channelId,
          },

          data: {
            name: (name as string).toLowerCase(),
            type,
          },
        },
      },
    },
  })

  return NextResponse.json(server)
}

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
  const profile = await currentProfile()
  const { searchParams } = new URL(req.url)

  const serverId = searchParams.get('serverId')
  const channelId = params.channelId

  if (!profile) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!serverId) {
    return new Response('Bad Request', { status: 400 })
  }

  if (!channelId) {
    return new Response('Bad Request', { status: 400 })
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
          role: {
            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
          },
        },
      },
    },

    data: {
      channels: {
        delete: {
          id: channelId,
        },
      },
    },
  })

  return NextResponse.json(server)
}
