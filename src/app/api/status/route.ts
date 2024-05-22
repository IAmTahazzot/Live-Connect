import { currentProfile } from '@/lib/current-profile'
import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
  const user = await currentProfile()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  return NextResponse.json({ user })
}
