import { FinderData } from '@/lib/types'
import { FriendRequest, Profile, Server } from '@prisma/client'
import { create } from 'zustand'

interface GlobalStore {
  getAll: () => {
    profile: Profile | null
    friends: { id: string; profile: Profile }[]
    friendRequests: {
      requester: (FriendRequest & { profile: Profile })[]
      pending: (FriendRequest & { friend: Profile })[]
    }
    finderData: FinderData[]
    servers: Server[]
    conversations: { id: string; recipient: Profile }[]
  }

  profile: Profile | null
  friends: { id: string; profile: Profile }[]
  friendRequests: {
    requester: (FriendRequest & { profile: Profile })[] // People who have sent you friend requests
    pending: (FriendRequest & { friend: Profile })[] // People you have sent friend requests to
  }
  finderData: FinderData[]
  servers: Server[]
  conversations: { id: string; recipient: Profile }[]

  syncAll: () => void
  syncProfile: () => void
  syncFriends: () => void
  syncFriendRequests: () => void
  syncFinderData: () => void
  syncServers: () => void
  syncConversations: () => void
}

export const useGlobalData = create<GlobalStore>((set, get) => {
  return {
    getAll: () => ({
      profile: get().profile,
      friends: get().friends,
      friendRequests: get().friendRequests,
      finderData: get().finderData,
      servers: get().servers,
      conversations: get().conversations,
    }),

    // global data
    syncAll: async () => {
      get().syncProfile()
      get().syncFriends()
      get().syncFriendRequests()
      get().syncFinderData()
      get().syncServers()
      get().syncConversations()
    },

    profile: null,
    syncProfile: async () => {
      try {
        const response = await fetch('/api/users/me')
        const profile = await response.json()
        set({ profile })
      } catch (error) {
        console.error(error)
      }
    },

    friends: [],
    syncFriends: async () => {
      try {
        const response = await fetch('/api/friends/all')
        const friends = await response.json()
        set({ friends })
      } catch (error) {
        console.error(error)
      }
    },

    friendRequests: {
      requester: [],
      pending: [],
    },
    syncFriendRequests: async () => {
      try {
        const response = await fetch('/api/friends/request')
        const friendRequests = await response.json()
        set({ friendRequests })
      } catch (error) {
        console.error(error)
      }
    },

    finderData: [],
    syncFinderData: async () => {
      try {
        const response = await fetch('/api/finder-data')
        const finderData = await response.json()
        set({ finderData })
      } catch (error) {
        console.error(error)
      }
    },

    servers: [],
    syncServers: async () => {
      try {
        const response = await fetch('/api/servers/me')
        const servers = await response.json()
        set({ servers })
      } catch (error) {
        console.error(error)
      }
    },

    conversations: [],
    syncConversations: async () => {
      try {
        const response = await fetch('/api/conversation/recipients')
        const conversations = await response.json()
        set({ conversations })
      } catch (error) {
        console.error(error)
      }
    },
  }
})
