import { Server as NetServer } from 'http'
import { Server as IOServer, Socket } from 'socket.io'
import { NextApiRequest } from 'next'

import { NextApiResponseWithIO } from '@/pages/api/socket/socketTypes'
import { getAuth } from '@clerk/nextjs/server'

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithIO) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    const httpServer: NetServer = res.socket.server as any
    res.socket.server.io = new IOServer(httpServer, {
      path,
      addTrailingSlash: false,
    } as any)
  }

  res.end()
}

export default ioHandler
