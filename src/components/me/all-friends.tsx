'use client'

import { Profile } from '@prisma/client'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PendingBlockLoader } from './pending-requests'
import { WumpusSleeping } from '@/lib/doodles'
import { BlockIcons, UserBlock, UserBlockButton } from './user-block'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useGlobalData } from '@/hooks/use-global-data'

export const AllFriends = () => {
  const { profile, friends: allFriends, syncFriends } = useGlobalData()
  const [friends, setFriends] = useState<{ id: string; profile: Profile }[]>(allFriends || [])
  const [removing, setRemoving] = useState<boolean>(false)
  const [openingConversation, setOpeningConversation] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    setFriends(allFriends)
  }, [allFriends, profile])

  if (!profile) {
    return (
      <div className="grid grid-cols-[1fr_350px] h-full overflow-hidden">
        <div className="px-6 py-4 h-full overflow-hidden">
          <div className="h-8 bg-[hsl(var(--background-modifier-selected)/.3)] rounded-full mx-4 my-2 animate-pulse"></div>
          <PendingBlockLoader clone={15} />
        </div>
        <div className="grid place-items-center border-l-[1px] border-solid border-zinc-600/50 px-4 py-6 h-full">
          <div className="space-y-3">
            <WumpusSleeping />
            <p className="text-gray-500 text-sm text-center">This is where wumpus sleep...</p>
          </div>
        </div>
      </div>
    )
  }

  const removeFromFriend = async (id: string) => {
    try {
      setRemoving(true)

      const req = await fetch('/api/friends', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })

      if (req.status !== 200) {
        throw new Error('Failed to remove friend, Trying to sync with the server to fix!')
      }

      toast.success('Friend removed successfully!')
    } catch (e) {
      toast.error('Failed to remove friend, Trying to sync with the server to fix!')
      if (typeof window !== 'undefined') {
        window.location.reload()
      } else {
        router.refresh()
      }
    } finally {
      setFriends(friends.filter(friend => friend.id !== id))
      setRemoving(false)
      syncFriends()
    }
  }

  const openConversation = async (conversationFrom: string, conversationTo: string) => {
    try {
      setOpeningConversation(true)
      const res = await axios.post('/api/conversation', {
        conversationFrom,
        conversationTo,
      })

      if (res.status !== 200) {
        throw new Error('Failed to send message, Trying to sync with the server to fix!')
      }

      const { conversationId } = res.data as { conversationId: string }
      router.push(`/me/${conversationId}`)
    } catch (e) {
      toast.error('Failed to open conversation, Trying to sync with the server to fix!')

      if (typeof window !== 'undefined') {
        window.location.reload()
      } else {
        router.refresh()
      }
    } finally {
      setOpeningConversation(false)
    }
  }

  const filteredFriends = friends.filter(friend => friend.profile.name.toLowerCase().includes(query.toLowerCase()))

  if (!friends.length) {
    return (
      <div className="grid place-items-center h-full overflow-hidden">
        <div className="space-y-6 md:space-y-10 w-[85%] md:w-auto">
          <WumpusSleeping />
          <p className="text-gray-400 text-center text-sm md:text-base">No one&apos;s around to play with wumpus!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] h-full overflow-hidden">
      <div className="px-6 py-4 h-full overflow-hidden">
        <div className="grid grid-cols-[1fr_auto] rounded-sm overflow-hidden bg-[hsl(var(--background-deep-dark))] h-8 px-3">
          <input
            type="text"
            className="h-full text-gray-300 bg-transparent"
            placeholder="Search"
            style={{
              outline: 'none',
            }}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              setQuery(e.target.value)
            }}
          />
          <SearchIcon size={18} className="self-center text-gray-200" />
        </div>

        <div className="h-full overflow-hidden">
          <h3 className="text-xs uppercase font-sans text-gray-400 font-medium my-4 tracking-wide">
            Friends ({friends.length || 0})
          </h3>
          <div className="h-[1px] bg-zinc-600/50 mb-3"></div>

          {/* SHOW ALL REQ AND PEN... */}
          <div className="h-full overflow-y-auto pb-24">
            {filteredFriends.map(friend => (
              <UserBlock
                key={friend.id}
                profile={friend.profile}
                currentUserId={profile.id}
                requestForbidden
                action={
                  removing || openingConversation ? (
                    <div className="loader mx-4"></div>
                  ) : (
                    <>
                      <UserBlockButton
                        label="Message"
                        icon={BlockIcons.MESSAGE}
                        onClick={() => {
                          openConversation(profile.id, friend.profile.id)
                        }}
                      />

                      <UserBlockButton
                        label="Remove"
                        icon={BlockIcons.REJECT}
                        onClick={() => {
                          toast.warning('Remove ' + friend.profile.name, {
                            action: {
                              label: 'Remove',
                              onClick: () => removeFromFriend(friend.id),
                            },
                          })
                        }}
                      />
                    </>
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
      <div className="hidden lg:grid place-items-center border-l-[1px] border-solid border-zinc-600/50 px-4 py-6 h-full">
        <div className="space-y-3">
          <WumpusSleeping />
          <p className="text-gray-500 text-sm text-center font-medium">This is where wumpus sleep...</p>
        </div>
      </div>
    </div>
  )
}
