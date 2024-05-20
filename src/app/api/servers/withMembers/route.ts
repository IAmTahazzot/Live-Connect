import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const servers = await db.server.findMany({
      include: {
        members: true,
      },
    })
    return NextResponse.json(servers)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
