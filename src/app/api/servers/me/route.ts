import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const profile = await currentProfile()

  if (!profile) {
    return NextResponse.json([], { status: 200 })
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  } as any)

  return NextResponse.json(servers, { status: 200 })
}
