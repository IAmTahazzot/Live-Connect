'use client'

import { useUser } from '@clerk/nextjs'
import { Profile } from '@prisma/client'
import { Hash } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { PanelProfile } from './panel-profile'

type PanelAccountProps = {
  setActiveTab: React.Dispatch<React.SetStateAction<{ name: string; component: React.ReactNode }>>
}

export const PanelAccount = ({ setActiveTab }: PanelAccountProps) => {
  const [user, setUser] = useState<Profile>()

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

      setUser(response.body.data)
    }

    getUser()
  }, [])

  if (!user) {
    return (
      <div>
        <div className="animate-pulse">
          <h1 className="text-[20px] font-semibold mb-4">My Account</h1>

          <div className="bg-[hsl(var(--background-deep-dark))] rounded-md overflow-hidden">
            <div className="bg-[#2A2B32] h-[100px]"></div>

            <div className="mb-10 px-4">
              <div className="flex justify-between mt-6 mb-2">
                <div className="flex gap-x-3">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-[6px] border-solid border-[hsl(var(--background-deep-dark))] -translate-y-12">
                    <div className="bg-[hsl(var(--background-secondary))] h-24 w-24"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-[hsl(var(--background-primary))] h-6 w-28 rounded-full"></div>
                    <div className="flex items-center gap-x-2 w-20 rounded-full h-5 px-2 bg-[hsl(var(--background-primary))]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center px-4 text-sm font-medium bg-[#5865f2] hover:bg-[#505bd8] text-white h-8 w-24 rounded-full"></div>
                </div>
              </div>

              <div className="bg-[hsl(var(--background-primary))] p-4 rounded-md space-y-6">
                <div className="space-y-1">
                  <h2 className="uppercase font-semibold text-gray-400 text-xs tracking-wide">Display name</h2>
                  <div className="bg-[hsl(var(--background-deep-dark))] h-4 w-16 rounded-full"></div>
                </div>
                <div className="space-y-1">
                  <h2 className="uppercase font-semibold text-gray-400 text-xs tracking-wide">Username</h2>
                  <div className="bg-[hsl(var(--background-deep-dark))] h-4 w-16 rounded-full"></div>
                </div>
                <div className="space-y-1">
                  <h2 className="uppercase font-semibold text-gray-400 text-xs tracking-wide">E-mail</h2>
                  <div className="bg-[hsl(var(--background-deep-dark))] h-4 w-16 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-[#41444a] my-10"></div>

        <div className="mt-4 pb-16">
          <h1 className="text-[20px] font-semibold mb-2">Danger zone</h1>
          <p className="text-gray-400 text-sm">
            Deleting your account will remove all your data (profile, messages etc) from our servers and you will not be
            able to recover it.
          </p>
          <div className="text-sm font-medium bg-red-500 rounded-full h-8 w-20 flex items-center justify-center text-white hover:bg-red-600 transition-colors duration-200 px-4 cursor-pointer my-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div>
        <h1 className="text-[20px] font-semibold mb-4">My Account</h1>

        <div className="bg-[hsl(var(--background-deep-dark))] rounded-md overflow-hidden">
          <div className="bg-[#2A2B32] h-[100px]"></div>

          <div className="mb-10 px-4">
            <div className="flex justify-between mt-6 mb-2">
              <div className="flex gap-x-3">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-[6px] border-solid border-[hsl(var(--background-deep-dark))] -translate-y-12">
                  <Image src={user.imageUrl} alt="User profile" fill priority={true} className="object-cover" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-[18px] font-semibold">{user.name}</h2>
                  <div className="flex items-center gap-x-2 rounded-lg py-1 px-2 bg-[hsl(var(--background-primary))]">
                    <div className="bg-emerald-500 h-4 w-4 rounded-full flex items-center justify-center">
                      <Hash size={12} className="text-black" />
                    </div>
                    <span className="text-sm">{user.userId}</span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="flex items-center px-4 text-sm font-medium bg-[#5865f2] hover:bg-[#505bd8] text-white rounded-sm h-8"
                  onClick={() => {
                    setActiveTab({
                      name: 'Profile',
                      component: <PanelProfile />,
                    })
                  }}>
                  Edit user profile
                </button>
              </div>
            </div>

            <div className="bg-[hsl(var(--background-primary))] p-4 rounded-md space-y-6">
              <div className="space-y-1">
                <h2 className="uppercase font-semibold text-gray-400 text-xs tracking-wide">Display name</h2>
                <h2>{user.name}</h2>
              </div>
              <div className="space-y-1">
                <h2 className="uppercase font-semibold text-gray-400 text-xs tracking-wide">Username</h2>
                <h2>{user.email.split('@')[0].toLowerCase()}</h2>
              </div>
              <div className="space-y-1">
                <h2 className="uppercase font-semibold text-gray-400 text-xs tracking-wide">E-mail</h2>
                <h2>{user.email}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-[#41444a] my-10"></div>

      <div className="mt-4 pb-16">
        <h1 className="text-[20px] font-semibold mb-2">Danger zone</h1>
        <p className="text-gray-400 text-sm">
          Deleting your account will remove all your data (profile, messages etc) from our servers and you will not be
          able to recover it.
        </p>

        <button className="text-sm font-medium bg-red-500 rounded-sm h-8 flex items-center justify-center text-white hover:bg-red-600 transition-colors duration-200 px-4 cursor-pointer my-4">
          Delete Account
        </button>
      </div>
    </div>
  )
}
