import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
  const lookingForFriendsUsers = await db.profile.findMany({
    where: {
      lookingForFriends: true,
    },
  })

  return NextResponse.json(lookingForFriendsUsers)
}
