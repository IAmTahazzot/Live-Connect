import { NextResponse } from 'next/server'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const profile = await currentProfile()
    const { name, type } = await request.json()
    const { searchParams } = new URL(request.url)

    const serverId = searchParams.get('serverId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Bad request', { status: 400 })
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
          create: {
            profileId: profile.id,
            name: (name as string).toLowerCase(),
            type,
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal error [create channel]', { status: 500 })
  }
}
