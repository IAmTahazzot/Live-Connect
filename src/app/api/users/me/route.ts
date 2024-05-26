import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
  const loggedInUser = await currentUser()

  if (!loggedInUser) {
    return NextResponse.json({ message: 'You are not logged in' }, { status: 401 })
  }

  const me = await db.profile.findUnique({
    where: {
      userId: loggedInUser.id,
    },
  })

  return NextResponse.json(me)
}
