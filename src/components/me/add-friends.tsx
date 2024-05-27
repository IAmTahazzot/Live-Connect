'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { BlockIcons, UserBlock, UserBlockButton } from './user-block'
import { useEffect, useState } from 'react'
import { Profile } from '@prisma/client'
import axios from 'axios'
import { Loader } from './user-sidebar'
import qs from 'query-string'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ScrollArea } from '../ui/scroll-area'

const searchForm = z.object({
  keywords: z.string(),
})

export const AddFriends = () => {
  const [lookingForFriendsUsers, setLookingForFriendsUsers] = useState<Profile[]>([])
  const [requestNotAllowed, setRequestNotAllowed] = useState<Profile[]>([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserProfiles = async () => {
      setIsLoading(true)
      const res = await axios.get('/api/users/looking-for-friends')
      const requestNotAllowedRes = await axios.get('/api/friends/request-forbidden')
      const userRes = await axios.get('/api/users/me')
      setCurrentUserId(userRes.data.id || '')
      setRequestNotAllowed(requestNotAllowedRes.data)
      setLookingForFriendsUsers(res.data)
      setIsLoading(false)
    }

    fetchUserProfiles()
  }, [])

  const form = useForm({
    resolver: zodResolver(searchForm),
    defaultValues: {
      keywords: '',
    },
  })

  const findAndRequest = async (keywords: z.infer<typeof searchForm>) => {
    setIsRequesting(true)
    const url = qs.stringifyUrl({
      url: '/api/friends/request',
      query: {
        keywords: keywords.keywords,
      },
    })

    const req = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentUserId: currentUserId,
      }),
    })

    const res = await req.json()
    setIsRequesting(false)

    if (req.status === 200) {
      toast.success(res.message)
    } else {
      toast.info(res.message)
    }

    form.reset()
    router.refresh()
  }

  return (
    <div
      className="grid grid-cols-[1fr_350px] gap-4 h-full px-2 overflow-hidden">
      <div className="px-4 py-6">
        <h3 className="uppercase font-semibold mb-1">Add Friend</h3>
        <p className="text-sm text-gray-400">You can add friends with their username.</p>

        <form method="POST" onSubmit={form.handleSubmit(findAndRequest)}>
          <div
            className="grid grid-cols-[1fr_170px] items-center gap-2 bg-[hsl(var(--background-deep-dark))] rounded-md mt-4 h-[52px] px-3 border-[2px] border-solid"
            style={{
              borderColor: form.watch('keywords').length ? 'var(--color-primary)' : 'transparent',
            }}>
            <input
              type="text"
              className="w-full h-full text-gray-200 bg-transparent font-medium"
              placeholder="Try with username... (example: @mr_wumpus)"
              {...form.register('keywords')}
              autoComplete="off"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-sm px-4 text-white h-8 font-medium text-sm disabled:opacity-50 grid place-items-center"
              disabled={form.watch('keywords').length < 1}>
              {isRequesting ? <div className="loader"></div> : 'Send Friend Request'}
            </button>
          </div>
        </form>
      </div>
      <div className="border-l-[1px] border-solid border-zinc-600/50 px-4 py-6 h-full">
        <h3 className="font-medium text-gray-200 mb-2">Find friends</h3>

        <div className="overflow-y-auto h-full">
          {!isLoading &&
            lookingForFriendsUsers.map(profile => {
              if (profile.id === currentUserId) return null

              // check if the user is already a friend
              const requestForbidden = requestNotAllowed.some(friend => friend.id === profile.id)

              return (
                <UserBlock
                  key={profile.id}
                  profile={profile}
                  currentUserId={currentUserId}
                  requestForbidden={requestForbidden}
                  action={
                    <>
                      {!requestForbidden && (
                        <UserBlockButton icon={BlockIcons.ADD} label="Add" onClick={() => console.log('Add')} />
                      )}

                      {requestForbidden && (
                        <span className="inline-block px-2 py-[2px] rounded-full bg-[hsl(var(--background-deep-dark),.5)] text-sm">
                          Pending
                        </span>
                      )}
                    </>
                  }
                />
              )
            })}

          {isLoading && <Loader clone={12} />}

          {/* Single user can be also user him/herself so check if it's true */}
          {!isLoading &&
            ((lookingForFriendsUsers.length === 1 &&
              !requestNotAllowed.some(friend => friend.id === lookingForFriendsUsers[0]?.id)) ||
              lookingForFriendsUsers.length < 1) && <p className="text-gray-400 text-sm font-medium">No users found</p>}
        </div>
      </div>
    </div>
  )
}
