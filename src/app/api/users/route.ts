import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
  const loggedInUser = await currentUser()

  if (!loggedInUser) {
    return NextResponse.json({
      status: 401,
      body: {
        message: 'Unauthorized',
      },
    })
  }

  const data = await db.profile.findUnique({
    where: {
      userId: loggedInUser.id,
    },
  })

  return NextResponse.json({
    status: 200,
    body: {
      data,
    },
  })
}
