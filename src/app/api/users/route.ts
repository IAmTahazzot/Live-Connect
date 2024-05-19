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

export const PATCH = async (req: Request) => {
  const loggedInUser = await currentUser()

  if (!loggedInUser) {
    return NextResponse.json({
      status: 401,
      body: {
        message: 'Unauthorized',
      },
    })
  }

  const { name, bio } = await req.json()

  if (!name && !bio) {
    return NextResponse.json({
      status: 400,
      body: {
        message: 'Name or bio is required',
      },
    })
  }

  const data = await db.profile.update({
    where: {
      userId: loggedInUser.id,
    },
    data: {
      name,
      bio,
    },
  })

  return NextResponse.json({
    status: 200,
    body: {
      data,
    },
  })
}
