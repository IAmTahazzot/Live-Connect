import { NextApiRequest } from 'next'

import { currentProfile as currentProfilePages } from '@/lib/current-profile-pages'
import { db } from '@/lib/db'
import { NextApiResponseWithIO } from '@/pages/api/socket/socketTypes'

export default async function handler(req: NextApiRequest, res: NextApiResponseWithIO) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const profile = await currentProfilePages(req)
    const { dispatchId, conversationId } = req.query
    const { content } = req.body

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID missing' })
    }

    let text = await db.userMessages.findFirst({
      where: {
        id: dispatchId as string,
        conversationId: conversationId as string,
      },
      include: {
        profile: true,
      },
    })

    if (!text || text.delete) {
      return res.status(404).json({ error: 'Message not found' })
    }

    if (req.method === 'DELETE') {
      text = await db.userMessages.update({
        where: {
          id: dispatchId as string,
        },
        data: {
          fileUrl: null,
          content: 'This message has been deleted.',
          delete: true,
        },
        include: {
          profile: true,
        },
      })
    }

    if (req.method === 'PATCH') {
      text = await db.userMessages.update({
        where: {
          id: dispatchId as string,
        },
        data: {
          content,
        },
        include: {
          profile: true,
        },
      })
    }

    const updateKey = `chat:${conversationId}:messages:update`

    res?.socket?.server?.io?.emit(updateKey, text)

    return res.status(200).json(text)
  } catch (error) {
    console.log('[MESSAGE_ID]', error)
    return res.status(500).json({ error: 'Internal Error' })
  }
}
