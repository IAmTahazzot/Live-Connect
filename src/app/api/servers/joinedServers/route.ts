import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

export async function GET(req: Request) {
  const profile = await currentProfile()

  if (!profile) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const servers = await db.server.findMany({
      where: {
        profileId: profile.id,
      },
    })

    return NextResponse.json(servers)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
