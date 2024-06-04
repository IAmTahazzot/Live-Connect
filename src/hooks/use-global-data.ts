import { FriendRequest, Profile } from '@prisma/client'
import { create } from 'zustand'

interface GlobalStore {
  profile: Profile | null
  syncProfile: () => void

  friends: { id: string; profile: Profile }[]
  syncFriends: () => void

  friendRequests: {
    requester: (FriendRequest & { profile: Profile })[] // People who have sent you friend requests
    pending: (FriendRequest & { friend: Profile })[] // People you have sent friend requests to
  }
  syncFriendRequests: () => void

  syncAll: () => void
}

export const useGlobalData = create<GlobalStore>((set, get) => {
  return {
    // global data
    syncAll: async () => {
      get().syncProfile()
      get().syncFriends()
      get().syncFriendRequests()
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
  }
})
