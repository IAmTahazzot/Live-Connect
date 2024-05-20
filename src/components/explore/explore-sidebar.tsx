import { currentProfile } from '@/lib/current-profile'
import { ServerFooter } from '../server/server-footer'
import { useEffect, useState } from 'react'
import { Profile } from '@prisma/client'

export const ExploreSidebar = () => {
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    const getUser = async () => {
      const data = await fetch('/api/users/', {
        method: 'GET',
      })

      const response = await data.json()

      if (response.status === 401) {
        alert('Unauthorized')
        return
      }

      setProfile(response.body.data)
    }

    getUser()
  }, [])

  return (
    <aside className="self-end flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <div className="flex-1 p-2">
        <h1 className="text-2xl font-semibold mb-2 px-2">Discover</h1>

        <button className="grid grid-cols-[40px_1fr] w-full rounded-sm py-[10px] px-2 bg-[var(--color-primary)] cursor-pointer">
          <div>
            <svg
              aria-hidden="true"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0ZM7.74 9.3A2 2 0 0 1 9.3 7.75l7.22-1.45a1 1 0 0 1 1.18 1.18l-1.45 7.22a2 2 0 0 1-1.57 1.57l-7.22 1.45a1 1 0 0 1-1.18-1.18L7.74 9.3Z"
                clipRule="evenodd"></path>
            </svg>
          </div>
          <span className="text-left">Home</span>
        </button>
      </div>

      {profile && <ServerFooter profile={profile} />}
      {!profile && <div className="bg-[hsl(var(--background-deep-dark))] animate-pulse h-12 rounded-full m-2"></div>}
    </aside>
  )
}
