'use client'

import { Member, Server } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const ExplorePublicServer = () => {
  const [hydrated, setHydrated] = useState(false)
  const [serverCollection, setServerCollection] = useState<(Server & { members: Member[] })[]>([])
  const [userServerCollection, setUserServerCollection] = useState<Server[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingServer, setLoadingServer] = useState<{
    server: Server | null
    loading: boolean
  }>({
    server: null,
    loading: false,
  })
  const router = useRouter()

  useEffect(() => {
    const fetchServer = async () => {
      const response = await fetch('/api/servers/withMembers')
      const data = await response.json()
      setServerCollection(data)
    }

    const fetchJoinedServer = async () => {
      const response = await fetch('/api/servers/joinedServers')
      const data = await response.json()
      setUserServerCollection(data)
    }

    setHydrated(true)
    fetchJoinedServer()
    fetchServer()
  }, [])

  if (!hydrated) {
    return null
  }

  if (!serverCollection || !userServerCollection) {
    return <Loader />
  }

  const filteredServers = serverCollection.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (filteredServers.length === 0) {
    // BUG: I know this is a bug, but I'm not fixing it. (Hint: Server will always return something :D)
    return <Loader />
  }

  const joinAndRedirect = async (server: Server, joinedServers: Server[]) => {
    setLoadingServer({
      server,
      loading: true,
    })

    // check if this server is already joined by the user
    const isUserJoined = joinedServers.some(userServer => userServer.id === server.id)

    if (isUserJoined) {
      router.refresh()
      router.push(`/servers/${server.id}`)
    } else {
      try {
        await fetch(`/api/join-server/${server.inviteCode}/join`, {
          method: 'PATCH',
        })
      } catch (error) {
        toast.error('Failed to join the server, refresh the page and try again.')
      } finally {
        router.refresh()
        router.push(`/servers/${server.id}`)
      }
    }

    setLoadingServer({
      server: null,
      loading: false,
    })
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-6">
      <div className="relative grid place-items-center h-[300px] w-full rounded-md overflow-hidden mb-8">
        <div className="absolute z-10 w-4/6 p-10">
          <h1 className="text-center mb-4 text-2xl font-semibold">
            Those aren&apos;t servers, they&apos;re communities.
          </h1>
          <input
            type="text"
            placeholder="Search for servers"
            className="w-full py-2 px-3 rounded-sm border-none bg-white text-gray-700 font-semibold outine-offset-4 focus:outline-2 focus:outline-white/75 transition-all duration-200 ease-in-out"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative h-full w-full">
          <Image src="/assets/explore-banner.svg" alt="Explore Banner" fill className="object-cover" />
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold mb-4">Public Communities</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredServers.map(server => (
            <button
              key={server.id}
              className="rounded-sm overflow-hidden bg-[#282a2d] hover:bg-[#1e2022] pb-6 hover:-translate-y-1 transition-transform duration-300 group relative"
              onClick={() => {
                if (loadingServer.loading) {
                  if (loadingServer.server?.id !== server.id) {
                    toast.error('DO NOT INTRUPT!')
                  } else {
                    toast.error('HOW DARE YOU CLICK TWICE!')
                  }
                  return
                }

                joinAndRedirect(server, userServerCollection)
              }}>
              <div className={loadingServer.server?.id === server.id && loadingServer.loading ? ' blur-[2px]' : ''}>
                <div className="h-[40px] bg-[hsl(var(--background-deep-dark))] w-full"></div>
                <div className="w-12 h-12 rounded-full overflow-hidden relative -translate-y-1/2 mx-auto">
                  {server.imageUrl ? (
                    <Image
                      src={server.imageUrl}
                      alt={server.name}
                      fill
                      className="rounded-full bg-[#282a2d] border-[6px] border-solid border-[#282a2d] group-hover:scale-110 transition-transform duration-300 ease-in-out"
                    />
                  ) : (
                    <div className="absolute h-full w-full top-0 left-0 grid place-items-center bg-[#282a2d]">
                      {server.name
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-center font-semibold -mt-4">{server.name}</h2>
                <div className="text-center text-gray-400 text-xs mt-1 flex gap-x-2 justify-center items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                  <span>{server.members.length} Members</span>
                </div>
              </div>

              {loadingServer.server?.id === server.id && loadingServer.loading && (
                <div className="absolute top-0 left-0 h-full w-full grid place-items-center">
                  <div className="relative z-10 loader"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const Loader = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-8 py-6 animate-pulse h-full overflow-y-auto">
      <div className="relative grid place-items-center h-[300px] w-full rounded-md overflow-hidden mb-8">
        <div className="absolute z-10 w-4/6 p-10">
          <div className="h-8 w-8/12 mx-auto rounded-full bg-white/75 mb-2"></div>
          <div className="w-full h-12 rounded-sm border-none bg-white/75"></div>
        </div>
        <div className="relative h-full w-full">
          <Image src="/assets/explore-banner.svg" alt="Explore Banner" fill className="object-cover" />
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold mb-4">Public Communities</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {Array.from({ length: Math.floor(Math.random() * 12) + 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-sm overflow-hidden bg-[#282a2d] hover:bg-[#1e2022] pb-6 hover:-translate-y-1 transition-transform duration-300 group relative">
              <div>
                <div className="h-[40px] bg-[hsl(var(--background-deep-dark))] w-full"></div>
                <div className="w-12 h-12 rounded-full overflow-hidden relative -translate-y-1/2 mx-auto">
                  <div className="absolute top-0 left-0 h-full w-full rounded-full bg-[#1e2022] border-[6px] border-solid border-[#282a2d] group-hover:scale-110 transition-transform duration-300 ease-in-out"></div>
                </div>

                <div className="h-6 w-16 mx-auto rounded-full bg-gray-500 -mt-4"></div>
                <div className="text-center text-gray-400 text-xs mt-1 flex gap-x-2 justify-center items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                  <div className="h-2 w-12 rounded-full bg-gray-500"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
