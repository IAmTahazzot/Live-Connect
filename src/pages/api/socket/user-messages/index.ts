import { NextApiRequest } from 'next'

import { currentProfile as currentProfilePages } from '@/lib/current-profile-pages'
import { db } from '@/lib/db'
import { NextApiResponseWithIO } from '@/pages/api/socket/socketTypes'

export default async function handler(req: NextApiRequest, res: NextApiResponseWithIO) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const profile = await currentProfilePages(req)
    const { content, fileUrl } = req.body
    const { conversationId } = req.query

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID missing' })
    }

    if (!content) {
      return res.status(400).json({ error: 'Content missing' })
    }

    try {
      const message = await db.userMessages.create({
        data: {
          content,
          fileUrl,
          conversationId: conversationId as string,
          profileId: profile.id,
        },
        include: {
          profile: true,
        },
      })

      const channelKey = `chat:${conversationId}:messages`

      res?.socket?.server?.io?.emit(channelKey, message)

      return res.status(200).json(message)
    } catch (error) {
      return res.status(500).json({ error: 'Internal Error, while dispatching data!' })
    }
  } catch (error) {
    console.log('[DIRECT_MESSAGES_POST]', error)
    return res.status(500).json({ message: 'Internal Error' })
  }
}
