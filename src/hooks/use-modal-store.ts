import { create } from 'zustand'
import { Channel, ChannelType, Server } from '@prisma/client'

export enum MODAL_TYPES {
  CREATE_SERVER = 'CREATE_SERVER',
  EDIT_SERVER = 'EDIT_SERVER',
  DELETE_SERVER = 'DELETE_SERVER',
  LEAVE_SERVER = 'LEAVE_SERVER',
  INVITE = 'INVITE',
  MEMBERS = 'MEMBERS',
  CREATE_CHANNEL = 'CREATE_CHANNEL',
  EDIT_CHANNEL = 'EDIT_CHANNEL',
  DELETE_CHANNEL = 'DELETE_CHANNEL',
  MESSAGE_FILE = 'MESSAGE_FILE',
  DELETE_MESSAGE = 'DELETE_MESSAGE',
  PROFILE = 'PROFILE',
}

export type ModalType = keyof typeof MODAL_TYPES

interface ModalData {
  server?: Server
  channel?: Channel
  channelType?: ChannelType
  apiUrl?: string
  query?: Record<string, any>
  [key: string]: any
}

interface ModalStore {
  type: ModalType | null
  isOpen: boolean
  data: ModalData
  onOpen: (type: ModalType, data?: ModalData) => void
  close: () => void
}

export const useModal = create<ModalStore>(
  set =>
    ({
      type: null,
      data: {},
      isOpen: false,
      onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
      close: () => set({ type: null, isOpen: false }),
    } as ModalStore)
)
