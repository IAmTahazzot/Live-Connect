'use client'

import { cn } from '@/lib/utils'
import { FriendRequest, Profile } from '@prisma/client'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BlockIcons, UserBlock, UserBlockButton } from './user-block'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { WumpusSleeping } from '@/lib/doodles'
import { useGlobalData } from '@/hooks/use-global-data'

export const PendingRequests = () => {
  const { friendRequests, profile } = useGlobalData()
  const [pendingRequests, setPendingRequests] = useState<{
    requester: (FriendRequest & { profile: Profile })[] // People who have sent you friend requests
    pending: (FriendRequest & { friend: Profile })[] // People you have sent friend requests to
  }>({ requester: friendRequests.requester, pending: friendRequests.pending })
  const [reqProcessing, setReqProcessing] = useState(false)
  const [query, setQuery] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    setPendingRequests({
      requester: friendRequests.requester,
      pending: friendRequests.pending,
    })
  }, [friendRequests])

  const handleAccept = async (id: string) => {
    if (reqProcessing) {
      return
    }

    try {
      setReqProcessing(true)
      await axios.put('/api/friends/request', { id })
      toast.success('Request accepted successfully!')
    } catch (e) {
      toast.error('Failed to accept request, Trying to sync with the server to fix!')

      if (typeof window !== 'undefined') {
        window.location.reload()
      } else {
        router.refresh()
      }
    } finally {
      setPendingRequests({
        requester: pendingRequests.requester.filter(req => req.id !== id),
        pending: pendingRequests.pending,
      })
      setReqProcessing(false)
    }
  }

  const handleReject = async (id: string) => {
    if (reqProcessing) {
      return
    }

    try {
      setReqProcessing(true)
      await fetch('/api/friends/request', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })
      toast.success('Request rejected successfully!')
    } catch (e) {
      toast.error('Failed to reject request, Trying to sync with the server to fix!')
      if (typeof window !== 'undefined') {
        window.location.reload()
      } else {
        router.refresh()
      }
    } finally {
      setPendingRequests({
        requester: pendingRequests.requester.filter(req => req.id !== id),
        pending: pendingRequests.pending.filter(req => req.id !== id),
      })
      setReqProcessing(false)
    }
  }

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

  const filteredPendingRequests = pendingRequests.pending.filter(req =>
    req.friend.name.toLowerCase().includes(query.toLowerCase())
  )

  const filteredRequesterRequests = pendingRequests.requester.filter(req =>
    req.profile.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <div className="grid grid-cols-[1fr_350px] h-full overflow-hidden">
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
              Pending — {pendingRequests.pending.length}
            </h3>
            <div className="h-[1px] bg-zinc-600/50 mb-3"></div>

            {/* SHOW ALL REQ AND PEN... */}
            <div className="h-full overflow-y-auto pb-24">
              {filteredPendingRequests.map(req => (
                <UserBlock
                  key={req.id}
                  profile={req.friend}
                  currentUserId={profile.id}
                  requestForbidden
                  action={
                    <>
                      <UserBlockButton
                        label="Remove"
                        icon={BlockIcons.REJECT}
                        onClick={() => {
                          handleAccept(req.id)
                        }}
                      />
                    </>
                  }
                />
              ))}

              {/* Those who requested */}
              {filteredRequesterRequests.map(req => (
                <UserBlock
                  key={req.id}
                  profile={req.profile}
                  currentUserId={profile.id}
                  requestForbidden
                  action={
                    reqProcessing ? (
                      <div className="loader mx-4"></div>
                    ) : (
                      <>
                        <UserBlockButton
                          label="Accept"
                          icon={BlockIcons.ACCEPT}
                          onClick={() => {
                            handleAccept(req.id)
                          }}
                        />
                        <UserBlockButton
                          label="Reject"
                          icon={BlockIcons.REJECT}
                          onClick={() => {
                            handleReject(req.id)
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
        <div className="grid place-items-center border-l-[1px] border-solid border-zinc-600/50 px-4 py-6 h-full">
          <div className="space-y-3">
            <WumpusSleeping />
            <p className="text-gray-500 text-sm text-center">This is where wumpus sleep...</p>
          </div>
        </div>
      </div>
    </>
  )
}

export const PendingBlockLoader = ({ clone = 1 }: { clone: number }) => {
  const opacity = 1

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return Array.from({ length: clone }).map((_, i) => (
    <div key={i}>
      <div
        className={cn('grid grid-cols-[40px_1fr_auto] gap-3 p-4 rounded-sm mt-1', i < 4 && 'animate-pulse')}
        style={{
          opacity: opacity - i * 0.1,
        }}>
        <div className="w-10 h-10 bg-[hsl(var(--background-modifier-selected)/.3)] rounded-full"></div>
        <div className="flex flex-col gap-2">
          <div
            className="h-6 bg-[hsl(var(--background-modifier-selected)/.3)] rounded-full"
            style={{
              width: `${Math.random() * 200 + 100}px`,
            }}></div>
          <div className="w-[80px] h-4 bg-[hsl(var(--background-modifier-selected)/.3)] rounded-full"></div>
        </div>
        <div className="w-6 h-6 bg-[hsl(var(--background-modifier-selected)/.3)] rounded-lg"></div>
      </div>
    </div>
  ))
}
