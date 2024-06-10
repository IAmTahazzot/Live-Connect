import { Server, Channel, Profile } from '@prisma/client'

export enum FinderDataType {
  SERVER = 'server',
  FRIEND = 'friend',
  CHANNEL = 'channel',
}

export type FinderData =
  | {
      type: FinderDataType.CHANNEL
      server: Server
      channel: Channel
    }
  | {
      type: FinderDataType.FRIEND
      friend: Profile
    }
  | {
      type: FinderDataType.SERVER
      server: Server
    }
